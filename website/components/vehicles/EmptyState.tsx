"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  hasActiveFilters: boolean;
}

export function EmptyState({ hasActiveFilters }: EmptyStateProps) {
  const router = useRouter();

  if (hasActiveFilters) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="mb-2 text-base font-semibold text-gray-900">
          No vehicles found
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          No vehicles match your current filters. Try adjusting your search
          criteria.
        </p>
        <Button
          onClick={() => router.push("/vehicles")}
          variant="outline"
          size="lg"
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <svg
        className="mb-4 h-12 w-12 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <h3 className="mb-2 text-base font-semibold text-gray-900">
        No vehicles in inventory
      </h3>
      <p className="text-sm text-gray-600">
        Check back soon for new vehicle listings.
      </p>
    </div>
  );
}
