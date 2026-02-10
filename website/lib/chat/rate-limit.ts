import { memoryCache } from "@/lib/cache/memory";

// Rate limit configuration
const GUEST_LIMIT = 10; // messages per hour
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Check rate limit for a given identifier (IP address or session ID)
 * Returns whether the request is allowed and how many requests remain
 */
export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const key = `chat:ratelimit:${identifier}`;
  
  // Get current count and timestamp
  const cached = memoryCache.get<{ count: number; firstRequest: number }>(key);
  
  const now = Date.now();
  
  if (!cached) {
    // First request in this window
    memoryCache.set(
      key,
      { count: 1, firstRequest: now },
      WINDOW_MS,
    );
    
    return {
      allowed: true,
      remaining: GUEST_LIMIT - 1,
      resetAt: new Date(now + WINDOW_MS),
    };
  }
  
  // Check if window has expired
  if (now - cached.firstRequest >= WINDOW_MS) {
    // Window expired, reset counter
    memoryCache.set(
      key,
      { count: 1, firstRequest: now },
      WINDOW_MS,
    );
    
    return {
      allowed: true,
      remaining: GUEST_LIMIT - 1,
      resetAt: new Date(now + WINDOW_MS),
    };
  }
  
  // Check if limit exceeded
  if (cached.count >= GUEST_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(cached.firstRequest + WINDOW_MS),
    };
  }
  
  // Increment counter
  memoryCache.set(
    key,
    { count: cached.count + 1, firstRequest: cached.firstRequest },
    WINDOW_MS - (now - cached.firstRequest), // Remaining TTL
  );
  
  return {
    allowed: true,
    remaining: GUEST_LIMIT - cached.count - 1,
    resetAt: new Date(cached.firstRequest + WINDOW_MS),
  };
}

/**
 * Get rate limit status without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
): Promise<RateLimitResult> {
  const key = `chat:ratelimit:${identifier}`;
  
  const cached = memoryCache.get<{ count: number; firstRequest: number }>(key);
  
  const now = Date.now();
  
  if (!cached || now - cached.firstRequest >= WINDOW_MS) {
    return {
      allowed: true,
      remaining: GUEST_LIMIT,
      resetAt: new Date(now + WINDOW_MS),
    };
  }
  
  return {
    allowed: cached.count < GUEST_LIMIT,
    remaining: Math.max(0, GUEST_LIMIT - cached.count),
    resetAt: new Date(cached.firstRequest + WINDOW_MS),
  };
}

/**
 * Reset rate limit for a given identifier (admin use)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = `chat:ratelimit:${identifier}`;
  memoryCache.delete(key);
}

/**
 * Get identifier from request (IP address or session ID)
 */
export function getIdentifier(request: Request): string {
  // Try to get IP from headers (Vercel sets x-forwarded-for)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ip = forwardedFor.split(",")[0];
    return ip ? ip.trim() : "unknown";
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier (not ideal but prevents errors)
  return "unknown";
}
