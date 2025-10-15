"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useFilters } from "contexts/FilterContext";
import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterContext = useFilters(); // May be null if outside FilterProvider
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(searchParams?.get("q") || "");
  const [validationError, setValidationError] = useState("");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Sync with URL parameter (works both inside and outside FilterProvider)
  useEffect(() => {
    const urlSearchTerm = searchParams?.get("q") || "";
    setSearchValue(urlSearchTerm);
  }, [searchParams]);

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger on mobile
      if (isMobile) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape key to clear focus
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;

    // Validation: minimum 2 characters
    if (query && query.trim().length > 0 && query.trim().length < 2) {
      setValidationError("Type at least 2 characters to search");
      return;
    }

    setValidationError("");

    // Submit to search page
    if (query && query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setValidationError("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    // Navigate to current page without query (removes ?q= from URL)
    const currentPath = window.location.pathname;
    router.push(currentPath);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Clear validation error when user types
    if (validationError) {
      setValidationError("");
    }
  };

  const placeholderText = isMobile
    ? "Search for products..."
    : "Search... (⌘K)";

  return (
    <div className="relative w-full">
      <Form
        action="/search"
        className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="text"
          name="q"
          placeholder={placeholderText}
          autoComplete="off"
          value={searchValue}
          onChange={handleChange}
          className="text-md w-full rounded-lg border bg-white px-4 py-2 pr-20 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center gap-2">
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="flex items-center"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-4" />
          </button>
        </div>
      </Form>
      {validationError && (
        <div className="absolute left-0 top-full mt-1 text-xs text-red-500 dark:text-red-400">
          {validationError}
        </div>
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
