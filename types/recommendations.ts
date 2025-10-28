import { z } from 'zod';

/**
 * User browsing activity tracked for recommendation generation
 */
export interface UserActivity {
  vehicles: string[]; // Vehicle slugs viewed
  products: string[]; // Product handles viewed
  searches: string[]; // Search queries
  timestamp: Date; // Last activity timestamp
}

/**
 * Scored recommendation item with reasoning
 */
export interface RecommendationScore {
  item: any; // VehicleListItem | Product (imported from other types)
  score: number; // Weighted score based on algorithm
  reason: string; // Human-readable scoring reason
  type: 'vehicle' | 'product';
}

/**
 * Options for generating recommendations
 */
export interface RecommendationOptions {
  userId?: string; // User ID for personalized recommendations
  limit?: number; // Max items to return (default: 6)
  type?: 'vehicles' | 'parts' | 'all'; // Filter by content type
  excludeGarage?: boolean; // Whether to exclude garage items (default: true)
}

/**
 * Recommendation result with metadata
 */
export interface RecommendationResult {
  items: any[]; // Array<VehicleListItem | Product>
  type: 'personalized' | 'fallback'; // Recommendation strategy used
  generatedAt: string; // ISO timestamp
  userId?: string; // User ID if personalized
}

/**
 * Zod schema for validating recommendation options
 */
export const RecommendationOptionsSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().min(1).max(20).optional().default(6),
  type: z.enum(['vehicles', 'parts', 'all']).optional().default('all'),
  excludeGarage: z.boolean().optional().default(true),
});

/**
 * Zod schema for validating user activity cookie data
 */
export const UserActivitySchema = z.object({
  vehicles: z.array(z.string()).default([]),
  products: z.array(z.string()).default([]),
  searches: z.array(z.string()).default([]),
  timestamp: z.coerce.date(),
});

/**
 * Type for validated recommendation options
 */
export type ValidatedRecommendationOptions = z.infer<typeof RecommendationOptionsSchema>;

/**
 * Type for validated user activity
 */
export type ValidatedUserActivity = z.infer<typeof UserActivitySchema>;
