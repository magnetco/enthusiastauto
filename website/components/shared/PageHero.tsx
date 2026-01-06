import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HeroCTA {
  label: string;
  href: string;
  variant?: "primary" | "outline";
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
  compact: "min-h-[35vh] lg:min-h-[40vh]",
};

const paddingClasses = {
  full: "py-20 lg:py-24",
  medium: "py-16 lg:py-20",
  compact: "py-12 lg:py-16",
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
  return (
    <section
      className={cn(
        "relative flex w-full items-center overflow-hidden bg-black",
        sizeClasses[size],
        className
      )}
    >
      {/* Background Image with overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
          {/* Dark gradient overlay for dramatic effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
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
          {/* Eyebrow Text */}
          {eyebrow && (
            <p className="mb-6 text-body-base font-medium uppercase tracking-[0.2em] text-white/50">
              {eyebrow}
            </p>
          )}

          {/* Main Heading */}
          {typeof title === "string" ? (
            <h1 className="font-headline mb-8 text-[2rem] leading-[1.05] text-white sm:text-[2.5rem] md:text-[3rem] lg:text-[3.3rem]">
              {title}
            </h1>
          ) : (
            <h1 className="font-headline mb-8 text-[2rem] leading-[1.05] text-white sm:text-[2.5rem] md:text-[3rem] lg:text-[3.3rem]">
              {title}
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="mb-10 max-w-xl text-body-large text-white/70 sm:text-body-xl">
              {subtitle}
            </p>
          )}

          {/* Additional content (e.g., feature badges) */}
          {children}

          {/* CTAs */}
          {ctas && ctas.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              {ctas.map((cta, index) => (
                <Link
                  key={index}
                  href={cta.href}
                  aria-label={cta.ariaLabel || cta.label}
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: cta.variant === "outline" ? "outline" : "default",
                    }),
                    cta.variant === "outline"
                      ? "border-white/30 font-semibold text-white hover:bg-white/10 hover:border-white/50"
                      : "bg-white px-8 font-semibold text-black hover:bg-white/90"
                  )}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

