"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChassisIcon } from "./ChassisIcon";
import { YearRangeSlider } from "./YearRangeSlider";
import { PriceRangeSlider } from "./PriceRangeSlider";
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

const statusOptions = [
  { value: "all", label: "All Vehicles" },
  { value: "current", label: "Current Inventory" },
  { value: "sold", label: "Sold Only" },
];

interface VehicleFiltersProps {
  priceRange?: {
    min: number;
    max: number;
  };
}

export function VehicleFilters({ priceRange = { min: 0, max: 200000 } }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [yearDistribution, setYearDistribution] = useState<YearDistribution[]>([]);
  const [isLoadingDistribution, setIsLoadingDistribution] = useState(true);

  // Parse current filters from URL
  const selectedChassis = searchParams.get("chassis")?.split(",") || [];
  const yearMin = searchParams.get("yearMin") || "";
  const yearMax = searchParams.get("yearMax") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const status = searchParams.get("status") || "all";
  // Default to hiding sold vehicles (true) unless explicitly set to false
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
    setIsDrawerOpen(false);
  };

  const hasActiveFilters =
    selectedChassis.length > 0 ||
    yearMin ||
    yearMax ||
    priceMin ||
    priceMax ||
    (status && status !== "all") ||
    hideSold;

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
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
          {status && status !== "all" && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => updateFilters({ status: null })}
            >
              {status === "current" ? "Current Inventory" : "Sold Only"}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {hideSold && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-gray-300"
              onClick={() => updateFilters({ hideSold: "false" })}
            >
              Hide Sold
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["chassis", "year", "price", "status"]}
      >
        {/* Chassis/Model Filter */}
        <AccordionItem value="chassis">
          <AccordionTrigger>Chassis/Model</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              {chassisOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => toggleChassis(option.code)}
                  className={`group relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary hover:bg-primary/5 ${
                    selectedChassis.includes(option.code)
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 bg-white"
                  }`}
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
          </AccordionContent>
        </AccordionItem>

        {/* Year Range Filter */}
        <AccordionItem value="year">
          <AccordionTrigger>Year Range</AccordionTrigger>
          <AccordionContent>
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
              <div className="text-sm text-muted-foreground">
                No vehicles available with current filters
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        {/* Status Filter */}
        <AccordionItem value="status">
          <AccordionTrigger>Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {/* Hide Sold Toggle */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hide-sold"
                    checked={hideSold}
                    onCheckedChange={(checked) =>
                      updateFilters({ hideSold: checked ? null : "false" })
                    }
                  />
                  <Label
                    htmlFor="hide-sold"
                    className="cursor-pointer text-sm font-medium"
                  >
                    Hide Sold Vehicles
                  </Label>
                </div>
              </div>

              {/* Status Radio Options */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Or filter by status:</p>
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={status === option.value}
                      onCheckedChange={() =>
                        updateFilters({ status: option.value })
                      }
                    />
                    <Label
                      htmlFor={`status-${option.value}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDrawerOpen(true)}
        className="md:hidden"
        aria-label="Open filters"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        Filters
      </Button>

      {/* Desktop Filters Sidebar */}
      <div className="hidden md:block">
        <FilterContent />
      </div>

      {/* Mobile Filter Drawer */}
      <Dialog
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="relative z-50 md:hidden"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container */}
        <div className="fixed inset-0 flex items-end">
          {/* Slide-in panel */}
          <DialogPanel className="flex w-full max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transition-all duration-300 ease-out data-closed:translate-y-full">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Filters
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close filters"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterContent />
            </div>

            {/* Bottom Button */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4">
              <Button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full"
                size="lg"
              >
                Apply Filters
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
