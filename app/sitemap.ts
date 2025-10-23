import { getCollections, getPages, getProducts } from "lib/shopify";
import { getVehicleSlugs } from "@/lib/sanity/queries/vehicles";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  // Static routes with priorities
  const staticRoutes: Route[] = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.9, // Vehicle listing - high priority
    },
    {
      url: `${baseUrl}/parts`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9, // Parts listing - high priority
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.8, // Search page
    },
  ];

  // Fetch vehicle slugs from Sanity CMS
  const vehiclesPromise = getVehicleSlugs().then((vehicles) =>
    vehicles.map((vehicle) => ({
      url: `${baseUrl}/vehicles/${vehicle.slug}`,
      lastModified: vehicle._updatedAt || new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.7, // Vehicle detail pages
    })),
  );

  // Fetch Shopify collections
  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  // Fetch Shopify products
  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7, // Product detail pages
    })),
  );

  // Fetch Shopify pages
  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([
        vehiclesPromise,
        collectionsPromise,
        productsPromise,
        pagesPromise,
      ])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...staticRoutes, ...fetchedRoutes];
}
