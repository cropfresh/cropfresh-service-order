/**
 * Rating gRPC Handlers - Story 3.10
 *
 * gRPC handlers for Quality Ratings & Feedback endpoints.
 * Maps gRPC requests to RatingService methods.
 *
 * AC1-4: GetFarmerRatings, GetRatingSummary, GetRatingDetails
 * AC8: MarkRatingSeen
 */

import { RatingService, RatingError, RatingErrorCode } from '../services/rating.service';
import { logger } from '../utils/logger';

// Type definitions for gRPC request/response objects
interface GetFarmerRatingsRequest {
    farmerId: number;
    page?: number;
    limit?: number;
    cropType?: string;
}

interface GetFarmerRatingSummaryRequest {
    farmerId: number;
}

interface GetRatingDetailsRequest {
    ratingId: string;
    farmerId: number;
}

interface MarkRatingSeenRequest {
    ratingId: string;
    farmerId: number;
}

// gRPC callback type
type GrpcCallback<T> = (error: Error | null, response?: T) => void;

export class RatingHandlers {
    private service: RatingService;

    constructor(service: RatingService) {
        this.service = service;
    }

    /**
     * AC1-3: Get farmer ratings list with pagination and summary.
     */
    async getFarmerRatings(
        call: { request: GetFarmerRatingsRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const { farmerId, page = 1, limit = 10, cropType } = call.request;

            const result = await this.service.getRatings({
                farmerId,
                page,
                limit,
                cropType
            });

            // Get summary alongside list
            const summary = await this.service.getSummary(farmerId);

            callback(null, {
                ratings: result.ratings.map(r => ({
                    id: r.id,
                    orderId: r.orderId,
                    cropType: r.cropType,
                    cropIcon: r.cropIcon,
                    quantityKg: r.quantityKg,
                    rating: r.rating,
                    comment: r.comment || '',
                    qualityIssues: r.qualityIssues.map(this.mapQualityIssue),
                    ratedAt: r.ratedAt.toISOString(),
                    seenByFarmer: r.seenByFarmer
                })),
                pagination: {
                    page: result.pagination.page,
                    limit: result.pagination.limit,
                    total: result.pagination.total
                },
                summary: {
                    overallScore: summary.overallScore,
                    totalOrders: summary.totalOrders,
                    starBreakdown: summary.starBreakdown,
                    monthlyTrend: summary.monthlyTrend.map(t => ({
                        month: t.month,
                        avgRating: t.avgRating,
                        count: t.count
                    })),
                    bestCropType: summary.bestCropType || '',
                    unseenCount: summary.unseenCount
                }
            });

            logger.info({ farmerId, count: result.ratings.length }, 'GetFarmerRatings completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    /**
     * AC2: Get farmer rating summary stats.
     */
    async getFarmerRatingSummary(
        call: { request: GetFarmerRatingSummaryRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const { farmerId } = call.request;

            const summary = await this.service.getSummary(farmerId);

            callback(null, {
                overallScore: summary.overallScore,
                totalOrders: summary.totalOrders,
                starBreakdown: summary.starBreakdown,
                monthlyTrend: summary.monthlyTrend.map(t => ({
                    month: t.month,
                    avgRating: t.avgRating,
                    count: t.count
                })),
                bestCropType: summary.bestCropType || '',
                unseenCount: summary.unseenCount
            });

            logger.info({ farmerId, score: summary.overallScore }, 'GetFarmerRatingSummary completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    /**
     * AC4-5: Get single rating details with recommendations.
     */
    async getRatingDetails(
        call: { request: GetRatingDetailsRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const { ratingId, farmerId } = call.request;

            const details = await this.service.getDetails(ratingId, farmerId);

            callback(null, {
                id: details.id,
                orderId: details.orderId,
                cropType: details.cropType,
                cropIcon: details.cropIcon,
                quantityKg: details.quantityKg,
                rating: details.rating,
                comment: details.comment || '',
                qualityIssues: details.qualityIssues.map(this.mapQualityIssue),
                recommendations: details.recommendations.map(r => ({
                    issue: r.issue,
                    title: r.title,
                    recommendation: r.recommendation,
                    tutorialId: r.tutorialId || ''
                })),
                ratedAt: details.ratedAt.toISOString(),
                deliveredAt: details.deliveredAt?.toISOString() || '',
                aiGradedPhotoUrl: details.aiGradedPhotoUrl || '',
                buyerPhotoUrl: details.buyerPhotoUrl || ''
            });

            logger.info({ ratingId, farmerId }, 'GetRatingDetails completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    /**
     * AC8: Mark rating as seen by farmer.
     */
    async markRatingSeen(
        call: { request: MarkRatingSeenRequest },
        callback: GrpcCallback<unknown>
    ): Promise<void> {
        try {
            const { ratingId, farmerId } = call.request;

            const success = await this.service.markSeen(ratingId, farmerId);

            callback(null, { success });

            logger.info({ ratingId, farmerId, success }, 'MarkRatingSeen completed');
        } catch (error) {
            this.handleError(error, callback);
        }
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private mapQualityIssue(issue: string): number {
        const issueMap: Record<string, number> = {
            'BRUISING': 1,
            'SIZE_INCONSISTENCY': 2,
            'RIPENESS_ISSUES': 3,
            'FRESHNESS_CONCERNS': 4,
            'PACKAGING_PROBLEMS': 5
        };
        return issueMap[issue] || 0;
    }

    private handleError(error: unknown, callback: GrpcCallback<unknown>): void {
        if (error instanceof RatingError) {
            const grpcError = new Error(error.message) as Error & { code: number };
            grpcError.code = this.mapErrorCode(error.code);
            callback(grpcError);
        } else if (error instanceof Error) {
            callback(error);
        } else {
            callback(new Error('Unknown error'));
        }
    }

    private mapErrorCode(code: RatingErrorCode): number {
        const grpcCodes: Record<RatingErrorCode, number> = {
            [RatingErrorCode.RATING_NOT_FOUND]: 5,    // NOT_FOUND
            [RatingErrorCode.INVALID_FARMER_ID]: 3,   // INVALID_ARGUMENT
            [RatingErrorCode.UNAUTHORIZED]: 7         // PERMISSION_DENIED
        };
        return grpcCodes[code] ?? 13; // INTERNAL
    }
}
