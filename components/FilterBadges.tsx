"use client";

import { useFilters } from "contexts/FilterContext";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

export function FilterBadges() {
  const filterContext = useFilters();

  // If no FilterContext, don't render (e.g., outside FilterProvider)
  if (!filterContext) return null;

  const {
    filters,
    toggleVendor,
    toggleCategory,
    clearVehicle,
    clearSearchTerm,
    clearFilters,
  } = filterContext;

  const hasActiveFilters =
    filters.vendors.length > 0 ||
    filters.categories.length > 0 ||
    filters.vehicle !== null ||
    (filters.searchTerm && filters.searchTerm.length >= 2);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Active Filters:
      </span>

      {/* Search Badge */}
      {filters.searchTerm && filters.searchTerm.length >= 2 && (
        <Badge
          key="search-badge"
          variant="default"
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] min-h-[36px] flex items-center"
          onClick={clearSearchTerm}
        >
          <span>Search: {filters.searchTerm}</span>
          <button
            className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[24px] min-w-[24px] flex items-center justify-center"
            aria-label="Clear search term"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {/* Vehicle Badge */}
      {filters.vehicle && (
        <Badge
          key="vehicle-badge"
          variant="default"
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] min-h-[36px] flex items-center"
          onClick={clearVehicle}
        >
          <span>
            Vehicle: {filters.vehicle.model} {filters.vehicle.year}
          </span>
          <button
            className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[24px] min-w-[24px] flex items-center justify-center"
            aria-label="Remove vehicle filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {/* Vendor Badges */}
      {filters.vendors.map((vendor) => (
        <Badge
          key={`vendor-${vendor}`}
          variant="default"
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] min-h-[36px] flex items-center"
          onClick={() => toggleVendor(vendor)}
        >
          <span>Vendor: {vendor}</span>
          <button
            className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[24px] min-w-[24px] flex items-center justify-center"
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
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] min-h-[36px] flex items-center"
          onClick={() => toggleCategory(category)}
        >
          <span>
            Category: {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <button
            className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[24px] min-w-[24px] flex items-center justify-center"
            aria-label={`Remove ${category} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Clear All Link */}
      {(filters.vendors.length > 1 ||
        filters.categories.length > 1 ||
        filters.vehicle !== null ||
        (filters.searchTerm && filters.searchTerm.length >= 2) ||
        (filters.vendors.length > 0 && filters.categories.length > 0)) && (
        <button
          onClick={clearFilters}
          className="ml-2 text-sm font-medium text-[#529BCA] hover:underline dark:text-[#529BCA] min-h-[36px] px-2"
          aria-label="Clear all filters"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
