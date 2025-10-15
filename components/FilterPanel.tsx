"use client";

import { useFilters } from "contexts/FilterContext";
import { FilterOption } from "lib/types/filters";
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
  className?: string;
}

export function FilterPanel({
  vendorOptions,
  categoryOptions,
  className = "",
}: FilterPanelProps) {
  const { filters, toggleVendor, toggleCategory, clearFilters } = useFilters();

  const hasActiveFilters =
    filters.vendors.length > 0 || filters.categories.length > 0;

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

      <Accordion type="multiple" defaultValue={["vendors", "categories"]}>
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
