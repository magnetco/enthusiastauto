"use client";

import { useState } from "react";
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

const chassisOptions = [
  "E30",
  "E36",
  "E39",
  "E46",
  "E60",
  "E90",
  "F30",
  "G20",
  "X3",
  "X4",
  "X5",
  "X6",
];

const statusOptions = [
  { value: "all", label: "All Vehicles" },
  { value: "current", label: "Current Inventory" },
  { value: "sold", label: "Sold" },
];

export function VehicleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Parse current filters from URL
  const selectedChassis = searchParams.get("chassis")?.split(",") || [];
  const yearMin = searchParams.get("yearMin") || "";
  const yearMax = searchParams.get("yearMax") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const status = searchParams.get("status") || "all";

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

  const toggleChassis = (chassis: string) => {
    const newSelection = selectedChassis.includes(chassis)
      ? selectedChassis.filter((c) => c !== chassis)
      : [...selectedChassis, chassis];

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
    (status && status !== "all");

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
              {status === "current" ? "Current Inventory" : "Sold"}
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
            <div className="space-y-2">
              {chassisOptions.map((chassis) => (
                <div key={chassis} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chassis-${chassis}`}
                    checked={selectedChassis.includes(chassis)}
                    onCheckedChange={() => toggleChassis(chassis)}
                  />
                  <Label
                    htmlFor={`chassis-${chassis}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {chassis}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Year Range Filter */}
        <AccordionItem value="year">
          <AccordionTrigger>Year Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div>
                <Label htmlFor="year-min" className="text-sm">
                  Min Year
                </Label>
                <Input
                  id="year-min"
                  type="number"
                  placeholder="e.g., 2000"
                  value={yearMin}
                  onChange={(e) => updateFilters({ yearMin: e.target.value })}
                  min="1990"
                  max="2025"
                />
              </div>
              <div>
                <Label htmlFor="year-max" className="text-sm">
                  Max Year
                </Label>
                <Input
                  id="year-max"
                  type="number"
                  placeholder="e.g., 2024"
                  value={yearMax}
                  onChange={(e) => updateFilters({ yearMax: e.target.value })}
                  min="1990"
                  max="2025"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div>
                <Label htmlFor="price-min" className="text-sm">
                  Min Price
                </Label>
                <Input
                  id="price-min"
                  type="number"
                  placeholder="e.g., 10000"
                  value={priceMin}
                  onChange={(e) => updateFilters({ priceMin: e.target.value })}
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <Label htmlFor="price-max" className="text-sm">
                  Max Price
                </Label>
                <Input
                  id="price-max"
                  type="number"
                  placeholder="e.g., 100000"
                  value={priceMax}
                  onChange={(e) => updateFilters({ priceMax: e.target.value })}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status Filter */}
        <AccordionItem value="status">
          <AccordionTrigger>Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 md:hidden"
        aria-label="Open filters"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        Filters
      </button>

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
          <DialogPanel className="flex w-full max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transition-all duration-300 ease-out data-[closed]:translate-y-full">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Filters
              </DialogTitle>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close filters"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
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
