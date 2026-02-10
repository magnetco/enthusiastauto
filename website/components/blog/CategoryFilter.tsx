"use client";

import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/sanity/queries/posts";

interface CategoryFilterProps {
  activeCategory: PostCategory | "all";
  onCategoryChange: (category: PostCategory | "all") => void;
}

const categories: Array<{ value: PostCategory | "all"; label: string }> = [
  { value: "all", label: "View all" },
  { value: "events", label: "Events" },
  { value: "around-the-shop", label: "Around The Shop" },
  { value: "videos", label: "Videos" },
];

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            activeCategory === category.value
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

