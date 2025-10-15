"use client";

import { useFilters } from "contexts/FilterContext";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

export function FilterBadges() {
  const { filters, toggleVendor, toggleCategory, clearFilters } = useFilters();

  const hasActiveFilters =
    filters.vendors.length > 0 || filters.categories.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Active Filters:
      </span>

      {/* Vendor Badges */}
      {filters.vendors.map((vendor) => (
        <Badge
          key={`vendor-${vendor}`}
          variant="default"
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8]"
          onClick={() => toggleVendor(vendor)}
        >
          <span>Vendor: {vendor}</span>
          <button
            className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Remove ${vendor} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Category Badges */}
      {filters.categories.map((category) => (
        <Badge
          key={`category-${category}`}
          variant="default"
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8]"
          onClick={() => toggleCategory(category)}
        >
          <span>
            Category: {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <button
            className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Remove ${category} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Clear All Link */}
      {(filters.vendors.length > 1 ||
        filters.categories.length > 1 ||
        (filters.vendors.length > 0 && filters.categories.length > 0)) && (
        <button
          onClick={clearFilters}
          className="ml-2 text-sm font-medium text-[#529BCA] hover:underline dark:text-[#529BCA]"
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
