"use client";

import { FilterProvider } from "contexts/FilterContext";
import { ReactNode } from "react";

/**
 * Client-side providers wrapper.
 * FilterProvider is SSR-safe and gracefully handles environments
 * where localStorage is unavailable or broken (e.g., Cursor IDE).
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  return <FilterProvider>{children}</FilterProvider>;
}
