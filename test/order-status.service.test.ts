/**
 * Order Status Service Unit Tests - Story 3.6
 * 
 * Tests for business logic and validation.
 */

import { OrderStatusService, OrderStatusError, OrderStatusErrorCode } from '../src/services/order-status.service';
import { OrderStatusRepository } from '../src/repositories/order-status.repository';
import { OrderTrackingStatus } from '../src/types/order-status.types';

// Mock repository
const mockRepo = {
    findByFarmerId: jest.fn(),
    findByOrderNumber: jest.fn(),
    countActiveByFarmerId: jest.fn(),
    updateStatus: jest.fn(),
    updateDelay: jest.fn()
} as unknown as OrderStatusRepository;

describe('OrderStatusService', () => {
    let service: OrderStatusService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new OrderStatusService(mockRepo);
    });

    describe('getOrders', () => {
        it('should return paginated orders for valid farmer', async () => {
            const mockOrders = [{ id: 'ORD-001' }];
            (mockRepo.findByFarmerId as jest.Mock).mockResolvedValue({
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
            })).rejects.toThrow(OrderStatusError);
        });
    });

    describe('getOrderDetails', () => {
        it('should return order for valid farmer and order', async () => {
            const mockOrder = {
                id: 'ORD-001',
                farmerId: 123,
                trackingStatus: OrderTrackingStatus.MATCHED
            };
            (mockRepo.findByOrderNumber as jest.Mock).mockResolvedValue(mockOrder);

            const result = await service.getOrderDetails('ORD-001', 123);

            expect(result).toEqual(mockOrder);
        });

        it('should throw ORDER_NOT_FOUND for missing order', async () => {
            (mockRepo.findByOrderNumber as jest.Mock).mockResolvedValue(null);

            await expect(service.getOrderDetails('ORD-999', 123)).rejects.toMatchObject({
                code: OrderStatusErrorCode.ORDER_NOT_FOUND
            });
        });

        it('should throw UNAUTHORIZED for wrong farmer', async () => {
            const mockOrder = { id: 'ORD-001', farmerId: 456 };
            (mockRepo.findByOrderNumber as jest.Mock).mockResolvedValue(mockOrder);

            await expect(service.getOrderDetails('ORD-001', 123)).rejects.toMatchObject({
                code: OrderStatusErrorCode.UNAUTHORIZED
            });
        });
    });

    describe('updateStatus', () => {
        it('should allow valid transition', async () => {
            const current = {
                id: 'ORD-001',
                trackingStatus: OrderTrackingStatus.LISTED,
                farmerId: 123
            };
            const updated = {
                ...current,
                trackingStatus: OrderTrackingStatus.MATCHED
            };

            (mockRepo.findByOrderNumber as jest.Mock)
                .mockResolvedValueOnce(current)
                .mockResolvedValueOnce(updated);
            (mockRepo.updateStatus as jest.Mock).mockResolvedValue(updated);

            const result = await service.updateStatus({
                orderId: 'ORD-001',
                newStatus: OrderTrackingStatus.MATCHED,
                actor: 'system'
            });

            expect(result.trackingStatus).toBe(OrderTrackingStatus.MATCHED);
        });

        it('should reject invalid transition', async () => {
            const current = {
                id: 'ORD-001',
                trackingStatus: OrderTrackingStatus.LISTED
            };
            (mockRepo.findByOrderNumber as jest.Mock).mockResolvedValue(current);

            await expect(service.updateStatus({
                orderId: 'ORD-001',
                newStatus: OrderTrackingStatus.DELIVERED, // Skip steps
                actor: 'system'
            })).rejects.toMatchObject({
                code: OrderStatusErrorCode.INVALID_TRANSITION
            });
        });

        it('should reject same status transition', async () => {
            const current = {
                id: 'ORD-001',
                trackingStatus: OrderTrackingStatus.MATCHED
            };
            (mockRepo.findByOrderNumber as jest.Mock).mockResolvedValue(current);

            await expect(service.updateStatus({
                orderId: 'ORD-001',
                newStatus: OrderTrackingStatus.MATCHED,
                actor: 'system'
            })).rejects.toMatchObject({
                code: OrderStatusErrorCode.ALREADY_IN_STATUS
            });
        });
    });

    describe('getActiveOrderCount', () => {
        it('should return count for valid farmer', async () => {
            (mockRepo.countActiveByFarmerId as jest.Mock).mockResolvedValue(5);

            const result = await service.getActiveOrderCount(123);

            expect(result).toBe(5);
        });
    });
});
