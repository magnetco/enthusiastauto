"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition Component
 * 
 * Provides smooth page transitions with element-by-element fade animations.
 * Total transition time: <1.4s
 * - Fade out: 0.5s (staggered by 30ms per element)
 * - Fade in: 0.6s (staggered by 40ms per element)
 * 
 * The component automatically detects direct children and applies staggered
 * animations to create a fluid, modern page transition effect.
 * 
 * Usage: Wrap your page content in template.tsx
 * 
 * @example
 * ```tsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = React.useState(children);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousPathname = React.useRef(pathname);

  React.useEffect(() => {
    // Skip transition on initial mount
    if (previousPathname.current === pathname) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Start transition
    setIsTransitioning(true);

    // Get all direct children elements
    const elements = Array.from(container.children) as HTMLElement[];
    
    // Limit stagger to prevent overly long transitions
    const maxStaggerElements = 10;
    const effectiveElementCount = Math.min(elements.length, maxStaggerElements);

    // Phase 1: Fade out current content (staggered)
    elements.forEach((element, index) => {
      const staggerIndex = Math.min(index, maxStaggerElements - 1);
      element.style.setProperty('--stagger-index', staggerIndex.toString());
      element.classList.add('page-transition-exit');
    });

    // Wait for fade out to complete, then swap content
    // Cap at 800ms total (500ms base + 300ms max stagger)
    const fadeOutDuration = Math.min(500 + (effectiveElementCount * 30), 800);
    
    const fadeOutTimer = setTimeout(() => {
      // Update content
      setDisplayChildren(children);
      previousPathname.current = pathname;

      // Small delay to ensure DOM update
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const newElements = Array.from(container.children) as HTMLElement[];
          const newEffectiveCount = Math.min(newElements.length, maxStaggerElements);
          
          // Phase 2: Fade in new content (staggered)
          newElements.forEach((element, index) => {
            const staggerIndex = Math.min(index, maxStaggerElements - 1);
            element.style.setProperty('--stagger-index', staggerIndex.toString());
            element.classList.add('page-transition-enter');
          });

          // Wait for fade in to complete
          // Cap at 1000ms total (600ms base + 400ms max stagger)
          const fadeInDuration = Math.min(600 + (newEffectiveCount * 40), 1000);
          
          const fadeInTimer = setTimeout(() => {
            // Clean up classes
            newElements.forEach((element) => {
              element.classList.remove('page-transition-enter');
              element.style.removeProperty('--stagger-index');
            });
            setIsTransitioning(false);
          }, fadeInDuration);

          // Store timer for cleanup
          return () => clearTimeout(fadeInTimer);
        });
      });
    }, fadeOutDuration);

    // Cleanup function
    return () => {
      clearTimeout(fadeOutTimer);
      elements.forEach((element) => {
        element.classList.remove('page-transition-exit', 'page-transition-enter');
        element.style.removeProperty('--stagger-index');
      });
    };
  }, [pathname, children]);

  return (
    <div
      ref={containerRef}
      className="page-transition-container"
      data-transitioning={isTransitioning}
    >
      {displayChildren}
    </div>
  );
}
