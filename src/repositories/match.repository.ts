/**
 * Match Repository - Story 3.5
 * 
 * Data Access Layer for Match entities using Prisma.
 * Encapsulates database queries and handles connection pooling implicitly via PrismaClient.
 */

import { PrismaClient, Prisma } from '../generated/prisma/client';
import { Match, CreateMatchDTO, MatchStatus } from '../types/match.types';
import { logger } from '../utils/logger';

export class MatchRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * STAR: Find Pending Matches for a Farmer
     * Situation: Need to list matches that are actionable by the farmer.
     * Task: Query matches by farmerId with status PENDING_ACCEPTANCE.
     * Action: Use Prisma findMany with where clause and ordering.
     * Result: Returns list of pending matches ordered by expiry (urgent first).
     */
    async findPendingByFarmerId(farmerId: number, limit = 10, offset = 0): Promise<Match[]> {
        const matches = await this.prisma.match.findMany({
            where: {
                farmerId,
                status: 'PENDING_ACCEPTANCE',
                expiresAt: {
                    gt: new Date() // Only non-expired
                }
            },
            orderBy: {
                expiresAt: 'asc' // Actionable first
            },
            take: limit,
            skip: offset
        });

        return matches as unknown as Match[]; // Type assertion due to Decimal compatibility
    }

    /**
     * Find Match by ID
     */
    async findById(id: string): Promise<Match | null> {
        const match = await this.prisma.match.findUnique({
            where: { id }
        });
        return match as unknown as Match | null;
    }

    /**
     * Create a new Match
     * Used when order service algorithms find a buyer for a listing.
     */
    async create(data: CreateMatchDTO): Promise<Match> {
        const totalAmount = new Prisma.Decimal(data.quantity).mul(data.pricePerKg);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + data.expiresInHours);

        const match = await this.prisma.match.create({
            data: {
                listingId: data.listingId,
                farmerId: data.farmerId,
                buyerId: data.buyerId,
                buyerBusinessType: data.buyerBusinessType,
                buyerCity: data.buyerCity,
                buyerArea: data.buyerArea,
                deliveryDate: data.deliveryDate,
                quantityMatched: new Prisma.Decimal(data.quantity),
                pricePerKg: new Prisma.Decimal(data.pricePerKg),
                totalAmount,
                status: 'PENDING_ACCEPTANCE',
                expiresAt
            }
        });

        logger.info({ matchId: match.id }, 'Created new match');
        return match as unknown as Match;
    }

    /**
     * Update Match Status
     * Used for Accept, Reject, or Expiry flows.
     */
    async updateStatus(
        id: string,
        status: MatchStatus,
        details?: { rejectionReason?: string, orderId?: string }
    ): Promise<Match> {
        const updateData: any = {
            status,
            updatedAt: new Date()
        };

        if (status === MatchStatus.ACCEPTED) {
            updateData.acceptedAt = new Date();
            if (details?.orderId) updateData.orderId = details.orderId;
        } else if (status === MatchStatus.REJECTED) {
            updateData.rejectedAt = new Date();
            if (details?.rejectionReason) updateData.rejectionReason = details.rejectionReason;
        } else if (status === MatchStatus.EXPIRED) {
            // Nothing special, strictly status update
        }

        const match = await this.prisma.match.update({
            where: { id },
            data: updateData
        });

        return match as unknown as Match;
    }

    /**
     * Find Expired Matches causing state inconsistency
     * Task: Find matches that are past expiry but still PENDING_ACCEPTANCE.
     */
    async findExpiredPendingMatches(): Promise<Match[]> {
        const matches = await this.prisma.match.findMany({
            where: {
                status: 'PENDING_ACCEPTANCE',
                expiresAt: {
                    lte: new Date()
                }
            },
            take: 100 // Batch process
        });

        return matches as unknown as Match[];
    }
}
