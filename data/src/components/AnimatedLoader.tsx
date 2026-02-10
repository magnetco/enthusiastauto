import { cn } from "../lib/utils";

interface AnimatedLoaderProps {
  /** Size of the loader in pixels (default: 48) */
  size?: number;
  /** Thickness of the ring in pixels (default: 3) */
  thickness?: number;
  /** Loading message to display below the spinner */
  message?: string;
  /** Additional className for the container */
  className?: string;
}

/**
 * AnimatedLoader Component
 * 
 * A beautiful animated loader with rotating gradient border effect,
 * matching the homepage hero button animation.
 * 
 * Gradient colors: #026AA2 → #529BCA → #F90020
 * Animation: 3.5s linear infinite rotation
 * 
 * Performance optimized with:
 * - CSS transforms for GPU acceleration
 * - Respects prefers-reduced-motion
 */
export function AnimatedLoader({
  size = 48,
  thickness = 3,
  message,
  className,
}: AnimatedLoaderProps) {
  const innerSize = size - thickness * 2;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      {/* Rotating gradient ring */}
      <div
        className="relative rounded-full loader-ring"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: "conic-gradient(from var(--gradient-angle, 0deg), #026AA2 0%, #529BCA 33%, #F90020 66%, #026AA2 100%)",
          padding: `${thickness}px`,
        }}
      >
        {/* Inner circle (creates ring effect) */}
        <div
          className="rounded-full"
          style={{
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            background: "hsl(var(--background))",
          }}
        />
      </div>

      {/* Optional loading message */}
      {message && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

/**
 * FullPageLoader Component
 * 
 * A full-screen overlay loader for page transitions and lazy loading.
 */
interface FullPageLoaderProps {
  /** Whether the loader is visible */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Background overlay opacity (0-1, default: 0.8) */
  overlayOpacity?: number;
}

export function FullPageLoader({
  isLoading,
  message = "Loading...",
  overlayOpacity = 0.8,
}: FullPageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
      style={{
        backgroundColor: `hsl(var(--background) / ${overlayOpacity})`,
        backdropFilter: "blur(8px)",
      }}
    >
      <AnimatedLoader size={64} thickness={4} message={message} />
    </div>
  );
}

/**
 * InlineLoader Component
 * 
 * A smaller inline loader for loading states within components.
 */
interface InlineLoaderProps {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional message */
  message?: string;
  /** Additional className */
  className?: string;
}

export function InlineLoader({
  size = "md",
  message,
  className,
}: InlineLoaderProps) {
  const sizeMap = {
    sm: { size: 24, thickness: 2 },
    md: { size: 32, thickness: 2.5 },
    lg: { size: 48, thickness: 3 },
  };

  const { size: loaderSize, thickness } = sizeMap[size];

  return (
    <AnimatedLoader
      size={loaderSize}
      thickness={thickness}
      message={message}
      className={className}
    />
  );
}
