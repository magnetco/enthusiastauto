"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { InlineLoader } from "./animated-loader";
import { useLazyImage } from "@/hooks/use-lazy-image";

interface LazyImageProps extends Omit<React.ComponentProps<typeof Image>, "src"> {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Show loader while image loads (default: true) */
  showLoader?: boolean;
  /** Loader size variant */
  loaderSize?: "sm" | "md" | "lg";
  /** Container className */
  containerClassName?: string;
}

/**
 * LazyImage Component
 * 
 * A wrapper around Next.js Image that shows an animated loader
 * while the image is downloading. Especially useful for large
 * inventory photos.
 * 
 * @example
 * ```tsx
 * <LazyImage
 *   src="/vehicles/e46-m3-hero.jpg"
 *   alt="2006 BMW E46 M3"
 *   width={1200}
 *   height={800}
 *   showLoader
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  showLoader = true,
  loaderSize = "md",
  containerClassName,
  className,
  onLoad,
  ...props
}: LazyImageProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const { isLoading } = useLazyImage(src);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    onLoad?.(e);
  };

  return (
    <div className={cn("relative", containerClassName)}>
      {/* Loader overlay */}
      {showLoader && (isLoading || !imageLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-(--color-bg-dark-blue-primary) z-10">
          <InlineLoader size={loaderSize} />
        </div>
      )}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}
