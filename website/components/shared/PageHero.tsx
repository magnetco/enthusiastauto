"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";
import { ReactNode, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface HeroCTA {
  label: string;
  href: string;
  variant?: "primary" | "outline" | "shimmer";
  ariaLabel?: string;
}

interface PageHeroProps {
  /** Eyebrow text above the title */
  eyebrow?: string;
  /** Main heading */
  title: string | ReactNode;
  /** Subtitle/description */
  subtitle?: string;
  /** Call-to-action buttons */
  ctas?: HeroCTA[];
  /** Background image URL */
  backgroundImage?: string;
  /** Size variant - full (homepage), medium (subpages), compact (minimal) */
  size?: "full" | "medium" | "compact";
  /** Additional content below subtitle (e.g., feature badges) */
  children?: ReactNode;
  /** Custom className for the section */
  className?: string;
}

const sizeClasses = {
  full: "min-h-[80vh] lg:min-h-[85vh]",
  medium: "min-h-[50vh] lg:min-h-[55vh]",
  compact: "min-h-[30vh] lg:min-h-[35vh]",
};

const paddingClasses = {
  full: "py-12 lg:py-16",
  medium: "py-10 lg:py-14",
  compact: "py-8 lg:py-10",
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  ctas,
  backgroundImage,
  size = "medium",
  children,
  className,
}: PageHeroProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Throttle updates using requestAnimationFrame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  };

  const handleMouseEnter = () => {
    setIsHeroHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHeroHovered(false);
    setMousePosition(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  return (
    <section
      className={cn(
        "relative flex w-full items-center overflow-hidden bg-[#141721]",
        sizeClasses[size],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
          {/* Dark gradient overlay for dramatic effect - using blue-tinted gradient */}
          <div 
            className="absolute inset-0" 
            style={{ 
              background: 'linear-gradient(27deg, rgba(46, 144, 250, 0.4) 0%, rgba(22, 25, 34, 0.4) 50%, rgba(49, 63, 109, 0) 100%)' 
            }} 
          />
        </div>
      )}

      {/* Hero Content */}
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-[var(--container-max)] px-page-x",
          paddingClasses[size]
        )}
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          {eyebrow && (
            <p className={cn(
              "font-medium uppercase tracking-wider text-white/70",
              size === "compact" ? "mb-2 text-xs" : "mb-3 text-sm"
            )}>
              {eyebrow}
            </p>
          )}

          {/* Main Heading */}
          {typeof title === "string" ? (
            <h1 className={cn(
              "font-headline mb-4 leading-[1.05] tracking-wide text-white",
              size === "compact" 
                ? "text-[2rem] sm:text-[2.5rem] md:text-[3rem]" 
                : "text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]"
            )}>
              {title}
            </h1>
          ) : (
            <h1 className={cn(
              "font-headline mb-4 leading-[1.05] tracking-wide text-white",
              size === "compact" 
                ? "text-[2rem] sm:text-[2.5rem] md:text-[3rem]" 
                : "text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]"
            )}>
              {title}
            </h1>
          )}

          {/* Additional content (e.g., tagline) - placed between title and subtitle */}
          {children}

          {/* Subtitle */}
          {subtitle && (
            <p className={cn(
              "max-w-2xl leading-relaxed text-white/90",
              size === "compact" 
                ? "mb-5 text-base sm:text-lg" 
                : "mb-7 text-lg sm:text-xl"
            )}>
              {subtitle}
            </p>
          )}

          {/* CTAs */}
          {ctas && ctas.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              {ctas.map((cta, index) => {
                // Use ShimmerButton for shimmer variant (with border)
                if (cta.variant === "shimmer") {
                  return (
                    <ShimmerButton
                      key={index}
                      href={cta.href}
                      size="lg"
                      mousePosition={mousePosition}
                      isHeroHovered={isHeroHovered}
                      aria-label={cta.ariaLabel || cta.label}
                      className="font-semibold"
                      showBorder={true}
                    >
                      {cta.label}
                    </ShimmerButton>
                  );
                }

                // Use ShimmerButton for outline variant (transparent bg with border)
                if (cta.variant === "outline") {
                  return (
                    <ShimmerButton
                      key={index}
                      href={cta.href}
                      size="lg"
                      mousePosition={mousePosition}
                      isHeroHovered={isHeroHovered}
                      aria-label={cta.ariaLabel || cta.label}
                      className="font-semibold"
                      variant="secondary"
                      showBorder={false}
                    >
                      {cta.label}
                    </ShimmerButton>
                  );
                }

                // Regular buttons for other variants (default/primary)
                return (
                  <Link
                    key={index}
                    href={cta.href}
                    aria-label={cta.ariaLabel || cta.label}
                    className={cn(
                      buttonVariants({
                        size: "lg",
                        variant: "default",
                      }),
                      "bg-white px-8 font-semibold text-black hover:bg-white/90"
                    )}
                  >
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

