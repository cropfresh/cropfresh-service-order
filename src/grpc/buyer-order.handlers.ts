/**
 * Buyer Order gRPC Handlers - Story 4.3
 *
 * gRPC Handler Layer for Buyer Order Placement.
 * Maps proto requests to service layer calls.
 *
 * STAR: Situation - Gateway needs gRPC endpoints for buyer order placement.
 *       Task: Handle CreateBuyerOrder, PaymentCallback, CancelOrder RPCs.
 *       Action: Parse requests, call service, map responses.
 *       Result: Type-safe gRPC endpoints for order placement flow.
 */

import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';
import { BuyerOrderService, BuyerOrderError, BuyerOrderErrorCode, ListingData } from '../services/buyer-order.service';
import { logger } from '../utils/logger';

// ============================================
// Proto Request/Response Types
// ============================================

export interface CreateBuyerOrderRequest {
    listing_id: number;
    buyer_id: number;
    quantity_kg: number;
    delivery_address_id: string;
    delivery_time_pref: number; // 0=MORNING, 1=AFTERNOON, 2=EVENING
    // Listing data (passed from Gateway after fetching from Catalog)
    listing_data?: {
        farmer_id: number;
        crop_type: string;
        crop_emoji?: string;
        quantity_kg: number;
        price_per_kg: number;
        quality_grade?: string;
        farmer_zone?: string;
        status: string;
    };
}

export interface CreateBuyerOrderResponse {
    order_id: string;
    order_number: string;
    status: string;
    total_amount: number;
    upi_payment_link: string;
    estimated_delivery: string;
}

export interface PaymentCallbackRequest {
    order_id: number;
    success: boolean;
    transaction_id?: string;
    error_message?: string;
}

export interface PaymentCallbackResponse {
    success: boolean;
    message: string;
}

export interface CancelOrderRequest {
    order_id: number;
    buyer_id: number;
}

export interface CancelOrderResponse {
    success: boolean;
    message: string;
}

// ============================================
// Delivery Time Enum Mapping
// ============================================

const DELIVERY_TIME_MAP: Record<number, 'MORNING' | 'AFTERNOON' | 'EVENING'> = {
    0: 'MORNING',
    1: 'AFTERNOON',
    2: 'EVENING',
};

// ============================================
// Buyer Order Handlers Class
// ============================================

export class BuyerOrderHandlers {
    private service: BuyerOrderService;

    constructor(service: BuyerOrderService) {
        this.service = service;
    }

    /**
     * STAR: Handle CreateBuyerOrder RPC.
     * Action: Parse request, validate, call service, return response.
     */
    async createBuyerOrder(
        call: ServerUnaryCall<CreateBuyerOrderRequest, unknown>,
        callback: sendUnaryData<CreateBuyerOrderResponse>
    ): Promise<void> {
        const correlationId = `grpc-${Date.now()}`;
        const req = call.request;

        try {
            logger.info({ correlationId, listingId: req.listing_id }, 'CreateBuyerOrder RPC called');

            // Validate listing data is present
            if (!req.listing_data) {
                callback(
                    {
                        code: status.INVALID_ARGUMENT,
                        message: 'Listing data is required',
                    },
                    null
                );
                return;
            }

            // Map request to DTO
            const listingData: ListingData = {
                id: req.listing_id,
                farmerId: req.listing_data.farmer_id,
                cropType: req.listing_data.crop_type,
                cropEmoji: req.listing_data.crop_emoji,
                quantityKg: req.listing_data.quantity_kg,
                pricePerKg: req.listing_data.price_per_kg,
                qualityGrade: req.listing_data.quality_grade,
                farmerZone: req.listing_data.farmer_zone,
                status: req.listing_data.status,
            };

            const result = await this.service.createOrder(
                {
                    buyerId: req.buyer_id,
                    listingId: req.listing_id,
                    quantityKg: req.quantity_kg,
                    deliveryAddressId: req.delivery_address_id,
                    deliveryTimePref: DELIVERY_TIME_MAP[req.delivery_time_pref] ?? 'MORNING',
                },
                listingData
            );

            const response: CreateBuyerOrderResponse = {
                order_id: result.orderId.toString(),
                order_number: result.orderNumber,
                status: result.status,
                total_amount: result.totalAmount,
                upi_payment_link: result.upiPaymentLink,
                estimated_delivery: result.estimatedDelivery,
            };

            logger.info({ correlationId, orderId: result.orderId }, 'Order created via gRPC');
            callback(null, response);
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * STAR: Handle PaymentCallback RPC.
     * Action: Update order status based on payment result.
     */
    async paymentCallback(
        call: ServerUnaryCall<PaymentCallbackRequest, unknown>,
        callback: sendUnaryData<PaymentCallbackResponse>
    ): Promise<void> {
        const correlationId = `grpc-${Date.now()}`;
        const req = call.request;

        try {
            logger.info({ correlationId, orderId: req.order_id }, 'PaymentCallback RPC called');

            await this.service.handlePaymentCallback({
                orderId: req.order_id,
                success: req.success,
                transactionId: req.transaction_id,
                errorMessage: req.error_message,
            });

            callback(null, {
                success: true,
                message: req.success ? 'Payment recorded' : 'Payment failure recorded',
            });
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * STAR: Handle CancelOrder RPC.
     * Action: Cancel order before payment completes.
     */
    async cancelOrder(
        call: ServerUnaryCall<CancelOrderRequest, unknown>,
        callback: sendUnaryData<CancelOrderResponse>
    ): Promise<void> {
        const correlationId = `grpc-${Date.now()}`;
        const req = call.request;

        try {
            logger.info({ correlationId, orderId: req.order_id }, 'CancelOrder RPC called');

            await this.service.cancelOrder(req.order_id, req.buyer_id);

            callback(null, {
                success: true,
                message: 'Order cancelled successfully',
            });
        } catch (error) {
            this.handleError(error, callback, correlationId);
        }
    }

    /**
     * Map domain errors to gRPC status codes.
     */
    private handleError<T>(
        error: unknown,
        callback: sendUnaryData<T>,
        correlationId: string
    ): void {
        if (error instanceof BuyerOrderError) {
            let grpcStatus: number;

            switch (error.code) {
                case BuyerOrderErrorCode.LISTING_NOT_FOUND:
                case BuyerOrderErrorCode.ORDER_NOT_FOUND:
                    grpcStatus = status.NOT_FOUND;
                    break;
                case BuyerOrderErrorCode.LISTING_INACTIVE:
                case BuyerOrderErrorCode.QUANTITY_EXCEEDED:
                case BuyerOrderErrorCode.INVALID_QUANTITY:
                    grpcStatus = status.INVALID_ARGUMENT;
                    break;
                case BuyerOrderErrorCode.INVALID_PAYMENT_TRANSITION:
                case BuyerOrderErrorCode.ALREADY_CANCELLED:
                    grpcStatus = status.FAILED_PRECONDITION;
                    break;
                default:
                    grpcStatus = status.INTERNAL;
            }

            logger.warn(
                { correlationId, code: error.code, message: error.message, metadata: error.metadata },
                'Business error in BuyerOrderHandler'
            );

            callback({ code: grpcStatus, message: error.message }, null);
        } else {
            logger.error({ correlationId, error }, 'Unexpected error in BuyerOrderHandler');
            callback({ code: status.INTERNAL, message: 'Internal server error' }, null);
        }
    }
}
