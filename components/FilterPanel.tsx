"use client";

import { useFilters } from "contexts/FilterContext";
import { FilterOption } from "lib/types/filters";
import { Product } from "lib/shopify/types";
import { extractModelOptions, extractYearOptions } from "lib/utils/vehicle";
import { useMemo } from "react";
import { VehicleSelector } from "./VehicleSelector";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FilterPanelProps {
  vendorOptions: FilterOption[];
  categoryOptions: FilterOption[];
  products: Product[];
  className?: string;
}

export function FilterPanel({
  vendorOptions,
  categoryOptions,
  products,
  className = "",
}: FilterPanelProps) {
  const filterContext = useFilters();

  // FilterPanel should always be inside FilterProvider, but be defensive
  if (!filterContext) {
    console.error("FilterPanel must be used within a FilterProvider");
    return null;
  }

  const {
    filters,
    toggleVendor,
    toggleCategory,
    clearFilters,
    setVehicle,
    clearVehicle,
  } = filterContext;

  // Extract vehicle options from products
  const modelOptions = useMemo(() => extractModelOptions(products), [products]);
  const yearOptions = useMemo(() => extractYearOptions(products), [products]);

  const hasActiveFilters =
    filters.vendors.length > 0 ||
    filters.categories.length > 0 ||
    filters.vehicle !== null;

  const handleVehicleSelect = (model: string, year: number) => {
    setVehicle(model, year);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
          aria-label="Clear all filters"
        >
          Clear All Filters
        </Button>
      )}

      <Accordion
        type="multiple"
        defaultValue={["vehicle", "vendors", "categories"]}
      >
        {/* Vehicle Fitment Filter Section */}
        <AccordionItem value="vehicle">
          <AccordionTrigger className="text-sm font-medium">
            Vehicle Fitment
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <VehicleSelector
                modelOptions={modelOptions}
                yearOptions={yearOptions}
                selectedModel={filters.vehicle?.model || null}
                selectedYear={filters.vehicle?.year || null}
                onSelect={handleVehicleSelect}
                onClear={clearVehicle}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Vendor Filter Section */}
        {vendorOptions.length > 0 && (
          <AccordionItem value="vendors">
            <AccordionTrigger className="text-sm font-medium">
              Vendor
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {vendorOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`vendor-${option.value}`}
                      checked={filters.vendors.includes(option.value)}
                      onCheckedChange={() => toggleVendor(option.value)}
                      aria-label={`Filter by ${option.label}`}
                    />
                    <label
                      htmlFor={`vendor-${option.value}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                    >
                      <span>{option.label}</span>
                      <span className="text-xs text-neutral-500">
                        ({option.count})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Category Filter Section */}
        {categoryOptions.length > 0 && (
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {categoryOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${option.value}`}
                      checked={filters.categories.includes(option.value)}
                      onCheckedChange={() => toggleCategory(option.value)}
                      aria-label={`Filter by ${option.label}`}
                    />
                    <label
                      htmlFor={`category-${option.value}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                    >
                      <span>{option.label}</span>
                      <span className="text-xs text-neutral-500">
                        ({option.count})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
