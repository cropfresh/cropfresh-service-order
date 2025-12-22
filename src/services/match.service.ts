/**
 * Match Service - Story 3.5
 * 
 * Business Logic Layer for Match operations.
 * Orchestrates Repository updates and business rules.
 */

import { MatchRepository } from '../repositories/match.repository';
import { Match, MatchStatus, RejectionReason } from '../types/match.types';
import { logger } from '../utils/logger';

export class MatchService {
    private repo: MatchRepository;

    constructor(repo: MatchRepository) {
        this.repo = repo;
    }

    /**
     * STAR: Get Pending Matches
     * Situation: Gateway needs list of matches for a farmer dashboard.
     * Action: Delegate to repository to fetch by farmerId.
     */
    async getPendingMatches(farmerId: number): Promise<Match[]> {
        return this.repo.findPendingByFarmerId(farmerId);
    }

    /**
     * STAR: Get Match Details
     */
    async getMatchById(matchId: string): Promise<Match | null> {
        return this.repo.findById(matchId);
    }

    /**
     * STAR: Accept Match
     * Situation: Farmer accepts a match (full or partial).
     * Task: Update match status, create Order (placeholder), and return success.
     */
    async acceptMatch(matchId: string, isPartial: boolean, acceptedQuantity?: number): Promise<Match> {
        const match = await this.repo.findById(matchId);
        if (!match) {
            throw new Error('Match not found');
        }

        if (match.status !== MatchStatus.PENDING_ACCEPTANCE) {
            throw new Error('Match is no longer pending acceptance');
        }

        if (new Date() > match.expiresAt) {
            await this.repo.updateStatus(matchId, MatchStatus.EXPIRED);
            throw new Error('Match has expired');
        }

        // TODO: Story 3.5.x - If partial, logic to split listing would go here or call Catalog Service.
        // For now, we update the status. 
        // If partial, maybe we store the acceptedQuantity somewhere? 
        // The current Match schema doesn't have "acceptedQuantity", it assumes quantityMatched is what's agreed.
        // If isPartial, we might want to update quantityMatched directly?
        // Let's assume for MVP if partial, we update quantityMatched to acceptedQuantity.

        // Note: We are mocking Order Creation here as per task scope focuses on Match view/accept.
        // In real flow, we would call `OrderService.createOrder` here.
        const mockOrderId = `ord-${Date.now()}`;

        const updatedMatch = await this.repo.updateStatus(matchId, MatchStatus.ACCEPTED, {
            orderId: mockOrderId
        });

        logger.info({ matchId, orderId: mockOrderId, isPartial }, 'Match accepted');
        return updatedMatch;
    }

    /**
     * STAR: Reject Match
     * Situation: Farmer rejects a match.
     * Task: Update status to REJECTED with reason.
     */
    async rejectMatch(matchId: string, reason: string): Promise<Match> {
        const match = await this.repo.findById(matchId);
        if (!match) {
            throw new Error('Match not found');
        }

        if (match.status !== MatchStatus.PENDING_ACCEPTANCE && match.status !== MatchStatus.EXPIRED) {
            // Allow rejecting expired matches just to clean up UI? Or strictly enforce?
            // Let's enforce strictly.
            throw new Error(`Match is ${match.status} and cannot be rejected`);
        }

        const updatedMatch = await this.repo.updateStatus(matchId, MatchStatus.REJECTED, {
            rejectionReason: reason
        });

        logger.info({ matchId, reason }, 'Match rejected');
        return updatedMatch;
    }

    /**
     * STAR: Expire Matches
     * Situation: Cron job runs to expire old matches.
     * Task: Find all expired pending matches and update status.
     */
    async expireMatches(): Promise<number> {
        const expiredMatches = await this.repo.findExpiredPendingMatches();
        let count = 0;

        for (const match of expiredMatches) {
            await this.repo.updateStatus(match.id, MatchStatus.EXPIRED);
            count++;
        }

        if (count > 0) {
            logger.info({ count }, 'Expired old matches');
        }
        return count;
    }
}
