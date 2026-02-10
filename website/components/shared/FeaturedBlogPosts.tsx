"use client";

import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlogCard } from "@/components/blog/BlogGrid";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { useState, useRef, useEffect } from "react";
import type { Post } from "@/lib/sanity/queries/posts";

interface FeaturedBlogPostsProps {
  posts: Post[];
}

export function FeaturedBlogPosts({ posts }: FeaturedBlogPostsProps) {
  const featuredPosts = posts.slice(0, 3);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const rafRef = useRef<number>();

  // If no blog posts, don't render section
  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  };

  const handleMouseEnter = () => {
    setIsSectionHovered(true);
  };

  const handleMouseLeave = () => {
    setIsSectionHovered(false);
    setMousePosition(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  return (
    <section
      className="relative bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-blog-heading"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <TitleBlock
            title="Latest Stories"
            description="Stay updated with the latest news, events, and insights from Enthusiast Auto Group."
            id="featured-blog-heading"
            action={
              <ShimmerButton
                href="/blog"
                aria-label="View all stories"
                size="lg"
                variant="tertiary"
                mousePosition={mousePosition}
                isHeroHovered={isSectionHovered}
              >
                View all stories
              </ShimmerButton>
            }
          />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>

        {/* Browse All CTA - Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <ShimmerButton
            href="/blog"
            aria-label="View all stories"
            size="lg"
            variant="tertiary"
            mousePosition={mousePosition}
            isHeroHovered={isSectionHovered}
            className="w-full"
          >
            View all stories
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
