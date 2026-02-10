"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  children: React.ReactNode;
}

// Context to share scroll state with child components
const HeaderScrollContext = createContext(false);

export function useHeaderScroll() {
  return useContext(HeaderScrollContext);
}

/**
 * Wrapper component that handles sticky header behavior with scroll-based styling
 * - Transparent dark background when at top
 * - White background with blur when scrolled
 */
export function StickyHeader({ children }: StickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Consider scrolled if user has scrolled more than 10px
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderScrollContext.Provider value={isScrolled}>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-t transition-all duration-300",
          isScrolled
            ? "border-gray-200/50 bg-white/95 shadow-sm backdrop-blur-[20px]"
            : "border-white/10 bg-[#0a0c10]"
        )}
      >
        {children}
      </header>
    </HeaderScrollContext.Provider>
  );
}
