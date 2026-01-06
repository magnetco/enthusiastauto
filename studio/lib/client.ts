import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/**
 * Read-only Sanity client for server components
 * useCdn: false because ISR handles caching at Next.js level
 * perspective: 'published' to fetch only published documents
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // ISR handles caching at Next.js level (60s revalidation)
  perspective: "published",
});

/**
 * Authenticated Sanity client for webhook mutations
 * Used for on-demand revalidation and content updates
 */
export const authenticatedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "published",
});
