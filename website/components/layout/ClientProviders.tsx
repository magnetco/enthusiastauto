"use client";

import { FilterProvider } from "contexts/FilterContext";
import { ReactNode, useEffect, useState } from "react";

/**
 * Client-side providers wrapper that safely handles SSR
 * FilterProvider requires localStorage which may not work in all environments
 * 
 * Note: Cursor IDE injects --localstorage-file to Node.js which breaks
 * localStorage during SSR. This wrapper ensures FilterProvider only
 * runs on the client side.
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // Test if localStorage is functional before mounting FilterProvider
      if (typeof window !== "undefined" && 
          window.localStorage && 
          typeof window.localStorage.getItem === "function") {
        setIsMounted(true);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    }
  }, []);

  // Don't render FilterProvider until client-side mount and localStorage works
  if (!isMounted || hasError) {
    return <>{children}</>;
  }

  return <FilterProvider>{children}</FilterProvider>;
}
