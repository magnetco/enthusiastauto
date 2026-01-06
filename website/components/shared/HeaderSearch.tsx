"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Header search bar component
 * Styled as a rounded pill input matching the design mockups
 */
export function HeaderSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    } else if (searchValue.trim().length === 0) {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex h-10 w-64 items-center rounded-full border border-white/20 bg-white/5 pl-4 pr-3 transition-colors focus-within:border-white/40 hover:border-white/30">
        <input
          type="text"
          placeholder="Search cars or parts"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:text-white"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

