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
 * Uses both fuzzy search and direct filtering for better results
 */
export async function searchVehicles(
  query: string,
  status: "current" | "sold" | "all" = "current",
  limit: number = 5,
): Promise<VehicleSearchResult> {
  try {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Get all vehicles from Sanity for more reliable searching
    const allVehicles = await getVehicles(
      status === "all" ? {} : { status },
      { field: "_createdAt", direction: "desc" }
    );
    
    // Also run fuzzy search for additional matches
    const fuzzyResults = await searchAll(query, "vehicles", limit * 3);
    
    // Direct text matching on vehicles (more reliable than fuzzy for exact terms)
    const directMatches = allVehicles.filter((vehicle) => {
      const searchableText = [
        vehicle.listingTitle,
        vehicle.chassis,
        vehicle.vin || "",
        vehicle.status,
      ].join(" ").toLowerCase();
      
      // Check if query terms are in the searchable text
      const queryTerms = normalizedQuery.split(/\s+/);
      return queryTerms.every(term => searchableText.includes(term));
    });
    
    // Combine results, prioritizing direct matches
    const directMatchSlugs = new Set(directMatches.map(v => v.slug.current));
    const fuzzyMatchVehicles = fuzzyResults
      .filter(r => {
        const vehicle = r.item as VehicleListItem;
        // Filter by status if needed
        if (status !== "all" && vehicle.status !== status) return false;
        // Exclude already matched vehicles
        return !directMatchSlugs.has(vehicle.slug.current);
      })
      .map(r => r.item as VehicleListItem);
    
    // Merge: direct matches first, then fuzzy matches
    const combinedVehicles = [...directMatches, ...fuzzyMatchVehicles].slice(0, limit);

    // Format results with full URLs
    const formattedResults = combinedVehicles.map((vehicle) => ({
      title: vehicle.listingTitle,
      slug: vehicle.slug.current,
      chassis: vehicle.chassis,
      price: vehicle.showCallForPrice
        ? "Call for price"
        : `$${vehicle.listingPrice?.toLocaleString()}`,
      status: vehicle.status,
      url: `https://enthusiastauto.com/vehicles/${vehicle.slug.current}`,
      mileage: vehicle.mileage,
    }));

    return {
      results: formattedResults,
      count: formattedResults.length,
      totalAvailable: allVehicles.filter(v => v.status === "current").length,
    };
  } catch (error) {
    console.error("Error searching vehicles:", error);
    return { results: [], count: 0 };
  }
}

/**
 * List all vehicles in inventory with optional filtering
 */
export async function listAllVehicles(
  status: "current" | "sold" | "all" = "current",
  chassis?: string,
  limit: number = 10,
): Promise<VehicleSearchResult> {
  try {
    const filters: any = {};
    if (status !== "all") filters.status = status;
    if (chassis) filters.chassis = chassis.toUpperCase();
    
    const vehicles = await getVehicles(filters, { field: "_createdAt", direction: "desc" });
    const limitedVehicles = vehicles.slice(0, limit);
    
    const formattedResults = limitedVehicles.map((vehicle) => ({
      title: vehicle.listingTitle,
      slug: vehicle.slug.current,
      chassis: vehicle.chassis,
      price: vehicle.showCallForPrice
        ? "Call for price"
        : `$${vehicle.listingPrice?.toLocaleString()}`,
      status: vehicle.status,
      url: `https://enthusiastauto.com/vehicles/${vehicle.slug.current}`,
      mileage: vehicle.mileage,
    }));

    return {
      results: formattedResults,
      count: formattedResults.length,
      totalAvailable: vehicles.length,
    };
  } catch (error) {
    console.error("Error listing vehicles:", error);
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
