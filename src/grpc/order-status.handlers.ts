/**
 * Order Status gRPC Handlers - Story 3.6
 * 
 * gRPC Handler Layer for Order Status Tracking.
 * Maps proto requests to service layer calls.
 * 
 * STAR: Situation - Gateway needs gRPC endpoints for farmer order tracking.
 *       Task - Handle gRPC requests, validate, call service, map responses.
 *       Action - Implement handlers for each RPC method.
 *       Result - Clean gRPC interface following proto contract.
 */

import { ServerUnaryCall, sendUnaryData, status as grpcStatus } from '@grpc/grpc-js';
import { OrderStatusService, OrderStatusError, OrderStatusErrorCode } from '../services/order-status.service';
import { OrderTrackingStatus, getStatusStep } from '../types/order-status.types';
import { logger } from '../utils/logger';

// Proto generated types (will be generated from proto compilation)
// Using inline types for now - replace with actual generated types
interface GetFarmerOrdersRequest {
    farmer_id: number;
    status_filter: string;
    page: number;
    limit: number;
}

interface GetFarmerOrderDetailsRequest {
    order_id: string;
    farmer_id: number;
}

interface GetActiveOrderCountRequest {
    farmer_id: number;
}

interface UpdateTrackingStatusRequest {
    order_id: string;
    new_status: number;
    actor: string;
    note: string;
    hauler_info?: {
        id: string;
        name: string;
        phone: string;
        vehicle_type?: string;
        vehicle_number?: string;
    };
    eta?: string;
    delay_minutes?: number;
    delay_reason?: string;
    upi_transaction_id?: string;
}

interface UpdateOrderDelayRequest {
    order_id: string;
    delay_minutes: number;
    reason: string;
    new_eta?: string;
    actor: string;
}

// Proto enum to domain enum mapping
const PROTO_STATUS_MAP: Record<number, OrderTrackingStatus> = {
    1: OrderTrackingStatus.LISTED,
    2: OrderTrackingStatus.MATCHED,
    3: OrderTrackingStatus.PICKUP_SCHEDULED,
    4: OrderTrackingStatus.AT_DROP_POINT,
    5: OrderTrackingStatus.IN_TRANSIT,
    6: OrderTrackingStatus.DELIVERED,
    7: OrderTrackingStatus.PAID
};

const DOMAIN_TO_PROTO_STATUS: Record<OrderTrackingStatus, number> = {
    [OrderTrackingStatus.LISTED]: 1,
    [OrderTrackingStatus.MATCHED]: 2,
    [OrderTrackingStatus.PICKUP_SCHEDULED]: 3,
    [OrderTrackingStatus.AT_DROP_POINT]: 4,
    [OrderTrackingStatus.IN_TRANSIT]: 5,
    [OrderTrackingStatus.DELIVERED]: 6,
    [OrderTrackingStatus.PAID]: 7
};

export class OrderStatusHandlers {
    private service: OrderStatusService;

    constructor(service: OrderStatusService) {
        this.service = service;
    }

    /**
     * STAR: Handle GetFarmerOrders RPC.
     * Action: Parse filter, call service, map to proto response.
     */
    async getFarmerOrders(
        call: ServerUnaryCall<GetFarmerOrdersRequest, unknown>,
        callback: sendUnaryData<unknown>
    ): Promise<void> {
        const { farmer_id, status_filter, page, limit } = call.request;
        const correlationId = call.metadata.get('x-correlation-id')[0] as string || '';

        try {
            logger.info({ correlationId, farmer_id, status_filter }, 'GetFarmerOrders request');

            const result = await this.service.getOrders({
                farmerId: farmer_id,
                status: (status_filter as 'active' | 'completed' | 'all') || 'all',
                page: page || 1,
                limit: limit || 20
            });

            // Map to proto response
            const response = {
                orders: result.orders.map(order => ({
                    order_id: order.id,
                    listing: {
                        id: order.listing.id,
                        crop_type: order.listing.cropType,
                        crop_emoji: order.listing.cropEmoji,
                        quantity_kg: order.listing.quantityKg,
                        photo_url: order.listing.photoUrl || ''
                    },
                    buyer: {
                        business_type: order.buyer.businessType,
                        city: order.buyer.city,
                        area: order.buyer.area || ''
                    },
                    tracking_status: DOMAIN_TO_PROTO_STATUS[order.trackingStatus],
                    current_step: order.currentStep,
                    total_steps: order.totalSteps,
                    total_amount: Number(order.totalAmount),
                    eta: order.eta?.toISOString() || '',
                    delay_minutes: order.delayMinutes || 0,
                    created_at: order.createdAt.toISOString()
                })),
                pagination: {
                    page: result.pagination.page,
                    limit: result.pagination.limit,
                    total: result.pagination.total
                }
            };

            callback(null, response);
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * STAR: Handle GetFarmerOrderDetails RPC.
     */
    async getFarmerOrderDetails(
        call: ServerUnaryCall<GetFarmerOrderDetailsRequest, unknown>,
        callback: sendUnaryData<unknown>
    ): Promise<void> {
        const { order_id, farmer_id } = call.request;
        const correlationId = call.metadata.get('x-correlation-id')[0] as string || '';

        try {
            logger.info({ correlationId, order_id, farmer_id }, 'GetFarmerOrderDetails request');

            const order = await this.service.getOrderDetails(order_id, farmer_id);

            // Map to proto response
            const response = {
                order_id: order.id,
                farmer_id: order.farmerId,
                listing: {
                    id: order.listing.id,
                    crop_type: order.listing.cropType,
                    crop_emoji: order.listing.cropEmoji,
                    quantity_kg: order.listing.quantityKg,
                    photo_url: order.listing.photoUrl || ''
                },
                buyer: {
                    business_type: order.buyer.businessType,
                    city: order.buyer.city,
                    area: order.buyer.area || ''
                },
                tracking_status: DOMAIN_TO_PROTO_STATUS[order.trackingStatus],
                current_step: order.currentStep,
                total_steps: order.totalSteps,
                total_amount: Number(order.totalAmount),
                eta: order.eta?.toISOString() || '',
                delay_minutes: order.delayMinutes || 0,
                delay_reason: order.delayReason || '',
                hauler: order.hauler ? {
                    id: order.hauler.id,
                    name: order.hauler.name,
                    phone: order.hauler.phone,
                    vehicle_type: order.hauler.vehicleType || '',
                    vehicle_number: order.hauler.vehicleNumber || ''
                } : null,
                status_history: order.statusHistory.map(event => ({
                    step: event.step,
                    status: DOMAIN_TO_PROTO_STATUS[event.status],
                    label: event.label,
                    completed: event.completed,
                    active: event.active,
                    timestamp: event.timestamp || '',
                    actor: event.actor || '',
                    note: event.note || ''
                })),
                upi_transaction_id: order.upiTransactionId || '',
                created_at: order.createdAt.toISOString(),
                updated_at: order.updatedAt.toISOString()
            };

            callback(null, response);
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * STAR: Handle GetActiveOrderCount RPC.
     */
    async getActiveOrderCount(
        call: ServerUnaryCall<GetActiveOrderCountRequest, unknown>,
        callback: sendUnaryData<unknown>
    ): Promise<void> {
        const { farmer_id } = call.request;
        const correlationId = call.metadata.get('x-correlation-id')[0] as string || '';

        try {
            logger.info({ correlationId, farmer_id }, 'GetActiveOrderCount request');

            const count = await this.service.getActiveOrderCount(farmer_id);

            callback(null, { count });
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * STAR: Handle UpdateTrackingStatus RPC.
     */
    async updateTrackingStatus(
        call: ServerUnaryCall<UpdateTrackingStatusRequest, unknown>,
        callback: sendUnaryData<unknown>
    ): Promise<void> {
        const req = call.request;
        const correlationId = call.metadata.get('x-correlation-id')[0] as string || '';

        try {
            logger.info({ correlationId, order_id: req.order_id, new_status: req.new_status }, 'UpdateTrackingStatus request');

            const newStatus = PROTO_STATUS_MAP[req.new_status];
            if (!newStatus) {
                callback({
                    code: grpcStatus.INVALID_ARGUMENT,
                    message: `Invalid status: ${req.new_status}`
                });
                return;
            }

            const updated = await this.service.updateStatus({
                orderId: req.order_id,
                newStatus,
                actor: req.actor,
                note: req.note,
                haulerInfo: req.hauler_info ? {
                    id: req.hauler_info.id,
                    name: req.hauler_info.name,
                    phone: req.hauler_info.phone,
                    vehicleType: req.hauler_info.vehicle_type,
                    vehicleNumber: req.hauler_info.vehicle_number
                } : undefined,
                eta: req.eta ? new Date(req.eta) : undefined,
                delayMinutes: req.delay_minutes,
                delayReason: req.delay_reason,
                upiTransactionId: req.upi_transaction_id
            });

            callback(null, {
                success: true,
                order_id: updated.id,
                new_status: DOMAIN_TO_PROTO_STATUS[updated.trackingStatus],
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * STAR: Handle UpdateOrderDelay RPC.
     */
    async updateOrderDelay(
        call: ServerUnaryCall<UpdateOrderDelayRequest, unknown>,
        callback: sendUnaryData<unknown>
    ): Promise<void> {
        const req = call.request;
        const correlationId = call.metadata.get('x-correlation-id')[0] as string || '';

        try {
            logger.info({ correlationId, order_id: req.order_id, delay_minutes: req.delay_minutes }, 'UpdateOrderDelay request');

            await this.service.updateDelay({
                orderId: req.order_id,
                delayMinutes: req.delay_minutes,
                reason: req.reason,
                newEta: req.new_eta ? new Date(req.new_eta) : undefined,
                actor: req.actor
            });

            callback(null, {
                success: true,
                order_id: req.order_id,
                delay_minutes: req.delay_minutes,
                new_eta: req.new_eta || ''
            });
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * Map domain errors to gRPC status codes.
     */
    private handleError(
        error: unknown,
        callback: sendUnaryData<unknown>,
        correlationId: string
    ): void {
        if (error instanceof OrderStatusError) {
            const codeMap: Record<OrderStatusErrorCode, grpcStatus> = {
                [OrderStatusErrorCode.ORDER_NOT_FOUND]: grpcStatus.NOT_FOUND,
                [OrderStatusErrorCode.INVALID_TRANSITION]: grpcStatus.FAILED_PRECONDITION,
                [OrderStatusErrorCode.ALREADY_IN_STATUS]: grpcStatus.FAILED_PRECONDITION,
                [OrderStatusErrorCode.UNAUTHORIZED]: grpcStatus.PERMISSION_DENIED
            };

            logger.warn({ correlationId, code: error.code, message: error.message }, 'Order status error');
            callback({ code: codeMap[error.code], message: error.message });
        } else {
            logger.error({ correlationId, error }, 'Unexpected error');
            callback({ code: grpcStatus.INTERNAL, message: 'Internal server error' });
        }
    }
}
