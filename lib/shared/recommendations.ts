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
 * Extract unique models from product tags array
 * Returns array of chassis codes (e.g., ["E46", "E90"])
 */
export function extractModelsFromTags(tags: string[]): string[] {
  const models = new Set<string>();

  tags.forEach((tag) => {
    const fitment = parseFitmentTag(tag);
    if (fitment.model) {
      models.add(fitment.model);
    }
  });

  return Array.from(models);
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
    // Extract chassis models from product tags
    const models = extractModelsFromTags(productTags);

    if (models.length === 0) {
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

    const vehicles = await client.fetch<VehicleListItem[]>(query, { models });

    // Cache the results for 5 minutes
    memoryCache.set(cacheKey, vehicles, 300000);

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles with part:", error);
    return [];
  }
}
