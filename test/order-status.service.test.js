"use strict";
/**
 * Order Status Service Unit Tests - Story 3.6
 *
 * Tests for business logic and validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const order_status_service_1 = require("../src/services/order-status.service");
const order_status_types_1 = require("../src/types/order-status.types");
// Mock repository
const mockRepo = {
    findByFarmerId: jest.fn(),
    findByOrderNumber: jest.fn(),
    countActiveByFarmerId: jest.fn(),
    updateStatus: jest.fn(),
    updateDelay: jest.fn()
};
describe('OrderStatusService', () => {
    let service;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new order_status_service_1.OrderStatusService(mockRepo);
    });
    describe('getOrders', () => {
        it('should return paginated orders for valid farmer', async () => {
            const mockOrders = [{ id: 'ORD-001' }];
            mockRepo.findByFarmerId.mockResolvedValue({
                orders: mockOrders,
                total: 1
            });
            const result = await service.getOrders({
                farmerId: 123,
                status: 'all',
                page: 1,
                limit: 20
            });
            expect(result.orders).toEqual(mockOrders);
            expect(result.pagination.total).toBe(1);
            expect(mockRepo.findByFarmerId).toHaveBeenCalledWith({
                farmerId: 123,
                status: 'all',
                page: 1,
                limit: 20
            });
        });
        it('should throw error for invalid farmer ID', async () => {
            await expect(service.getOrders({
                farmerId: 0,
                status: 'all'
            })).rejects.toThrow(order_status_service_1.OrderStatusError);
        });
    });
    describe('getOrderDetails', () => {
        it('should return order for valid farmer and order', async () => {
            const mockOrder = {
                id: 'ORD-001',
                farmerId: 123,
                trackingStatus: order_status_types_1.OrderTrackingStatus.MATCHED
            };
            mockRepo.findByOrderNumber.mockResolvedValue(mockOrder);
            const result = await service.getOrderDetails('ORD-001', 123);
            expect(result).toEqual(mockOrder);
        });
        it('should throw ORDER_NOT_FOUND for missing order', async () => {
            mockRepo.findByOrderNumber.mockResolvedValue(null);
            await expect(service.getOrderDetails('ORD-999', 123)).rejects.toMatchObject({
                code: order_status_service_1.OrderStatusErrorCode.ORDER_NOT_FOUND
            });
        });
        it('should throw UNAUTHORIZED for wrong farmer', async () => {
            const mockOrder = { id: 'ORD-001', farmerId: 456 };
            mockRepo.findByOrderNumber.mockResolvedValue(mockOrder);
            await expect(service.getOrderDetails('ORD-001', 123)).rejects.toMatchObject({
                code: order_status_service_1.OrderStatusErrorCode.UNAUTHORIZED
            });
        });
    });
    describe('updateStatus', () => {
        it('should allow valid transition', async () => {
            const current = {
                id: 'ORD-001',
                trackingStatus: order_status_types_1.OrderTrackingStatus.LISTED,
                farmerId: 123
            };
            const updated = {
                ...current,
                trackingStatus: order_status_types_1.OrderTrackingStatus.MATCHED
            };
            mockRepo.findByOrderNumber
                .mockResolvedValueOnce(current)
                .mockResolvedValueOnce(updated);
            mockRepo.updateStatus.mockResolvedValue(updated);
            const result = await service.updateStatus({
                orderId: 'ORD-001',
                newStatus: order_status_types_1.OrderTrackingStatus.MATCHED,
                actor: 'system'
            });
            expect(result.trackingStatus).toBe(order_status_types_1.OrderTrackingStatus.MATCHED);
        });
        it('should reject invalid transition', async () => {
            const current = {
                id: 'ORD-001',
                trackingStatus: order_status_types_1.OrderTrackingStatus.LISTED
            };
            mockRepo.findByOrderNumber.mockResolvedValue(current);
            await expect(service.updateStatus({
                orderId: 'ORD-001',
                newStatus: order_status_types_1.OrderTrackingStatus.DELIVERED, // Skip steps
                actor: 'system'
            })).rejects.toMatchObject({
                code: order_status_service_1.OrderStatusErrorCode.INVALID_TRANSITION
            });
        });
        it('should reject same status transition', async () => {
            const current = {
                id: 'ORD-001',
                trackingStatus: order_status_types_1.OrderTrackingStatus.MATCHED
            };
            mockRepo.findByOrderNumber.mockResolvedValue(current);
            await expect(service.updateStatus({
                orderId: 'ORD-001',
                newStatus: order_status_types_1.OrderTrackingStatus.MATCHED,
                actor: 'system'
            })).rejects.toMatchObject({
                code: order_status_service_1.OrderStatusErrorCode.ALREADY_IN_STATUS
            });
        });
    });
    describe('getActiveOrderCount', () => {
        it('should return count for valid farmer', async () => {
            mockRepo.countActiveByFarmerId.mockResolvedValue(5);
            const result = await service.getActiveOrderCount(123);
            expect(result).toBe(5);
        });
    });
});
