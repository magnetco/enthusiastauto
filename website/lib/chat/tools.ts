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
 * Returns variant IDs for add-to-cart functionality
 */
export async function searchParts(
  query: string,
  chassis?: string,
  year?: number,
  limit: number = 8,
): Promise<PartsSearchResult> {
  try {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Get all products from Shopify for more reliable searching
    const allProducts = await getProducts({ query: normalizedQuery });
    
    // Also run fuzzy search for additional matches
    const fuzzyResults = await searchAll(query, "parts", limit * 3);
    
    // Combine direct Shopify results with fuzzy results
    const directMatchHandles = new Set(allProducts.map(p => p.handle));
    const fuzzyMatchProducts = fuzzyResults
      .filter(r => !directMatchHandles.has((r.item as Product).handle))
      .map(r => r.item as Product);
    
    let combinedProducts = [...allProducts, ...fuzzyMatchProducts];
    
    // Filter by fitment if chassis or year provided
    if (chassis || year) {
      combinedProducts = combinedProducts.filter((product) => {
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
    const limitedProducts = combinedProducts.slice(0, limit);

    // Format results with variant IDs for add-to-cart
    const formattedResults = limitedProducts.map((product) => {
      // Extract fitment info from tags
      const fitmentTags = product.tags
        .filter((tag) => /bmw|e\d{2}|f\d{2}|g\d{2}/i.test(tag))
        .map((tag) => {
          const fitment = parseFitmentTag(tag);
          return fitment.model || tag;
        })
        .filter((tag, index, self) => self.indexOf(tag) === index);

      // Get the first available variant for add-to-cart
      const defaultVariant = product.variants?.find(v => v.availableForSale) || product.variants?.[0];

      return {
        title: product.title,
        handle: product.handle,
        price: `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`,
        fitment: fitmentTags,
        url: `https://enthusiastauto.com/product/${product.handle}`,
        vendor: product.vendor,
        variantId: defaultVariant?.id,
        availableForSale: product.availableForSale,
      };
    });

    return {
      results: formattedResults,
      count: formattedResults.length,
      totalAvailable: combinedProducts.filter(p => p.availableForSale).length,
    };
  } catch (error) {
    console.error("Error searching parts:", error);
    return { results: [], count: 0 };
  }
}

/**
 * List all parts/products with optional category filtering
 */
export async function listAllParts(
  category?: string,
  limit: number = 10,
): Promise<PartsSearchResult> {
  try {
    const query = category ? `product_type:${category}` : undefined;
    const products = await getProducts({ query });
    const limitedProducts = products.slice(0, limit);
    
    const formattedResults = limitedProducts.map((product) => {
      const fitmentTags = product.tags
        .filter((tag) => /bmw|e\d{2}|f\d{2}|g\d{2}/i.test(tag))
        .map((tag) => {
          const fitment = parseFitmentTag(tag);
          return fitment.model || tag;
        })
        .filter((tag, index, self) => self.indexOf(tag) === index);

      const defaultVariant = product.variants?.find(v => v.availableForSale) || product.variants?.[0];

      return {
        title: product.title,
        handle: product.handle,
        price: `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`,
        fitment: fitmentTags,
        url: `https://enthusiastauto.com/product/${product.handle}`,
        vendor: product.vendor,
        variantId: defaultVariant?.id,
        availableForSale: product.availableForSale,
      };
    });

    return {
      results: formattedResults,
      count: formattedResults.length,
      totalAvailable: products.filter(p => p.availableForSale).length,
    };
  } catch (error) {
    console.error("Error listing parts:", error);
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

    // Format results with variant IDs
    const formattedParts = limitedParts.map((part) => {
      const defaultVariant = part.variants?.find(v => v.availableForSale) || part.variants?.[0];
      return {
        title: part.title,
        handle: part.handle,
        price: `$${parseFloat(part.priceRange.minVariantPrice.amount).toFixed(2)}`,
        url: `https://enthusiastauto.com/product/${part.handle}`,
        vendor: part.vendor,
        variantId: defaultVariant?.id,
      };
    });

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
 * Find parts compatible with a vehicle by chassis code
 */
export async function getPartsForChassis(
  chassis: string,
  limit: number = 8,
): Promise<VehiclePartsMatchResult | null> {
  try {
    // Get a vehicle with this chassis to use for matching
    const vehicles = await getVehicles({ chassis: chassis.toUpperCase(), status: "current" }, { field: "_createdAt", direction: "desc" });
    
    if (vehicles.length === 0) {
      // No vehicle found, search parts directly by chassis tag
      const partsResult = await searchParts(chassis, chassis, undefined, limit);
      return {
        vehicle: {
          title: `${chassis.toUpperCase()} BMW`,
          slug: "",
          chassis: chassis.toUpperCase(),
          url: `https://enthusiastauto.com/vehicles?chassis=${chassis.toUpperCase()}`,
        },
        compatibleParts: partsResult.results.map(p => ({
          title: p.title,
          handle: p.handle,
          price: p.price,
          url: p.url,
          variantId: p.variantId,
        })),
        count: partsResult.count,
      };
    }
    
    // Use the first vehicle to find compatible parts
    const vehicle = vehicles[0];
    const vehicleDetail = await getVehicleDetail(vehicle.slug.current);
    
    if (!vehicleDetail) {
      return null;
    }
    
    const parts = await getCompatibleParts(vehicleDetail);
    const limitedParts = parts.slice(0, limit);
    
    return {
      vehicle: {
        title: vehicle.listingTitle,
        slug: vehicle.slug.current,
        chassis: vehicle.chassis,
        url: `https://enthusiastauto.com/vehicles/${vehicle.slug.current}`,
      },
      compatibleParts: limitedParts.map((part) => {
        const defaultVariant = part.variants?.find(v => v.availableForSale) || part.variants?.[0];
        return {
          title: part.title,
          handle: part.handle,
          price: `$${parseFloat(part.priceRange.minVariantPrice.amount).toFixed(2)}`,
          url: `https://enthusiastauto.com/product/${part.handle}`,
          variantId: defaultVariant?.id,
        };
      }),
      count: limitedParts.length,
    };
  } catch (error) {
    console.error("Error getting parts for chassis:", error);
    return null;
  }
}

/**
 * Find vehicles compatible with a specific part
 */
export async function getVehiclesForPart(
  productHandle: string,
): Promise<PartsVehicleMatchResult | null> {
  try {
    // Get the product details
    const product = await getProduct(productHandle);
    
    if (!product) {
      return null;
    }
    
    // Find vehicles that match this part's fitment tags
    const compatibleVehicles = await getVehiclesWithPart(productHandle, product.tags);
    
    return {
      part: {
        title: product.title,
        handle: product.handle,
        price: `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`,
        url: `https://enthusiastauto.com/product/${product.handle}`,
      },
      compatibleVehicles: compatibleVehicles.map((vehicle) => ({
        title: vehicle.listingTitle,
        slug: vehicle.slug.current,
        chassis: vehicle.chassis,
        price: vehicle.showCallForPrice
          ? "Call for price"
          : `$${vehicle.listingPrice?.toLocaleString()}`,
        url: `https://enthusiastauto.com/vehicles/${vehicle.slug.current}`,
      })),
      count: compatibleVehicles.length,
    };
  } catch (error) {
    console.error("Error getting vehicles for part:", error);
    return null;
  }
}

/**
 * Add a product to the shopping cart
 * Note: This creates a cart if one doesn't exist
 */
export async function addProductToCart(
  productHandle: string,
  quantity: number = 1,
): Promise<AddToCartResult> {
  try {
    // Get the product to find its variant ID
    const product = await getProduct(productHandle);
    
    if (!product) {
      return {
        success: false,
        message: `Product "${productHandle}" not found.`,
      };
    }
    
    if (!product.availableForSale) {
      return {
        success: false,
        message: `"${product.title}" is currently out of stock.`,
      };
    }
    
    // Get the first available variant
    const variant = product.variants?.find(v => v.availableForSale) || product.variants?.[0];
    
    if (!variant) {
      return {
        success: false,
        message: `No available variants for "${product.title}".`,
      };
    }
    
    // Check if cart exists, create if not
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;
    
    if (!cartId) {
      const newCart = await createCart();
      cartId = newCart.id;
      if (cartId) {
        cookieStore.set("cartId", cartId);
      }
    }
    
    // Add to cart
    await addToCart([{ merchandiseId: variant.id, quantity }]);
    
    return {
      success: true,
      message: `Added ${quantity}x "${product.title}" to your cart.`,
      productTitle: product.title,
      cartUrl: "https://enthusiastauto.com/cart",
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      message: `Failed to add item to cart: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
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
          return JSON.stringify({
            message: "No vehicles found matching your search criteria.",
            suggestion: "Try searching with different terms like chassis code (E46, E92, F80) or model name (M3, M5).",
            browseUrl: "https://enthusiastauto.com/vehicles",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "list_vehicles": {
        const result = await listAllVehicles(
          (args.status as "current" | "sold" | "all") || "current",
          args.chassis as string | undefined,
          (args.limit as number) || 10,
        );
        
        if (result.count === 0) {
          return JSON.stringify({
            message: "No vehicles currently in inventory.",
            browseUrl: "https://enthusiastauto.com/vehicles",
          });
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
          return JSON.stringify({
            message: "No parts found matching your search criteria.",
            suggestion: "Try searching with different terms or browse all parts.",
            browseUrl: "https://enthusiastauto.com/parts",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "list_parts": {
        const result = await listAllParts(
          args.category as string | undefined,
          (args.limit as number) || 10,
        );
        
        if (result.count === 0) {
          return JSON.stringify({
            message: "No parts currently available.",
            browseUrl: "https://enthusiastauto.com/parts",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "get_vehicle_details": {
        const result = await getVehicleDetails(args.slug as string);
        
        if (!result) {
          return JSON.stringify({
            message: "Vehicle not found.",
            browseUrl: "https://enthusiastauto.com/vehicles",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "get_compatible_parts": {
        const result = await getVehicleCompatibleParts(
          args.vehicleSlug as string,
          (args.limit as number) || 6,
        );
        
        if (!result) {
          return JSON.stringify({
            message: "Vehicle not found or no compatible parts available.",
            browseUrl: "https://enthusiastauto.com/parts",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "get_parts_for_chassis": {
        const result = await getPartsForChassis(
          args.chassis as string,
          (args.limit as number) || 8,
        );
        
        if (!result) {
          return JSON.stringify({
            message: "No parts found for this chassis code.",
            browseUrl: "https://enthusiastauto.com/parts",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "get_vehicles_for_part": {
        const result = await getVehiclesForPart(args.productHandle as string);
        
        if (!result) {
          return JSON.stringify({
            message: "Part not found or no compatible vehicles in inventory.",
          });
        }
        
        return JSON.stringify(result, null, 2);
      }

      case "add_to_cart": {
        const result = await addProductToCart(
          args.productHandle as string,
          (args.quantity as number) || 1,
        );
        
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
