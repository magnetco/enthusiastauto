import { createVehicleFuse, createProductFuse, extractFuseResults } from "./fuse";
import { getVehicleIndex, getProductIndex } from "./indexer";
import { memoryCache } from "@/lib/cache/memory";
import type { SearchResult } from "@/types/search";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { Product } from "@/lib/shopify/types";

// Cache TTL for search results: 5 minutes (300000ms) per NFR009
const SEARCH_RESULT_TTL_MS = 5 * 60 * 1000;

/**
 * Generates cache key for search results
 */
function getSearchCacheKey(
  query: string,
  type: "vehicles" | "parts" | "all",
): string {
  return `search:results:${type}:${query.toLowerCase().trim()}`;
}

/**
 * Searches vehicles using Fuse.js
 * Returns search results with scores (lower is better)
 */
async function searchVehicles(
  query: string,
): Promise<SearchResult<VehicleListItem>[]> {
  try {
    const vehicleIndex = await getVehicleIndex();
    const fuse = createVehicleFuse(vehicleIndex);
    const results = fuse.search(query);
    const extracted = extractFuseResults(results);

    return extracted.map((result) => ({
      type: "vehicle" as const,
      item: result.item as unknown as VehicleListItem,
      score: result.score,
    }));
  } catch (error) {
    console.error("Error searching vehicles:", error);
    return [];
  }
}

/**
 * Searches products using Fuse.js
 * Returns search results with scores (lower is better)
 */
async function searchProducts(query: string): Promise<SearchResult<Product>[]> {
  try {
    const productIndex = await getProductIndex();
    const fuse = createProductFuse(productIndex);
    const results = fuse.search(query);
    const extracted = extractFuseResults(results);

    return extracted.map((result) => ({
      type: "product" as const,
      item: result.item as unknown as Product,
      score: result.score,
    }));
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

/**
 * Unified search across both vehicles and products
 * Merges and ranks results by relevance score
 *
 * @param query - Search query string
 * @param type - Content type filter ("vehicles" | "parts" | "all")
 * @param limit - Maximum results to return (default: 20)
 * @returns Array of unified search results sorted by relevance
 *
 * Performance: Results are cached for 5 minutes to meet <300ms NFR009 requirement
 */
export async function searchAll(
  query: string,
  type: "vehicles" | "parts" | "all" = "all",
  limit: number = 20,
): Promise<SearchResult[]> {
  // Validate query
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.trim();

  // Check cache first
  const cacheKey = getSearchCacheKey(normalizedQuery, type);
  const cached = memoryCache.get<SearchResult[]>(cacheKey);
  if (cached) {
    return cached.slice(0, limit);
  }

  // Track search time for performance monitoring
  const startTime = Date.now();

  // Execute searches based on type filter
  let vehicleResults: SearchResult<VehicleListItem>[] = [];
  let productResults: SearchResult<Product>[] = [];

  if (type === "vehicles" || type === "all") {
    vehicleResults = await searchVehicles(normalizedQuery);
  }

  if (type === "parts" || type === "all") {
    productResults = await searchProducts(normalizedQuery);
  }

  // Merge and sort results by score (lower Fuse.js score = better match)
  const mergedResults = [...vehicleResults, ...productResults].sort(
    (a, b) => a.score - b.score,
  );

  // Log performance for monitoring
  const searchTime = Date.now() - startTime;
  if (searchTime > 300) {
    console.warn(
      `[Search] Slow query detected: "${normalizedQuery}" took ${searchTime}ms (target: <300ms)`,
    );
  }

  // Cache results for 5 minutes
  memoryCache.set(cacheKey, mergedResults, SEARCH_RESULT_TTL_MS);

  // Return limited results
  return mergedResults.slice(0, limit);
}

/**
 * Popular search terms for cache warming
 * Based on common BMW and automotive queries
 */
export const POPULAR_SEARCH_TERMS = [
  "BMW",
  "E46",
  "M3",
  "parts",
  "performance",
  "brake",
  "suspension",
  "engine",
  "M5",
  "E39",
];

/**
 * Warms search result cache with popular terms
 * Reduces latency for common searches
 */
export async function warmSearchResults(): Promise<void> {
  console.log("[Search] Warming search result cache...");
  try {
    await Promise.all(
      POPULAR_SEARCH_TERMS.map((term) => searchAll(term, "all", 20)),
    );
    console.log(
      `[Search] Warmed cache with ${POPULAR_SEARCH_TERMS.length} popular terms`,
    );
  } catch (error) {
    console.error("[Search] Failed to warm search results:", error);
  }
}
