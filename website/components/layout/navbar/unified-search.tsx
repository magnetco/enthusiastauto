"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "@/types/search";

export default function UnifiedSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(searchParams?.get("q") || "");
  const [validationError, setValidationError] = useState("");
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Sync with URL parameter
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
      // Escape key to clear focus and close autocomplete
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setIsAutocompleteOpen(false);
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
    setIsAutocompleteOpen(false);

    // Submit to unified search page
    if (query && query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setValidationError("");
    setIsAutocompleteOpen(false);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear validation error when user types
    if (validationError) {
      setValidationError("");
    }

    // Open autocomplete if query is valid
    if (value.length >= 2) {
      setIsAutocompleteOpen(true);
    } else {
      setIsAutocompleteOpen(false);
    }
  };

  const handleFocus = () => {
    // Open autocomplete if there's a valid query
    if (searchValue.length >= 2) {
      setIsAutocompleteOpen(true);
    }
  };

  const handleAutocompleteSelect = (result: SearchResult) => {
    setIsAutocompleteOpen(false);
    // Navigation is handled by SearchAutocomplete component
  };

  const placeholderText = "Search cars or parts";

  return (
    <div className="relative w-full">
      <Form
        action="/search"
        className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search vehicles and parts"
      >
        <label htmlFor="unified-search-input" className="sr-only">
          Search for vehicles and parts
        </label>
        <Input
          id="unified-search-input"
          ref={inputRef}
          type="text"
          name="q"
          placeholder={placeholderText}
          autoComplete="off"
          value={searchValue}
          onChange={handleChange}
          onFocus={handleFocus}
          aria-invalid={!!validationError}
          aria-describedby={validationError ? "search-error" : undefined}
          className="w-full min-w-[320px] pr-20"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center gap-2">
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
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

      {/* Autocomplete dropdown */}
      <SearchAutocomplete
        query={searchValue}
        isOpen={isAutocompleteOpen}
        onClose={() => setIsAutocompleteOpen(false)}
        onSelect={handleAutocompleteSelect}
      />

      {validationError && (
        <div
          id="search-error"
          className="absolute left-0 top-full mt-1 text-xs text-[var(--color-error-500)] dark:text-[var(--color-error-500)]"
          role="alert"
        >
          {validationError}
        </div>
      )}
    </div>
  );
}

export function UnifiedSearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search vehicles & parts..."
        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
