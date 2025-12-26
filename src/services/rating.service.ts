/**
 * Rating Service - Story 3.10
 *
 * Business logic for farmer quality ratings and feedback.
 * Follows TransactionService pattern.
 *
 * STAR:
 * Situation: Farmers need quality feedback with recommendations
 * Task: Process ratings with aggregation and improvement suggestions
 * Action: Service layer with recommendation engine
 * Result: Complete rating info with actionable recommendations
 */

import { RatingRepository } from '../repositories/rating.repository';
import { logger } from '../utils/logger';
import {
    RatingFilter,
    RatingsResponse,
    RatingSummary,
    RatingDetails,
    Recommendation,
    QualityIssueCat,
    getCropEmoji
} from '../types/rating.types';

// Recommendation mappings for quality issues (AC5)
const RECOMMENDATION_MAP: Record<QualityIssueCat, Omit<Recommendation, 'issue'>> = {
    BRUISING: {
        title: 'Bruising detected',
        recommendation: 'Handle produce gently during transport. Use padded crates and avoid stacking too high.',
        tutorialId: 'handling-101'
    },
    SIZE_INCONSISTENCY: {
        title: 'Size inconsistency',
        recommendation: 'Sort produce by size before packing. Buyers prefer uniform sizes in each batch.',
        tutorialId: 'grading-basics'
    },
    RIPENESS_ISSUES: {
        title: 'Ripeness issues',
        recommendation: 'Harvest at optimal ripeness. Check color and firmness before picking.',
        tutorialId: 'harvest-timing'
    },
    FRESHNESS_CONCERNS: {
        title: 'Freshness concerns',
        recommendation: 'Reduce time between harvest and delivery. Store in cool, shaded areas.',
        tutorialId: 'post-harvest'
    },
    PACKAGING_PROBLEMS: {
        title: 'Packaging problems',
        recommendation: 'Use proper crates with ventilation. Avoid overpacking containers.',
        tutorialId: 'packaging-guide'
    }
};

// Error codes
export enum RatingErrorCode {
    RATING_NOT_FOUND = 'RATING_NOT_FOUND',
    INVALID_FARMER_ID = 'INVALID_FARMER_ID',
    UNAUTHORIZED = 'UNAUTHORIZED'
}

export class RatingError extends Error {
    constructor(
        public code: RatingErrorCode,
        message: string
    ) {
        super(message);
        this.name = 'RatingError';
    }
}

export class RatingService {
    private repository: RatingRepository;

    constructor(repository: RatingRepository) {
        this.repository = repository;
    }

    /**
     * Get paginated ratings for a farmer.
     * AC2-3: Ratings list with pagination and filtering
     */
    async getRatings(filter: RatingFilter): Promise<RatingsResponse> {
        if (!filter.farmerId || filter.farmerId <= 0) {
            throw new RatingError(
                RatingErrorCode.INVALID_FARMER_ID,
                'Valid farmer ID is required'
            );
        }

        const { ratings, total } = await this.repository.getRatings(filter);

        logger.info({
            farmerId: filter.farmerId,
            count: ratings.length,
            total
        }, 'Ratings fetched');

        return {
            ratings,
            pagination: {
                page: filter.page,
                limit: filter.limit,
                total,
                hasMore: filter.page * filter.limit < total
            }
        };
    }

    /**
     * Get ratings summary for a farmer.
     * AC2: Overall quality summary
     */
    async getSummary(farmerId: number): Promise<RatingSummary> {
        if (!farmerId || farmerId <= 0) {
            throw new RatingError(
                RatingErrorCode.INVALID_FARMER_ID,
                'Valid farmer ID is required'
            );
        }

        const summary = await this.repository.getSummary(farmerId);

        logger.info({
            farmerId,
            overallScore: summary.overallScore,
            totalOrders: summary.totalOrders
        }, 'Rating summary fetched');

        return summary;
    }

    /**
     * Get rating details with recommendations.
     * AC4-5: Rating detail view with improvement suggestions
     */
    async getDetails(ratingId: string, farmerId: number): Promise<RatingDetails> {
        if (!farmerId || farmerId <= 0) {
            throw new RatingError(
                RatingErrorCode.INVALID_FARMER_ID,
                'Valid farmer ID is required'
            );
        }

        const rating = await this.repository.getDetails(ratingId, farmerId);

        if (!rating) {
            throw new RatingError(
                RatingErrorCode.RATING_NOT_FOUND,
                `Rating ${ratingId} not found`
            );
        }

        // Generate recommendations for quality issues (AC5)
        const recommendations = this.generateRecommendations(rating.qualityIssues);

        logger.info({
            ratingId,
            farmerId,
            rating: rating.rating,
            issueCount: rating.qualityIssues.length
        }, 'Rating details fetched');

        return {
            id: rating.id,
            orderId: rating.orderId,
            cropType: rating.cropType,
            cropIcon: getCropEmoji(rating.cropType),
            quantityKg: Number(rating.quantityKg),
            rating: rating.rating,
            comment: rating.comment,
            qualityIssues: rating.qualityIssues,
            recommendations,
            ratedAt: rating.ratedAt,
            deliveredAt: null, // Would come from Order lookup
            aiGradedPhotoUrl: rating.aiGradedPhotoUrl,
            buyerPhotoUrl: rating.buyerPhotoUrl
        };
    }

    /**
     * Mark rating as seen by farmer.
     * AC8: Mark as seen when detail viewed
     */
    async markSeen(ratingId: string, farmerId: number): Promise<boolean> {
        if (!farmerId || farmerId <= 0) {
            throw new RatingError(
                RatingErrorCode.INVALID_FARMER_ID,
                'Valid farmer ID is required'
            );
        }

        const success = await this.repository.markSeen(ratingId, farmerId);

        logger.info({ ratingId, farmerId, success }, 'Rating marked as seen');

        return success;
    }

    /**
     * Get unseen rating count for badge.
     * AC8: Badge count on My Ratings tab
     */
    async getUnseenCount(farmerId: number): Promise<number> {
        return this.repository.getUnseenCount(farmerId);
    }

    // ============================================
    // PRIVATE HELPERS
    // ============================================

    /**
     * Generate improvement recommendations for quality issues.
     * AC5: Low rating recommendations
     */
    private generateRecommendations(issues: QualityIssueCat[]): Recommendation[] {
        return issues.map(issue => ({
            issue,
            ...RECOMMENDATION_MAP[issue]
        }));
    }
}
