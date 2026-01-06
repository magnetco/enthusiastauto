"use client";

import { useState, useMemo } from "react";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { BlogGrid } from "./BlogGrid";
import { CategoryFilter } from "./CategoryFilter";
import type { PostListItem, PostCategory } from "@/lib/sanity/queries/posts";

interface BlogPageClientProps {
  featuredPosts: PostListItem[];
  allPosts: PostListItem[];
}

export function BlogPageClient({
  featuredPosts,
  allPosts,
}: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<PostCategory | "all">(
    "all"
  );

  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") {
      return allPosts;
    }
    return allPosts.filter((post) => post.category === activeCategory);
  }, [allPosts, activeCategory]);

  return (
    <>
      {/* Featured Stories Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-16 lg:mb-20">
          <TitleBlock
            title="Featured Stories"
            className="mb-8"
          />
          <FeaturedCarousel posts={featuredPosts} />
        </section>
      )}

      {/* All Stories Section */}
      <section>
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <TitleBlock title="All Stories" />
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <BlogGrid posts={filteredPosts} />

        {/* Load More - could be implemented with pagination */}
        {filteredPosts.length > 9 && (
          <div className="mt-12 flex justify-center">
            <button className="rounded-full border border-neutral-300 px-8 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
              View More Stories
            </button>
          </div>
        )}
      </section>
    </>
  );
}

