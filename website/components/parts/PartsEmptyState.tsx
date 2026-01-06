"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PartsEmptyStateProps {
  hasActiveFilters: boolean;
}

export function PartsEmptyState({ hasActiveFilters }: PartsEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-12 text-center">
      <svg
        className="mb-4 h-16 w-16 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        No parts found
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600">
        {hasActiveFilters
          ? "No parts match your current filters. Try adjusting your search criteria."
          : "Check back soon for quality BMW parts and accessories."}
      </p>
      {hasActiveFilters ? (
        <Button asChild variant="outline">
          <Link href="/parts">Clear All Filters</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href="/vehicles">Browse Vehicles</Link>
        </Button>
      )}
    </div>
  );
}

