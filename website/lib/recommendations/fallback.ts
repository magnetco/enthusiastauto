import { getVehicles, VehicleListItem } from '@/lib/sanity/queries/vehicles';
import { getProducts } from '@/lib/shopify';
import { Product } from '@/lib/shopify/types';
import { memoryCache } from '@/lib/cache/memory';

/**
 * Cache key for popular vehicles
 */
const POPULAR_VEHICLES_CACHE_KEY = 'recommendations:popular:vehicles';

/**
 * Cache key for popular parts
 */
const POPULAR_PARTS_CACHE_KEY = 'recommendations:popular:parts';

/**
 * Cache TTL for fallback recommendations (15 minutes)
 */
const FALLBACK_CACHE_TTL = 15 * 60 * 1000;

/**
 * Get popular vehicles for fallback recommendations
 * Returns most recent "Current Inventory" vehicles from Sanity
 * @param limit - Number of vehicles to return (default: 4)
 * @returns Array of popular vehicles
 */
export async function getPopularVehicles(
  limit: number = 4
): Promise<VehicleListItem[]> {
  try {
    // Check cache first
    const cached = memoryCache.get<VehicleListItem[]>(
      POPULAR_VEHICLES_CACHE_KEY
    );
    if (cached) {
      return cached.slice(0, limit);
    }

    // Fetch recent Current Inventory vehicles
    const vehicles = await getVehicles(
      { currentOnly: true },
      'recent'
    );

    // Take top 8 vehicles and cache them
    const popularVehicles = vehicles.slice(0, 8);

    memoryCache.set(
      POPULAR_VEHICLES_CACHE_KEY,
      popularVehicles,
      FALLBACK_CACHE_TTL
    );

    return popularVehicles.slice(0, limit);
  } catch (error) {
    console.error('[getPopularVehicles] Error fetching popular vehicles:', error);
    return [];
  }
}

/**
 * Get popular parts for fallback recommendations
 * Returns featured/best-selling products from Shopify
 * @param limit - Number of products to return (default: 4)
 * @returns Array of popular products
 */
export async function getPopularParts(
  limit: number = 4
): Promise<Product[]> {
  try {
    // Check cache first
    const cached = memoryCache.get<Product[]>(POPULAR_PARTS_CACHE_KEY);
    if (cached) {
      return cached.slice(0, limit);
    }

    // Fetch products (sorted by newest by default)
    const products = await getProducts({});

    // Take top 8 products and cache them
    const popularProducts = products.slice(0, 8);

    memoryCache.set(
      POPULAR_PARTS_CACHE_KEY,
      popularProducts,
      FALLBACK_CACHE_TTL
    );

    return popularProducts.slice(0, limit);
  } catch (error) {
    console.error('[getPopularParts] Error fetching popular parts:', error);
    return [];
  }
}

/**
 * Get mixed fallback recommendations (vehicles + parts)
 * @param totalLimit - Total number of items to return (default: 6)
 * @returns Array of mixed popular items
 */
export async function getFallbackRecommendations(
  totalLimit: number = 6
): Promise<Array<VehicleListItem | Product>> {
  try {
    // Split limit between vehicles and parts
    const vehicleLimit = Math.ceil(totalLimit / 2);
    const partsLimit = Math.floor(totalLimit / 2);

    const [vehicles, parts] = await Promise.all([
      getPopularVehicles(vehicleLimit),
      getPopularParts(partsLimit),
    ]);

    // Interleave vehicles and parts for visual variety
    const mixed: Array<VehicleListItem | Product> = [];
    const maxLength = Math.max(vehicles.length, parts.length);

    for (let i = 0; i < maxLength; i++) {
      const vehicle = vehicles[i];
      const part = parts[i];
      if (vehicle) mixed.push(vehicle);
      if (part) mixed.push(part);
    }

    return mixed.slice(0, totalLimit);
  } catch (error) {
    console.error('[getFallbackRecommendations] Error generating fallback:', error);
    return [];
  }
}
