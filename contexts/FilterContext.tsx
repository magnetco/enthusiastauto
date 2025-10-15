"use client";

import { FilterContextType, FilterState } from "lib/types/filters";
import {
  clearFiltersFromSession,
  loadFiltersFromSession,
  saveFiltersToSession,
} from "lib/utils/filters";
import { createContext, useContext, useEffect, useState } from "react";

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilterState: FilterState = {
  vendors: [],
  categories: [],
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load filters from sessionStorage on mount
  useEffect(() => {
    const savedFilters = loadFiltersFromSession();
    if (savedFilters) {
      setFilters(savedFilters);
    }
    setIsInitialized(true);
  }, []);

  // Save filters to sessionStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveFiltersToSession(filters);
    }
  }, [filters, isInitialized]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
    clearFiltersFromSession();
  };

  const toggleVendor = (vendor: string) => {
    setFilters((prev) => ({
      ...prev,
      vendors: prev.vendors.includes(vendor)
        ? prev.vendors.filter((v) => v !== vendor)
        : [...prev.vendors, vendor],
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilters,
        clearFilters,
        toggleVendor,
        toggleCategory,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
