"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useViewPreference } from "@/lib/hooks/useViewPreference";
import { useVehicleComparison } from "@/lib/hooks/useVehicleComparison";
import { VehicleGrid } from "./VehicleGrid";
import { ViewToggle } from "./ViewToggle";
import { FilterNavbar } from "./FilterNavbar";
import { SortDropdown } from "./SortDropdown";
import { VehicleComparison } from "./VehicleComparison";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

interface VehiclesPageClientProps {
  vehicles: VehicleListItem[];
  vehicleCount: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

/**
 * Client-side wrapper for vehicles page
 * Manages view state, comparison, and filtering
 */
export function VehiclesPageClient({ vehicles, vehicleCount, priceRange }: VehiclesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { view, setView, isHydrated } = useViewPreference();
  const comparison = useVehicleComparison();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Default to showing current inventory only (true) unless explicitly set to false
  const showCurrentOnly = searchParams.get("currentOnly") !== "false";

  const toggleCurrentInventory = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      // Show current inventory only (default state, remove param)
      params.delete("currentOnly");
    } else {
      // Show all inventory
      params.set("currentOnly", "false");
    }
    router.push(`/vehicles?${params.toString()}`);
  };

  // Prevent flash of wrong view during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-[600px] animate-pulse">
        <div className="mb-6 h-10 w-full rounded bg-gray-200" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter Navbar - Full width collapsible panels */}
      <div className="mb-8">
        <FilterNavbar priceRange={priceRange} />
      </div>

      {/* Controls Row: View Toggle, Current Inventory, Count, and Sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: View Toggle and Current Inventory Checkbox */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <ViewToggle currentView={view} onViewChange={setView} />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="current-inventory"
              checked={showCurrentOnly}
              onCheckedChange={toggleCurrentInventory}
            />
            <Label
              htmlFor="current-inventory"
              className="cursor-pointer text-sm font-medium"
            >
              Current Inventory
            </Label>
          </div>
        </div>

        {/* Center: Vehicle Count */}
        <div className="text-sm text-muted-foreground">
          {vehicleCount} {vehicleCount === 1 ? "vehicle" : "vehicles"} found
        </div>

        {/* Right: Sort Dropdown */}
        <SortDropdown />
      </div>

      {/* Vehicle Grid - Full width */}
      <VehicleGrid
        vehicles={vehicles}
        view={view}
        onCompareToggle={(vehicle) => comparison.toggleVehicle(vehicle)}
        comparisonIds={comparison.selectedVehicles.map((v) => v._id)}
      />

      {/* Comparison Bar - Sticky at bottom when vehicles selected */}
      {comparison.count > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg">
          <div className="mx-auto flex max-w-max items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {comparison.count} vehicle{comparison.count !== 1 ? "s" : ""} selected for comparison
              </span>
              {comparison.maxReached && (
                <span className="text-xs text-amber-600">(Maximum reached)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={comparison.clearAll}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={comparison.count < 2}
              >
                Compare ({comparison.count})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <VehicleComparison
        vehicles={comparison.selectedVehicles}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onRemoveVehicle={comparison.removeVehicle}
      />
    </>
  );
}
