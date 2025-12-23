/**
 * Order Status Service - Story 3.6
 * 
 * Business Logic Layer for Order Status Tracking.
 * Orchestrates repository calls and enforces business rules.
 * 
 * STAR: Situation - Farmers need to query and track order status.
 *       Task - Provide service methods with validation and business rules.
 *       Action - Validate transitions, delegate to repository, emit events.
 *       Result - Clean business logic layer with state machine validation.
 */

import { OrderStatusRepository } from '../repositories/order-status.repository';
import {
    OrderWithTracking,
    OrderListItem,
    GetOrdersFilter,
    PaginatedOrders,
    UpdateOrderStatusDTO,
    UpdateDelayDTO,
    OrderTrackingStatus,
    isValidTransition,
    getStatusStep
} from '../types/order-status.types';
import { logger } from '../utils/logger';

// Error codes for structured error handling
export enum OrderStatusErrorCode {
    ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
    INVALID_TRANSITION = 'INVALID_TRANSITION',
    ALREADY_IN_STATUS = 'ALREADY_IN_STATUS',
    UNAUTHORIZED = 'UNAUTHORIZED'
}

export class OrderStatusError extends Error {
    code: OrderStatusErrorCode;
    metadata?: Record<string, unknown>;

    constructor(code: OrderStatusErrorCode, message: string, metadata?: Record<string, unknown>) {
        super(message);
        this.code = code;
        this.metadata = metadata;
        this.name = 'OrderStatusError';
    }
}

export class OrderStatusService {
    private repo: OrderStatusRepository;

    constructor(repo: OrderStatusRepository) {
        this.repo = repo;
    }

    // ============================================
    // QUERY METHODS
    // ============================================

    /**
     * STAR: Get paginated orders for farmer.
     * Situation: Dashboard needs order list with filters.
     * Action: Validate farmerId, delegate to repository.
     */
    async getOrders(filter: GetOrdersFilter): Promise<PaginatedOrders> {
        this.validateFarmerId(filter.farmerId);

        const { orders, total } = await this.repo.findByFarmerId(filter);

        return {
            orders,
            pagination: {
                page: filter.page ?? 1,
                limit: filter.limit ?? 20,
                total
            }
        };
    }

    /**
     * STAR: Get single order with full tracking details.
     * Situation: Order details screen needs full timeline.
     * Action: Validate ownership, return full order data.
     */
    async getOrderDetails(orderId: string, farmerId: number): Promise<OrderWithTracking> {
        this.validateFarmerId(farmerId);

        const order = await this.repo.findByOrderNumber(orderId);

        if (!order) {
            throw new OrderStatusError(
                OrderStatusErrorCode.ORDER_NOT_FOUND,
                `Order not found: ${orderId}`,
                { orderId }
            );
        }

        // Verify farmer owns this order
        if (order.farmerId !== farmerId) {
            throw new OrderStatusError(
                OrderStatusErrorCode.UNAUTHORIZED,
                'Not authorized to view this order',
                { orderId, farmerId }
            );
        }

        return order;
    }

    /**
     * STAR: Get active order count for badge.
     */
    async getActiveOrderCount(farmerId: number): Promise<number> {
        this.validateFarmerId(farmerId);
        return this.repo.countActiveByFarmerId(farmerId);
    }

    // ============================================
    // STATUS UPDATE METHODS
    // ============================================

    /**
     * STAR: Update order status with validation.
     * Situation: Internal service triggers status change.
     * Task: Validate transition, update, emit notification event.
     */
    async updateStatus(dto: UpdateOrderStatusDTO): Promise<OrderWithTracking> {
        // Get current order
        const current = await this.repo.findByOrderNumber(dto.orderId);

        if (!current) {
            throw new OrderStatusError(
                OrderStatusErrorCode.ORDER_NOT_FOUND,
                `Order not found: ${dto.orderId}`,
                { orderId: dto.orderId }
            );
        }

        // Validate status transition
        this.validateStatusTransition(current.trackingStatus, dto.newStatus);

        // Perform update
        const updated = await this.repo.updateStatus(dto);

        // Emit event for notification service (async, fire-and-forget)
        this.emitStatusChangeEvent(updated, current.trackingStatus);

        logger.info({
            orderId: dto.orderId,
            from: current.trackingStatus,
            to: dto.newStatus,
            actor: dto.actor
        }, 'Order status transitioned');

        return updated;
    }

    /**
     * STAR: Update delay information.
     * Situation: Logistics reports delay.
     * Task: Update delay, trigger delay notification.
     */
    async updateDelay(dto: UpdateDelayDTO): Promise<void> {
        const current = await this.repo.findByOrderNumber(dto.orderId);

        if (!current) {
            throw new OrderStatusError(
                OrderStatusErrorCode.ORDER_NOT_FOUND,
                `Order not found: ${dto.orderId}`,
                { orderId: dto.orderId }
            );
        }

        await this.repo.updateDelay(
            dto.orderId,
            dto.delayMinutes,
            dto.reason,
            dto.newEta
        );

        // Emit delay notification event
        this.emitDelayEvent(current.farmerId, dto);

        logger.info({
            orderId: dto.orderId,
            delayMinutes: dto.delayMinutes,
            reason: dto.reason
        }, 'Order delay updated');
    }

    // ============================================
    // VALIDATION HELPERS
    // ============================================

    /**
     * Validate farmer ID is present and valid.
     */
    private validateFarmerId(farmerId: number): void {
        if (!farmerId || typeof farmerId !== 'number' || farmerId <= 0) {
            throw new OrderStatusError(
                OrderStatusErrorCode.UNAUTHORIZED,
                'Invalid farmer ID',
                { farmerId }
            );
        }
    }

    /**
     * Validate status transition using state machine.
     */
    private validateStatusTransition(
        currentStatus: OrderTrackingStatus,
        newStatus: OrderTrackingStatus
    ): void {
        if (currentStatus === newStatus) {
            throw new OrderStatusError(
                OrderStatusErrorCode.ALREADY_IN_STATUS,
                `Order is already in status: ${currentStatus}`,
                { currentStatus }
            );
        }

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new OrderStatusError(
                OrderStatusErrorCode.INVALID_TRANSITION,
                `Invalid transition from ${currentStatus} to ${newStatus}`,
                { currentStatus, newStatus }
            );
        }
    }

    // ============================================
    // EVENT EMISSION (Placeholder for NotificationService integration)
    // ============================================

    /**
     * Emit status change event for push/SMS notifications.
     * TODO: Integrate with NotificationService gRPC client.
     */
    private emitStatusChangeEvent(
        order: OrderWithTracking,
        previousStatus: OrderTrackingStatus
    ): void {
        // Placeholder - will call NotificationService
        logger.debug({
            orderId: order.id,
            farmerId: order.farmerId,
            previousStatus,
            newStatus: order.trackingStatus
        }, 'Status change event emitted');
    }

    /**
     * Emit delay notification event.
     * TODO: Integrate with NotificationService gRPC client.
     */
    private emitDelayEvent(farmerId: number, dto: UpdateDelayDTO): void {
        // Placeholder - will call NotificationService
        logger.debug({
            orderId: dto.orderId,
            farmerId,
            delayMinutes: dto.delayMinutes
        }, 'Delay event emitted');
    }
}
