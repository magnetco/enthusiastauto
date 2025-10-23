import { client } from "@/sanity/lib/client";

/**
 * Vehicle list item type - subset of full Vehicle schema
 * Contains only fields needed for listing page display
 */
export interface VehicleListItem {
  _id: string;
  listingTitle: string;
  slug: { current: string };
  chassis: string;
  mileage: number;
  listingPrice?: number;
  showCallForPrice: boolean;
  status: "current" | "sold";
  inventoryStatus: "Current Inventory" | "Sold";
  signatureShot?: any; // Sanity image reference
  soldShot?: any; // Sanity image reference
  _createdAt: string;
}

/**
 * Filter parameters for vehicle queries
 */
export interface VehicleFilters {
  chassis?: string[];
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: "current" | "sold" | "all";
}

/**
 * Sort options for vehicle queries
 */
export type VehicleSort =
  | "price-asc"
  | "price-desc"
  | "year-asc"
  | "year-desc"
  | "mileage-asc"
  | "mileage-desc"
  | "recent";

/**
 * Fetches vehicles from Sanity with optional filtering and sorting
 * @param filters - Optional filter parameters
 * @param sort - Optional sort option
 * @returns Array of vehicle list items
 */
export async function getVehicles(
  filters?: VehicleFilters,
  sort: VehicleSort = "recent",
): Promise<VehicleListItem[]> {
  // Build filter conditions
  const conditions: string[] = ['_type == "vehicle"'];

  if (filters?.chassis && filters.chassis.length > 0) {
    conditions.push(`chassis in $chassis`);
  }

  // Note: Year filtering commented out until we add year field to schema
  // For now, year is part of listingTitle
  // if (filters?.yearMin !== undefined) {
  //   conditions.push(`year >= $yearMin`);
  // }

  // if (filters?.yearMax !== undefined) {
  //   conditions.push(`year <= $yearMax`);
  // }

  if (filters?.priceMin !== undefined) {
    conditions.push(`listingPrice >= $priceMin`);
  }

  if (filters?.priceMax !== undefined) {
    conditions.push(`listingPrice <= $priceMax`);
  }

  if (filters?.status && filters.status !== "all") {
    const statusValue =
      filters.status === "current" ? "Current Inventory" : "Sold";
    conditions.push(`inventoryStatus == $status`);
  }

  // Build sort clause
  let orderBy: string;
  switch (sort) {
    case "price-asc":
      orderBy = "listingPrice asc";
      break;
    case "price-desc":
      orderBy = "listingPrice desc";
      break;
    case "year-asc":
      orderBy = "listingTitle asc"; // Year is part of title
      break;
    case "year-desc":
      orderBy = "listingTitle desc";
      break;
    case "mileage-asc":
      orderBy = "mileage asc";
      break;
    case "mileage-desc":
      orderBy = "mileage desc";
      break;
    case "recent":
    default:
      orderBy = "_createdAt desc";
      break;
  }

  // Build GROQ query
  const whereClause = conditions.join(" && ");
  const query = `
    *[${whereClause}] | order(${orderBy}) {
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

  // Build params object
  const params: Record<string, unknown> = {};
  if (filters?.chassis) params.chassis = filters.chassis;
  if (filters?.yearMin !== undefined) params.yearMin = filters.yearMin;
  if (filters?.yearMax !== undefined) params.yearMax = filters.yearMax;
  if (filters?.priceMin !== undefined) params.priceMin = filters.priceMin;
  if (filters?.priceMax !== undefined) params.priceMax = filters.priceMax;
  if (filters?.status && filters.status !== "all") {
    params.status = filters.status === "current" ? "Current Inventory" : "Sold";
  }

  try {
    const vehicles = await client.fetch<VehicleListItem[]>(query, params);
    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

/**
 * Full vehicle detail type - complete Vehicle schema
 * Contains all fields for vehicle detail page display
 */
export interface VehicleDetail {
  _id: string;
  listingTitle: string;
  slug: { current: string };
  stockNumber: string;
  vin?: string;
  chassis: string;
  mileage: number;
  bodyStyle: string;
  drive: string;
  exteriorColor: string;
  interiorColor: string;
  listingPrice?: number;
  showCallForPrice: boolean;
  status: "current" | "sold";
  inventoryStatus: "Current Inventory" | "Sold";
  statusTag?: string;
  isLive: boolean;
  featuredVehicle: boolean;
  featuredInventory: boolean;
  sortOrder?: number;
  engineCodes: string;
  engineType: string;
  engineSize: string;
  transmission: string;
  signatureShot?: any;
  soldShot?: any;
  secondaryShot?: any;
  galleryExterior1?: any[];
  galleryExterior2?: any[];
  galleryExterior3?: any[];
  galleryInterior1?: any[];
  galleryInterior2?: any[];
  galleryImages?: any[]; // Combined gallery images from GROQ query
  listingThumbnailFeatures?: string[];
  highlights?: any[];
  overview?: any[];
  history?: string;
  featuredVehicleThumbnailText?: any[];
  _createdAt: string;
  _updatedAt?: string;
}

/**
 * GROQ query for fetching a single vehicle's complete details
 * Used by vehicle detail page at /vehicles/[slug]
 */
export const vehicleDetailQuery = `*[_type == "vehicle" && slug.current == $slug][0] {
  _id,
  listingTitle,
  slug,
  stockNumber,
  vin,
  chassis,
  mileage,
  bodyStyle,
  drive,
  exteriorColor,
  interiorColor,
  listingPrice,
  showCallForPrice,
  status,
  inventoryStatus,
  statusTag,
  isLive,
  featuredVehicle,
  featuredInventory,
  sortOrder,
  engineCodes,
  engineType,
  engineSize,
  transmission,
  signatureShot {
    asset-> {
      _id,
      url,
      metadata {
        lqip,
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    },
    alt
  },
  soldShot {
    asset-> {
      _id,
      url,
      metadata {
        lqip,
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    },
    alt
  },
  secondaryShot {
    asset-> {
      _id,
      url,
      metadata {
        lqip,
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    },
    alt
  },
  "galleryImages": [
    ...coalesce(galleryExterior1[], []),
    ...coalesce(galleryExterior2[], []),
    ...coalesce(galleryExterior3[], []),
    ...coalesce(galleryInterior1[], []),
    ...coalesce(galleryInterior2[], [])
  ] {
    asset-> {
      _id,
      url,
      metadata {
        lqip,
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    },
    alt,
    caption
  },
  listingThumbnailFeatures,
  highlights,
  overview,
  history,
  featuredVehicleThumbnailText,
  _createdAt,
  _updatedAt
}`;

/**
 * Fetches a single vehicle's complete details by slug
 * @param slug - Vehicle slug
 * @returns Vehicle detail object or null if not found
 */
export async function getVehicleDetail(
  slug: string,
): Promise<VehicleDetail | null> {
  try {
    const vehicle = await client.fetch<VehicleDetail>(vehicleDetailQuery, {
      slug,
    });
    return vehicle;
  } catch (error) {
    console.error("Error fetching vehicle detail:", error);
    return null;
  }
}

/**
 * Fetches slugs for top N current vehicles for static generation
 * @param limit - Number of vehicles to pre-render (default: 50)
 * @returns Array of slug objects
 */
export async function getVehicleSlugs(
  limit?: number,
): Promise<Array<{ slug: string; _updatedAt?: string }>> {
  const limitClause = limit ? `[0...${limit}]` : "";
  const query = `
    *[_type == "vehicle" && status == "current" && isLive == true] | order(_createdAt desc) ${limitClause} {
      "slug": slug.current,
      _updatedAt
    }
  `;

  try {
    const slugs = await client.fetch<
      Array<{ slug: string; _updatedAt?: string }>
    >(query);
    return slugs;
  } catch (error) {
    console.error("Error fetching vehicle slugs:", error);
    return [];
  }
}

/**
 * Fetches featured vehicles for homepage (excludes sold vehicles)
 * @param limit - Number of featured vehicles to fetch (default: 6)
 * @returns Array of vehicle list items
 */
export async function getFeaturedVehicles(
  limit = 6,
): Promise<VehicleListItem[]> {
  const query = `
    *[_type == "vehicle" && status == "current" && featuredVehicle == true && isLive == true] | order(sortOrder desc, _createdAt desc) [0...${limit}] {
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

  try {
    const vehicles = await client.fetch<VehicleListItem[]>(query);
    return vehicles;
  } catch (error) {
    console.error("Error fetching featured vehicles:", error);
    return [];
  }
}
