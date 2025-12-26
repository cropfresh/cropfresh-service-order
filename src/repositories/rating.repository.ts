/**
 * Rating Repository - Story 3.10
 *
 * Data access layer for quality ratings using Prisma.
 * Follows repository pattern from order-status.repository.ts.
 *
 * STAR:
 * Situation: Farmers need to view their quality ratings from buyers
 * Task: Provide data access for ratings with aggregation and pagination
 * Action: Repository methods for CRUD operations on QualityRating model
 * Result: Clean data access layer consumed by RatingService
 */

import { PrismaClient, QualityRating, QualityIssue, Prisma } from '../generated/prisma';
import { logger } from '../utils/logger';
import {
    RatingFilter,
    RatingListItem,
    RatingSummary,
    RatingDetails,
    StarBreakdown,
    TrendItem,
    getCropEmoji
} from '../types/rating.types';

export class RatingRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Get paginated ratings for a farmer.
     * AC3: Recent ratings list (newest first, paginated 10 per page)
     */
    async getRatings(filter: RatingFilter): Promise<{
        ratings: RatingListItem[];
        total: number;
    }> {
        const where: Prisma.QualityRatingWhereInput = {
            farmerId: filter.farmerId,
            ...(filter.cropType && { cropType: filter.cropType })
        };

        const [ratings, total] = await Promise.all([
            this.prisma.qualityRating.findMany({
                where,
                orderBy: { ratedAt: 'desc' },
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit
            }),
            this.prisma.qualityRating.count({ where })
        ]);

        return {
            ratings: ratings.map(this.toListItem),
            total
        };
    }

    /**
     * Get rating summary for a farmer.
     * AC2: Overall quality summary - aggregate stats
     */
    async getSummary(farmerId: number): Promise<RatingSummary> {
        // Get all ratings for aggregation
        const ratings = await this.prisma.qualityRating.findMany({
            where: { farmerId },
            select: {
                rating: true,
                cropType: true,
                ratedAt: true,
                seenByFarmer: true
            }
        });

        if (ratings.length === 0) {
            return {
                overallScore: 0,
                totalOrders: 0,
                starBreakdown: { star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 },
                monthlyTrend: [],
                bestCropType: null,
                unseenCount: 0
            };
        }

        // Calculate overall score
        const totalScore = ratings.reduce((sum, r) => sum + r.rating, 0);
        const overallScore = Math.round((totalScore / ratings.length) * 10) / 10;

        // Star breakdown
        const starBreakdown = this.calculateStarBreakdown(ratings);

        // Monthly trend (last 6 months)
        const monthlyTrend = this.calculateMonthlyTrend(ratings);

        // Best crop type (most frequent 5-star)
        const bestCropType = this.findBestCropType(ratings);

        // Unseen count
        const unseenCount = ratings.filter(r => !r.seenByFarmer).length;

        return {
            overallScore,
            totalOrders: ratings.length,
            starBreakdown,
            monthlyTrend,
            bestCropType,
            unseenCount
        };
    }

    /**
     * Get single rating details with full info.
     * AC4: Rating detail view
     */
    async getDetails(ratingId: string, farmerId: number): Promise<QualityRating | null> {
        return this.prisma.qualityRating.findFirst({
            where: {
                id: ratingId,
                farmerId
            }
        });
    }

    /**
     * Mark rating as seen by farmer.
     * AC8: Mark as seen when rating detail viewed
     */
    async markSeen(ratingId: string, farmerId: number): Promise<boolean> {
        try {
            await this.prisma.qualityRating.updateMany({
                where: {
                    id: ratingId,
                    farmerId,
                    seenByFarmer: false
                },
                data: {
                    seenByFarmer: true,
                    seenAt: new Date()
                }
            });
            return true;
        } catch (error) {
            logger.error({ error, ratingId, farmerId }, 'Failed to mark rating as seen');
            return false;
        }
    }

    /**
     * Get unseen rating count for badge.
     * AC8: Badge count on "My Ratings" tab
     */
    async getUnseenCount(farmerId: number): Promise<number> {
        return this.prisma.qualityRating.count({
            where: {
                farmerId,
                seenByFarmer: false
            }
        });
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private toListItem(rating: QualityRating): RatingListItem {
        return {
            id: rating.id,
            orderId: rating.orderId,
            cropType: rating.cropType,
            cropIcon: getCropEmoji(rating.cropType),
            quantityKg: Number(rating.quantityKg),
            rating: rating.rating,
            comment: rating.comment,
            qualityIssues: rating.qualityIssues,
            ratedAt: rating.ratedAt,
            seenByFarmer: rating.seenByFarmer
        };
    }

    private calculateStarBreakdown(ratings: { rating: number }[]): StarBreakdown {
        const counts = { star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 };

        for (const r of ratings) {
            switch (r.rating) {
                case 5: counts.star5++; break;
                case 4: counts.star4++; break;
                case 3: counts.star3++; break;
                case 2: counts.star2++; break;
                case 1: counts.star1++; break;
            }
        }

        return counts;
    }

    private calculateMonthlyTrend(ratings: { rating: number; ratedAt: Date }[]): TrendItem[] {
        const now = new Date();
        const monthsAgo = 6;
        const monthlyData: Map<string, { sum: number; count: number }> = new Map();

        // Initialize last 6 months
        for (let i = 0; i < monthsAgo; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData.set(key, { sum: 0, count: 0 });
        }

        // Aggregate ratings by month
        for (const r of ratings) {
            const key = `${r.ratedAt.getFullYear()}-${String(r.ratedAt.getMonth() + 1).padStart(2, '0')}`;
            const existing = monthlyData.get(key);
            if (existing) {
                existing.sum += r.rating;
                existing.count++;
            }
        }

        // Convert to trend items
        return Array.from(monthlyData.entries())
            .map(([month, data]) => ({
                month,
                avgRating: data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : 0,
                count: data.count
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
    }

    private findBestCropType(ratings: { rating: number; cropType: string }[]): string | null {
        const fiveStarCounts: Map<string, number> = new Map();

        for (const r of ratings) {
            if (r.rating === 5) {
                fiveStarCounts.set(r.cropType, (fiveStarCounts.get(r.cropType) || 0) + 1);
            }
        }

        if (fiveStarCounts.size === 0) return null;

        let bestCrop = '';
        let maxCount = 0;
        for (const [crop, count] of fiveStarCounts) {
            if (count > maxCount) {
                maxCount = count;
                bestCrop = crop;
            }
        }

        return bestCrop;
    }
}
