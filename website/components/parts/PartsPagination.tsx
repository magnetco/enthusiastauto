"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PartsPaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
}

export function PartsPagination({
  currentPage,
  totalResults,
  resultsPerPage,
}: PartsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Update URL with new page
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      router.push(`/parts?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 7; // Max number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  // Calculate showing range
  const startItem = (currentPage - 1) * resultsPerPage + 1;
  const endItem = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="mt-8 space-y-4">
      {/* Results info */}
      <p className="text-center text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalResults} parts
      </p>

      {/* Pagination controls */}
      <nav
        role="navigation"
        aria-label="Parts pagination"
        className="flex items-center justify-center gap-2"
      >
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isCurrentPage = pageNum === currentPage;

            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                disabled={isCurrentPage}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isCurrentPage ? "page" : undefined}
                className="min-w-[2.5rem]"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}

