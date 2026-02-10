"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface SmartStickyHeaderProps {
  children: React.ReactNode;
}

// Context to share scroll state with child components
const HeaderScrollContext = createContext({
  isScrolled: false,
  isVisible: true,
});

export function useHeaderScroll() {
  return useContext(HeaderScrollContext);
}

/**
 * Smart sticky header wrapper with hide-on-scroll-down, show-on-scroll-up behavior
 * - Hides when scrolling down (more content visible)
 * - Shows when scrolling up (easy access to navigation)
 * - Always visible when at top of page
 * - Dark background with blur when scrolled
 */
export function SmartStickyHeader({ children }: SmartStickyHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we've scrolled past threshold
      const scrolled = currentScrollY > 10;
      setIsScrolled(scrolled);

      // Determine scroll direction and visibility
      if (currentScrollY <= 10) {
        // At top of page - always show
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll listener with passive flag for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <HeaderScrollContext.Provider value={{ isScrolled, isVisible }}>
      <header
        className={cn(
          "fixed top-0 z-50 w-full border-t transition-all duration-300",
          // Visibility
          isVisible ? "translate-y-0" : "-translate-y-full",
          // Background and border styling
          isScrolled
            ? "border-white/10 bg-[#0a0c10]/95 shadow-sm backdrop-blur-[20px]"
            : "border-white/10 bg-[#0a0c10]"
        )}
      >
        {children}
      </header>
    </HeaderScrollContext.Provider>
  );
}
