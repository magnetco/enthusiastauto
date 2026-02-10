"use client";

import { useState, useMemo } from "react";
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
import type { Product } from "@/lib/shopify/types";

interface PartsFiltersProps {
  products: Product[];
}

export function PartsFilters({ products }: PartsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract unique vendors and categories from products
  const vendorOptions = useMemo(() => {
    const vendorMap = new Map<string, number>();
    products.forEach((product) => {
      if (product.vendor) {
        vendorMap.set(product.vendor, (vendorMap.get(product.vendor) || 0) + 1);
      }
    });
    return Array.from(vendorMap.entries())
      .map(([vendor, count]) => ({ value: vendor, label: vendor, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, number>();
    products.forEach((product) => {
      if (product.productType) {
        categoryMap.set(
          product.productType,
          (categoryMap.get(product.productType) || 0) + 1
        );
      }
    });
    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ value: category, label: category, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [products]);

  // Parse current filters from URL
  const selectedVendors = searchParams.get("vendor")?.split(",") || [];
  const selectedCategories = searchParams.get("category")?.split(",") || [];
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const searchQuery = searchParams.get("q") || "";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/parts?${params.toString()}`);
  };

  const toggleVendor = (vendor: string) => {
    const newSelection = selectedVendors.includes(vendor)
      ? selectedVendors.filter((v) => v !== vendor)
      : [...selectedVendors, vendor];

    updateFilters({
      vendor: newSelection.length > 0 ? newSelection.join(",") : null,
    });
  };

  const toggleCategory = (category: string) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    updateFilters({
      category: newSelection.length > 0 ? newSelection.join(",") : null,
    });
  };

  const clearAllFilters = () => {
    router.push("/parts");
    setIsDrawerOpen(false);
  };

  const hasActiveFilters =
    selectedVendors.length > 0 ||
    selectedCategories.length > 0 ||
    priceMin ||
    priceMax ||
    searchQuery;

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <Label htmlFor="search-parts" className="text-sm font-medium">
          Search Parts
        </Label>
        <Input
          id="search-parts"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => updateFilters({ q: e.target.value || null })}
          className="mt-1"
        />
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
              onClick={() => updateFilters({ q: null })}
            >
              &quot;{searchQuery}&quot;
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {selectedVendors.map((vendor) => (
            <Badge
              key={vendor}
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
              onClick={() => toggleVendor(vendor)}
            >
              {vendor}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {priceMin && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
              onClick={() => updateFilters({ priceMin: null })}
            >
              Min ${parseInt(priceMin).toLocaleString()}
              <XMarkIcon className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {priceMax && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
              onClick={() => updateFilters({ priceMax: null })}
            >
              Max ${parseInt(priceMax).toLocaleString()}
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
        defaultValue={["vendor", "category", "price"]}
      >
        {/* Vendor Filter */}
        {vendorOptions.length > 0 && (
          <AccordionItem value="vendor">
            <AccordionTrigger>Brand / Vendor</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vendorOptions.map((vendor) => (
                  <div key={vendor.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vendor-${vendor.value}`}
                      checked={selectedVendors.includes(vendor.value)}
                      onCheckedChange={() => toggleVendor(vendor.value)}
                    />
                    <Label
                      htmlFor={`vendor-${vendor.value}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
                    >
                      <span>{vendor.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ({vendor.count})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Category Filter */}
        {categoryOptions.length > 0 && (
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categoryOptions.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
                    >
                      <span>{category.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ({category.count})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

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
                  placeholder="e.g., 50"
                  value={priceMin}
                  onChange={(e) => updateFilters({ priceMin: e.target.value })}
                  min="0"
                  step="10"
                />
              </div>
              <div>
                <Label htmlFor="price-max" className="text-sm">
                  Max Price
                </Label>
                <Input
                  id="price-max"
                  type="number"
                  placeholder="e.g., 500"
                  value={priceMax}
                  onChange={(e) => updateFilters({ priceMax: e.target.value })}
                  min="0"
                  step="10"
                />
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
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted md:hidden"
        aria-label="Open filters"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        Filters
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {selectedVendors.length + selectedCategories.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0) + (searchQuery ? 1 : 0)}
          </span>
        )}
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
          <DialogPanel className="flex w-full max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-background shadow-xl transition-all duration-300 ease-out data-[closed]:translate-y-full">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-4 py-4">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Filters
              </DialogTitle>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
            <div className="sticky bottom-0 border-t border-border bg-background px-4 py-4">
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

