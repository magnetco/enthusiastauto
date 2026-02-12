"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { ChassisIcon } from "./ChassisIcon";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { YearRangeSlider } from "./YearRangeSlider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { YearDistribution } from "@/lib/sanity/queries/vehicles";

const chassisOptions = [
  { code: "E24", label: "E24" },
  { code: "E26", label: "E26" },
  { code: "E28", label: "E28" },
  { code: "E30", label: "E30" },
  { code: "E31", label: "E31" },
  { code: "E34", label: "E34" },
  { code: "E36", label: "E36" },
  { code: "E39", label: "E39" },
  { code: "E46", label: "E46" },
  { code: "E60", label: "E60" },
  { code: "E82", label: "E82" },
  { code: "E9X", label: "E9X" },
  { code: "F8X", label: "F8X" },
  { code: "F87", label: "F87" },
  { code: "G8X", label: "G8X" },
  { code: "Z3", label: "Z3" },
  { code: "Z4", label: "Z4" },
  { code: "Z8", label: "Z8" },
  { code: "SAV", label: "SAV" },
  { code: "OTHER", label: "Other" },
];

type FilterPanel = "chassis" | "year" | "price" | null;

interface FilterNavbarProps {
  priceRange?: {
    min: number;
    max: number;
  };
}

export function FilterNavbar({ priceRange = { min: 0, max: 200000 } }: FilterNavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openPanel, setOpenPanel] = useState<FilterPanel>("chassis"); // Chassis expanded by default
  const [yearDistribution, setYearDistribution] = useState<YearDistribution[]>([]);
  const [isLoadingDistribution, setIsLoadingDistribution] = useState(true);

  // Parse current filters from URL
  const selectedChassis = searchParams.get("chassis")?.split(",") || [];
  const yearMin = searchParams.get("yearMin") || "";
  const yearMax = searchParams.get("yearMax") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const status = searchParams.get("status") || "all";
  const hideSold = searchParams.get("hideSold") !== "false";

  // Fetch year distribution when filters change (excluding year filters)
  useEffect(() => {
    const fetchDistribution = async () => {
      setIsLoadingDistribution(true);
      try {
        const params = new URLSearchParams();
        if (selectedChassis.length > 0) {
          params.set("chassis", selectedChassis.join(","));
        }
        if (priceMin) params.set("priceMin", priceMin);
        if (priceMax) params.set("priceMax", priceMax);
        if (status && status !== "all") params.set("status", status);
        params.set("hideSold", hideSold.toString());

        const response = await fetch(
          `/api/vehicles/year-distribution?${params.toString()}`,
        );
        if (response.ok) {
          const data = await response.json();
          setYearDistribution(data);
        }
      } catch (error) {
        console.error("Error fetching year distribution:", error);
      } finally {
        setIsLoadingDistribution(false);
      }
    };

    fetchDistribution();
  }, [selectedChassis.join(","), priceMin, priceMax, status, hideSold]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/vehicles?${params.toString()}`);
  };

  const toggleChassis = (chassisCode: string) => {
    const newSelection = selectedChassis.includes(chassisCode)
      ? selectedChassis.filter((c) => c !== chassisCode)
      : [...selectedChassis, chassisCode];

    updateFilters({
      chassis: newSelection.length > 0 ? newSelection.join(",") : null,
    });
  };

  const clearAllFilters = () => {
    router.push("/vehicles");
  };

  const hasActiveFilters =
    selectedChassis.length > 0 ||
    yearMin ||
    yearMax ||
    priceMin ||
    priceMax;

  const togglePanel = (panel: FilterPanel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      {/* Filter Buttons Row */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Chassis Style Button */}
        <Button
          variant={openPanel === "chassis" ? "default" : "outline"}
          size="sm"
          onClick={() => togglePanel("chassis")}
          className={cn(
            "gap-2",
            openPanel === "chassis" && "bg-gray-900 hover:bg-gray-800"
          )}
        >
          Chassis Style
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform",
              openPanel === "chassis" && "rotate-180"
            )}
          />
        </Button>

        {/* Year Range Button */}
        <Button
          variant={openPanel === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => togglePanel("year")}
          className={cn(
            "gap-2",
            openPanel === "year" && "bg-gray-900 hover:bg-gray-800"
          )}
        >
          Year Range
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform",
              openPanel === "year" && "rotate-180"
            )}
          />
        </Button>

        {/* Price Range Button */}
        <Button
          variant={openPanel === "price" ? "default" : "outline"}
          size="sm"
          onClick={() => togglePanel("price")}
          className={cn(
            "gap-2",
            openPanel === "price" && "bg-gray-900 hover:bg-gray-800"
          )}
        >
          Price Range
          <ChevronDownIcon
            className={cn(
              "h-4 w-4 transition-transform",
              openPanel === "price" && "rotate-180"
            )}
          />
        </Button>

        {/* Clear All Button (only show if filters active) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="ml-auto"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 border-t border-gray-200 px-4 py-3">
          {selectedChassis.map((chassis) => (
            <Badge
              key={chassis}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => toggleChassis(chassis)}
            >
              {chassis}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {yearMin && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => updateFilters({ yearMin: null })}
            >
              Year ≥ {yearMin}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {yearMax && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => updateFilters({ yearMax: null })}
            >
              Year ≤ {yearMax}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {priceMin && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => updateFilters({ priceMin: null })}
            >
              Price ≥ ${parseInt(priceMin).toLocaleString()}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {priceMax && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => updateFilters({ priceMax: null })}
            >
              Price ≤ ${parseInt(priceMax).toLocaleString()}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Expandable Panel Content */}
      {openPanel && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-6">
          {/* Chassis Panel */}
          {openPanel === "chassis" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {chassisOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => toggleChassis(option.code)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary hover:bg-primary/5",
                    selectedChassis.includes(option.code)
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 bg-white"
                  )}
                >
                  <ChassisIcon chassis={option.code} className="h-10 w-20" />
                  <span className="text-xs font-medium text-gray-900">
                    {option.label}
                  </span>
                  {selectedChassis.includes(option.code) && (
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Year Range Panel */}
          {openPanel === "year" && (
            <div className="mx-auto max-w-2xl">
              {isLoadingDistribution ? (
                <div className="space-y-4">
                  <div className="h-16 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                </div>
              ) : yearDistribution.length > 0 ? (
                <YearRangeSlider
                  min={yearMin ? parseInt(yearMin) : undefined}
                  max={yearMax ? parseInt(yearMax) : undefined}
                  distribution={yearDistribution}
                  onChange={(min, max) => {
                    updateFilters({
                      yearMin: min.toString(),
                      yearMax: max.toString(),
                    });
                  }}
                />
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No vehicles available with current filters
                </div>
              )}
            </div>
          )}

          {/* Price Range Panel */}
          {openPanel === "price" && (
            <div className="mx-auto max-w-md">
              <PriceRangeSlider
                min={priceRange.min}
                max={priceRange.max}
                value={[
                  priceMin ? parseInt(priceMin) : priceRange.min,
                  priceMax ? parseInt(priceMax) : priceRange.max,
                ]}
                onChange={([min, max]) => {
                  updateFilters({
                    priceMin: min === priceRange.min ? null : min.toString(),
                    priceMax: max === priceRange.max ? null : max.toString(),
                  });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
