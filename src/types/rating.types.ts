/**
 * Rating Types - Story 3.10
 *
 * Type definitions for farmer quality ratings and feedback.
 * Maps to Prisma QualityRating model.
 */

// Quality issue categories
export type QualityIssueCat =
    | 'BRUISING'
    | 'SIZE_INCONSISTENCY'
    | 'RIPENESS_ISSUES'
    | 'FRESHNESS_CONCERNS'
    | 'PACKAGING_PROBLEMS';

// Individual rating item for list view
export interface RatingListItem {
    id: string;
    orderId: number;
    cropType: string;
    cropIcon: string;
    quantityKg: number;
    rating: number;
    comment: string | null;
    qualityIssues: QualityIssueCat[];
    ratedAt: Date;
    seenByFarmer: boolean;
}

// rating summary stats
export interface RatingSummary {
    overallScore: number; // 0.0 - 5.0
    totalOrders: number;
    starBreakdown: StarBreakdown;
    monthlyTrend: TrendItem[];
    bestCropType: string | null;
    unseenCount: number;
}

export interface StarBreakdown {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
}

export interface TrendItem {
    month: string; // 'YYYY-MM'
    avgRating: number;
    count: number;
}

// Full rating details for detail view
export interface RatingDetails {
    id: string;
    orderId: number;
    cropType: string;
    cropIcon: string;
    quantityKg: number;
    rating: number;
    comment: string | null;
    qualityIssues: QualityIssueCat[];
    recommendations: Recommendation[];
    ratedAt: Date;
    deliveredAt: Date | null;
    aiGradedPhotoUrl: string | null;
    buyerPhotoUrl: string | null;
}

export interface Recommendation {
    issue: QualityIssueCat;
    title: string;
    recommendation: string;
    tutorialId: string | null;
}

// Query filter for ratings
export interface RatingFilter {
    farmerId: number;
    cropType?: string;
    page: number;
    limit: number;
}

// Paginated response 
export interface RatingsResponse {
    ratings: RatingListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

// Crop type to emoji mapping
export const CROP_EMOJI_MAP: Record<string, string> = {
    'Tomato': '🍅',
    'Potato': '🥔',
    'Onion': '🧅',
    'Carrot': '🥕',
    'Cabbage': '🥬',
    'Chilli': '🌶️',
    'Beans': '🫛',
    'Rice': '🌾',
    'Wheat': '🌾',
    'Mango': '🥭',
    'Banana': '🍌',
    'Apple': '🍎',
    'Orange': '🍊',
    'Grapes': '🍇',
    'default': '🥬'
};

export function getCropEmoji(cropType: string): string {
    return CROP_EMOJI_MAP[cropType] || CROP_EMOJI_MAP['default'];
}
