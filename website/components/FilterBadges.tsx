"use client";

import { useFilters } from "contexts/FilterContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        Active Filters:
      </span>

      {/* Search Badge */}
      {filters.searchTerm && filters.searchTerm.length >= 2 && (
        <Badge
          key="search-badge"
          variant="default"
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] h-7 flex items-center text-xs px-2"
          onClick={clearSearchTerm}
        >
          <span>Search: {filters.searchTerm}</span>
          <button
            className="ml-0.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-5 w-5 flex items-center justify-center"
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
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] h-7 flex items-center text-xs px-2"
          onClick={clearVehicle}
        >
          <span>
            Vehicle: {filters.vehicle.model} {filters.vehicle.year}
          </span>
          <button
            className="ml-0.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-5 w-5 flex items-center justify-center"
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
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] h-7 flex items-center text-xs px-2"
          onClick={() => toggleVendor(vendor)}
        >
          <span>Vendor: {vendor}</span>
          <button
            className="ml-0.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-5 w-5 flex items-center justify-center"
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
          className="group cursor-pointer gap-1 bg-[#529BCA] pr-1 hover:bg-[#4189B8] dark:bg-[#529BCA] dark:hover:bg-[#4189B8] h-7 flex items-center text-xs px-2"
          onClick={() => toggleCategory(category)}
        >
          <span>
            Category: {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <button
            className="ml-0.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-5 w-5 flex items-center justify-center"
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
        <Button
          variant="link"
          size="sm"
          onClick={clearFilters}
          className="ml-1 h-7 px-1.5 text-xs"
          aria-label="Clear all filters"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
