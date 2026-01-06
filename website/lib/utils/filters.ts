import { Product } from "lib/shopify/types";
import { FilterOption, FilterState } from "lib/types/filters";
import { matchVehicle } from "./vehicle";

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
    // Search filter: product must match search term (minimum 2 characters)
    if (filters.searchTerm && filters.searchTerm.length >= 2) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(searchLower);
      const matchesDescription = product.description
        .toLowerCase()
        .includes(searchLower);

      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

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

    // Vehicle fitment filter: if vehicle is selected, product must be compatible or universal
    if (filters.vehicle) {
      const fitmentStatus = matchVehicle(product, filters.vehicle);
      // Only show compatible and universal fit products when vehicle is selected
      // Hide incompatible products (those with fitment tags that don't match)
      if (fitmentStatus === "incompatible") {
        return false;
      }
    }

    return true;
  });
}

// Check if sessionStorage is available and functional
function isSessionStorageAvailable(): boolean {
  // Must be in browser environment
  if (typeof window === "undefined") return false;
  // Must have sessionStorage object
  if (!window.sessionStorage) return false;
  // Must have proper methods (Cursor IDE can inject broken storage)
  if (typeof window.sessionStorage.getItem !== "function") return false;
  if (typeof window.sessionStorage.setItem !== "function") return false;
  try {
    const test = "__storage_test__";
    window.sessionStorage.setItem(test, test);
    window.sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save filter state to sessionStorage (only vendors and categories)
 * Note: Vehicle selection is persisted to localStorage separately
 */
export function saveFiltersToSession(filters: {
  vendors: string[];
  categories: string[];
}): void {
  if (!isSessionStorageAvailable()) return;
  try {
    window.sessionStorage.setItem("productFilters", JSON.stringify(filters));
  } catch (error) {
    console.error("Failed to save filters to sessionStorage:", error);
  }
}

/**
 * Load filter state from sessionStorage (only vendors and categories)
 * Note: Vehicle selection is loaded from localStorage separately
 */
export function loadFiltersFromSession(): {
  vendors: string[];
  categories: string[];
} | null {
  if (!isSessionStorageAvailable()) return null;
  try {
    const saved = window.sessionStorage.getItem("productFilters");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load filters from sessionStorage:", error);
  }
  return null;
}

/**
 * Clear filter state from sessionStorage
 */
export function clearFiltersFromSession(): void {
  if (!isSessionStorageAvailable()) return;
  try {
    window.sessionStorage.removeItem("productFilters");
  } catch (error) {
    console.error("Failed to clear filters from sessionStorage:", error);
  }
}
