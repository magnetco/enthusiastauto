import { searchAll } from "@/lib/search/unified";
import { getVehicleDetail, getVehicles } from "@/lib/sanity/queries/vehicles";
import { getCompatibleParts, getVehiclesWithPart } from "@/lib/shared/recommendations";
import { parseFitmentTag } from "@/lib/shared/recommendations";
import { getProduct, getProducts, addToCart, createCart } from "@/lib/shopify";
import { cookies } from "next/headers";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { Product } from "@/lib/shopify/types";
import type { SearchResult } from "@/types/search";

// Tool result types
export interface VehicleSearchResult {
  results: Array<{
    title: string;
    slug: string;
    chassis: string;
    price: string;
    status: string;
    url: string;
    mileage?: number;
  }>;
  count: number;
  totalAvailable?: number;
}

export interface PartsSearchResult {
  results: Array<{
    title: string;
    handle: string;
    price: string;
    fitment: string[];
    url: string;
    vendor?: string;
    variantId?: string; // For add-to-cart functionality
    availableForSale?: boolean;
  }>;
  count: number;
  totalAvailable?: number;
}

export interface AddToCartResult {
  success: boolean;
  message: string;
  productTitle?: string;
  cartUrl?: string;
}

export interface VehiclePartsMatchResult {
  vehicle: {
    title: string;
    slug: string;
    chassis: string;
    url: string;
  };
  compatibleParts: Array<{
    title: string;
    handle: string;
    price: string;
    url: string;
    variantId?: string;
  }>;
  count: number;
}

export interface PartsVehicleMatchResult {
  part: {
    title: string;
    handle: string;
    price: string;
    url: string;
  };
  compatibleVehicles: Array<{
    title: string;
    slug: string;
    chassis: string;
    price: string;
    url: string;
  }>;
  count: number;
}

export interface VehicleDetailsResult {
  title: string;
  slug: string;
  chassis: string;
  price: string;
  status: string;
  mileage?: number;
  vin?: string;
  url: string;
  specs: {
    engine?: string;
    transmission?: string;
    drivetrain?: string;
    exteriorColor?: string;
    interiorColor?: string;
  };
  features?: string[];
  description?: string;
}

export interface CompatiblePartsResult {
  vehicleTitle: string;
  parts: Array<{
    title: string;
    handle: string;
    price: string;
    url: string;
    vendor?: string;
  }>;
  count: number;
}

/**
 * Search for vehicles in inventory or sold vehicles
 */
export async function searchVehicles(
  query: string,
  status: "current" | "sold" | "all" = "current",
  limit: number = 5,
): Promise<VehicleSearchResult> {
  try {
    // Search all vehicles
    const results = await searchAll(query, "vehicles", limit * 2); // Fetch more to account for filtering

    // Filter by status
    const filteredResults = results.filter((result) => {
      if (status === "all") return true;
      const vehicle = result.item as VehicleListItem;
      return vehicle.status === status;
    });

    // Limit results
    const limitedResults = filteredResults.slice(0, limit);

    // Format results
    const formattedResults = limitedResults.map((result) => {
      const vehicle = result.item as VehicleListItem;
      return {
        title: vehicle.listingTitle,
        slug: vehicle.slug.current,
        chassis: vehicle.chassis,
        price: vehicle.showCallForPrice
          ? "Call for price"
          : `$${vehicle.listingPrice?.toLocaleString()}`,
        status: vehicle.status,
        url: `/vehicles/${vehicle.slug.current}`,
        mileage: vehicle.mileage,
      };
    });

    return {
      results: formattedResults,
      count: formattedResults.length,
    };
  } catch (error) {
    console.error("Error searching vehicles:", error);
    return { results: [], count: 0 };
  }
}

/**
 * Search for parts with optional fitment filtering
 */
export async function searchParts(
  query: string,
  chassis?: string,
  year?: number,
  limit: number = 8,
): Promise<PartsSearchResult> {
  try {
    // Search all parts
    const results = await searchAll(query, "parts", limit * 2); // Fetch more to account for filtering

    // Filter by fitment if chassis or year provided
    let filteredResults = results;
    if (chassis || year) {
      filteredResults = results.filter((result) => {
        const product = result.item as Product;
        
        // Check if any tag matches the fitment
        return product.tags.some((tag) => {
          const fitment = parseFitmentTag(tag);
          
          // Check chassis match
          if (chassis && fitment.model) {
            if (fitment.model.toUpperCase() !== chassis.toUpperCase()) {
              return false;
            }
          }
          
          // Check year match
          if (year && (fitment.yearMin || fitment.yearMax)) {
            const yearMin = fitment.yearMin || year;
            const yearMax = fitment.yearMax || year;
            if (year < yearMin || year > yearMax) {
              return false;
            }
          }
          
          // Universal parts always match
          if (fitment.isUniversal) {
            return true;
          }
          
          return true;
        });
      });
    }

    // Limit results
    const limitedResults = filteredResults.slice(0, limit);

    // Format results
    const formattedResults = limitedResults.map((result) => {
      const product = result.item as Product;
      
      // Extract fitment info from tags
      const fitmentTags = product.tags
        .filter((tag) => /bmw|e\d{2}|f\d{2}|g\d{2}/i.test(tag))
        .map((tag) => {
          const fitment = parseFitmentTag(tag);
          return fitment.model || tag;
        })
        .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates

      return {
        title: product.title,
        handle: product.handle,
        price: `$${product.priceRange.minVariantPrice.amount}`,
        fitment: fitmentTags,
        url: `/product/${product.handle}`,
        vendor: product.vendor,
      };
    });

    return {
      results: formattedResults,
      count: formattedResults.length,
    };
  } catch (error) {
    console.error("Error searching parts:", error);
    return { results: [], count: 0 };
  }
}

/**
 * Get detailed information about a specific vehicle
 */
export async function getVehicleDetails(
  slug: string,
): Promise<VehicleDetailsResult | null> {
  try {
    const vehicle = await getVehicleDetail(slug);
    
    if (!vehicle) {
      return null;
    }

    return {
      title: vehicle.listingTitle,
      slug: vehicle.slug.current,
      chassis: vehicle.chassis,
      price: vehicle.showCallForPrice
        ? "Call for price"
        : `$${vehicle.listingPrice?.toLocaleString()}`,
      status: vehicle.status,
      mileage: vehicle.mileage,
      vin: vehicle.vin,
      url: `/vehicles/${vehicle.slug.current}`,
      specs: {
        engine: `${vehicle.engineType} ${vehicle.engineSize}`,
        transmission: vehicle.transmission,
        drivetrain: vehicle.drive,
        exteriorColor: vehicle.exteriorColor,
        interiorColor: vehicle.interiorColor,
      },
      features: vehicle.listingThumbnailFeatures,
      description: vehicle.history,
    };
  } catch (error) {
    console.error("Error getting vehicle details:", error);
    return null;
  }
}

/**
 * Get parts compatible with a specific vehicle
 */
export async function getVehicleCompatibleParts(
  vehicleSlug: string,
  limit: number = 6,
): Promise<CompatiblePartsResult | null> {
  try {
    // First get the vehicle details
    const vehicle = await getVehicleDetail(vehicleSlug);
    
    if (!vehicle) {
      return null;
    }

    // Get compatible parts
    const parts = await getCompatibleParts(vehicle);
    
    // Limit results
    const limitedParts = parts.slice(0, limit);

    // Format results
    const formattedParts = limitedParts.map((part) => ({
      title: part.title,
      handle: part.handle,
      price: `$${part.priceRange.minVariantPrice.amount}`,
      url: `/product/${part.handle}`,
      vendor: part.vendor,
    }));

    return {
      vehicleTitle: vehicle.listingTitle,
      parts: formattedParts,
      count: formattedParts.length,
    };
  } catch (error) {
    console.error("Error getting compatible parts:", error);
    return null;
  }
}

/**
 * Execute a tool call and return the result as a string
 */
export async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
): Promise<string> {
  try {
    switch (toolName) {
      case "search_vehicles": {
        const result = await searchVehicles(
          args.query as string,
          (args.status as "current" | "sold" | "all") || "current",
          (args.limit as number) || 5,
        );
        
        if (result.count === 0) {
          return "No vehicles found matching your search criteria.";
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "search_parts": {
        const result = await searchParts(
          args.query as string,
          args.chassis as string | undefined,
          args.year as number | undefined,
          (args.limit as number) || 8,
        );
        
        if (result.count === 0) {
          return "No parts found matching your search criteria.";
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "get_vehicle_details": {
        const result = await getVehicleDetails(args.slug as string);
        
        if (!result) {
          return "Vehicle not found.";
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "get_compatible_parts": {
        const result = await getVehicleCompatibleParts(
          args.vehicleSlug as string,
          (args.limit as number) || 6,
        );
        
        if (!result) {
          return "Vehicle not found or no compatible parts available.";
        }
        
        return JSON.stringify(result, null, 2);
      }

      default:
        return `Unknown tool: ${toolName}`;
    }
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    return `Error executing tool: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}
