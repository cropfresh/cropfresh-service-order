/**
 * Match Domain Types - Story 3.5
 * 
 * Shared domain definitions for Match entities.
 * Used across Repository, Service, and gRPC layers.
 */

import { Decimal } from '@prisma/client/runtime/library';

// Match Status Enum (aligned with Prisma/Proto)
export enum MatchStatus {
    PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
}

// Rejection Reason Enum
export enum RejectionReason {
    QUALITY_CHANGED = 'QUALITY_CHANGED',
    SOLD_ELSEWHERE = 'SOLD_ELSEWHERE',
    CHANGED_MIND = 'CHANGED_MIND',
    OTHER = 'OTHER'
}

// Match Entity Interface
export interface Match {
    id: string;
    listingId: string;
    farmerId: number; // Added
    orderId?: string | null;
    quantityMatched: number | Decimal; // Can be prisma Decimal
    pricePerKg: number | Decimal;
    totalAmount: number | Decimal;
    status: MatchStatus;
    rejectionReason?: string | null;
    expiresAt: Date;
    acceptedAt?: Date | null;
    rejectedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;

    // Buyer Info
    buyerId: string;
    buyerBusinessType: string;
    buyerCity: string;
    buyerArea?: string | null;
    deliveryDate?: string | null;
}

// DTO for Creating a Match (Internal Use)
export interface CreateMatchDTO {
    listingId: string;
    farmerId: number; // Added
    buyerId: string;
    buyerBusinessType: string;
    buyerCity: string;
    buyerArea?: string;
    deliveryDate?: string;
    quantity: number;
    pricePerKg: number;
    expiresInHours: number;
}

// DTO for Accepting a Match
export interface AcceptMatchDTO {
    matchId: string;
    isPartial: boolean;
    acceptedQuantity?: number;
}

// DTO for Rejecting a Match
export interface RejectMatchDTO {
    matchId: string;
    reason: RejectionReason;
    otherReasonText?: string;
}
