import { client } from "@/lib/sanity/client";

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
  signatureShot?: any; // Sanity image reference
  soldShot?: any; // Sanity image reference
  _createdAt: string;
  // Extended fields for list view
  vin?: string;
  transmission?: string;
  drive?: string;
  exteriorColor?: string;
  interiorColor?: string;
  engineType?: string;
  engineSize?: string;
  listingThumbnailFeatures?: string[];
  statusTag?: string;
  featuredVehicle?: boolean;
  galleryImages?: any[]; // For quick gallery view
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
    if (filters.status === "current") {
      // Treat null status as "current" (not sold)
      conditions.push(`(status == "current" || !defined(status) || status == null)`);
    } else {
      conditions.push(`status == $status`);
    }
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
      signatureShot,
      soldShot,
      _createdAt,
      vin,
      transmission,
      drive,
      exteriorColor,
      interiorColor,
      engineType,
      engineSize,
      listingThumbnailFeatures,
      statusTag,
      featuredVehicle,
      "galleryImages": [
        ...coalesce(galleryExterior1[], []),
        ...coalesce(galleryExterior2[], []),
        ...coalesce(galleryExterior3[], []),
        ...coalesce(galleryInterior1[], []),
        ...coalesce(galleryInterior2[], [])
      ][0...8]
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
    params.status = filters.status;
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
  documentation?: Array<{
    type: string;
    image?: {
      asset: {
        url: string;
        _id: string;
      };
    };
    file?: {
      asset: {
        url: string;
        _id: string;
      };
    };
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
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
  documentation[] {
    type,
    image {
      asset-> {
        _id,
        url
      }
    },
    file {
      asset-> {
        _id,
        url
      }
    }
  },
  faqs[] {
    question,
    answer
  },
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
    *[_type == "vehicle" && (status == "current" || !defined(status) || status == null) && status != "sold" && isLive == true] | order(_createdAt desc) ${limitClause} {
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
    *[_type == "vehicle" && (status == "current" || !defined(status) || status == null) && status != "sold" && featuredVehicle == true && isLive == true] | order(sortOrder desc, _createdAt desc) [0...${limit}] {
      _id,
      listingTitle,
      slug,
      chassis,
      mileage,
      listingPrice,
      showCallForPrice,
      status,
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

/**
 * Fetches similar vehicles based on chassis code
 * Excludes the current vehicle and sold vehicles
 * @param chassis - Chassis code to match
 * @param currentSlug - Current vehicle slug to exclude
 * @param limit - Number of similar vehicles to fetch (default: 6)
 * @returns Array of vehicle list items
 */
export async function getSimilarVehicles(
  chassis: string,
  currentSlug: string,
  limit = 6,
): Promise<VehicleListItem[]> {
  const query = `
    *[_type == "vehicle" && chassis == $chassis && slug.current != $currentSlug && (status == "current" || !defined(status) || status == null) && status != "sold" && isLive == true] | order(_createdAt desc) [0...${limit}] {
      _id,
      listingTitle,
      slug,
      chassis,
      mileage,
      listingPrice,
      showCallForPrice,
      status,
      signatureShot,
      soldShot,
      exteriorColor,
      interiorColor,
      _createdAt
    }
  `;

  try {
    const vehicles = await client.fetch<VehicleListItem[]>(query, {
      chassis,
      currentSlug,
    });
    return vehicles;
  } catch (error) {
    console.error("Error fetching similar vehicles:", error);
    return [];
  }
}

/**
 * Fetches global FAQs (placeholder - would need a global FAQ schema)
 * For now, returns empty array
 * @returns Array of FAQ objects
 */
export async function getGlobalFAQs(): Promise<
  Array<{ question: string; answer: string }>
> {
  // TODO: Create a global FAQ schema in Sanity
  // For now, return empty array
  return [];
}
