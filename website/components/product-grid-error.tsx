"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProductGridErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ProductGridError({ error, reset }: ProductGridErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Product grid error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950">
      <svg
        className="mb-4 h-12 w-12 text-red-600 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
        Failed to load products
      </h3>
      <p className="mb-4 text-center text-sm text-red-700 dark:text-red-300">
        {error.message ||
          "An error occurred while fetching products. Please try again."}
      </p>
      <Button
        onClick={reset}
        variant="default"
        className="bg-red-600 hover:bg-red-700"
      >
        Try again
      </Button>
    </div>
  );
}
