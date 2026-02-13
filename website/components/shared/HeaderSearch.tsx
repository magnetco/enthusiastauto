"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHeaderScroll } from "./StickyHeader";
import { cn } from "@/lib/utils";

/**
 * Header search bar component
 * Styled as a rounded pill input matching the design mockups
 */
export function HeaderSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const isScrolled = useHeaderScroll();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    } else if (searchValue.trim().length === 0) {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-80">
      <Input
        type="text"
        placeholder="Search cars or parts"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={cn(
          "h-10 pr-10 transition-colors duration-300",
          isScrolled
            ? "bg-gray-100 text-gray-900 placeholder:text-gray-500 hover:bg-gray-200 focus:bg-gray-200"
            : "border-white/10 bg-white/5 text-white/70 placeholder:text-white/50 hover:bg-white/10 focus:bg-white/10"
        )}
      />
      <button
        type="submit"
        className={cn(
          "absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center transition-colors duration-300",
          isScrolled
            ? "text-gray-500 hover:text-gray-900"
            : "text-white/60 hover:text-white"
        )}
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  );
}

