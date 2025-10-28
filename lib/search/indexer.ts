import { client } from "@/sanity/lib/client";
import { getProducts } from "@/lib/shopify";
import { memoryCache } from "@/lib/cache/memory";
import type {
  SearchableVehicle,
  SearchableProduct,
} from "@/types/search";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { Product } from "@/lib/shopify/types";

// Cache keys
const VEHICLE_INDEX_KEY = "search:vehicles:index";
const PRODUCT_INDEX_KEY = "search:products:index";

// Cache TTL: 15 minutes (900000ms) per NFR008 - Real-Time Index Updates requirement
const INDEX_TTL_MS = 15 * 60 * 1000;

/**
 * Transforms a VehicleListItem into a searchable format for Fuse.js
 * Flattens nested objects and handles optional fields
 */
export function transformVehicleToSearchable(
  vehicle: VehicleListItem,
): SearchableVehicle {
  return {
    _id: vehicle._id,
    listingTitle: vehicle.listingTitle,
    slug: vehicle.slug.current,
    chassis: vehicle.chassis,
    vin: undefined, // VIN not in VehicleListItem, would need full detail
    mileage: vehicle.mileage,
    listingPrice: vehicle.listingPrice,
    status: vehicle.status,
    inventoryStatus: vehicle.inventoryStatus,
    _createdAt: vehicle._createdAt,
  };
}

/**
 * Transforms a Shopify Product into a searchable format for Fuse.js
 * Flattens nested objects and concatenates tags
 */
export function transformProductToSearchable(
  product: Product,
): SearchableProduct {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags.join(" "), // Concatenate tags for search
    minPrice: product.priceRange.minVariantPrice.amount,
    maxPrice: product.priceRange.maxVariantPrice.amount,
    availableForSale: product.availableForSale,
    updatedAt: product.updatedAt,
  };
}

/**
 * Builds vehicle search index by fetching all vehicles from Sanity
 * Uses GROQ query to fetch all vehicles with necessary fields
 */
export async function buildVehicleIndex(): Promise<SearchableVehicle[]> {
  try {
    const query = `
      *[_type == "vehicle" && isLive == true] {
        _id,
        listingTitle,
        slug,
        chassis,
        mileage,
        listingPrice,
        showCallForPrice,
        status,
        inventoryStatus,
        _createdAt
      }
    `;

    const vehicles = await client.fetch<VehicleListItem[]>(query);
    return vehicles.map(transformVehicleToSearchable);
  } catch (error) {
    console.error("Error building vehicle index:", error);
    return [];
  }
}

/**
 * Builds product search index by fetching all products from Shopify
 * Uses existing getProducts function
 */
export async function buildProductIndex(): Promise<SearchableProduct[]> {
  try {
    const products = await getProducts({});
    return products.map(transformProductToSearchable);
  } catch (error) {
    console.error("Error building product index:", error);
    return [];
  }
}

/**
 * Gets vehicle index from cache or builds it if not cached/expired
 * Implements 15-minute cache TTL per NFR008
 */
export async function getVehicleIndex(): Promise<SearchableVehicle[]> {
  // Check cache first
  const cached = memoryCache.get<SearchableVehicle[]>(VEHICLE_INDEX_KEY);
  if (cached) {
    return cached;
  }

  // Build fresh index
  const index = await buildVehicleIndex();

  // Cache for 15 minutes
  memoryCache.set(VEHICLE_INDEX_KEY, index, INDEX_TTL_MS);

  return index;
}

/**
 * Gets product index from cache or builds it if not cached/expired
 * Implements 15-minute cache TTL per NFR008
 */
export async function getProductIndex(): Promise<SearchableProduct[]> {
  // Check cache first
  const cached = memoryCache.get<SearchableProduct[]>(PRODUCT_INDEX_KEY);
  if (cached) {
    return cached;
  }

  // Build fresh index
  const index = await buildProductIndex();

  // Cache for 15 minutes
  memoryCache.set(PRODUCT_INDEX_KEY, index, INDEX_TTL_MS);

  return index;
}

/**
 * Refreshes the vehicle search index
 * Triggers rebuild and cache update
 */
export async function refreshVehicleIndex(): Promise<void> {
  const index = await buildVehicleIndex();
  memoryCache.set(VEHICLE_INDEX_KEY, index, INDEX_TTL_MS);
}

/**
 * Refreshes the product search index
 * Triggers rebuild and cache update
 */
export async function refreshProductIndex(): Promise<void> {
  const index = await buildProductIndex();
  memoryCache.set(PRODUCT_INDEX_KEY, index, INDEX_TTL_MS);
}

/**
 * Refreshes all search indexes (vehicles and products)
 * Called by webhook handlers when content changes
 */
export async function refreshAllIndexes(): Promise<void> {
  await Promise.all([refreshVehicleIndex(), refreshProductIndex()]);
}

/**
 * Warms the search cache on application startup
 * Pre-builds indexes to avoid cold start latency
 */
export async function warmSearchCache(): Promise<void> {
  console.log("[Search] Warming search cache...");
  try {
    await Promise.all([getVehicleIndex(), getProductIndex()]);
    console.log("[Search] Cache warmed successfully");
  } catch (error) {
    console.error("[Search] Failed to warm cache:", error);
  }
}
