/**
 * Rating Service Unit Tests - Story 3.10
 * 
 * Tests for RatingService business logic:
 * - getRatings with pagination
 * - getSummary with aggregation
 * - getDetails with recommendations
 * - markSeen functionality
 */

import { RatingService, RatingError, RatingErrorCode } from '../src/services/rating.service';
import { RatingRepository } from '../src/repositories/rating.repository';
import { RatingListItem, RatingSummary } from '../src/types/rating.types';

// Mock the repository
jest.mock('../src/repositories/rating.repository');

// Mock the logger to prevent console output
jest.mock('../src/utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn()
    }
}));

describe('RatingService', () => {
    let service: RatingService;
    let mockRepository: jest.Mocked<RatingRepository>;

    // Mock data matching the actual types
    const mockRatingListItem: RatingListItem = {
        id: 'rating-1',
        orderId: 1, // orderId is number, not string
        cropType: 'Tomatoes',
        cropIcon: '🍅',
        quantityKg: 50,
        rating: 4,
        comment: 'Good quality tomatoes',
        qualityIssues: [],
        ratedAt: new Date('2024-01-15'),
        seenByFarmer: false
    };

    const mockSummary: RatingSummary = {
        overallScore: 4.2,
        totalOrders: 25,
        starBreakdown: { star1: 0, star2: 1, star3: 3, star4: 12, star5: 9 },
        monthlyTrend: [
            { month: '2024-01', avgRating: 4.0, count: 8 },
            { month: '2024-02', avgRating: 4.3, count: 10 }
        ],
        bestCropType: 'Tomatoes',
        unseenCount: 3
    };

    // Mock raw Prisma QualityRating (what repository.getDetails returns)
    const mockPrismaRating = {
        id: 'rating-1',
        orderId: 1,
        farmerId: 1,
        buyerId: 2,
        cropType: 'Tomatoes',
        quantityKg: { toNumber: () => 50 } as any, // Mock Prisma Decimal
        rating: 4,
        comment: 'Good quality tomatoes',
        qualityIssues: ['BRUISING'] as any[],
        ratedAt: new Date('2024-01-15'),
        seenByFarmer: false,
        seenAt: null,
        aiGradedPhotoUrl: null,
        buyerPhotoUrl: null
    };

    beforeEach(() => {
        mockRepository = {
            getRatings: jest.fn(),
            getSummary: jest.fn(),
            getDetails: jest.fn(),
            markSeen: jest.fn(),
            getUnseenCount: jest.fn()
        } as unknown as jest.Mocked<RatingRepository>;

        service = new RatingService(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRatings', () => {
        it('should return paginated ratings list', async () => {
            const mockResult = {
                ratings: [mockRatingListItem],
                total: 1
            };
            mockRepository.getRatings.mockResolvedValue(mockResult);

            const result = await service.getRatings({
                farmerId: 1,
                page: 1,
                limit: 10
            });

            expect(result.ratings).toHaveLength(1);
            expect(result.ratings[0].cropType).toBe('Tomatoes');
            expect(result.pagination.total).toBe(1);
            expect(mockRepository.getRatings).toHaveBeenCalledWith({
                farmerId: 1,
                page: 1,
                limit: 10
            });
        });

        it('should filter by crop type when provided', async () => {
            mockRepository.getRatings.mockResolvedValue({
                ratings: [mockRatingListItem],
                total: 1
            });

            await service.getRatings({
                farmerId: 1,
                page: 1,
                limit: 10,
                cropType: 'Tomatoes'
            });

            expect(mockRepository.getRatings).toHaveBeenCalledWith({
                farmerId: 1,
                page: 1,
                limit: 10,
                cropType: 'Tomatoes'
            });
        });

        it('should throw error for invalid farmer ID', async () => {
            await expect(service.getRatings({
                farmerId: 0,
                page: 1,
                limit: 10
            })).rejects.toThrow(RatingError);

            await expect(service.getRatings({
                farmerId: -1,
                page: 1,
                limit: 10
            })).rejects.toThrow('Valid farmer ID is required');
        });
    });

    describe('getSummary', () => {
        it('should return aggregated rating summary', async () => {
            mockRepository.getSummary.mockResolvedValue(mockSummary);

            const result = await service.getSummary(1);

            expect(result.overallScore).toBe(4.2);
            expect(result.totalOrders).toBe(25);
            expect(result.starBreakdown.star5).toBe(9);
            expect(result.monthlyTrend).toHaveLength(2);
            expect(result.bestCropType).toBe('Tomatoes');
        });

        it('should include unseen count', async () => {
            mockRepository.getSummary.mockResolvedValue(mockSummary);

            const result = await service.getSummary(1);

            expect(result.unseenCount).toBe(3);
        });

        it('should throw error for invalid farmer ID', async () => {
            await expect(service.getSummary(0)).rejects.toThrow(RatingError);
        });
    });

    describe('getDetails', () => {
        it('should return full rating details with recommendations', async () => {
            mockRepository.getDetails.mockResolvedValue(mockPrismaRating as any);

            const result = await service.getDetails('rating-1', 1);

            expect(result.id).toBe('rating-1');
            expect(result.rating).toBe(4);
            // Recommendations should be generated for BRUISING issue
            expect(result.recommendations).toBeDefined();
            expect(result.recommendations.length).toBeGreaterThan(0);
            expect(result.recommendations[0].issue).toBe('BRUISING');
        });

        it('should throw error when rating not found', async () => {
            mockRepository.getDetails.mockResolvedValue(null);

            await expect(service.getDetails('invalid-id', 1))
                .rejects.toThrow(RatingError);

            await expect(service.getDetails('invalid-id', 1))
                .rejects.toThrow('Rating invalid-id not found');
        });

        it('should throw error for invalid farmer ID', async () => {
            await expect(service.getDetails('rating-1', 0))
                .rejects.toThrow(RatingError);
        });
    });

    describe('markSeen', () => {
        it('should mark rating as seen', async () => {
            mockRepository.markSeen.mockResolvedValue(true);

            const result = await service.markSeen('rating-1', 1);

            expect(result).toBe(true);
            expect(mockRepository.markSeen).toHaveBeenCalledWith('rating-1', 1);
        });

        it('should return false when rating not found', async () => {
            mockRepository.markSeen.mockResolvedValue(false);

            const result = await service.markSeen('invalid-id', 1);

            expect(result).toBe(false);
        });

        it('should throw error for invalid farmer ID', async () => {
            await expect(service.markSeen('rating-1', 0)).rejects.toThrow(RatingError);
        });
    });

    describe('getUnseenCount', () => {
        it('should return count of unseen ratings', async () => {
            mockRepository.getUnseenCount.mockResolvedValue(5);

            const result = await service.getUnseenCount(1);

            expect(result).toBe(5);
            expect(mockRepository.getUnseenCount).toHaveBeenCalledWith(1);
        });
    });
});
