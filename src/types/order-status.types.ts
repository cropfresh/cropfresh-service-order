/**
 * Order Status Domain Types - Story 3.6
 * 
 * Shared domain definitions for Order Status Tracking.
 * Used across Repository, Service, and gRPC layers.
 * 
 * STAR: Situation - Farmers need to track 7-stage order lifecycle.
 *       Task - Define types for status timeline, hauler info, ETA tracking.
 *       Action - Create enums, interfaces, and DTOs.
 *       Result - Consistent types across all layers.
 */

import { Prisma } from '../generated/prisma/client';

// ============================================
// STATUS ENUMS
// ============================================

/**
 * 7-Stage Order Tracking Status
 * Aligned with mobile app and Story 3.6 acceptance criteria.
 */
export enum OrderTrackingStatus {
    LISTED = 'LISTED',
    MATCHED = 'MATCHED',
    PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
    AT_DROP_POINT = 'AT_DROP_POINT',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    PAID = 'PAID'
}

/**
 * Status step number (1-7) for progress calculation.
 */
export const STATUS_STEP_MAP: Record<OrderTrackingStatus, number> = {
    [OrderTrackingStatus.LISTED]: 1,
    [OrderTrackingStatus.MATCHED]: 2,
    [OrderTrackingStatus.PICKUP_SCHEDULED]: 3,
    [OrderTrackingStatus.AT_DROP_POINT]: 4,
    [OrderTrackingStatus.IN_TRANSIT]: 5,
    [OrderTrackingStatus.DELIVERED]: 6,
    [OrderTrackingStatus.PAID]: 7
};

/**
 * Valid status transitions (state machine).
 * Only forward transitions allowed.
 */
export const VALID_TRANSITIONS: Record<OrderTrackingStatus, OrderTrackingStatus[]> = {
    [OrderTrackingStatus.LISTED]: [OrderTrackingStatus.MATCHED],
    [OrderTrackingStatus.MATCHED]: [OrderTrackingStatus.PICKUP_SCHEDULED],
    [OrderTrackingStatus.PICKUP_SCHEDULED]: [OrderTrackingStatus.AT_DROP_POINT],
    [OrderTrackingStatus.AT_DROP_POINT]: [OrderTrackingStatus.IN_TRANSIT],
    [OrderTrackingStatus.IN_TRANSIT]: [OrderTrackingStatus.DELIVERED],
    [OrderTrackingStatus.DELIVERED]: [OrderTrackingStatus.PAID],
    [OrderTrackingStatus.PAID]: [] // Terminal state
};

// ============================================
// DOMAIN ENTITIES
// ============================================

/**
 * Timeline Event - Single entry in status_history JSONB.
 */
export interface TimelineEvent {
    step: number;
    status: OrderTrackingStatus;
    label: string;
    completed: boolean;
    active: boolean;
    timestamp?: string; // ISO8601
    actor?: string;     // User/service that triggered
    note?: string;      // Optional note (e.g., delay reason)
}

/**
 * Hauler Information - For IN_TRANSIT status.
 */
export interface HaulerInfo {
    id: string;
    name: string;
    phone: string;
    vehicleType?: string;
    vehicleNumber?: string;
}

/**
 * Listing Summary - Denormalized for performance.
 */
export interface OrderListingSummary {
    id: string;
    cropType: string;
    cropEmoji: string;
    quantityKg: number;
    photoUrl?: string;
}

/**
 * Buyer Summary - Anonymized for farmer view.
 */
export interface OrderBuyerSummary {
    id?: string;
    businessType: string;
    city: string;
    area?: string;
}

/**
 * Order with full tracking details.
 */
export interface OrderWithTracking {
    id: string;
    farmerId: number;
    listing: OrderListingSummary;
    buyer: OrderBuyerSummary;
    trackingStatus: OrderTrackingStatus;
    currentStep: number;
    totalSteps: number;
    totalAmount: number | Prisma.Decimal;
    eta?: Date;
    delayMinutes?: number;
    delayReason?: string;
    hauler?: HaulerInfo;
    statusHistory: TimelineEvent[];
    upiTransactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Order list item (lightweight for list view).
 */
export interface OrderListItem {
    id: string;
    listing: OrderListingSummary;
    buyer: OrderBuyerSummary;
    trackingStatus: OrderTrackingStatus;
    currentStep: number;
    totalSteps: number;
    totalAmount: number | Prisma.Decimal;
    eta?: Date;
    delayMinutes?: number;
    createdAt: Date;
}

// ============================================
// DTOs
// ============================================

/**
 * Filter for fetching orders list.
 */
export interface GetOrdersFilter {
    farmerId: number;
    status?: 'active' | 'completed' | 'all';
    page?: number;
    limit?: number;
}

/**
 * Paginated orders response.
 */
export interface PaginatedOrders {
    orders: OrderListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

/**
 * DTO for updating order status.
 */
export interface UpdateOrderStatusDTO {
    orderId: string;
    newStatus: OrderTrackingStatus;
    actor: string;
    note?: string;
    haulerInfo?: HaulerInfo;
    eta?: Date;
    delayMinutes?: number;
    delayReason?: string;
    upiTransactionId?: string;
}

/**
 * DTO for delay update.
 */
export interface UpdateDelayDTO {
    orderId: string;
    delayMinutes: number;
    reason: string;
    newEta?: Date;
    actor: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a status transition is valid.
 */
export function isValidTransition(
    currentStatus: OrderTrackingStatus,
    newStatus: OrderTrackingStatus
): boolean {
    const allowed = VALID_TRANSITIONS[currentStatus];
    return allowed.includes(newStatus);
}

/**
 * Get step number for a status.
 */
export function getStatusStep(status: OrderTrackingStatus): number {
    return STATUS_STEP_MAP[status] ?? 1;
}

/**
 * Check if order is active (not PAID).
 */
export function isActiveOrder(status: OrderTrackingStatus): boolean {
    return status !== OrderTrackingStatus.PAID;
}

/**
 * Generate timeline events up to current status.
 */
export function generateTimeline(currentStatus: OrderTrackingStatus): TimelineEvent[] {
    const currentStep = getStatusStep(currentStatus);
    const statuses = Object.values(OrderTrackingStatus);

    return statuses.map((status) => {
        const step = getStatusStep(status);
        return {
            step,
            status,
            label: formatStatusLabel(status),
            completed: step < currentStep,
            active: status === currentStatus,
            timestamp: step <= currentStep ? new Date().toISOString() : undefined
        };
    });
}

/**
 * Format status enum to human-readable label.
 */
export function formatStatusLabel(status: OrderTrackingStatus): string {
    const labels: Record<OrderTrackingStatus, string> = {
        [OrderTrackingStatus.LISTED]: 'Listed',
        [OrderTrackingStatus.MATCHED]: 'Matched',
        [OrderTrackingStatus.PICKUP_SCHEDULED]: 'Pickup Scheduled',
        [OrderTrackingStatus.AT_DROP_POINT]: 'At Drop Point',
        [OrderTrackingStatus.IN_TRANSIT]: 'In Transit',
        [OrderTrackingStatus.DELIVERED]: 'Delivered',
        [OrderTrackingStatus.PAID]: 'Payment Received'
    };
    return labels[status] ?? status;
}

// ============================================
// STORY 3.7 - TRANSACTION HISTORY TYPES
// ============================================

/**
 * Earnings Summary - AC1
 * Dashboard stats: total, this month, pending.
 */
export interface EarningsSummary {
    total: number;           // All-time earnings (PAID orders)
    thisMonth: number;       // Current month earnings
    pending: number;         // DELIVERED but not yet PAID
    orderCount: {
        total: number;
        thisMonth: number;
    };
    newSinceLastVisit: number;  // Badge count
    currency: string;           // "INR"
}

/**
 * Transaction List Item - AC2
 * Lightweight for infinite scroll list.
 */
export interface TransactionListItem {
    id: string;             // Order ID
    date: Date;             // Transaction date
    crop: {
        type: string;
        icon: string;       // Emoji
        quantityKg: number;
    };
    buyer: {
        type: string;       // "Restaurant", "Hotel", etc.
        city: string;       // Masked city only
    };
    amount: number;         // Net amount
    status: 'completed' | 'pending';
    qualityGrade?: string;  // "A", "B", "C"
}

/**
 * Payment Breakdown - AC4
 * Detailed payment info for transaction detail.
 */
export interface PaymentBreakdown {
    baseAmount: number;     // Base price × quantity
    qualityBonus: number;   // Bonus for high grade (can be negative)
    platformFee: number;    // Always 0 for farmers
    netAmount: number;      // Final amount received
    upiTxnId: string;       // Last 8 chars visible: "****ABCD1234"
    paidAt?: Date;          // Payment timestamp
}

/**
 * Transaction Details - AC4
 * Full transaction with timeline and payment.
 */
export interface TransactionDetails {
    id: string;
    listing: OrderListingSummary;
    buyer: OrderBuyerSummary;
    dropPoint?: {
        name: string;
        address: string;
    };
    hauler?: HaulerInfo;
    timeline: TimelineEvent[];
    payment: PaymentBreakdown;
    createdAt: Date;
    canDownloadReceipt: boolean;  // true if within 90 days
}

/**
 * Transaction Filter - AC3
 * Query params for transaction list.
 */
export interface TransactionFilter {
    farmerId: number;
    status?: 'completed' | 'pending' | 'all';
    fromDate?: Date;        // Date range start
    toDate?: Date;          // Date range end
    cropType?: string;      // Filter by crop
    sortBy?: 'date' | 'amount' | 'crop';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

/**
 * Paginated Transactions Response.
 */
export interface PaginatedTransactions {
    transactions: TransactionListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

