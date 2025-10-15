"use client";

import { useFilters } from "contexts/FilterContext";
import { Product } from "lib/shopify/types";
import {
  extractCategoryOptions,
  extractVendorOptions,
  filterProducts,
} from "lib/utils/filters";
import { useMemo } from "react";
import { FilterBadges } from "./FilterBadges";
import { FilterPanel } from "./FilterPanel";
import { ProductGrid, ProductGridEmpty } from "./product-grid";

interface ProductGridWithFiltersProps {
  products: Product[];
  showFilters?: boolean;
}

export function ProductGridWithFilters({
  products,
  showFilters = true,
}: ProductGridWithFiltersProps) {
  const { filters } = useFilters();

  // Extract filter options from all products
  const vendorOptions = useMemo(
    () => extractVendorOptions(products),
    [products],
  );
  const categoryOptions = useMemo(
    () => extractCategoryOptions(products),
    [products],
  );

  // Apply filters to products
  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  );

  const totalProducts = products.length;
  const filteredCount = filteredProducts.length;
  const hasActiveFilters =
    filters.vendors.length > 0 || filters.categories.length > 0;

  return (
    <div className="flex gap-6">
      {/* Filter Panel - Desktop Sidebar */}
      {showFilters &&
        (vendorOptions.length > 0 || categoryOptions.length > 0) && (
          <aside className="hidden w-[280px] flex-none md:block">
            <div>
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>
              <FilterPanel
                vendorOptions={vendorOptions}
                categoryOptions={categoryOptions}
              />
            </div>
          </aside>
        )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Active Filter Badges */}
        <FilterBadges />

        {/* Product Count */}
        <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
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

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : hasActiveFilters ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
            <svg
              className="mb-4 h-12 w-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              No products found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Try adjusting your filters to see more products.
            </p>
          </div>
        ) : (
          <ProductGridEmpty />
        )}
      </div>

      {/* Mobile Filter Drawer - TODO: Implement sheet/drawer component */}
      {/* For now, filters are hidden on mobile. Can be added in a future iteration. */}
    </div>
  );
}
