import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { Product } from "@/lib/shopify/types";

/**
 * Unified search result with type discrimination
 * Allows distinguishing between vehicle and product results
 */
export interface SearchResult<T = VehicleListItem | Product> {
  type: "vehicle" | "product";
  item: T;
  score: number;
}

/**
 * Search query parameters for API requests
 */
export interface SearchQuery {
  q: string; // Query string (min 2, max 100 chars)
  type?: "vehicles" | "parts" | "all"; // Filter by content type
  limit?: number; // Results limit (default 20, max 100)
}

/**
 * Search API response format
 */
export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  searchTime: number; // Time in milliseconds
}

/**
 * Flattened vehicle data optimized for Fuse.js searching
 * Contains all searchable fields from VehicleListItem
 */
export interface SearchableVehicle {
  _id: string;
  listingTitle: string;
  slug: string;
  chassis: string;
  vin?: string;
  mileage: number;
  listingPrice?: number;
  status: string;
  inventoryStatus: string;
  _createdAt: string;
}

/**
 * Flattened product data optimized for Fuse.js searching
 * Contains all searchable fields from Shopify Product
 */
export interface SearchableProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string;
  minPrice: string;
  maxPrice: string;
  availableForSale: boolean;
  updatedAt: string;
}

/**
 * Fuse.js search configuration options
 */
export interface FuseConfig {
  threshold: number; // 0.0 = exact match, 1.0 = match anything
  keys: Array<{
    name: string;
    weight: number;
  }>;
}
