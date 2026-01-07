interface SectionHeadingProps {
  /** The section title */
  title: string;
  /** HTML id for the heading element (for aria-labelledby) */
  id?: string;
  /** Use destructive color for the /// indicator (for danger zones) */
  variant?: "default" | "destructive";
  /** Optional className for the container */
  className?: string;
}

/**
 * SectionHeading - Compact section header for account/interior pages
 * Displays the /// indicator alongside a title
 * For larger public-facing sections, use TitleBlock instead
 */
export function SectionHeading({
  title,
  id,
  variant = "default",
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span
          className={`font-semibold ${variant === "destructive" ? "text-destructive" : "text-brand-red"}`}
        >
          ///
        </span>
        <h2
          id={id}
          className="text-title-3 font-semibold text-foreground"
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

