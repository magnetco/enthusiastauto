import { cn } from "@/lib/utils";

interface GradientLineProps {
  className?: string;
}

/**
 * GradientLine Component
 * 
 * A decorative gradient line using BMW M-inspired colors.
 * Gradient flows from dark gray → blue → purple → red.
 * 
 * Based on the design system's brand colors:
 * - Start: #151515 (dark gray)
 * - Mid-1: #529BCA (blue)
 * - Mid-2: #292664 (purple)
 * - End: #D12026 (brand red)
 */
export function GradientLine({ className }: GradientLineProps) {
  return (
    <div className={cn("w-full", className)} aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="2"
        viewBox="0 0 1013 2"
        fill="none"
        preserveAspectRatio="none"
        className="h-0.5 w-full"
      >
        <path
          d="M0 1H1013"
          stroke="url(#paint0_linear_gradient_line)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient
            id="paint0_linear_gradient_line"
            x1="0"
            y1="1.5"
            x2="1013"
            y2="1.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#151515" />
            <stop offset="0.307692" stopColor="#529BCA" />
            <stop offset="0.615385" stopColor="#292664" />
            <stop offset="1" stopColor="#D12026" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
