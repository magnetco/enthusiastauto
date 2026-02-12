import { getServerSession } from '@/lib/auth/session';
import prisma from '@/lib/db/prisma';
import { getUserActivity } from './tracking';
import { getFallbackRecommendations } from './fallback';
import { getVehicles, VehicleListItem } from '@/lib/sanity/queries/vehicles';
import { getProducts } from '@/lib/shopify';
import { Product } from '@/lib/shopify/types';
import { parseFitmentTag } from '@/lib/shared/recommendations';
import { memoryCache } from '@/lib/cache/memory';
import {
  RecommendationOptions,
  RecommendationResult,
  RecommendationScore,
} from '@/types/recommendations';

/**
 * Scoring weights for recommendation algorithm
 */
const WEIGHTS = {
  GARAGE: 3.0, // Items matching garage vehicles/parts
  BROWSING: 2.0, // Recently viewed items
  PURCHASE: 1.5, // Purchase history items
};

/**
 * Cache TTL for user recommendations (5 minutes)
 */
const USER_CACHE_TTL = 5 * 60 * 1000;

/**
 * Performance monitoring threshold (200ms target)
 */
const PERFORMANCE_THRESHOLD_MS = 200;

/**
 * Get recommendations for a user
 * @param userId - Optional user ID for personalized recommendations
 * @param options - Recommendation options
 * @returns RecommendationResult with items and metadata
 */
export async function getRecommendationsForUser(
  userId?: string,
  options?: RecommendationOptions
): Promise<RecommendationResult> {
  const startTime = performance.now();

  try {
    // Set default options
    const {
      limit = 6,
      type = 'all',
      excludeGarage = true,
    } = options || {};

    // Check cache first (user-specific)
    const cacheKey = `recommendations:user:${userId || 'anonymous'}:${type}:${limit}`;
    const cached = memoryCache.get<RecommendationResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get user data
    const session = userId ? await getServerSession() : null;
    const authenticatedUserId = session?.user?.id;

    // Get user activity and garage items
    const [activity, garageItems] = await Promise.all([
      getUserActivity(authenticatedUserId),
      authenticatedUserId ? getUserGarageItems(authenticatedUserId) : Promise.resolve([]),
    ]);

    // Check if user has any activity or garage items
    const hasActivity =
      activity.vehicles.length > 0 ||
      activity.products.length > 0 ||
      garageItems.length > 0;

    // If no activity, return fallback recommendations
    if (!hasActivity) {
      const fallbackItems = await getFallbackRecommendations(limit);
      const result: RecommendationResult = {
        items: fallbackItems,
        type: 'fallback',
        generatedAt: new Date().toISOString(),
        userId: authenticatedUserId,
      };

      // Cache fallback recommendations
      memoryCache.set(cacheKey, result, USER_CACHE_TTL);

      logPerformance(startTime, 'fallback');
      return result;
    }

    // Generate personalized recommendations
    const scoredItems = await scoreRecommendations(
      activity,
      garageItems,
      type,
      excludeGarage
    );

    // Take top N items
    const recommendations = scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.item);

    const result: RecommendationResult = {
      items: recommendations,
      type: 'personalized',
      generatedAt: new Date().toISOString(),
      userId: authenticatedUserId,
    };

    // Cache personalized recommendations
    memoryCache.set(cacheKey, result, USER_CACHE_TTL);

    logPerformance(startTime, 'personalized');
    return result;
  } catch (error) {
    console.error('[getRecommendationsForUser] Error generating recommendations:', error);

    // Fallback on error
    const fallbackItems = await getFallbackRecommendations(options?.limit || 6);
    return {
      items: fallbackItems,
      type: 'fallback',
      generatedAt: new Date().toISOString(),
      userId,
    };
  }
}

/**
 * Get user's garage items from database
 */
async function getUserGarageItems(userId: string): Promise<Array<{ itemType: string; itemId: string; itemHandle: string }>> {
  try {
    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      select: {
        itemType: true,
        itemId: true,
        itemHandle: true,
      },
    });

    // Filter out items with null itemHandle
    return favorites
      .filter((f): f is { itemType: string; itemId: string; itemHandle: string } =>
        f.itemHandle !== null
      );
  } catch (error) {
    console.error('[getUserGarageItems] Error fetching garage items:', error);
    return [];
  }
}

/**
 * Score and rank recommendation candidates
 */
async function scoreRecommendations(
  activity: { vehicles: string[]; products: string[]; searches: string[] },
  garageItems: Array<{ itemType: string; itemId: string; itemHandle: string }>,
  type: 'vehicles' | 'parts' | 'all',
  excludeGarage: boolean
): Promise<RecommendationScore[]> {
  const scoredItems: RecommendationScore[] = [];

  // Extract garage vehicle chassis codes for matching
  const garageVehicles = garageItems
    .filter((item) => item.itemType === 'vehicle')
    .map((item) => item.itemId);

  const garageProducts = garageItems
    .filter((item) => item.itemType === 'product')
    .map((item) => item.itemHandle);

  // Fetch candidate items
  const [allVehicles, allProducts] = await Promise.all([
    type === 'vehicles' || type === 'all'
      ? getVehicles({ currentOnly: true }, 'recent')
      : Promise.resolve([]),
    type === 'parts' || type === 'all'
      ? getProducts({})
      : Promise.resolve([]),
  ]);

  // Score vehicles
  if (type === 'vehicles' || type === 'all') {
    for (const vehicle of allVehicles) {
      // Exclude if in garage
      if (excludeGarage && garageVehicles.includes(vehicle.slug.current)) {
        continue;
      }

      let score = 0;
      let reasons: string[] = [];

      // Garage-based scoring (weight: 3.0)
      // If user has vehicles with same chassis in garage
      const hasMatchingChassis = garageVehicles.some((garageSlug) => {
        const garageVehicle = allVehicles.find((v) => v.slug.current === garageSlug);
        return garageVehicle?.chassis === vehicle.chassis;
      });

      if (hasMatchingChassis) {
        score += WEIGHTS.GARAGE;
        reasons.push(`Matches garage chassis: ${vehicle.chassis}`);
      }

      // Browsing history scoring (weight: 2.0)
      if (activity.vehicles.includes(vehicle.slug.current)) {
        score += WEIGHTS.BROWSING;
        reasons.push('Recently viewed');
      }

      // Only add if score > 0
      if (score > 0) {
        scoredItems.push({
          item: vehicle,
          score,
          reason: reasons.join(', '),
          type: 'vehicle',
        });
      }
    }
  }

  // Score products
  if (type === 'parts' || type === 'all') {
    for (const product of allProducts) {
      // Exclude if in garage
      if (excludeGarage && garageProducts.includes(product.handle)) {
        continue;
      }

      let score = 0;
      let reasons: string[] = [];

      // Garage-based scoring (weight: 3.0)
      // If product fits garage vehicles
      const fitmentTags = product.tags.filter((tag) =>
        /bmw\s+(e\d{2,3}|f\d{2,3}|g\d{2}|universal)/i.test(tag)
      );

      const fitsGarageVehicle = garageVehicles.some((garageSlug) => {
        const garageVehicle = allVehicles.find((v) => v.slug.current === garageSlug);
        if (!garageVehicle) return false;

        return fitmentTags.some((tag) => {
          const fitment = parseFitmentTag(tag);
          return (
            fitment.isUniversal ||
            fitment.model === garageVehicle.chassis
          );
        });
      });

      if (fitsGarageVehicle) {
        score += WEIGHTS.GARAGE;
        reasons.push('Compatible with garage vehicle');
      }

      // Browsing history scoring (weight: 2.0)
      if (activity.products.includes(product.handle)) {
        score += WEIGHTS.BROWSING;
        reasons.push('Recently viewed');
      }

      // Only add if score > 0
      if (score > 0) {
        scoredItems.push({
          item: product,
          score,
          reason: reasons.join(', '),
          type: 'product',
        });
      }
    }
  }

  return scoredItems;
}

/**
 * Log performance metrics
 */
function logPerformance(startTime: number, type: string): void {
  const duration = performance.now() - startTime;
  const status = duration < PERFORMANCE_THRESHOLD_MS ? '✓' : '⚠';

  console.log(
    `[Recommendations] ${status} Generated ${type} recommendations in ${duration.toFixed(2)}ms (target: <${PERFORMANCE_THRESHOLD_MS}ms)`
  );

  if (duration >= PERFORMANCE_THRESHOLD_MS) {
    console.warn(
      `[Recommendations] Performance warning: Exceeded ${PERFORMANCE_THRESHOLD_MS}ms threshold`
    );
  }
}
