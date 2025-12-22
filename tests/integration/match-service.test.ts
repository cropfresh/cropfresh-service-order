/**
 * Match Service Integration Tests - Story 3.5 (Task 9.1-9.4)
 * 
 * Tests for match accept, reject, partial match, and expiry flows.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MatchService } from '../../src/services/match.service';
import { MatchRepository } from '../../src/repositories/match.repository';
import { MatchStatus, RejectionReason, Match, CreateMatchDTO } from '../../src/types/match.types';

// Mock PrismaClient
const mockPrisma = {
    match: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
};

// Create test fixtures
const createMockMatch = (overrides: Partial<Match> = {}): Match => ({
    id: 'match-uuid-001',
    listingId: 'listing-uuid-001',
    farmerId: 1001,
    orderId: null,
    quantityMatched: 50,
    pricePerKg: 35,
    totalAmount: 1750,
    status: MatchStatus.PENDING_ACCEPTANCE,
    rejectionReason: null,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    acceptedAt: null,
    rejectedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    buyerId: 'buyer-001',
    buyerBusinessType: 'Restaurant',
    buyerCity: 'Bangalore',
    buyerArea: 'Koramangala',
    deliveryDate: 'Dec 25',
    ...overrides,
});

describe('MatchService', () => {
    let matchRepo: MatchRepository;
    let matchService: MatchService;

    beforeEach(() => {
        vi.clearAllMocks();
        matchRepo = new MatchRepository(mockPrisma as any);
        matchService = new MatchService(matchRepo);
    });

    // ===========================================================================
    // Task 9.1: Test accept match flow end-to-end
    // ===========================================================================
    describe('acceptMatch', () => {
        it('should accept a pending match and return updated match with orderId', async () => {
            const mockMatch = createMockMatch();
            mockPrisma.match.findUnique.mockResolvedValue(mockMatch);
            mockPrisma.match.update.mockResolvedValue({
                ...mockMatch,
                status: MatchStatus.ACCEPTED,
                orderId: 'ord-12345',
                acceptedAt: new Date(),
            });

            const result = await matchService.acceptMatch(mockMatch.id, false);

            expect(result.status).toBe(MatchStatus.ACCEPTED);
            expect(result.orderId).toBeDefined();
            expect(mockPrisma.match.update).toHaveBeenCalledWith({
                where: { id: mockMatch.id },
                data: expect.objectContaining({
                    status: MatchStatus.ACCEPTED,
                }),
            });
        });

        it('should throw error when match not found', async () => {
            mockPrisma.match.findUnique.mockResolvedValue(null);

            await expect(
                matchService.acceptMatch('non-existent-id', false)
            ).rejects.toThrow('Match not found');
        });

        it('should throw error when match already accepted', async () => {
            const acceptedMatch = createMockMatch({ status: MatchStatus.ACCEPTED });
            mockPrisma.match.findUnique.mockResolvedValue(acceptedMatch);

            await expect(
                matchService.acceptMatch(acceptedMatch.id, false)
            ).rejects.toThrow('Match is no longer pending acceptance');
        });

        it('should throw error when match has expired', async () => {
            const expiredMatch = createMockMatch({
                expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
            });
            mockPrisma.match.findUnique.mockResolvedValue(expiredMatch);
            mockPrisma.match.update.mockResolvedValue({
                ...expiredMatch,
                status: MatchStatus.EXPIRED,
            });

            await expect(
                matchService.acceptMatch(expiredMatch.id, false)
            ).rejects.toThrow('Match has expired');
        });
    });

    // ===========================================================================
    // Task 9.2: Test reject match with reason recording
    // ===========================================================================
    describe('rejectMatch', () => {
        it('should reject a match and record the reason', async () => {
            const mockMatch = createMockMatch();
            const rejectionReason = RejectionReason.SOLD_ELSEWHERE;

            mockPrisma.match.findUnique.mockResolvedValue(mockMatch);
            mockPrisma.match.update.mockResolvedValue({
                ...mockMatch,
                status: MatchStatus.REJECTED,
                rejectionReason,
                rejectedAt: new Date(),
            });

            const result = await matchService.rejectMatch(mockMatch.id, rejectionReason);

            expect(result.status).toBe(MatchStatus.REJECTED);
            expect(result.rejectionReason).toBe(rejectionReason);
            expect(mockPrisma.match.update).toHaveBeenCalledWith({
                where: { id: mockMatch.id },
                data: expect.objectContaining({
                    status: MatchStatus.REJECTED,
                    rejectionReason,
                }),
            });
        });

        it('should throw error when rejecting already accepted match', async () => {
            const acceptedMatch = createMockMatch({ status: MatchStatus.ACCEPTED });
            mockPrisma.match.findUnique.mockResolvedValue(acceptedMatch);

            await expect(
                matchService.rejectMatch(acceptedMatch.id, RejectionReason.CHANGED_MIND)
            ).rejects.toThrow(/cannot be rejected/);
        });
    });

    // ===========================================================================
    // Task 9.3: Test partial match logic (placeholder - requires more complex setup)
    // ===========================================================================
    describe('partial match', () => {
        it('should accept partial match with reduced quantity', async () => {
            const mockMatch = createMockMatch({ quantityMatched: 100 });
            mockPrisma.match.findUnique.mockResolvedValue(mockMatch);
            mockPrisma.match.update.mockResolvedValue({
                ...mockMatch,
                status: MatchStatus.ACCEPTED,
                orderId: 'ord-partial-001',
            });

            // isPartial = true, acceptedQuantity = 30
            const result = await matchService.acceptMatch(mockMatch.id, true, 30);

            expect(result.status).toBe(MatchStatus.ACCEPTED);
            // Note: Full partial logic would update quantityMatched to 30
            // and potentially create a remainder listing (not implemented in MVP)
        });
    });

    // ===========================================================================
    // Task 9.4: Test match expiry cron job
    // ===========================================================================
    describe('expireMatches', () => {
        it('should expire all pending matches past their expiry time', async () => {
            const expiredMatch1 = createMockMatch({
                id: 'expired-1',
                expiresAt: new Date(Date.now() - 1000),
            });
            const expiredMatch2 = createMockMatch({
                id: 'expired-2',
                expiresAt: new Date(Date.now() - 2000),
            });

            mockPrisma.match.findMany.mockResolvedValue([expiredMatch1, expiredMatch2]);
            mockPrisma.match.update.mockResolvedValue({ status: MatchStatus.EXPIRED });

            const count = await matchService.expireMatches();

            expect(count).toBe(2);
            expect(mockPrisma.match.update).toHaveBeenCalledTimes(2);
        });

        it('should return 0 when no matches are expired', async () => {
            mockPrisma.match.findMany.mockResolvedValue([]);

            const count = await matchService.expireMatches();

            expect(count).toBe(0);
            expect(mockPrisma.match.update).not.toHaveBeenCalled();
        });
    });

    // ===========================================================================
    // Task 9.1 continued: getPendingMatches
    // ===========================================================================
    describe('getPendingMatches', () => {
        it('should return pending matches for a farmer', async () => {
            const matches = [
                createMockMatch({ id: 'match-1' }),
                createMockMatch({ id: 'match-2' }),
            ];
            mockPrisma.match.findMany.mockResolvedValue(matches);

            const result = await matchService.getPendingMatches(1001);

            expect(result).toHaveLength(2);
            expect(mockPrisma.match.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        farmerId: 1001,
                        status: 'PENDING_ACCEPTANCE',
                    }),
                })
            );
        });
    });
});
