import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationsForUser } from '@/lib/recommendations/engine';
import { RecommendationOptionsSchema } from '@/types/recommendations';
import { z } from 'zod';

/**
 * Rate limiting configuration
 * 100 requests per minute per user
 */
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for a user
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetAt) {
    // Reset or initialize
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * GET /api/recommendations
 * Returns personalized recommendations for authenticated users or popular items for anonymous users
 *
 * Query params:
 * - userId: Optional user ID (auto-detected from session)
 * - limit: Number of items to return (default: 6, max: 20)
 * - type: Filter by content type (vehicles|parts|all)
 *
 * Response:
 * {
 *   recommendations: Array<Vehicle | Product>,
 *   type: 'personalized' | 'fallback',
 *   isFallback: boolean,
 *   generatedAt: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const limitParam = searchParams.get('limit');
    const typeParam = searchParams.get('type');

    // Validate parameters
    const validationResult = RecommendationOptionsSchema.safeParse({
      userId,
      limit: limitParam ? parseInt(limitParam, 10) : 6,
      type: typeParam || 'all',
      excludeGarage: true,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid parameters',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const options = validationResult.data;

    // Rate limiting check
    const identifier = userId || request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute`,
        },
        { status: 429 }
      );
    }

    // Generate recommendations
    const result = await getRecommendationsForUser(userId, options);

    // Build response
    const response = NextResponse.json(
      {
        recommendations: result.items,
        type: result.type,
        isFallback: result.type === 'fallback',
        generatedAt: result.generatedAt,
      },
      {
        status: 200,
        headers: {
          // Cache personalized content for 5 minutes
          'Cache-Control': 'private, max-age=300',
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('[GET /api/recommendations] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to generate recommendations',
      },
      { status: 500 }
    );
  }
}
