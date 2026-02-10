"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PostListItem } from "@/lib/sanity/queries/posts";
import { categoryLabels } from "@/lib/sanity/queries/posts";
import { urlFor } from "@/lib/sanity/image";

interface BlogGridProps {
  posts: PostListItem[];
  columns?: 2 | 3;
}

/**
 * Check if the image asset is a valid Sanity asset reference (has proper _ref format)
 * vs a placeholder image that has a direct URL
 */
function isSanityAsset(asset: { _ref: string; url: string } | undefined): boolean {
  if (!asset) return false;
  // Sanity refs start with "image-" and have a specific format like "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg"
  return asset._ref?.startsWith("image-") && asset._ref.includes("-") && asset._ref.split("-").length >= 3;
}

export function BlogGrid({ posts, columns = 3 }: BlogGridProps) {
  if (!posts.length) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No stories found.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:gap-8",
        columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {posts.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}

function BlogCard({ post }: { post: PostListItem }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use urlFor only for valid Sanity assets, otherwise use the direct URL
  const imageUrl = post.mainImage?.asset?.url
    ? isSanityAsset(post.mainImage?.asset)
      ? urlFor(post.mainImage).width(600).height(400).url()
      : post.mainImage.asset.url
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 hover:border-muted-foreground hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
          {/* Category Badge */}
          <span className="absolute left-3 top-3 rounded bg-background/90 px-2 py-1 text-xs font-medium uppercase tracking-wider text-foreground backdrop-blur-sm">
            {categoryLabels[post.category]}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Meta */}
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            {post.location && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span>{post.location}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Read Link */}
          <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            Read Story
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

export { BlogCard };
