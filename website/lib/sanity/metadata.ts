/**
 * Metadata generation utilities for Sanity CMS pages
 * Generates Next.js Metadata objects from Sanity page data
 */

import type { Metadata } from "next";
import type { Page } from "./queries/pages";

/**
 * Generate Next.js metadata from Sanity page data
 */
export function generatePageMetadata(page: Page): Metadata {
  const { seo } = page;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      siteName: "Enthusiast Auto",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: {
      index: !seo.noIndex,
      follow: !seo.noIndex,
      googleBot: {
        index: !seo.noIndex,
        follow: !seo.noIndex,
      },
    },
  };
}

/**
 * Generate metadata with fallback for missing pages
 */
export function generatePageMetadataWithFallback(
  page: Page | null,
  fallbackTitle: string,
  fallbackDescription: string
): Metadata {
  if (!page) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        type: "website",
        title: fallbackTitle,
        description: fallbackDescription,
        siteName: "Enthusiast Auto",
      },
    };
  }

  return generatePageMetadata(page);
}
