/**
 * Sanity queries for Page content type
 * Fetches static page content including hero, SEO, and sections
 */

import { client } from "../client";

export interface PageSEO {
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string[];
  noIndex: boolean;
}

export interface PageHero {
  enabled: boolean;
  size: "small" | "medium" | "large" | "full";
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundImageUrl?: string;
  overlay: number;
  ctas?: Array<{
    label: string;
    href: string;
    variant: "primary" | "outline" | "ghost";
  }>;
}

export interface PageSection {
  sectionId: string;
  component: string;
  prompt: string;
  enabled: boolean;
  backgroundColor: "white" | "neutral-50" | "dark-blue-primary" | "navy-primary" | "navy-secondary";
  paddingY: "none" | "small" | "medium" | "large";
  sortOrder: number;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  pageType: string;
  seo: PageSEO;
  hero?: PageHero;
  sections?: PageSection[];
  structuredData?: string;
  isPublished: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  return await client.fetch(
    `*[_type == "page" && slug.current == $slug && isPublished == true][0] {
      _id,
      title,
      "slug": slug.current,
      pageType,
      seo {
        metaTitle,
        metaDescription,
        ogTitle,
        ogDescription,
        "ogImage": ogImage.asset->url,
        keywords,
        noIndex
      },
      hero {
        enabled,
        size,
        eyebrow,
        title,
        titleHighlight,
        subtitle,
        "backgroundImage": backgroundImage.asset->url,
        backgroundImageUrl,
        overlay,
        ctas[] {
          label,
          href,
          variant
        }
      },
      sections[] {
        sectionId,
        component,
        prompt,
        enabled,
        backgroundColor,
        paddingY,
        sortOrder
      } | order(sortOrder asc),
      structuredData,
      isPublished,
      publishedAt,
      updatedAt
    }`,
    { slug }
  );
}

/**
 * Fetch all published pages (for sitemap generation)
 */
export async function getAllPages(): Promise<Array<{ slug: string; updatedAt: string }>> {
  return await client.fetch(
    `*[_type == "page" && isPublished == true] {
      "slug": slug.current,
      updatedAt
    } | order(updatedAt desc)`
  );
}

/**
 * Fetch page by type (useful for getting homepage, about, etc.)
 */
export async function getPageByType(pageType: string): Promise<Page | null> {
  return await client.fetch(
    `*[_type == "page" && pageType == $pageType && isPublished == true][0] {
      _id,
      title,
      "slug": slug.current,
      pageType,
      seo {
        metaTitle,
        metaDescription,
        ogTitle,
        ogDescription,
        "ogImage": ogImage.asset->url,
        keywords,
        noIndex
      },
      hero {
        enabled,
        size,
        eyebrow,
        title,
        titleHighlight,
        subtitle,
        "backgroundImage": backgroundImage.asset->url,
        backgroundImageUrl,
        overlay,
        ctas[] {
          label,
          href,
          variant
        }
      },
      sections[] {
        sectionId,
        component,
        prompt,
        enabled,
        backgroundColor,
        paddingY,
        sortOrder
      } | order(sortOrder asc),
      structuredData,
      isPublished,
      publishedAt,
      updatedAt
    }`,
    { pageType }
  );
}

/**
 * Get all page slugs for static generation
 */
export async function getPageSlugs(): Promise<string[]> {
  const pages = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "page" && isPublished == true] {
      "slug": slug.current
    }`
  );

  return pages.map((page) => page.slug);
}
