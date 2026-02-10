"use client";

import { useState, useEffect } from "react";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

const STORAGE_KEY = "eag-vehicle-comparison";
const MAX_COMPARE = 3;

/**
 * Hook to manage vehicle comparison state
 * Allows selecting up to 3 vehicles for side-by-side comparison
 */
export function useVehicleComparison() {
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleListItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedVehicles(parsed.slice(0, MAX_COMPARE));
        }
      }
    } catch (error) {
      console.error("Failed to load comparison vehicles:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when selection changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedVehicles));
      } catch (error) {
        console.error("Failed to save comparison vehicles:", error);
      }
    }
  }, [selectedVehicles, isHydrated]);

  const addVehicle = (vehicle: VehicleListItem) => {
    if (selectedVehicles.length >= MAX_COMPARE) {
      return false; // Max reached
    }
    if (selectedVehicles.some((v) => v._id === vehicle._id)) {
      return false; // Already added
    }
    setSelectedVehicles([...selectedVehicles, vehicle]);
    return true;
  };

  const removeVehicle = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter((v) => v._id !== vehicleId));
  };

  const toggleVehicle = (vehicle: VehicleListItem) => {
    const isSelected = selectedVehicles.some((v) => v._id === vehicle._id);
    if (isSelected) {
      removeVehicle(vehicle._id);
      return false;
    } else {
      return addVehicle(vehicle);
    }
  };

  const clearAll = () => {
    setSelectedVehicles([]);
  };

  const isSelected = (vehicleId: string) => {
    return selectedVehicles.some((v) => v._id === vehicleId);
  };

  const canAddMore = selectedVehicles.length < MAX_COMPARE;

  return {
    selectedVehicles,
    addVehicle,
    removeVehicle,
    toggleVehicle,
    clearAll,
    isSelected,
    canAddMore,
    count: selectedVehicles.length,
    maxReached: selectedVehicles.length >= MAX_COMPARE,
  };
}
