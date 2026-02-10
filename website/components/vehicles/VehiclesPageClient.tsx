"use client";

import { useState } from "react";
import { useViewPreference } from "@/lib/hooks/useViewPreference";
import { useVehicleComparison } from "@/lib/hooks/useVehicleComparison";
import { VehicleGrid } from "./VehicleGrid";
import { ViewToggle } from "./ViewToggle";
import { ChassisFilter } from "./ChassisFilter";
import { VehicleFilters } from "./VehicleFilters";
import { SortDropdown } from "./SortDropdown";
import { VehicleComparison } from "./VehicleComparison";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import { useRouter, useSearchParams } from "next/navigation";

interface VehiclesPageClientProps {
  vehicles: VehicleListItem[];
  vehicleCount: number;
}

/**
 * Client-side wrapper for vehicles page
 * Manages view state, comparison, and chassis filtering
 */
export function VehiclesPageClient({ vehicles, vehicleCount }: VehiclesPageClientProps) {
  const { view, setView, isHydrated } = useViewPreference();
  const comparison = useVehicleComparison();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current chassis filter from URL
  const currentChassis = searchParams.get("chassis")?.split(",").filter(Boolean) || [];

  // Handle chassis filter toggle
  const handleChassisToggle = (chassis: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("chassis")?.split(",").filter(Boolean) || [];
    
    let updated: string[];
    if (current.includes(chassis)) {
      // Remove chassis
      updated = current.filter((c) => c !== chassis);
    } else {
      // Add chassis
      updated = [...current, chassis];
    }

    if (updated.length > 0) {
      params.set("chassis", updated.join(","));
    } else {
      params.delete("chassis");
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
      {/* Chassis Filter - Horizontal Grid */}
      <div className="mb-8">
        <ChassisFilter
          selectedChassis={currentChassis}
          onChassisToggle={handleChassisToggle}
        />
      </div>

      {/* Controls Row: View Toggle and Sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: View Toggle */}
        <ViewToggle currentView={view} onViewChange={setView} />

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-4">
          {/* Mobile Filters Button */}
          <div className="md:hidden">
            <VehicleFilters />
          </div>
          <SortDropdown />
        </div>
      </div>

      {/* Vehicle Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {vehicleCount} {vehicleCount === 1 ? "vehicle" : "vehicles"} found
      </div>

      {/* Main Layout: Conditional Sidebar + Vehicle Grid */}
      <div className={view === "list" ? "w-full" : "gap-8 md:grid md:grid-cols-[280px_1fr] lg:gap-12"}>
        {/* Desktop Sidebar Filters - Hidden in list view */}
        {view !== "list" && (
          <aside className="hidden md:block">
            <div className="sticky top-24">
              <VehicleFilters />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main>
          <VehicleGrid
            vehicles={vehicles}
            view={view}
            onCompareToggle={(vehicle) => comparison.toggleVehicle(vehicle)}
            comparisonIds={comparison.selectedVehicles.map((v) => v._id)}
          />
        </main>
      </div>

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
