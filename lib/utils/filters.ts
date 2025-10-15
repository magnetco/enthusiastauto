import { Product } from "lib/shopify/types";
import { FilterOption, FilterState } from "lib/types/filters";

/**
 * Extract unique vendors from products and count occurrences
 */
export function extractVendorOptions(products: Product[]): FilterOption[] {
  const vendorMap = new Map<string, number>();

  products.forEach((product) => {
    if (product.vendor) {
      vendorMap.set(product.vendor, (vendorMap.get(product.vendor) || 0) + 1);
    }
  });

  return Array.from(vendorMap.entries())
    .map(([vendor, count]) => ({
      value: vendor,
      label: vendor,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Extract unique categories from products and count occurrences
 * Categories come from product tags, filtering out vehicle fitment tags
 */
export function extractCategoryOptions(products: Product[]): FilterOption[] {
  const categoryMap = new Map<string, number>();

  // Pattern to identify vehicle fitment tags (e.g., "BMW 128i Base 2008")
  // Fitment tags typically contain: Brand + Model + Trim + Year
  const vehicleFitmentPattern = /\d{4}$/; // Ends with a 4-digit year
  const commonCarBrands = /^(BMW|Audi|Mercedes|Porsche|Volkswagen|VW)/i;

  products.forEach((product) => {
    if (product.tags && product.tags.length > 0) {
      product.tags.forEach((tag) => {
        // Filter out vehicle fitment tags and empty tags
        const isVehicleFitment =
          vehicleFitmentPattern.test(tag) || commonCarBrands.test(tag);

        if (tag && tag.trim() !== "" && !isVehicleFitment) {
          categoryMap.set(tag, (categoryMap.get(tag) || 0) + 1);
        }
      });
    }
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      value: name,
      label: name,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Filter products based on active filters
 * Filters combine with AND logic - products must match ALL active filters
 */
export function filterProducts(
  products: Product[],
  filters: FilterState,
): Product[] {
  return products.filter((product) => {
    // Vendor filter: product must match one of selected vendors
    if (filters.vendors.length > 0) {
      if (!product.vendor || !filters.vendors.includes(product.vendor)) {
        return false;
      }
    }

    // Category filter: product must have at least one of selected categories
    if (filters.categories.length > 0) {
      if (!product.tags || product.tags.length === 0) {
        return false;
      }
      const hasMatchingCategory = filters.categories.some((category) =>
        product.tags.includes(category),
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Save filter state to sessionStorage
 */
export function saveFiltersToSession(filters: FilterState): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("productFilters", JSON.stringify(filters));
    } catch (error) {
      console.error("Failed to save filters to sessionStorage:", error);
    }
  }
}

/**
 * Load filter state from sessionStorage
 */
export function loadFiltersFromSession(): FilterState | null {
  if (typeof window !== "undefined") {
    try {
      const saved = sessionStorage.getItem("productFilters");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load filters from sessionStorage:", error);
    }
  }
  return null;
}

/**
 * Clear filter state from sessionStorage
 */
export function clearFiltersFromSession(): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("productFilters");
    } catch (error) {
      console.error("Failed to clear filters from sessionStorage:", error);
    }
  }
}
