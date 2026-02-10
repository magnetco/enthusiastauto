"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { FullPageLoader } from "./animated-loader";

interface PageTransitionProps {
  children: React.ReactNode;
  /** Duration to show loader during transitions (ms, default: 500) */
  duration?: number;
}

/**
 * PageTransition Component
 * 
 * Wraps page content and shows an animated loader during route transitions.
 * Useful for providing visual feedback when navigating between pages,
 * especially when loading large images.
 * 
 * Usage: Wrap your page content in layout.tsx or individual pages
 * 
 * @example
 * ```tsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({ children, duration = 500 }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(false);
  const [displayChildren, setDisplayChildren] = React.useState(children);

  React.useEffect(() => {
    // Show loader when route changes
    setIsLoading(true);

    // Update children after a brief delay
    const updateTimer = setTimeout(() => {
      setDisplayChildren(children);
    }, 100);

    // Hide loader after duration
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      clearTimeout(updateTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname, children, duration]);

  return (
    <>
      <FullPageLoader isLoading={isLoading} message="Loading..." />
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
        {displayChildren}
      </div>
    </>
  );
}
