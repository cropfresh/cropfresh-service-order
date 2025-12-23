/**
 * Transaction gRPC Handlers - Story 3.7
 * 
 * gRPC handlers for Transaction History & Earnings endpoints.
 * Maps gRPC requests to TransactionService methods.
 * 
 * AC1: GetFarmerEarnings - Earnings summary
 * AC2-3: GetFarmerTransactions - List with filters
 * AC4: GetTransactionDetails - Full transaction details
 */

import { TransactionService, TransactionError, TransactionErrorCode } from '../services/transaction.service';
import { logger } from '../utils/logger';
import {
    TransactionFilter
} from '../types/order-status.types';

// Type definitions for gRPC request/response objects
interface GetFarmerEarningsRequest {
    farmerId: number;
}

interface GetFarmerTransactionsRequest {
    farmerId: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
    cropType?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}

interface GetTransactionDetailsRequest {
    transactionId: string;
    farmerId: number;
}

// gRPC callback type
type GrpcCallback<T> = (error: Error | null, response?: T) => void;

export class TransactionHandlers {
    private service: TransactionService;

    constructor(service: TransactionService) {
        this.service = service;
    }

    /**
     * AC1: Get farmer earnings summary.
     */
    async getFarmerEarnings(
        call: { request: GetFarmerEarningsRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const { farmerId } = call.request;

            const earnings = await this.service.getEarnings(farmerId);

            callback(null, {
                total: earnings.total,
                thisMonth: earnings.thisMonth,
                pending: earnings.pending,
                totalOrderCount: earnings.orderCount.total,
                thisMonthOrderCount: earnings.orderCount.thisMonth,
                newSinceLastVisit: earnings.newSinceLastVisit,
                currency: earnings.currency
            });

            logger.info({ farmerId }, 'GetFarmerEarnings completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    /**
     * AC2-3: Get farmer transactions with filters and pagination.
     */
    async getFarmerTransactions(
        call: { request: GetFarmerTransactionsRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const req = call.request;

            const filter: TransactionFilter = {
                farmerId: req.farmerId,
                status: this.parseStatus(req.status),
                fromDate: req.fromDate ? new Date(req.fromDate) : undefined,
                toDate: req.toDate ? new Date(req.toDate) : undefined,
                cropType: req.cropType || undefined,
                sortBy: this.parseSortBy(req.sortBy),
                sortOrder: req.sortOrder === 'asc' ? 'asc' : 'desc',
                page: req.page || 1,
                limit: req.limit || 20
            };

            const result = await this.service.getTransactions(filter);

            callback(null, {
                transactions: result.transactions.map(t => ({
                    id: t.id,
                    date: t.date.toISOString(),
                    cropType: t.crop.type,
                    cropIcon: t.crop.icon,
                    quantityKg: t.crop.quantityKg,
                    buyerType: t.buyer.type,
                    buyerCity: t.buyer.city,
                    amount: t.amount,
                    status: t.status,
                    qualityGrade: t.qualityGrade || ''
                })),
                page: result.pagination.page,
                limit: result.pagination.limit,
                total: result.pagination.total,
                hasMore: result.pagination.hasMore
            });

            logger.info({
                farmerId: req.farmerId,
                count: result.transactions.length
            }, 'GetFarmerTransactions completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    /**
     * AC4: Get transaction details.
     */
    async getTransactionDetails(
        call: { request: GetTransactionDetailsRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const { transactionId, farmerId } = call.request;

            const details = await this.service.getTransactionDetails(transactionId, farmerId);

            callback(null, {
                id: details.id,
                listing: {
                    id: details.listing.id,
                    cropType: details.listing.cropType,
                    cropEmoji: details.listing.cropEmoji,
                    quantityKg: details.listing.quantityKg,
                    photoUrl: details.listing.photoUrl || ''
                },
                buyer: {
                    businessType: details.buyer.businessType,
                    city: details.buyer.city,
                    area: details.buyer.area || ''
                },
                dropPoint: details.dropPoint ? {
                    name: details.dropPoint.name,
                    address: details.dropPoint.address
                } : null,
                hauler: details.hauler ? {
                    id: details.hauler.id,
                    name: details.hauler.name,
                    phone: details.hauler.phone,
                    vehicleType: details.hauler.vehicleType || '',
                    vehicleNumber: details.hauler.vehicleNumber || ''
                } : null,
                timeline: details.timeline.map(e => ({
                    step: e.step,
                    status: e.status,
                    label: e.label,
                    completed: e.completed,
                    active: e.active,
                    timestamp: e.timestamp || '',
                    actor: e.actor || '',
                    note: e.note || ''
                })),
                payment: {
                    baseAmount: details.payment.baseAmount,
                    qualityBonus: details.payment.qualityBonus,
                    platformFee: details.payment.platformFee,
                    netAmount: details.payment.netAmount,
                    upiTxnId: details.payment.upiTxnId,
                    paidAt: details.payment.paidAt?.toISOString() || ''
                },
                createdAt: details.createdAt.toISOString(),
                canDownloadReceipt: details.canDownloadReceipt
            });

            logger.info({ transactionId, farmerId }, 'GetTransactionDetails completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private parseStatus(status?: string): 'completed' | 'pending' | 'all' {
        if (status === 'completed' || status === 'pending') {
            return status;
        }
        return 'all';
    }

    private parseSortBy(sortBy?: string): 'date' | 'amount' | 'crop' {
        if (sortBy === 'amount' || sortBy === 'crop') {
            return sortBy;
        }
        return 'date';
    }

    private handleError(error: unknown, callback: GrpcCallback<unknown>): void {
        if (error instanceof TransactionError) {
            const grpcError = new Error(error.message) as Error & { code: number };
            grpcError.code = this.mapErrorCode(error.code);
            callback(grpcError);
        } else if (error instanceof Error) {
            callback(error);
        } else {
            callback(new Error('Unknown error'));
        }
    }

    private mapErrorCode(code: TransactionErrorCode): number {
        const grpcCodes: Record<TransactionErrorCode, number> = {
            [TransactionErrorCode.TRANSACTION_NOT_FOUND]: 5,    // NOT_FOUND
            [TransactionErrorCode.INVALID_FARMER_ID]: 3,        // INVALID_ARGUMENT
            [TransactionErrorCode.RECEIPT_EXPIRED]: 9           // FAILED_PRECONDITION
        };
        return grpcCodes[code] ?? 13; // INTERNAL
    }
}
