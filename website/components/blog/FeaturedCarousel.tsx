"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { PostListItem } from "@/lib/sanity/queries/posts";
import { categoryLabels } from "@/lib/sanity/queries/posts";
import { urlFor } from "@/lib/sanity/image";

interface FeaturedCarouselProps {
  posts: PostListItem[];
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

export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts.length) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const currentPost = posts[currentIndex];

  const formattedDate = new Date(currentPost.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Use urlFor only for valid Sanity assets, otherwise use the direct URL
  const imageUrl = currentPost.mainImage?.asset?.url
    ? isSanityAsset(currentPost.mainImage?.asset)
      ? urlFor(currentPost.mainImage).width(1200).height(600).url()
      : currentPost.mainImage.asset.url
    : null;

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl bg-neutral-900">
        <Link href={`/blog/${currentPost.slug}`} className="group block">
          {/* Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={currentPost.mainImage?.alt || currentPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-800" />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
            <div className="max-w-3xl">
              {/* Meta */}
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="rounded bg-white/20 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                  {categoryLabels[currentPost.category]}
                </span>
                <span>{formattedDate}</span>
                {currentPost.location && (
                  <>
                    <span className="text-white/40">•</span>
                    <span>{currentPost.location}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-white/90 sm:text-3xl lg:text-4xl">
                {currentPost.title}
              </h3>

              {/* Excerpt */}
              <p className="line-clamp-2 text-base text-white/70 sm:text-lg">
                {currentPost.excerpt}
              </p>

              {/* Read More */}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-4 group-hover:underline">
                Read More
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      {posts.length > 1 && (
        <>
          {/* Arrows */}
          <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
            <button
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 sm:bottom-6 sm:right-6">
            <span className="mr-2 text-sm font-medium text-white/70">
              {currentIndex + 1} / {posts.length}
            </span>
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

