/**
 * Transaction Service Tests - Story 3.7
 * 
 * Unit tests for TransactionService: getEarnings, getTransactions, 
 * getTransactionDetails, canDownloadReceipt.
 * 
 * Coverage: AC1 (earnings), AC2-3 (transactions), AC4 (details), AC5 (receipt)
 */

import { TransactionService, TransactionError, TransactionErrorCode } from '../src/services/transaction.service';
import { OrderStatusRepository } from '../src/repositories/order-status.repository';
import {
    EarningsSummary,
    TransactionFilter,
    PaginatedTransactions,
    TransactionDetails,
    OrderTrackingStatus
} from '../src/types/order-status.types';

// Mock the repository
jest.mock('../src/repositories/order-status.repository');

describe('TransactionService', () => {
    let service: TransactionService;
    let mockRepo: jest.Mocked<OrderStatusRepository>;

    // Fixed test data
    const testFarmerId = 12345;
    const testTransactionId = 'ORD-2025-001234';

    const mockEarningsSummary: EarningsSummary = {
        total: 45000,
        thisMonth: 8500,
        pending: 1800,
        orderCount: { total: 45, thisMonth: 8 },
        newSinceLastVisit: 3,
        currency: 'INR'
    };

    const mockPaginatedTransactions: PaginatedTransactions = {
        transactions: [
            {
                id: 'ORD-2025-001234',
                date: new Date('2025-12-20T10:00:00+05:30'),
                crop: { type: 'Tomato', icon: '🍅', quantityKg: 50 },
                buyer: { type: 'Restaurant', city: 'Bangalore' },
                amount: 1800,
                status: 'completed',
                qualityGrade: 'A'
            }
        ],
        pagination: { page: 1, limit: 20, total: 1, hasMore: false }
    };

    const mockTransactionDetails: TransactionDetails = {
        id: testTransactionId,
        listing: {
            id: 'LST-001234',
            cropType: 'Tomato',
            cropEmoji: '🍅',
            quantityKg: 50
        },
        buyer: {
            businessType: 'Restaurant',
            city: 'Bangalore'
        },
        timeline: [
            { step: 7, status: OrderTrackingStatus.PAID, label: 'Paid', completed: true, active: true }
        ],
        payment: {
            baseAmount: 1750,
            qualityBonus: 50,
            platformFee: 0,
            netAmount: 1800,
            upiTxnId: '****ABCD1234',
            paidAt: new Date('2025-12-20T15:30:00+05:30')
        },
        createdAt: new Date('2025-12-20T08:00:00+05:30'),
        canDownloadReceipt: true
    };

    beforeEach(() => {
        // Create fresh mock for each test
        mockRepo = {
            getEarningsSummary: jest.fn(),
            getTransactions: jest.fn(),
            getTransactionDetails: jest.fn()
        } as unknown as jest.Mocked<OrderStatusRepository>;

        service = new TransactionService(mockRepo);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ============================================
    // AC1: EARNINGS SUMMARY
    // ============================================

    describe('getEarnings - AC1', () => {
        it('should return earnings summary for valid farmer', async () => {
            mockRepo.getEarningsSummary.mockResolvedValue(mockEarningsSummary);

            const result = await service.getEarnings(testFarmerId);

            expect(mockRepo.getEarningsSummary).toHaveBeenCalledWith(testFarmerId);
            expect(result).toEqual(mockEarningsSummary);
            expect(result.total).toBe(45000);
            expect(result.thisMonth).toBe(8500);
            expect(result.pending).toBe(1800);
            expect(result.currency).toBe('INR');
        });

        it('should throw INVALID_FARMER_ID for zero farmer ID', async () => {
            await expect(service.getEarnings(0)).rejects.toThrow(TransactionError);
            await expect(service.getEarnings(0)).rejects.toMatchObject({
                code: TransactionErrorCode.INVALID_FARMER_ID
            });
        });

        it('should throw INVALID_FARMER_ID for negative farmer ID', async () => {
            await expect(service.getEarnings(-1)).rejects.toThrow(TransactionError);
        });

        it('should handle empty earnings (no orders)', async () => {
            const emptyEarnings: EarningsSummary = {
                total: 0,
                thisMonth: 0,
                pending: 0,
                orderCount: { total: 0, thisMonth: 0 },
                newSinceLastVisit: 0,
                currency: 'INR'
            };
            mockRepo.getEarningsSummary.mockResolvedValue(emptyEarnings);

            const result = await service.getEarnings(testFarmerId);

            expect(result.total).toBe(0);
            expect(result.orderCount.total).toBe(0);
        });
    });

    // ============================================
    // AC2-3: TRANSACTIONS LIST WITH FILTERS
    // ============================================

    describe('getTransactions - AC2, AC3', () => {
        it('should return paginated transactions with default filter', async () => {
            mockRepo.getTransactions.mockResolvedValue(mockPaginatedTransactions);

            const filter: TransactionFilter = { farmerId: testFarmerId };
            const result = await service.getTransactions(filter);

            expect(mockRepo.getTransactions).toHaveBeenCalled();
            expect(result.transactions).toHaveLength(1);
            expect(result.pagination.page).toBe(1);
        });

        it('should apply 90-day default when no dates provided (AC8)', async () => {
            mockRepo.getTransactions.mockResolvedValue(mockPaginatedTransactions);

            const filter: TransactionFilter = { farmerId: testFarmerId };
            await service.getTransactions(filter);

            // Verify the filter was modified to include fromDate
            const calledFilter = mockRepo.getTransactions.mock.calls[0][0];
            expect(calledFilter.fromDate).toBeDefined();
        });

        it('should respect custom date range', async () => {
            mockRepo.getTransactions.mockResolvedValue(mockPaginatedTransactions);

            const customFrom = new Date('2025-01-01');
            const customTo = new Date('2025-12-31');
            const filter: TransactionFilter = {
                farmerId: testFarmerId,
                fromDate: customFrom,
                toDate: customTo
            };

            await service.getTransactions(filter);

            const calledFilter = mockRepo.getTransactions.mock.calls[0][0];
            expect(calledFilter.fromDate).toEqual(customFrom);
            expect(calledFilter.toDate).toEqual(customTo);
        });

        it('should filter by status (completed)', async () => {
            mockRepo.getTransactions.mockResolvedValue(mockPaginatedTransactions);

            const filter: TransactionFilter = {
                farmerId: testFarmerId,
                status: 'completed'
            };
            await service.getTransactions(filter);

            const calledFilter = mockRepo.getTransactions.mock.calls[0][0];
            expect(calledFilter.status).toBe('completed');
        });

        it('should filter by crop type', async () => {
            mockRepo.getTransactions.mockResolvedValue(mockPaginatedTransactions);

            const filter: TransactionFilter = {
                farmerId: testFarmerId,
                cropType: 'Tomato'
            };
            await service.getTransactions(filter);

            const calledFilter = mockRepo.getTransactions.mock.calls[0][0];
            expect(calledFilter.cropType).toBe('Tomato');
        });

        it('should handle empty transactions list (AC7)', async () => {
            const emptyResult: PaginatedTransactions = {
                transactions: [],
                pagination: { page: 1, limit: 20, total: 0, hasMore: false }
            };
            mockRepo.getTransactions.mockResolvedValue(emptyResult);

            const filter: TransactionFilter = { farmerId: testFarmerId };
            const result = await service.getTransactions(filter);

            expect(result.transactions).toHaveLength(0);
            expect(result.pagination.total).toBe(0);
        });
    });

    // ============================================
    // AC4: TRANSACTION DETAILS
    // ============================================

    describe('getTransactionDetails - AC4', () => {
        it('should return full transaction details with timeline', async () => {
            mockRepo.getTransactionDetails.mockResolvedValue(mockTransactionDetails);

            const result = await service.getTransactionDetails(testTransactionId, testFarmerId);

            expect(mockRepo.getTransactionDetails).toHaveBeenCalledWith(testTransactionId, testFarmerId);
            expect(result.id).toBe(testTransactionId);
            expect(result.timeline).toHaveLength(1);
            expect(result.payment.platformFee).toBe(0); // Farmers pay 0% commission
            expect(result.payment.netAmount).toBe(1800);
        });

        it('should throw TRANSACTION_NOT_FOUND for unknown transaction', async () => {
            mockRepo.getTransactionDetails.mockResolvedValue(null);

            await expect(
                service.getTransactionDetails('UNKNOWN-ID', testFarmerId)
            ).rejects.toMatchObject({
                code: TransactionErrorCode.TRANSACTION_NOT_FOUND
            });
        });

        it('should include canDownloadReceipt flag', async () => {
            mockRepo.getTransactionDetails.mockResolvedValue(mockTransactionDetails);

            const result = await service.getTransactionDetails(testTransactionId, testFarmerId);

            expect(result.canDownloadReceipt).toBe(true);
        });
    });

    // ============================================
    // AC5: RECEIPT DOWNLOAD VALIDATION
    // ============================================

    describe('canDownloadReceipt - AC5', () => {
        it('should return true when within 90 days', async () => {
            mockRepo.getTransactionDetails.mockResolvedValue(mockTransactionDetails);

            const result = await service.canDownloadReceipt(testTransactionId, testFarmerId);

            expect(result).toBe(true);
        });

        it('should return false when beyond 90 days', async () => {
            const expiredDetails = {
                ...mockTransactionDetails,
                canDownloadReceipt: false
            };
            mockRepo.getTransactionDetails.mockResolvedValue(expiredDetails);

            const result = await service.canDownloadReceipt(testTransactionId, testFarmerId);

            expect(result).toBe(false);
        });

        it('should throw error for unknown transaction', async () => {
            mockRepo.getTransactionDetails.mockResolvedValue(null);

            await expect(
                service.canDownloadReceipt('UNKNOWN-ID', testFarmerId)
            ).rejects.toThrow(TransactionError);
        });
    });
});
