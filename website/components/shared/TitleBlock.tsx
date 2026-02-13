import { BMWMStripesStacked } from "@/components/icons/bmw-m-stripes";
import { cn } from "@/lib/utils";

interface TitleBlockProps {
  /** The section title - will be displayed uppercase in Chromatic Gothic */
  title: string;
  /** Optional description text below the title */
  description?: string;
  /** HTML id for the heading element (for aria-labelledby) */
  id?: string;
  /** Optional action element (e.g., button or link) displayed on the right */
  action?: React.ReactNode;
  /** Optional className for the container */
  className?: string;
  /** Visual variant - light (default) or dark */
  variant?: "light" | "dark";
}

/**
 * TitleBlock - Standardized section header component
 * Displays the BMW M stripes icon alongside an uppercase title (left-aligned)
 * with an optional action button on the right
 */
export function TitleBlock({
  title,
  description,
  id,
  action,
  className,
  variant = "light",
}: TitleBlockProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <div className="mb-4 flex max-w-160 items-center gap-6 sm:mb-6 sm:gap-8">
            <BMWMStripesStacked />
            <h2
              id={id}
              className={cn(
                "font-headline text-title-2 tracking-wide sm:text-title-1",
                variant === "dark" ? "text-white" : "text-neutral-900"
              )}
            >
              {title}
            </h2>
          </div>
          {description && (
            <p className={cn(
              "max-w-md text-body-xl leading-normal",
              variant === "dark" ? "text-white/80" : "text-neutral-600"
            )}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="hidden shrink-0 sm:block">{action}</div>
        )}
      </div>
    </div>
  );
}

