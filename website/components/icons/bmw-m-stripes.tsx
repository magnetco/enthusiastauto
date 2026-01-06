import clsx from "clsx";

interface BMWMStripesProps extends React.ComponentProps<"svg"> {
  size?: "sm" | "md" | "lg";
}

/**
 * BMW M Stripes Icon
 * The iconic BMW Motorsport tri-color stripes (blue, violet, red)
 */
export function BMWMStripes({ size = "md", className, ...props }: BMWMStripesProps) {
  const sizeClasses = {
    sm: "h-4 w-auto",
    md: "h-6 w-auto",
    lg: "h-8 w-auto",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={clsx(sizeClasses[size], className)}
    >
      {/* Blue stripe */}
      <rect x="2" y="4" width="6" height="16" fill="#0066B1" />
      {/* Violet/Purple stripe */}
      <rect x="9" y="4" width="6" height="16" fill="#6B3FA0" />
      {/* Red stripe */}
      <rect x="16" y="4" width="6" height="16" fill="#E32526" />
    </svg>
  );
}

/**
 * BMW M Stripes Horizontal - Thin horizontal bar version
 * Used for accents and dividers
 */
export function BMWMStripesHorizontal({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      className={clsx("flex h-1 w-12 overflow-hidden rounded-sm", className)} 
      {...props}
    >
      <div className="flex-1 bg-[#0066B1]" />
      <div className="flex-1 bg-[#6B3FA0]" />
      <div className="flex-1 bg-[#E32526]" />
    </div>
  );
}

/**
 * BMW M Stripes Stacked - Three diagonal parallelograms slanting left
 * Used for section title blocks (red, dark blue, light blue from left to right)
 */
export function BMWMStripesStacked({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 27 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("h-5 w-auto", className)}
      {...props}
    >
      {/* Red stripe (left) - slants left */}
      <polygon points="6,0 11,0 5,16 0,16" fill="#E32526" />
      {/* Dark blue stripe (middle) - slants left */}
      <polygon points="14,0 19,0 13,16 8,16" fill="#0066B1" />
      {/* Light blue stripe (right) - slants left, 5 units wide to match others */}
      <polygon points="22,0 27,0 21,16 16,16" fill="#6EB5E0" />
    </svg>
  );
}

/**
 * BMW M Badge - Full M badge with stripes
 */
export function BMWMBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div 
      className={clsx(
        "inline-flex items-center gap-1 rounded-sm bg-white/10 px-2 py-1 backdrop-blur-sm",
        className
      )} 
      {...props}
    >
      <div className="flex h-4 w-3 overflow-hidden rounded-[2px]">
        <div className="flex-1 bg-[#0066B1]" />
        <div className="flex-1 bg-[#6B3FA0]" />
        <div className="flex-1 bg-[#E32526]" />
      </div>
      <span className="text-xs font-bold tracking-wider text-white">POWER</span>
    </div>
  );
}

export default BMWMStripes;

