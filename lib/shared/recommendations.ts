import { shopifyFetch } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { client } from "@/sanity/lib/client";
import {
  VehicleDetail,
  VehicleListItem,
} from "@/lib/sanity/queries/vehicles";
import { memoryCache } from "@/lib/cache/memory";

/**
 * Fitment tag parsing utilities
 */

interface FitmentInfo {
  model?: string; // E.g., "E46", "E90"
  yearMin?: number;
  yearMax?: number;
  isUniversal: boolean;
}

/**
 * Parse BMW fitment tag to extract model and year range
 * Examples:
 * - "BMW E46 2001-2006" → { model: "E46", yearMin: 2001, yearMax: 2006 }
 * - "BMW E46" → { model: "E46" }
 * - "BMW Universal" → { isUniversal: true }
 */
export function parseFitmentTag(tag: string): FitmentInfo {
  const normalizedTag = tag.trim();

  // Check for universal fit
  if (/bmw\s+universal/i.test(normalizedTag)) {
    return { isUniversal: true };
  }

  // Extract model (E46, E90, etc.)
  const modelMatch = normalizedTag.match(/\b(E\d{2,3}|F\d{2,3}|G\d{2})\b/i);
  const model = modelMatch?.[1]?.toUpperCase();

  // Extract year range (e.g., "2001-2006")
  const yearRangeMatch = normalizedTag.match(/(\d{4})\s*-\s*(\d{4})/);
  if (yearRangeMatch && yearRangeMatch[1] && yearRangeMatch[2]) {
    return {
      model,
      yearMin: parseInt(yearRangeMatch[1], 10),
      yearMax: parseInt(yearRangeMatch[2], 10),
      isUniversal: false,
    };
  }

  // Extract single year (e.g., "2003")
  const singleYearMatch = normalizedTag.match(/\b(\d{4})\b/);
  if (singleYearMatch && singleYearMatch[1]) {
    const year = parseInt(singleYearMatch[1], 10);
    return {
      model,
      yearMin: year,
      yearMax: year,
      isUniversal: false,
    };
  }

  return {
    model,
    isUniversal: false,
  };
}

/**
 * Extract vehicle year from listingTitle
 * E.g., "2003 BMW E46 M3" → 2003
 */
export function extractYearFromTitle(title: string): number | undefined {
  const yearMatch = title.match(/^(\d{4})\b/);
  return yearMatch?.[1] ? parseInt(yearMatch[1], 10) : undefined;
}

/**
 * Extract model designation from listingTitle
 * E.g., "2013 BMW E92 M3 ZCP" → "M3"
 * Looks for common BMW model patterns after the chassis code
 */
export function extractModelFromTitle(title: string): string | undefined {
  // Match common BMW models: M3, M5, 335i, 540i, etc.
  const modelMatch = title.match(
    /\b(M\d|[1-7]\d{2}[A-Za-z]{0,2}|X[1-7]|Z\d)\b/i,
  );
  return modelMatch?.[1]?.toUpperCase();
}

/**
 * Generate compatibility tags for a vehicle based on CMS fields
 * These tags will be used to search Shopify products
 *
 * Example for "2013 BMW E92 M3":
 * Returns: ["E92", "M3", "BMW E92", "BMW M3", "E92 M3", "BMW", "2013 BMW"]
 */
export function generateVehicleCompatibilityTags(
  vehicle: VehicleDetail,
): string[] {
  const tags: string[] = [];
  const chassis = vehicle.chassis.toUpperCase();
  const year = extractYearFromTitle(vehicle.listingTitle);
  const model = extractModelFromTitle(vehicle.listingTitle);

  // Core tags - highest priority
  tags.push(chassis); // "E92"

  if (model) {
    tags.push(model); // "M3"
    tags.push(`${chassis} ${model}`); // "E92 M3"
    tags.push(`BMW ${model}`); // "BMW M3"
  }

  tags.push(`BMW ${chassis}`); // "BMW E92"

  // Year-specific tags
  if (year) {
    tags.push(`${year} ${chassis}`); // "2013 E92"
    tags.push(`${year} BMW`); // "2013 BMW"
    if (model) {
      tags.push(`${year} ${model}`); // "2013 M3"
    }
  }

  // Generic BMW tag for universal parts
  tags.push("BMW");

  return tags;
}

/**
 * Model name to chassis code mapping for modern BMWs
 */
const MODEL_TO_CHASSIS_MAP: Record<string, string[]> = {
  // G-series (2018+)
  M2: ["G87"], // 2023+ M2
  M3: ["G80"], // 2021+ M3
  M4: ["G82"], // 2021+ M4 Coupe, G83 Convertible
  M5: ["F90"], // 2018+ M5
  M8: ["F91", "F92", "F93"], // M8 Gran Coupe, Coupe, Convertible
  "330i": ["G20"], // 3 Series sedan
  "340i": ["G20"],
  "M340i": ["G20"],
  "430i": ["G22"], // 4 Series coupe
  "440i": ["G22"],
  "M440i": ["G22"],
  // F-series (2011-2020)
  "335i": ["F30"], // 2012-2015 3 Series
  "340i-F30": ["F30"], // 2016-2019 (overlap with G20)
  M235i: ["F22"], // 2 Series
  M240i: ["F22"],
  "435i": ["F32"], // 4 Series
  "440i-F32": ["F32"],
  M3F80: ["F80"], // 2014-2020 M3
  M4F82: ["F82"], // 2014-2020 M4 Coupe
  // E-series (older)
  M5E39: ["E39"], // 2000-2003 M5
  M3E46: ["E46"], // 2001-2006 M3
  M3E90: ["E90"], // 2008-2013 M3 Sedan
  M3E92: ["E92"], // 2008-2013 M3 Coupe
};

/**
 * Extract chassis codes from product tags
 * Handles both explicit chassis codes (e.g., "BMW E46") and model names (e.g., "BMW M4 Base 2023")
 */
export function extractModelsFromTags(tags: string[]): string[] {
  const chassis = new Set<string>();

  tags.forEach((tag) => {
    // Try to extract explicit chassis code first (e.g., "BMW E46", "BMW G82")
    const fitment = parseFitmentTag(tag);
    if (fitment.model) {
      chassis.add(fitment.model);
      return;
    }

    // If no chassis code, try to extract model name and map to chassis
    // Examples: "BMW M4 Base 2023", "BMW M3 Competition 2021"
    const modelMatch = tag.match(
      /BMW\s+(M\d|[1-7]\d{2}[A-Za-z]{0,2}|X[1-7]|Z\d)/i,
    );
    if (modelMatch && modelMatch[1]) {
      const modelName = modelMatch[1].toUpperCase();

      // Look up chassis codes for this model
      const chassisCodes = MODEL_TO_CHASSIS_MAP[modelName];
      if (chassisCodes) {
        chassisCodes.forEach((code) => chassis.add(code));
      } else {
        // If not in map, try some default mappings based on generation detection
        // For M3/M4, detect generation by year if present
        const yearMatch = tag.match(/\b(20\d{2})\b/);
        if (yearMatch && yearMatch[1]) {
          const year = parseInt(yearMatch[1], 10);
          if (modelName === "M3") {
            if (year >= 2021) chassis.add("G80"); // G80 M3
            else if (year >= 2014) chassis.add("F80"); // F80 M3
            else if (year >= 2008) chassis.add("E90"); // E90/E92 M3
            else if (year >= 2001) chassis.add("E46"); // E46 M3
          } else if (modelName === "M4") {
            if (year >= 2021) chassis.add("G82"); // G82 M4
            else if (year >= 2014) chassis.add("F82"); // F82 M4
          } else if (modelName === "M5") {
            if (year >= 2018) chassis.add("F90"); // F90 M5
            else if (year >= 2011) chassis.add("F10"); // F10 M5
            else if (year >= 2005) chassis.add("E60"); // E60 M5
            else if (year >= 2000) chassis.add("E39"); // E39 M5
          }
        }
      }
    }
  });

  return Array.from(chassis);
}

/**
 * Shopify GraphQL query for products by tags
 */
const productsQuery = `
  query getProducts($query: String!) {
    products(first: 30, query: $query) {
      edges {
        node {
          id
          handle
          availableForSale
          title
          description
          descriptionHtml
          vendor
          productType
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          tags
          updatedAt
        }
      }
    }
  }
`;

/**
 * Get compatible parts recommendations for a vehicle
 *
 * Simple tag-based matching:
 * 1. Generates compatibility tags from vehicle CMS fields (chassis, model, year)
 * 2. Searches Shopify for products with ANY of these exact tags
 * 3. Returns matching products (max 6)
 *
 * Example: For "2013 BMW E92 M3", searches for products tagged with:
 * "E92", "M3", "BMW E92", "BMW M3", "E92 M3", etc.
 *
 * Users can tag Shopify products with simple tags like "E92" or "M3" and they'll match!
 * Uses 5-minute in-memory cache to reduce API calls
 */
export async function getCompatibleParts(
  vehicle: VehicleDetail,
): Promise<Product[]> {
  // Check cache first
  const cacheKey = `compatible-parts:${vehicle.slug.current}`;
  const cached = memoryCache.get<Product[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Generate compatibility tags from vehicle data
    const compatibilityTags = generateVehicleCompatibilityTags(vehicle);

    // Log for debugging
    console.log(
      `[Recommendations] Searching for ${vehicle.listingTitle}`,
      `\nGenerated tags:`,
      compatibilityTags,
    );

    // Build Shopify search query: search for products with ANY of these tags
    // Format: tag:E92 OR tag:M3 OR tag:"BMW E92" OR tag:"BMW M3" ...
    const tagQueries = compatibilityTags
      .map((tag) => {
        // Quote tags with spaces, leave single-word tags unquoted
        const quotedTag = tag.includes(" ") ? `"${tag}"` : tag;
        return `tag:${quotedTag}`;
      })
      .join(" OR ");

    const searchQuery = tagQueries;
    console.log(`[Recommendations] Shopify query:`, searchQuery);

    type ProductsQueryType = {
      data: {
        products: {
          edges: Array<{
            node: {
              id: string;
              handle: string;
              availableForSale: boolean;
              title: string;
              description: string;
              descriptionHtml: string;
              vendor: string;
              productType: string;
              priceRange: {
                maxVariantPrice: { amount: string; currencyCode: string };
                minVariantPrice: { amount: string; currencyCode: string };
              };
              featuredImage: {
                url: string;
                altText: string;
                width: number;
                height: number;
              };
              tags: string[];
              updatedAt: string;
            };
          }>;
        };
      };
      variables: { query: string };
    };

    const res = await shopifyFetch<ProductsQueryType>({
      query: productsQuery,
      variables: { query: searchQuery },
    });

    // Extract products from GraphQL response
    const rawProducts =
      res.body.data?.products?.edges?.map((edge) => edge.node) || [];

    // Transform to Product type with images array
    const products: Product[] = rawProducts
      .map((p) => ({
        id: p.id,
        handle: p.handle,
        availableForSale: p.availableForSale,
        title: p.title,
        description: p.description,
        descriptionHtml: p.descriptionHtml,
        vendor: p.vendor,
        productType: p.productType,
        options: [], // Not needed for recommendations
        priceRange: p.priceRange,
        variants: [], // Not needed for recommendations
        featuredImage: {
          url: p.featuredImage.url,
          altText: p.featuredImage.altText,
          width: p.featuredImage.width,
          height: p.featuredImage.height,
        },
        images: p.featuredImage
          ? [
              {
                url: p.featuredImage.url,
                altText: p.featuredImage.altText,
                width: p.featuredImage.width,
                height: p.featuredImage.height,
              },
            ]
          : [],
        seo: {
          title: p.title,
          description: p.description,
        },
        tags: p.tags,
        updatedAt: p.updatedAt,
      }))
      .slice(0, 6); // Limit to 6 products (already matched by tags)

    console.log(
      `[Recommendations] Found ${products.length} compatible products`,
    );

    // Cache the results for 5 minutes
    memoryCache.set(cacheKey, products, 300000);

    return products;
  } catch (error) {
    console.error("Error fetching compatible parts:", error);
    return [];
  }
}

/**
 * Get vehicles in stock that are compatible with a product
 * Queries Sanity for vehicles matching product fitment tags
 * Returns max 4 current-status vehicles sorted by newest first
 * Uses 5-minute in-memory cache to reduce API calls
 */
export async function getVehiclesWithPart(
  productHandle: string,
  productTags: string[],
): Promise<VehicleListItem[]> {
  // Check cache first
  const cacheKey = `vehicles-with-part:${productHandle}`;
  const cached = memoryCache.get<VehicleListItem[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Log for debugging
    console.log(
      `[Recommendations] Finding vehicles for product: ${productHandle}`,
    );
    console.log(`[Recommendations] Product tags:`, productTags);

    // Extract chassis models from product tags
    const models = extractModelsFromTags(productTags);

    console.log(`[Recommendations] Extracted chassis models:`, models);

    if (models.length === 0) {
      console.log(
        `[Recommendations] No chassis models found in tags, returning empty`,
      );
      return [];
    }

    // GROQ query to fetch vehicles with matching chassis
    const query = `
      *[_type == "vehicle" && chassis in $models && inventoryStatus == "Current Inventory"]
      | order(_createdAt desc) [0...4] {
        _id,
        listingTitle,
        slug,
        chassis,
        mileage,
        listingPrice,
        showCallForPrice,
        status,
        inventoryStatus,
        signatureShot,
        soldShot,
        _createdAt
      }
    `;

    console.log(`[Recommendations] GROQ query:`, query);
    console.log(`[Recommendations] Query params:`, { models });

    const vehicles = await client.fetch<VehicleListItem[]>(query, { models });

    console.log(
      `[Recommendations] Found ${vehicles.length} matching vehicles`,
    );

    // Cache the results for 5 minutes
    memoryCache.set(cacheKey, vehicles, 300000);

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles with part:", error);
    return [];
  }
}
