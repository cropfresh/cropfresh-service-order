/**
 * Buyer Order Service Unit Tests - Story 4.3
 *
 * Tests for BuyerOrderService business logic:
 * - createOrder with validation
 * - handlePaymentCallback for success/failure
 * - cancelOrder before payment
 */

import { BuyerOrderService, BuyerOrderError, BuyerOrderErrorCode, ListingData } from '../src/services/buyer-order.service';
import { BuyerOrderRepository } from '../src/repositories/buyer-order.repository';
import { DeliveryTimePref, PaymentStatus } from '../src/generated/prisma';

// Mock the repository
jest.mock('../src/repositories/buyer-order.repository');

// Mock the logger to prevent console output
jest.mock('../src/utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
    }
}));

describe('BuyerOrderService', () => {
    let service: BuyerOrderService;
    let mockRepository: jest.Mocked<BuyerOrderRepository>;

    // Mock listing data
    const mockListing: ListingData = {
        id: 1,
        farmerId: 100,
        cropType: 'Tomatoes',
        cropEmoji: '🍅',
        quantityKg: 50,
        pricePerKg: 45,
        qualityGrade: 'A',
        farmerZone: 'Karnataka',
        status: 'ACTIVE'
    };

    // Mock order (as returned by repository)
    const mockOrder = {
        id: 1,
        orderNumber: 'ORD-TEST-123',
        buyerId: 200,
        farmerId: 100,
        status: 'PENDING',
        paymentStatus: PaymentStatus.PENDING,
        totalAmount: { toNumber: () => 2250 } as any,
        quantityKg: { toNumber: () => 50 } as any,
        pricePerKg: { toNumber: () => 45 } as any,
        deliveryAddressId: 'addr-1',
        deliveryTimePref: DeliveryTimePref.MORNING,
        escrowTransactionId: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByOrderNumber: jest.fn(),
            updatePaymentStatus: jest.fn(),
            cancelOrder: jest.fn(),
            findByBuyerId: jest.fn()
        } as unknown as jest.Mocked<BuyerOrderRepository>;

        service = new BuyerOrderService(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // =========================================
    // createOrder Tests
    // =========================================

    describe('createOrder', () => {
        const validDto = {
            buyerId: 200,
            listingId: 1,
            quantityKg: 50,
            deliveryAddressId: 'addr-1',
            deliveryTimePref: 'MORNING' as const
        };

        it('should create order when valid input provided', async () => {
            mockRepository.create.mockResolvedValue(mockOrder as any);

            const result = await service.createOrder(validDto, mockListing);

            expect(result.orderId).toBe(1);
            expect(result.status).toBe('PENDING_PAYMENT');
            expect(result.totalAmount).toBe(2250); // 50 * 45
            expect(result.upiPaymentLink).toContain('upi://pay');
            expect(result.estimatedDelivery).toContain('6AM - 12PM');
            expect(mockRepository.create).toHaveBeenCalled();
        });

        it('should reject when listing is inactive', async () => {
            const inactiveListing = { ...mockListing, status: 'INACTIVE' };

            await expect(service.createOrder(validDto, inactiveListing))
                .rejects.toThrow(BuyerOrderError);

            await expect(service.createOrder(validDto, inactiveListing))
                .rejects.toThrow('Listing is no longer available');

            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should reject when quantity is zero or negative', async () => {
            const invalidDto = { ...validDto, quantityKg: 0 };

            await expect(service.createOrder(invalidDto, mockListing))
                .rejects.toThrow(BuyerOrderError);

            await expect(service.createOrder(invalidDto, mockListing))
                .rejects.toThrow('Quantity must be greater than 0');
        });

        it('should reject when quantity exceeds available stock', async () => {
            const exceededDto = { ...validDto, quantityKg: 100 };

            await expect(service.createOrder(exceededDto, mockListing))
                .rejects.toThrow(BuyerOrderError);

            await expect(service.createOrder(exceededDto, mockListing))
                .rejects.toThrow('Requested quantity exceeds available stock');
        });

        it('should map AFTERNOON delivery time preference correctly', async () => {
            mockRepository.create.mockResolvedValue(mockOrder as any);

            const afternoonDto = { ...validDto, deliveryTimePref: 'AFTERNOON' as const };
            const result = await service.createOrder(afternoonDto, mockListing);

            expect(result.estimatedDelivery).toContain('12PM - 5PM');
        });

        it('should map EVENING delivery time preference correctly', async () => {
            mockRepository.create.mockResolvedValue(mockOrder as any);

            const eveningDto = { ...validDto, deliveryTimePref: 'EVENING' as const };
            const result = await service.createOrder(eveningDto, mockListing);

            expect(result.estimatedDelivery).toContain('5PM - 9PM');
        });

        it('should generate unique order number', async () => {
            mockRepository.create.mockResolvedValue(mockOrder as any);

            await service.createOrder(validDto, mockListing);

            const createCall = mockRepository.create.mock.calls[0][0];
            expect(createCall.orderNumber).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
        });
    });

    // =========================================
    // handlePaymentCallback Tests
    // =========================================

    describe('handlePaymentCallback', () => {
        it('should update status to SECURED on successful payment', async () => {
            mockRepository.findById.mockResolvedValue(mockOrder as any);
            mockRepository.updatePaymentStatus.mockResolvedValue(mockOrder as any);

            await service.handlePaymentCallback({
                orderId: 1,
                success: true,
                transactionId: 'txn-123'
            });

            expect(mockRepository.updatePaymentStatus).toHaveBeenCalledWith({
                orderId: 1,
                paymentStatus: PaymentStatus.SECURED,
                escrowTransactionId: 'txn-123',
                upiTransactionId: 'txn-123'
            });
        });

        it('should update status to FAILED on failed payment', async () => {
            mockRepository.findById.mockResolvedValue(mockOrder as any);
            mockRepository.updatePaymentStatus.mockResolvedValue(mockOrder as any);

            await service.handlePaymentCallback({
                orderId: 1,
                success: false,
                errorMessage: 'Insufficient funds'
            });

            expect(mockRepository.updatePaymentStatus).toHaveBeenCalledWith({
                orderId: 1,
                paymentStatus: PaymentStatus.FAILED
            });
        });

        it('should throw error when order not found', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(service.handlePaymentCallback({
                orderId: 999,
                success: true
            })).rejects.toThrow(BuyerOrderError);

            await expect(service.handlePaymentCallback({
                orderId: 999,
                success: true
            })).rejects.toThrow('Order not found');
        });
    });

    // =========================================
    // cancelOrder Tests
    // =========================================

    describe('cancelOrder', () => {
        it('should cancel order successfully', async () => {
            mockRepository.findById.mockResolvedValue(mockOrder as any);
            mockRepository.cancelOrder.mockResolvedValue(mockOrder as any);

            await service.cancelOrder(1, 200);

            expect(mockRepository.cancelOrder).toHaveBeenCalledWith(1, 'BUYER_CANCELLED');
        });

        it('should throw error when order not found', async () => {
            mockRepository.findById.mockResolvedValue(null);

            await expect(service.cancelOrder(999, 200))
                .rejects.toThrow(BuyerOrderError);

            await expect(service.cancelOrder(999, 200))
                .rejects.toThrow('Order not found');
        });

        it('should throw error when buyer does not own order', async () => {
            const otherBuyerOrder = { ...mockOrder, buyerId: 999 };
            mockRepository.findById.mockResolvedValue(otherBuyerOrder as any);

            await expect(service.cancelOrder(1, 200))
                .rejects.toThrow('Order not found');
        });

        it('should throw error when order already cancelled', async () => {
            const cancelledOrder = { ...mockOrder, deletedAt: new Date() };
            mockRepository.findById.mockResolvedValue(cancelledOrder as any);

            await expect(service.cancelOrder(1, 200))
                .rejects.toThrow('Order is already cancelled');
        });
    });
});
