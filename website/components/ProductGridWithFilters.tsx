"use client";

import { useFilters } from "contexts/FilterContext";
import { useDebounce } from "lib/hooks/useDebounce";
import { Product } from "lib/shopify/types";
import {
  extractCategoryOptions,
  extractVendorOptions,
  filterProducts,
} from "lib/utils/filters";
import { useMemo } from "react";
import { FilterBadges } from "./FilterBadges";
import { FilterPanel } from "./FilterPanel";
import { FilterDrawer } from "./layout/filter-drawer";
import { ProductGrid, ProductGridEmpty } from "./product-grid";

interface ProductGridWithFiltersProps {
  products: Product[];
  showFilters?: boolean;
}

export function ProductGridWithFilters({
  products,
  showFilters = true,
}: ProductGridWithFiltersProps) {
  const filterContext = useFilters();

  // Fallback if no FilterContext (shouldn't happen, but be safe)
  const filters = filterContext?.filters || {
    vendors: [],
    categories: [],
    vehicle: null,
    searchTerm: "",
  };

  // Debounce the search term for performance (300ms delay)
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Track when debouncing is in progress
  const isSearchDebouncing =
    filters.searchTerm !== debouncedSearchTerm &&
    filters.searchTerm.length >= 2;

  // Extract filter options from all products
  const vendorOptions = useMemo(
    () => extractVendorOptions(products),
    [products],
  );
  const categoryOptions = useMemo(
    () => extractCategoryOptions(products),
    [products],
  );

  // Apply filters to products with debounced search term
  const filteredProducts = useMemo(() => {
    const filtersWithDebouncedSearch = {
      ...filters,
      searchTerm: debouncedSearchTerm,
    };
    return filterProducts(products, filtersWithDebouncedSearch);
  }, [products, filters, debouncedSearchTerm]);

  const totalProducts = products.length;
  const filteredCount = filteredProducts.length;
  const hasActiveFilters =
    filters.vendors.length > 0 ||
    filters.categories.length > 0 ||
    filters.vehicle !== null ||
    (filters.searchTerm && filters.searchTerm.length >= 2);

  const activeFilterCount =
    filters.vendors.length +
    filters.categories.length +
    (filters.vehicle ? 1 : 0) +
    (filters.searchTerm && filters.searchTerm.length >= 2 ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-5">
      {/* Filter Panel - Desktop Sidebar (hidden on mobile) */}
      {showFilters &&
        (vendorOptions.length > 0 || categoryOptions.length > 0) && (
          <aside className="hidden w-[260px] flex-none md:block">
            <div className="sticky top-3">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide normal-case text-muted-foreground">Filters</h2>
              <FilterPanel
                vendorOptions={vendorOptions}
                categoryOptions={categoryOptions}
                products={products}
              />
            </div>
          </aside>
        )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Row - Product Count aligned with FILTERS */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
            {hasActiveFilters ? (
              <p>
                Showing {filteredCount} of {totalProducts}{" "}
                {totalProducts === 1 ? "product" : "products"}
              </p>
            ) : (
              <p>
                {totalProducts} {totalProducts === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          {/* Mobile Filter Drawer Button - Top Right */}
          {showFilters &&
            (vendorOptions.length > 0 || categoryOptions.length > 0) && (
              <div className="md:hidden">
                <FilterDrawer
                  vendorOptions={vendorOptions}
                  categoryOptions={categoryOptions}
                  products={products}
                />
              </div>
            )}
        </div>

        {/* Second Row - Active Filter Badges (only if there are active filters) */}
        {hasActiveFilters && (
          <div className="mb-3">
            <FilterBadges />
          </div>
        )}

        {/* Search Debouncing Indicator */}
        {isSearchDebouncing && (
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <svg
                className="h-3 w-3 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : hasActiveFilters ? (
          <EmptyState
            searchTerm={filters.searchTerm}
            activeFilterCount={activeFilterCount}
          />
        ) : (
          <ProductGridEmpty />
        )}
      </div>
    </div>
  );
}

function EmptyState({
  searchTerm,
  activeFilterCount,
}: {
  searchTerm: string;
  activeFilterCount: number;
}) {
  const filterContext = useFilters();

  // Fallback handlers if no FilterContext
  const clearFilters = filterContext?.clearFilters || (() => {});
  const clearSearchTerm = filterContext?.clearSearchTerm || (() => {});

  // Determine the appropriate message based on active filters
  const getMessage = () => {
    if (searchTerm && searchTerm.length >= 2 && activeFilterCount > 1) {
      return `No products match your search and filters`;
    }
    if (searchTerm && searchTerm.length >= 2) {
      return `No products match "${searchTerm}"`;
    }
    return "No products match your filters";
  };

  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/5">
      <svg
        className="mb-3 h-10 w-10 text-muted-foreground/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="mb-1.5 text-sm font-medium text-foreground">
        No products found
      </h3>
      <p className="mb-4 text-center text-xs text-muted-foreground">
        {getMessage()}
      </p>

      {/* Helpful suggestions */}
      <div className="flex flex-col items-center gap-2 text-xs">
        <p className="text-muted-foreground/70">
          {activeFilterCount > 0 &&
            `${activeFilterCount} active filter${activeFilterCount > 1 ? "s" : ""}`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {searchTerm && searchTerm.length >= 2 && (
            <button
              onClick={clearSearchTerm}
              className="text-[#529BCA] hover:underline dark:text-[#529BCA]"
            >
              Clear search
            </button>
          )}
          {activeFilterCount > 0 && (
            <>
              {searchTerm && searchTerm.length >= 2 && (
                <span className="text-neutral-400">•</span>
              )}
              <button
                onClick={clearFilters}
                className="text-[#529BCA] hover:underline dark:text-[#529BCA]"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
