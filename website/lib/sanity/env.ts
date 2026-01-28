/**
 * Sanity environment configuration for the website
 * Read-only client configuration for data fetching
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-21";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

