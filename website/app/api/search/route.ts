import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/lib/search/unified";
import type { SearchResponse } from "@/types/search";

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

// Simple in-memory rate limiting storage
const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Clean up expired rate limit entries periodically
 */
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [ip, data] of rateLimitMap.entries()) {
        if (now > data.resetTime) {
          rateLimitMap.delete(ip);
        }
      }
    },
    60 * 1000,
  ); // Cleanup every minute
}

/**
 * Check if request is rate limited
 * Returns true if rate limit exceeded
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Create new rate limit window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

/**
 * GET /api/search
 *
 * Unified search endpoint for vehicles and products
 *
 * Query Parameters:
 * - q: Search query string (required, min 2 chars, max 100 chars)
 * - type: Content type filter ("vehicles" | "parts" | "all", default: "all")
 * - limit: Max results to return (default: 20, max: 100)
 *
 * Returns:
 * - results: Array of SearchResult objects
 * - totalResults: Total number of results found
 * - searchTime: Time taken in milliseconds
 *
 * Rate Limiting: 100 requests per minute per IP
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    if (checkRateLimit(clientIP)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        },
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const type = (searchParams.get("type") || "all") as
      | "vehicles"
      | "parts"
      | "all";
    const limitParam = searchParams.get("limit");

    // Validate query parameter
    if (!query) {
      return NextResponse.json(
        {
          error: "Missing query parameter",
          message: "Query parameter 'q' is required",
        },
        { status: 400 },
      );
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return NextResponse.json(
        {
          error: "Invalid query",
          message: "Query must be at least 2 characters long",
        },
        { status: 400 },
      );
    }

    if (trimmedQuery.length > 100) {
      return NextResponse.json(
        {
          error: "Invalid query",
          message: "Query must not exceed 100 characters",
        },
        { status: 400 },
      );
    }

    // Validate type parameter
    if (type && !["vehicles", "parts", "all"].includes(type)) {
      return NextResponse.json(
        {
          error: "Invalid type parameter",
          message: "Type must be 'vehicles', 'parts', or 'all'",
        },
        { status: 400 },
      );
    }

    // Parse and validate limit parameter
    let limit = 20; // default
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          {
            error: "Invalid limit parameter",
            message: "Limit must be a positive integer",
          },
          { status: 400 },
        );
      }
      limit = Math.min(parsedLimit, 100); // cap at 100
    }

    // Execute search
    const results = await searchAll(trimmedQuery, type, limit);
    const searchTime = Date.now() - startTime;

    // Build response
    const response: SearchResponse = {
      results,
      totalResults: results.length,
      searchTime,
    };

    // Return with cache headers (5 minutes)
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred while processing your search",
      },
      { status: 500 },
    );
  }
}
