"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "latest", label: "Latest Arrivals" },
  { value: "best-selling", label: "Best Selling" },
];

export function PartsSortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "relevance";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/parts?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-gray-700"
      >
        Sort by:
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue placeholder="Select sort order" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

