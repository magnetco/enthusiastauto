"use client";

import { useFilters } from "contexts/FilterContext";
import { FilterOption } from "lib/types/filters";
import { Product } from "lib/shopify/types";
import { extractModelOptions, extractYearOptions } from "lib/utils/vehicle";
import { useMemo } from "react";
import { VehicleSelector } from "./VehicleSelector";
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
    setVehicle,
    clearVehicle,
  } = filterContext;

  // Extract vehicle options from products
  const modelOptions = useMemo(() => extractModelOptions(products), [products]);
  const yearOptions = useMemo(() => extractYearOptions(products), [products]);

  const handleVehicleSelect = (model: string, year: number) => {
    setVehicle(model, year);
  };

  return (
    <div className={`${className}`}>
      <Accordion
        type="multiple"
        defaultValue={["vehicle", "vendors", "categories"]}
        className="space-y-0"
      >
        {/* Vehicle Fitment Filter Section */}
        <AccordionItem value="vehicle">
          <AccordionTrigger className="text-xs font-semibold">
            Vehicle Fitment
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-1.5">
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
            <AccordionTrigger className="text-xs font-semibold">
              Vendor
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1.5">
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
                      className="flex flex-1 cursor-pointer items-center justify-between text-xs"
                    >
                      <span>{option.label}</span>
                      <span className="text-[11px] text-muted-foreground">
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
            <AccordionTrigger className="text-xs font-semibold">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1.5">
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
                      className="flex flex-1 cursor-pointer items-center justify-between text-xs"
                    >
                      <span>{option.label}</span>
                      <span className="text-[11px] text-muted-foreground">
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
