"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";

interface PartsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

/**
 * Desktop mega-menu for Parts navigation
 * Full-width dropdown with brands (vendors) and tags
 */
export function PartsMegaMenu({
  isOpen,
  onClose,
  products,
}: PartsMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Extract unique brands (vendors) from products
  const brands = Array.from(
    new Set(products.map((p) => p.vendor).filter(Boolean))
  ).sort();

  // Extract unique tags from products (excluding hidden tags)
  const allTags = products.flatMap((p) => p.tags || []);
  const tags = Array.from(
    new Set(
      allTags.filter(
        (tag) =>
          tag &&
          !tag.toLowerCase().startsWith("hidden") &&
          !tag.toLowerCase().startsWith("nextjs-frontend")
      )
    )
  ).sort();

  // Split brands into columns (max 12 per column)
  const brandsPerColumn = 12;
  const brandColumns: string[][] = [];
  for (let i = 0; i < brands.length; i += brandsPerColumn) {
    brandColumns.push(brands.slice(i, i + brandsPerColumn));
  }

  // Split tags into columns (max 12 per column)
  const tagsPerColumn = 12;
  const tagColumns: string[][] = [];
  for (let i = 0; i < tags.length; i += tagsPerColumn) {
    tagColumns.push(tags.slice(i, i + tagsPerColumn));
  }

  return (
    <div
      ref={menuRef}
      onMouseLeave={onClose}
      className={cn(
        "fixed left-0 right-0 top-[var(--header-height)] z-50 transition-all duration-200",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0 pointer-events-none"
      )}
    >
      {/* Full-width background */}
      <div className="w-full border-y border-white/10 bg-[#0a0c10] shadow-2xl">
        {/* Content container - aligned with header */}
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex py-6">
            {/* Left column: Quick links */}
            <div className="w-56 shrink-0 border-r border-white/10 pr-6">
              <button
                onClick={onClose}
                className="mb-6 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Close
              </button>

              <div className="h-px bg-white/10 mb-4" />

              <nav className="space-y-1">
                <Link
                  href="/parts"
                  onClick={onClose}
                  className="block py-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  All Parts
                </Link>
                <Link
                  href="/merchandise"
                  onClick={onClose}
                  className="block py-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  Merchandise
                </Link>
              </nav>
            </div>

            {/* Right section: Brands and Tags */}
            <div className="flex-1 pl-12">
              <div className="grid grid-cols-2 gap-12">
                {/* Brands Section */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
                    Brands
                  </h3>
                  <div className="flex gap-8">
                    {brandColumns.map((column, columnIndex) => (
                      <div key={columnIndex} className="flex flex-col gap-2">
                        {column.map((brand) => (
                          <Link
                            key={brand}
                            href={`/parts?vendor=${encodeURIComponent(brand)}`}
                            onClick={onClose}
                            className="block py-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">
                    Categories
                  </h3>
                  <div className="flex gap-8">
                    {tagColumns.map((column, columnIndex) => (
                      <div key={columnIndex} className="flex flex-col gap-2">
                        {column.map((tag) => (
                          <Link
                            key={tag}
                            href={`/parts?q=${encodeURIComponent(tag)}`}
                            onClick={onClose}
                            className="block py-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
