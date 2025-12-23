/**
 * Order Status Repository - Story 3.6
 * 
 * Data Access Layer for Order Status Tracking operations.
 * Encapsulates all Prisma queries for order status management.
 * 
 * STAR: Situation - Need to query and update order tracking status.
 *       Task - Provide repository methods for CRUD operations.
 *       Action - Use Prisma client with optimized select/include.
 *       Result - Clean data access layer without business logic.
 */

import { PrismaClient, TrackingStatus, Prisma } from '../generated/prisma/client';
import {
    OrderWithTracking,
    OrderListItem,
    TimelineEvent,
    GetOrdersFilter,
    UpdateOrderStatusDTO,
    OrderTrackingStatus,
    HaulerInfo,
    // Story 3.7 Transaction types
    EarningsSummary,
    TransactionListItem,
    TransactionDetails,
    TransactionFilter,
    PaginatedTransactions
} from '../types/order-status.types';
import { logger } from '../utils/logger';

export class OrderStatusRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // ============================================
    // QUERY METHODS
    // ============================================

    /**
     * STAR: Find orders by farmer with pagination and filtering.
     * Situation: Farmer wants to see their order list.
     * Action: Query with filters, select only needed fields.
     */
    async findByFarmerId(filter: GetOrdersFilter): Promise<{
        orders: OrderListItem[];
        total: number;
    }> {
        const { farmerId, status, page = 1, limit = 20 } = filter;

        // Build where clause based on status filter
        let trackingStatusFilter: TrackingStatus[] | undefined;

        if (status === 'active') {
            trackingStatusFilter = [
                'LISTED', 'MATCHED', 'PICKUP_SCHEDULED',
                'AT_DROP_POINT', 'IN_TRANSIT', 'DELIVERED'
            ] as TrackingStatus[];
        } else if (status === 'completed') {
            trackingStatusFilter = ['PAID'] as TrackingStatus[];
        }

        const where: Prisma.OrderWhereInput = {
            farmerId,
            deletedAt: null,
            ...(trackingStatusFilter && {
                trackingStatus: { in: trackingStatusFilter }
            })
        };

        // Run count and find in parallel
        const [total, orders] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                select: {
                    id: true,
                    orderNumber: true,
                    trackingStatus: true,
                    totalAmount: true,
                    eta: true,
                    delayMinutes: true,
                    createdAt: true,
                    // Listing info
                    listingId: true,
                    cropType: true,
                    cropEmoji: true,
                    quantityKg: true,
                    photoUrl: true,
                    // Buyer info
                    buyerBusinessType: true,
                    buyerCity: true,
                    buyerArea: true
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            })
        ]);

        // Map to domain types
        const mappedOrders: OrderListItem[] = orders.map(order => ({
            id: order.orderNumber,
            listing: {
                id: order.listingId ?? '',
                cropType: order.cropType ?? 'Unknown',
                cropEmoji: order.cropEmoji ?? '🌾',
                quantityKg: order.quantityKg?.toNumber() ?? 0,
                photoUrl: order.photoUrl ?? undefined
            },
            buyer: {
                businessType: order.buyerBusinessType ?? 'Unknown',
                city: order.buyerCity ?? 'Unknown',
                area: order.buyerArea ?? undefined
            },
            trackingStatus: order.trackingStatus as OrderTrackingStatus,
            currentStep: this.getStepNumber(order.trackingStatus),
            totalSteps: 7,
            totalAmount: order.totalAmount,
            eta: order.eta ?? undefined,
            delayMinutes: order.delayMinutes ?? undefined,
            createdAt: order.createdAt
        }));

        return { orders: mappedOrders, total };
    }

    /**
     * STAR: Find single order with full tracking details.
     * Action: Include full status history and hauler info.
     */
    async findByOrderNumber(orderNumber: string): Promise<OrderWithTracking | null> {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber },
            select: {
                id: true,
                orderNumber: true,
                farmerId: true,
                trackingStatus: true,
                totalAmount: true,
                eta: true,
                delayMinutes: true,
                delayReason: true,
                statusHistory: true,
                upiTransactionId: true,
                createdAt: true,
                updatedAt: true,
                // Listing info
                listingId: true,
                cropType: true,
                cropEmoji: true,
                quantityKg: true,
                photoUrl: true,
                // Buyer info
                buyerId: true,
                buyerBusinessType: true,
                buyerCity: true,
                buyerArea: true,
                // Hauler info
                haulerId: true,
                haulerName: true,
                haulerPhone: true,
                haulerVehicle: true
            }
        });

        if (!order) return null;

        return {
            id: order.orderNumber,
            farmerId: order.farmerId,
            listing: {
                id: order.listingId ?? '',
                cropType: order.cropType ?? 'Unknown',
                cropEmoji: order.cropEmoji ?? '🌾',
                quantityKg: order.quantityKg?.toNumber() ?? 0,
                photoUrl: order.photoUrl ?? undefined
            },
            buyer: {
                id: String(order.buyerId),
                businessType: order.buyerBusinessType ?? 'Unknown',
                city: order.buyerCity ?? 'Unknown',
                area: order.buyerArea ?? undefined
            },
            trackingStatus: order.trackingStatus as OrderTrackingStatus,
            currentStep: this.getStepNumber(order.trackingStatus),
            totalSteps: 7,
            totalAmount: order.totalAmount,
            eta: order.eta ?? undefined,
            delayMinutes: order.delayMinutes ?? undefined,
            delayReason: order.delayReason ?? undefined,
            hauler: order.haulerId ? {
                id: order.haulerId,
                name: order.haulerName ?? 'Unknown',
                phone: order.haulerPhone ?? '',
                vehicleType: order.haulerVehicle?.split(' ')[0],
                vehicleNumber: order.haulerVehicle?.split(' ').slice(1).join(' ')
            } : undefined,
            statusHistory: this.parseStatusHistory(order.statusHistory),
            upiTransactionId: order.upiTransactionId ?? undefined,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };
    }

    /**
     * STAR: Count active orders for farmer (for badge).
     */
    async countActiveByFarmerId(farmerId: number): Promise<number> {
        return this.prisma.order.count({
            where: {
                farmerId,
                deletedAt: null,
                trackingStatus: {
                    notIn: ['PAID'] as TrackingStatus[]
                }
            }
        });
    }

    // ============================================
    // UPDATE METHODS
    // ============================================

    /**
     * STAR: Update order tracking status.
     * Situation: Status transition triggered by internal service.
     * Action: Update status, append to history, set related fields.
     */
    async updateStatus(dto: UpdateOrderStatusDTO): Promise<OrderWithTracking> {
        const { orderId, newStatus, actor, note, haulerInfo, eta, delayMinutes, delayReason, upiTransactionId } = dto;

        // Get current order
        const current = await this.prisma.order.findUnique({
            where: { orderNumber: orderId },
            select: { statusHistory: true, trackingStatus: true }
        });

        if (!current) {
            throw new Error(`Order not found: ${orderId}`);
        }

        // Append to status history
        const history = this.parseStatusHistory(current.statusHistory);
        const newEvent: TimelineEvent = {
            step: this.getStepNumber(newStatus as unknown as TrackingStatus),
            status: newStatus,
            label: this.formatStatusLabel(newStatus),
            completed: true,
            active: true,
            timestamp: new Date().toISOString(),
            actor,
            note
        };

        // Mark previous events as not active
        history.forEach(e => e.active = false);
        history.push(newEvent);

        // Build update data
        const updateData: Prisma.OrderUpdateInput = {
            trackingStatus: newStatus as unknown as TrackingStatus,
            statusHistory: history as unknown as Prisma.InputJsonValue
        };

        // Add optional fields based on status
        if (haulerInfo) {
            updateData.haulerId = haulerInfo.id;
            updateData.haulerName = haulerInfo.name;
            updateData.haulerPhone = haulerInfo.phone;
            updateData.haulerVehicle = haulerInfo.vehicleType
                ? `${haulerInfo.vehicleType} ${haulerInfo.vehicleNumber ?? ''}`
                : undefined;
        }

        if (eta) updateData.eta = eta;
        if (delayMinutes !== undefined) updateData.delayMinutes = delayMinutes;
        if (delayReason) updateData.delayReason = delayReason;
        if (upiTransactionId) updateData.upiTransactionId = upiTransactionId;

        await this.prisma.order.update({
            where: { orderNumber: orderId },
            data: updateData
        });

        logger.info({ orderId, newStatus, actor }, 'Order status updated');

        // Return updated order
        return this.findByOrderNumber(orderId) as Promise<OrderWithTracking>;
    }

    /**
     * STAR: Update delay info.
     */
    async updateDelay(orderId: string, delayMinutes: number, reason: string, newEta?: Date): Promise<void> {
        await this.prisma.order.update({
            where: { orderNumber: orderId },
            data: {
                delayMinutes,
                delayReason: reason,
                ...(newEta && { eta: newEta })
            }
        });

        logger.info({ orderId, delayMinutes, reason }, 'Order delay updated');
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private getStepNumber(status: TrackingStatus | string): number {
        const steps: Record<string, number> = {
            LISTED: 1,
            MATCHED: 2,
            PICKUP_SCHEDULED: 3,
            AT_DROP_POINT: 4,
            IN_TRANSIT: 5,
            DELIVERED: 6,
            PAID: 7
        };
        return steps[status] ?? 1;
    }

    private formatStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            LISTED: 'Listed',
            MATCHED: 'Matched',
            PICKUP_SCHEDULED: 'Pickup Scheduled',
            AT_DROP_POINT: 'At Drop Point',
            IN_TRANSIT: 'In Transit',
            DELIVERED: 'Delivered',
            PAID: 'Payment Received'
        };
        return labels[status] ?? status;
    }

    private parseStatusHistory(history: unknown): TimelineEvent[] {
        if (!history) return [];
        if (Array.isArray(history)) return history as TimelineEvent[];
        if (typeof history === 'string') {
            try {
                return JSON.parse(history);
            } catch {
                return [];
            }
        }
        return [];
    }

    // ============================================
    // STORY 3.7 - TRANSACTION QUERY METHODS
    // ============================================

    /**
     * STAR: Get farmer earnings summary - AC1
     * Situation: Farmer opens earnings dashboard.
     * Action: Aggregate PAID and DELIVERED orders.
     */
    async getEarningsSummary(farmerId: number): Promise<EarningsSummary> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Run all queries in parallel
        const [totalEarnings, monthEarnings, pendingEarnings, totalCount, monthCount] = await Promise.all([
            // Total all-time earnings (PAID orders)
            this.prisma.order.aggregate({
                where: { farmerId, trackingStatus: 'PAID' as TrackingStatus, deletedAt: null },
                _sum: { totalAmount: true },
                _count: true
            }),
            // This month earnings
            this.prisma.order.aggregate({
                where: {
                    farmerId,
                    trackingStatus: 'PAID' as TrackingStatus,
                    deletedAt: null,
                    updatedAt: { gte: startOfMonth }
                },
                _sum: { totalAmount: true },
                _count: true
            }),
            // Pending (DELIVERED but not PAID)
            this.prisma.order.aggregate({
                where: { farmerId, trackingStatus: 'DELIVERED' as TrackingStatus, deletedAt: null },
                _sum: { totalAmount: true }
            }),
            // Total order count
            this.prisma.order.count({
                where: { farmerId, trackingStatus: 'PAID' as TrackingStatus, deletedAt: null }
            }),
            // This month count
            this.prisma.order.count({
                where: {
                    farmerId,
                    trackingStatus: 'PAID' as TrackingStatus,
                    deletedAt: null,
                    updatedAt: { gte: startOfMonth }
                }
            })
        ]);

        return {
            total: totalEarnings._sum.totalAmount?.toNumber() ?? 0,
            thisMonth: monthEarnings._sum.totalAmount?.toNumber() ?? 0,
            pending: pendingEarnings._sum.totalAmount?.toNumber() ?? 0,
            orderCount: {
                total: totalCount,
                thisMonth: monthCount
            },
            newSinceLastVisit: 0, // TODO: Track last visit timestamp
            currency: 'INR'
        };
    }

    /**
     * STAR: Get transactions with filters and pagination - AC2, AC3
     * Situation: Farmer browses transaction history.
     * Action: Filter by status, date, crop; paginate results.
     */
    async getTransactions(filter: TransactionFilter): Promise<PaginatedTransactions> {
        const {
            farmerId,
            status = 'all',
            fromDate,
            toDate,
            cropType,
            sortBy = 'date',
            sortOrder = 'desc',
            page = 1,
            limit = 20
        } = filter;

        // Build where clause
        let trackingStatusFilter: TrackingStatus[] | undefined;
        if (status === 'completed') {
            trackingStatusFilter = ['PAID'] as TrackingStatus[];
        } else if (status === 'pending') {
            trackingStatusFilter = ['DELIVERED'] as TrackingStatus[];
        }

        // Default to 90 days if no date filter
        const defaultFromDate = new Date();
        defaultFromDate.setDate(defaultFromDate.getDate() - 90);

        const where: Prisma.OrderWhereInput = {
            farmerId,
            deletedAt: null,
            trackingStatus: trackingStatusFilter
                ? { in: trackingStatusFilter }
                : { in: ['PAID', 'DELIVERED'] as TrackingStatus[] },
            ...(fromDate && { createdAt: { gte: fromDate } }),
            ...(toDate && { createdAt: { lte: toDate } }),
            ...(!fromDate && !toDate && { createdAt: { gte: defaultFromDate } }),
            ...(cropType && { cropType: { contains: cropType, mode: 'insensitive' as const } })
        };

        // Build orderBy
        const orderByMap: Record<string, Prisma.OrderOrderByWithRelationInput> = {
            date: { createdAt: sortOrder },
            amount: { totalAmount: sortOrder },
            crop: { cropType: sortOrder }
        };

        const [total, orders] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.findMany({
                where,
                select: {
                    orderNumber: true,
                    createdAt: true,
                    cropType: true,
                    cropEmoji: true,
                    quantityKg: true,
                    buyerBusinessType: true,
                    buyerCity: true,
                    totalAmount: true,
                    trackingStatus: true,
                    qualityGrade: true
                },
                orderBy: orderByMap[sortBy] ?? { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            })
        ]);

        const transactions: TransactionListItem[] = orders.map(order => ({
            id: order.orderNumber,
            date: order.createdAt,
            crop: {
                type: order.cropType ?? 'Unknown',
                icon: order.cropEmoji ?? '🌾',
                quantityKg: order.quantityKg?.toNumber() ?? 0
            },
            buyer: {
                type: order.buyerBusinessType ?? 'Buyer',
                city: order.buyerCity ?? 'Unknown'
            },
            amount: order.totalAmount?.toNumber() ?? 0,
            status: order.trackingStatus === 'PAID' ? 'completed' : 'pending',
            qualityGrade: order.qualityGrade ?? undefined
        }));

        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                hasMore: page * limit < total
            }
        };
    }

    /**
     * STAR: Get transaction details - AC4
     * Situation: Farmer taps on transaction to view full details.
     * Action: Return full timeline and payment breakdown.
     */
    async getTransactionDetails(orderId: string, farmerId: number): Promise<TransactionDetails | null> {
        const order = await this.prisma.order.findFirst({
            where: {
                orderNumber: orderId,
                farmerId,
                deletedAt: null,
                trackingStatus: { in: ['PAID', 'DELIVERED'] as TrackingStatus[] }
            },
            select: {
                orderNumber: true,
                createdAt: true,
                updatedAt: true,
                // Listing
                listingId: true,
                cropType: true,
                cropEmoji: true,
                quantityKg: true,
                photoUrl: true,
                qualityGrade: true,
                // Buyer
                buyerBusinessType: true,
                buyerCity: true,
                buyerArea: true,
                // Drop point
                dropPointName: true,
                dropPointAddress: true,
                // Hauler
                haulerId: true,
                haulerName: true,
                haulerPhone: true,
                haulerVehicle: true,
                // Payment
                totalAmount: true,
                baseAmount: true,
                qualityBonus: true,
                upiTransactionId: true,
                paidAt: true,
                // Timeline
                statusHistory: true,
                trackingStatus: true
            }
        });

        if (!order) return null;

        // Calculate if receipt is downloadable (within 90 days)
        const paidDate = order.paidAt ?? order.updatedAt;
        const daysSincePaid = Math.floor((Date.now() - paidDate.getTime()) / (1000 * 60 * 60 * 24));
        const canDownloadReceipt = daysSincePaid <= 90;

        // Mask UPI ID (show last 8 chars)
        const upiId = order.upiTransactionId ?? '';
        const maskedUpiId = upiId.length > 8
            ? '****' + upiId.slice(-8)
            : upiId;

        return {
            id: order.orderNumber,
            listing: {
                id: order.listingId ?? '',
                cropType: order.cropType ?? 'Unknown',
                cropEmoji: order.cropEmoji ?? '🌾',
                quantityKg: order.quantityKg?.toNumber() ?? 0,
                photoUrl: order.photoUrl ?? undefined
            },
            buyer: {
                businessType: order.buyerBusinessType ?? 'Buyer',
                city: order.buyerCity ?? 'Unknown',
                area: order.buyerArea ?? undefined
            },
            dropPoint: order.dropPointName ? {
                name: order.dropPointName,
                address: order.dropPointAddress ?? ''
            } : undefined,
            hauler: order.haulerId ? {
                id: order.haulerId,
                name: order.haulerName ?? 'Unknown',
                phone: order.haulerPhone ?? '',
                vehicleType: order.haulerVehicle?.split(' ')[0],
                vehicleNumber: order.haulerVehicle?.split(' ').slice(1).join(' ')
            } : undefined,
            timeline: this.parseStatusHistory(order.statusHistory),
            payment: {
                baseAmount: order.baseAmount?.toNumber() ?? order.totalAmount?.toNumber() ?? 0,
                qualityBonus: order.qualityBonus?.toNumber() ?? 0,
                platformFee: 0, // Farmers pay 0% commission
                netAmount: order.totalAmount?.toNumber() ?? 0,
                upiTxnId: maskedUpiId,
                paidAt: order.paidAt ?? undefined
            },
            createdAt: order.createdAt,
            canDownloadReceipt
        };
    }
}

