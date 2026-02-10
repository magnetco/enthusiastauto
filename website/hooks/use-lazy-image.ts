"use client";

import { useState, useEffect } from "react";

interface UseLazyImageOptions {
  /** Delay before starting to load the image (ms) */
  delay?: number;
  /** Callback when image starts loading */
  onLoadStart?: () => void;
  /** Callback when image finishes loading */
  onLoadComplete?: () => void;
  /** Callback when image fails to load */
  onError?: (error: Error) => void;
}

interface UseLazyImageReturn {
  /** Whether the image is currently loading */
  isLoading: boolean;
  /** Whether the image has loaded successfully */
  isLoaded: boolean;
  /** Error if image failed to load */
  error: Error | null;
  /** Image source to use (empty string until ready to load) */
  src: string;
}

/**
 * Hook for lazy loading images with loading states
 * 
 * Useful for large images like inventory shots that benefit from
 * showing a loader while the image downloads.
 * 
 * @example
 * ```tsx
 * const { isLoading, src } = useLazyImage('/large-image.jpg');
 * 
 * return (
 *   <div>
 *     {isLoading && <AnimatedLoader />}
 *     <img src={src} alt="..." />
 *   </div>
 * );
 * ```
 */
export function useLazyImage(
  imageSrc: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const { delay = 0, onLoadStart, onLoadComplete, onError } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!imageSrc) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadImage = () => {
      setIsLoading(true);
      onLoadStart?.();

      const img = new Image();

      img.onload = () => {
        if (!isMounted) return;
        setIsLoading(false);
        setIsLoaded(true);
        setSrc(imageSrc);
        onLoadComplete?.();
      };

      img.onerror = () => {
        if (!isMounted) return;
        const err = new Error(`Failed to load image: ${imageSrc}`);
        setError(err);
        setIsLoading(false);
        onError?.(err);
      };

      img.src = imageSrc;
    };

    if (delay > 0) {
      timeoutId = setTimeout(loadImage, delay);
    } else {
      loadImage();
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [imageSrc, delay, onLoadStart, onLoadComplete, onError]);

  return { isLoading, isLoaded, error, src };
}
