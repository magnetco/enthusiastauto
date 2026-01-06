/**
 * In-memory cache with TTL support
 * Used for caching recommendation queries (5-minute TTL)
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get value from cache
   * Returns undefined if key not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set value in cache with TTL in milliseconds
   * Default TTL: 5 minutes (300000ms)
   */
  set<T>(key: string, value: T, ttlMs: number = 300000): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries (cleanup)
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach((entry) => {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        activeEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      activeEntries,
      expiredEntries,
    };
  }
}

// Singleton instance
export const memoryCache = new MemoryCache();

// Periodic cleanup (every 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      memoryCache.cleanup();
    },
    10 * 60 * 1000,
  );
}
