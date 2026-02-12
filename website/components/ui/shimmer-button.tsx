"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";

interface ShimmerButtonProps
  extends Omit<React.ComponentProps<"a">, "size">,
    Omit<VariantProps<typeof buttonVariants>, "variant"> {
  /** Mouse position from parent section (for shimmer effect) */
  mousePosition?: { x: number; y: number } | null;
  /** Whether mouse is in the hero section (triggers border animation) */
  isHeroHovered?: boolean;
  /** Whether to show the animated border (default: true) */
  showBorder?: boolean;
  /** Button variant: primary (white border), secondary (no border), tertiary (light bg, dark text) */
  variant?: "primary" | "secondary" | "tertiary";
}

/**
 * ShimmerButton Component
 * 
 * A specialized button with:
 * - Animated rotating gradient border (activates when mouse enters hero section)
 * - Mouse-proximity background shimmer effect
 * - Gradient colors: #151515 → #529BCA → #292664 → #D12026
 * 
 * Performance optimized with:
 * - CSS transforms for GPU acceleration
 * - RequestAnimationFrame for smooth updates
 * - Respects prefers-reduced-motion
 */
export function ShimmerButton({
  className,
  size,
  mousePosition,
  isHeroHovered = false,
  showBorder = true,
  variant = "primary",
  children,
  ...props
}: ShimmerButtonProps) {
  const buttonRef = React.useRef<HTMLAnchorElement>(null);
  const [shimmerStyle, setShimmerStyle] = React.useState<React.CSSProperties>({});
  const rafRef = React.useRef<number | undefined>(undefined);

  // Calculate mouse proximity shimmer effect
  React.useEffect(() => {
    if (!mousePosition || !buttonRef.current) {
      setShimmerStyle({});
      return;
    }

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      // Calculate distance from mouse to button center
      const deltaX = mousePosition.x - buttonCenterX;
      const deltaY = mousePosition.y - buttonCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Max distance for shimmer effect (300px as specified)
      const maxDistance = 300;

      if (distance > maxDistance) {
        setShimmerStyle({});
        return;
      }

      // Calculate position relative to button (0-100%)
      const relativeX = ((mousePosition.x - rect.left) / rect.width) * 100;
      const relativeY = ((mousePosition.y - rect.top) / rect.height) * 100;

      // Calculate intensity based on distance (closer = brighter)
      const intensity = Math.max(0, 1 - distance / maxDistance);

      // Use bright gradient colors for shimmer effect
      setShimmerStyle({
        background: `radial-gradient(circle 200px at ${relativeX}% ${relativeY}%, rgba(82, 155, 202, ${intensity * 0.6}) 0%, rgba(41, 38, 100, ${intensity * 0.4}) 30%, transparent 60%)`,
      });
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mousePosition]);

  const isTertiary = variant === "tertiary";
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";

  return (
    <a
      ref={buttonRef}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-headline text-[11px] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-2 shrink-0",
        "h-12 font-semibold",
        "group relative overflow-hidden rounded-full",
        className
      )}
      style={{
        background: isTertiary
          ? isHeroHovered
            ? "conic-gradient(from var(--gradient-angle, 0deg), #026AA2 0%, #529BCA 33%, #F90020 66%, #026AA2 100%)"
            : "#0a0c10"
          : showBorder
            ? isHeroHovered 
              ? "conic-gradient(from var(--gradient-angle, 0deg), #026AA2 0%, #529BCA 33%, #F90020 66%, #026AA2 100%)"
              : "#ffffff"
            : shimmerStyle.background 
              ? `${shimmerStyle.background}, #141721`
              : "#141721",
        padding: "2px",
      }}
      {...props}
    >
      {/* Inner button with background and shimmer overlay */}
      {isTertiary ? (
        <span 
          className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full px-8 text-neutral-900 transition-colors"
          style={{
            background: "#ffffff",
          }}
        >
          {children}
        </span>
      ) : showBorder ? (
        <span 
          className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full px-8 text-white transition-colors"
          style={{
            background: shimmerStyle.background 
              ? `${shimmerStyle.background}, #141721`
              : "#141721",
          }}
        >
          {children}
        </span>
      ) : (
        <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-full px-8 text-white">
          {children}
        </span>
      )}

      {/* CSS keyframes for rotation */}
      <style jsx>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes shimmer-rotate {
          from {
            --gradient-angle: 0deg;
          }
          to {
            --gradient-angle: 360deg;
          }
        }

        a {
          animation: ${isHeroHovered ? "shimmer-rotate 3.5s linear infinite" : "none"};
          will-change: auto;
        }

        a:hover {
          will-change: transform;
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          a {
            animation: none !important;
          }
        }
      `}</style>
    </a>
  );
}
