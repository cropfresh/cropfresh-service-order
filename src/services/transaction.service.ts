/**
 * Transaction Service - Story 3.7
 * 
 * Business Logic Layer for Transaction History and Earnings.
 * Provides farmer earnings summary, transaction list, and details.
 * 
 * STAR: Situation - Farmers need to view earnings and transaction history.
 *       Task - Provide service methods for earnings, transactions, receipts.
 *       Action - Delegate to repository, apply business rules.
 *       Result - Clean business logic layer for AC1-5.
 */

import { OrderStatusRepository } from '../repositories/order-status.repository';
import {
    EarningsSummary,
    TransactionListItem,
    TransactionDetails,
    TransactionFilter,
    PaginatedTransactions
} from '../types/order-status.types';
import { logger } from '../utils/logger';

// Error codes for structured error handling
export enum TransactionErrorCode {
    TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
    INVALID_FARMER_ID = 'INVALID_FARMER_ID',
    RECEIPT_EXPIRED = 'RECEIPT_EXPIRED'
}

export class TransactionError extends Error {
    code: TransactionErrorCode;
    metadata?: Record<string, unknown>;

    constructor(code: TransactionErrorCode, message: string, metadata?: Record<string, unknown>) {
        super(message);
        this.code = code;
        this.metadata = metadata;
        this.name = 'TransactionError';
    }
}

export class TransactionService {
    private repo: OrderStatusRepository;

    constructor(repo: OrderStatusRepository) {
        this.repo = repo;
    }

    // ============================================
    // AC1: EARNINGS SUMMARY
    // ============================================

    /**
     * STAR: Get farmer earnings summary for dashboard.
     * Situation: Farmer opens earnings screen.
     * Action: Aggregate total, monthly, pending earnings.
     */
    async getEarnings(farmerId: number): Promise<EarningsSummary> {
        this.validateFarmerId(farmerId);

        const summary = await this.repo.getEarningsSummary(farmerId);

        logger.info({
            farmerId,
            total: summary.total,
            thisMonth: summary.thisMonth
        }, 'Earnings summary retrieved');

        return summary;
    }

    // ============================================
    // AC2, AC3: TRANSACTION LIST WITH FILTERS
    // ============================================

    /**
     * STAR: Get paginated transactions with filters.
     * Situation: Farmer browses transaction history.
     * Action: Apply filters, paginate, return list.
     */
    async getTransactions(filter: TransactionFilter): Promise<PaginatedTransactions> {
        this.validateFarmerId(filter.farmerId);

        // Apply 90-day default if no dates specified (AC8)
        const appliedFilter = { ...filter };
        if (!filter.fromDate && !filter.toDate) {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            appliedFilter.fromDate = ninetyDaysAgo;
        }

        const result = await this.repo.getTransactions(appliedFilter);

        logger.info({
            farmerId: filter.farmerId,
            status: filter.status,
            count: result.transactions.length,
            total: result.pagination.total
        }, 'Transactions retrieved');

        return result;
    }

    // ============================================
    // AC4: TRANSACTION DETAILS
    // ============================================

    /**
     * STAR: Get single transaction with full details.
     * Situation: Farmer taps on transaction for details.
     * Action: Load timeline, payment breakdown, receipt status.
     */
    async getTransactionDetails(
        transactionId: string,
        farmerId: number
    ): Promise<TransactionDetails> {
        this.validateFarmerId(farmerId);

        const details = await this.repo.getTransactionDetails(transactionId, farmerId);

        if (!details) {
            throw new TransactionError(
                TransactionErrorCode.TRANSACTION_NOT_FOUND,
                `Transaction not found: ${transactionId}`,
                { transactionId }
            );
        }

        logger.info({
            transactionId,
            farmerId,
            canDownloadReceipt: details.canDownloadReceipt
        }, 'Transaction details retrieved');

        return details;
    }

    // ============================================
    // AC5: RECEIPT VALIDATION
    // ============================================

    /**
     * STAR: Check if receipt can be downloaded.
     * Situation: Farmer requests receipt download.
     * Action: Check 90-day window, return validity.
     */
    async canDownloadReceipt(transactionId: string, farmerId: number): Promise<boolean> {
        this.validateFarmerId(farmerId);

        const details = await this.repo.getTransactionDetails(transactionId, farmerId);
        if (!details) {
            throw new TransactionError(
                TransactionErrorCode.TRANSACTION_NOT_FOUND,
                `Transaction not found: ${transactionId}`,
                { transactionId }
            );
        }

        return details.canDownloadReceipt;
    }

    // ============================================
    // VALIDATION HELPERS
    // ============================================

    private validateFarmerId(farmerId: number): void {
        if (!farmerId || typeof farmerId !== 'number' || farmerId <= 0) {
            throw new TransactionError(
                TransactionErrorCode.INVALID_FARMER_ID,
                'Invalid farmer ID',
                { farmerId }
            );
        }
    }
}
