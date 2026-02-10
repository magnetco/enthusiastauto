"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { FilterPanel } from "@/components/FilterPanel";
import { FilterOption } from "@/lib/types/filters";
import { Product } from "@/lib/shopify/types";
import { useState } from "react";

interface FilterDrawerProps {
  vendorOptions: FilterOption[];
  categoryOptions: FilterOption[];
  products: Product[];
}

export function FilterDrawer({
  vendorOptions,
  categoryOptions,
  products,
}: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filters Button - visible only on mobile/tablet < 768px */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted md:hidden min-h-[44px]"
        aria-label="Open filters"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        Filters
      </button>

      {/* Mobile Filter Drawer using HeadlessUI Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 md:hidden"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to position the panel */}
        <div className="fixed inset-0 flex items-end">
          {/* Slide-in panel from bottom */}
          <DialogPanel className="w-full max-h-[85vh] rounded-t-2xl bg-background shadow-xl transition-all duration-300 ease-out data-[closed]:translate-y-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-4 py-4">
              <DialogTitle className="text-lg font-semibold text-foreground">
                Filters
              </DialogTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close filters"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterPanel
                vendorOptions={vendorOptions}
                categoryOptions={categoryOptions}
                products={products}
              />
            </div>

            {/* Bottom sticky button */}
            <div className="sticky bottom-0 border-t border-border bg-background px-4 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
              >
                Apply Filters
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
