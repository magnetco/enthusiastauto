import Fuse from "fuse.js";
import type {
  SearchableVehicle,
  SearchableProduct,
  FuseConfig,
} from "@/types/search";
import type { IFuseOptions, FuseResult } from "fuse.js";

/**
 * Fuse.js configuration for vehicle search
 * Field weights: title (2.0), chassis (1.5), VIN (1.5), status (1.0), metadata (0.8)
 * Threshold: 0.3 for balanced precision/recall
 */
export const vehicleFuseConfig: IFuseOptions<SearchableVehicle> = {
  threshold: 0.3,
  keys: [
    { name: "listingTitle", weight: 2.0 },
    { name: "chassis", weight: 1.5 },
    { name: "vin", weight: 1.5 },
    { name: "status", weight: 1.0 },
    { name: "inventoryStatus", weight: 1.0 },
    { name: "slug", weight: 0.8 },
  ],
  includeScore: true,
  useExtendedSearch: false,
  findAllMatches: false,
  minMatchCharLength: 2,
  shouldSort: true,
  ignoreLocation: true,
};

/**
 * Fuse.js configuration for product search
 * Field weights: title (2.0), tags (1.5), description (1.0), vendor/productType (0.8)
 * Threshold: 0.3 for balanced precision/recall
 */
export const productFuseConfig: IFuseOptions<SearchableProduct> = {
  threshold: 0.3,
  keys: [
    { name: "title", weight: 2.0 },
    { name: "tags", weight: 1.5 },
    { name: "description", weight: 1.0 },
    { name: "vendor", weight: 0.8 },
    { name: "productType", weight: 0.8 },
    { name: "handle", weight: 0.8 },
  ],
  includeScore: true,
  useExtendedSearch: false,
  findAllMatches: false,
  minMatchCharLength: 2,
  shouldSort: true,
  ignoreLocation: true,
};

/**
 * Creates a new Fuse.js instance for vehicle search
 * @param vehicles - Array of searchable vehicle objects
 * @returns Configured Fuse.js instance
 */
export function createVehicleFuse(
  vehicles: SearchableVehicle[],
): Fuse<SearchableVehicle> {
  return new Fuse(vehicles, vehicleFuseConfig);
}

/**
 * Creates a new Fuse.js instance for product search
 * @param products - Array of searchable product objects
 * @returns Configured Fuse.js instance
 */
export function createProductFuse(
  products: SearchableProduct[],
): Fuse<SearchableProduct> {
  return new Fuse(products, productFuseConfig);
}

/**
 * Helper to transform Fuse.js results into simplified score-sorted array
 * @param fuseResults - Raw Fuse.js search results with scores
 * @returns Array of items with scores
 */
export function extractFuseResults<T>(
  fuseResults: FuseResult<T>[],
): Array<{ item: T; score: number }> {
  return fuseResults.map((result) => ({
    item: result.item,
    score: result.score ?? 1, // Lower score is better in Fuse.js (0 = perfect match)
  }));
}
