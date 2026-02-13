import { client } from "../client";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Blog post category types
 */
export type PostCategory = "events" | "around-the-shop" | "videos";

/**
 * Blog post list item - minimal data for grid display
 */
export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: PostCategory;
  publishedAt: string;
  location?: string;
  featured: boolean;
  mainImage?: {
    asset?: {
      _ref: string;
      url: string;
    };
    alt?: string;
  };
}

/**
 * Full blog post detail with body content
 */
export interface PostDetail extends PostListItem {
  body: PortableTextBlock[]; // Portable Text blocks
}

/**
 * Category labels for display
 */
export const categoryLabels: Record<PostCategory, string> = {
  events: "Events",
  "around-the-shop": "Around The Shop",
  videos: "Videos",
};

/**
 * Fetches all blog posts, optionally filtered by category
 * @param category - Optional category filter
 * @returns Array of post list items
 */
export async function getPosts(category?: PostCategory): Promise<PostListItem[]> {
  const categoryFilter = category ? ` && category == "${category}"` : "";
  
  const query = `
    *[_type == "post"${categoryFilter}] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      category,
      publishedAt,
      location,
      featured,
      mainImage {
        "asset": {
          "_ref": asset._ref,
          "url": asset->url
        },
        alt
      }
    }
  `;

  try {
    const posts = await client.fetch<PostListItem[]>(query);
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * Fetches featured blog posts for the featured carousel
 * @param limit - Maximum number of featured posts to return
 * @returns Array of featured post list items
 */
export async function getFeaturedPosts(limit = 5): Promise<PostListItem[]> {
  const query = `
    *[_type == "post" && featured == true] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      category,
      publishedAt,
      location,
      featured,
      mainImage {
        "asset": {
          "_ref": asset._ref,
          "url": asset->url
        },
        alt
      }
    }
  `;

  try {
    const posts = await client.fetch<PostListItem[]>(query);
    return posts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

/**
 * Fetches a single blog post by slug
 * @param slug - The post slug
 * @returns Post detail or null if not found
 */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      category,
      publishedAt,
      location,
      featured,
      mainImage {
        "asset": {
          "_ref": asset._ref,
          "url": asset->url
        },
        alt
      },
      body
    }
  `;

  try {
    const post = await client.fetch<PostDetail | null>(query, { slug });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

/**
 * Fetches all post slugs for static generation
 * @returns Array of slug objects
 */
export async function getPostSlugs(): Promise<Array<{ slug: string }>> {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      "slug": slug.current
    }
  `;

  try {
    const slugs = await client.fetch<Array<{ slug: string }>>(query);
    return slugs;
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

/**
 * Fetches related posts (same category, excluding current post)
 * @param category - The category to match
 * @param excludeSlug - Slug of current post to exclude
 * @param limit - Maximum number of related posts
 * @returns Array of related post list items
 */
export async function getRelatedPosts(
  category: PostCategory,
  excludeSlug: string,
  limit = 3
): Promise<PostListItem[]> {
  const query = `
    *[_type == "post" && category == $category && slug.current != $excludeSlug] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      category,
      publishedAt,
      location,
      featured,
      mainImage {
        "asset": {
          "_ref": asset._ref,
          "url": asset->url
        },
        alt
      }
    }
  `;

  try {
    const posts = await client.fetch<PostListItem[]>(query, { category, excludeSlug });
    return posts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

