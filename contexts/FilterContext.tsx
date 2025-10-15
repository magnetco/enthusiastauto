"use client";

import {
  FilterContextType,
  FilterState,
  VehicleSelection,
} from "lib/types/filters";
import {
  clearFiltersFromSession,
  loadFiltersFromSession,
  saveFiltersToSession,
} from "lib/utils/filters";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilterState: FilterState = {
  vendors: [],
  categories: [],
  vehicle: null,
  searchTerm: "",
};

const VEHICLE_STORAGE_KEY = "vehicle-selection";

// Load vehicle from localStorage
function loadVehicleFromStorage(): VehicleSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(VEHICLE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Save vehicle to localStorage
function saveVehicleToStorage(vehicle: VehicleSelection | null) {
  if (typeof window === "undefined") return;
  try {
    if (vehicle) {
      localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicle));
    } else {
      localStorage.removeItem(VEHICLE_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSyncedSearchTerm, setLastSyncedSearchTerm] = useState<string>("");
  const isSyncingRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load filters from sessionStorage, vehicle from localStorage, and searchTerm from URL on mount
  useEffect(() => {
    const savedFilters = loadFiltersFromSession();
    const savedVehicle = loadVehicleFromStorage();
    const urlSearchTerm = searchParams.get("q") || "";

    setFilters({
      vendors: savedFilters?.vendors || [],
      categories: savedFilters?.categories || [],
      vehicle: savedVehicle,
      searchTerm: urlSearchTerm,
    });
    setLastSyncedSearchTerm(urlSearchTerm);
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Save filters to sessionStorage whenever they change (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveFiltersToSession({
        vendors: filters.vendors,
        categories: filters.categories,
      });
    }
  }, [filters.vendors, filters.categories, isInitialized]);

  // Save vehicle to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveVehicleToStorage(filters.vehicle);
    }
  }, [filters.vehicle, isInitialized]);

  // Sync searchTerm changes to URL query parameters (after initialization)
  useEffect(() => {
    if (
      isInitialized &&
      filters.searchTerm !== lastSyncedSearchTerm &&
      !isSyncingRef.current
    ) {
      isSyncingRef.current = true;
      const params = new URLSearchParams(window.location.search);
      if (filters.searchTerm && filters.searchTerm.length >= 2) {
        params.set("q", filters.searchTerm);
      } else {
        params.delete("q");
      }
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
      setLastSyncedSearchTerm(filters.searchTerm);
      // Reset sync flag after a brief delay to allow router to update
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchTerm, isInitialized, lastSyncedSearchTerm]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
    clearFiltersFromSession();
    saveVehicleToStorage(null);
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

  const setVehicle = (model: string, year: number) => {
    setFilters((prev) => ({
      ...prev,
      vehicle: { model, year },
    }));
  };

  const clearVehicle = () => {
    setFilters((prev) => ({
      ...prev,
      vehicle: null,
    }));
    saveVehicleToStorage(null);
  };

  const setSearchTerm = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: term,
    }));
  };

  const clearSearchTerm = () => {
    setFilters((prev) => {
      // Ensure we preserve all other filters when clearing search
      return {
        vendors: prev.vendors,
        categories: prev.categories,
        vehicle: prev.vehicle,
        searchTerm: "",
      };
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilters,
        clearFilters,
        toggleVendor,
        toggleCategory,
        setVehicle,
        clearVehicle,
        setSearchTerm,
        clearSearchTerm,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    // Return null when outside FilterProvider (e.g., in navbar)
    // Components can check for null and handle gracefully
    return null;
  }
  return context;
}
