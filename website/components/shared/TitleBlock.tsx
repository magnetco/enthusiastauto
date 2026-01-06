import { BMWMStripesStacked } from "@/components/icons/bmw-m-stripes";

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
}: TitleBlockProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <div className="mb-4 flex items-center gap-6 sm:mb-6 sm:gap-8">
            <BMWMStripesStacked />
            <h2
              id={id}
              className="font-headline text-title-2 tracking-wide text-neutral-900 sm:text-title-1"
            >
              {title}
            </h2>
          </div>
          {description && (
            <p className="max-w-md text-body-base text-neutral-600 sm:text-body-large">
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

