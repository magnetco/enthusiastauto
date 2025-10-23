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
 * Rank product relevance for a given vehicle
 * Higher score = better match
 */
function rankProductForVehicle(
  product: Product,
  vehicle: VehicleDetail,
): number {
  const vehicleYear = extractYearFromTitle(vehicle.listingTitle);
  const vehicleChassis = vehicle.chassis.toUpperCase();

  let score = 0;

  product.tags.forEach((tag) => {
    const fitment = parseFitmentTag(tag);

    // Universal fit products get base score
    if (fitment.isUniversal) {
      score = Math.max(score, 1);
      return;
    }

    // Model match
    if (fitment.model && fitment.model === vehicleChassis) {
      // Exact year match
      if (
        vehicleYear &&
        fitment.yearMin &&
        fitment.yearMax &&
        vehicleYear >= fitment.yearMin &&
        vehicleYear <= fitment.yearMax
      ) {
        score = Math.max(score, 10); // Exact model + year range match
      } else if (vehicleYear && fitment.yearMin === vehicleYear) {
        score = Math.max(score, 10); // Exact model + specific year match
      } else {
        score = Math.max(score, 5); // Model-only match
      }
    }
  });

  return score;
}

/**
 * Shopify GraphQL query for products by tags
 */
const productsQuery = `
  query getProducts($query: String!) {
    products(first: 20, query: $query) {
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
 * Queries Shopify for products matching vehicle chassis and year
 * Returns max 6 products ranked by fitment relevance
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
    const vehicleChassis = vehicle.chassis.toUpperCase();

    // Build Shopify query to search products with chassis tag
    // Query format: "tag:BMW E46" OR "tag:BMW Universal"
    const searchQuery = `tag:BMW ${vehicleChassis} OR tag:BMW Universal`;

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
    const products: Product[] = rawProducts.map((p) => ({
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
    }));

    // Rank products by relevance
    const rankedProducts = products
      .map((product) => ({
        product,
        score: rankProductForVehicle(product, vehicle),
      }))
      .filter((item) => item.score > 0) // Only include matches
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 6) // Limit to 6 products
      .map((item) => item.product);

    // Cache the results for 5 minutes
    memoryCache.set(cacheKey, rankedProducts, 300000);

    return rankedProducts;
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
