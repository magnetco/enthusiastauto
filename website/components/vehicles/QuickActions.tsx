"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  HeartIcon as HeartOutline,
  FunnelIcon,
  ShareIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface QuickActionsProps {
  vehicleId: string;
  vehicleTitle: string;
  isFavorite?: boolean;
  isInComparison?: boolean;
  onFavoriteToggle?: () => void;
  onCompareToggle?: () => void;
  onShare?: () => void;
  onGalleryOpen?: () => void;
  className?: string;
}

/**
 * Quick Actions Component
 * Provides favorite, compare, share, and gallery actions for vehicles
 * Icons: 24px, outlined default, filled on hover/active
 */
export function QuickActions({
  vehicleId,
  vehicleTitle,
  isFavorite = false,
  isInComparison = false,
  onFavoriteToggle,
  onCompareToggle,
  onShare,
  onGalleryOpen,
  className,
}: QuickActionsProps) {
  const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior - copy link
      const url = `${window.location.origin}/vehicles/${vehicleId}`;
      navigator.clipboard.writeText(url);
      // TODO: Show toast notification
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Favorite */}
      {onFavoriteToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteToggle();
          }}
          onMouseEnter={() => setIsHoveringFavorite(true)}
          onMouseLeave={() => setIsHoveringFavorite(false)}
          className={cn(
            "rounded-full p-1.5 transition-all duration-200",
            "hover:bg-red-50",
            isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite || isHoveringFavorite ? (
            <HeartSolid className="h-6 w-6" />
          ) : (
            <HeartOutline className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Compare */}
      {onCompareToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareToggle();
          }}
          className={cn(
            "rounded-full p-1.5 transition-all duration-200",
            "hover:bg-blue-50",
            isInComparison
              ? "bg-blue-50 text-blue-600"
              : "text-gray-400 hover:text-blue-600"
          )}
          aria-label={isInComparison ? "Remove from comparison" : "Add to comparison"}
          title={isInComparison ? "Remove from comparison" : "Add to comparison"}
        >
          <FunnelIcon className="h-6 w-6" />
        </button>
      )}

      {/* Share */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare();
        }}
        className={cn(
          "rounded-full p-1.5 text-gray-400 transition-all duration-200",
          "hover:bg-gray-100 hover:text-gray-600"
        )}
        aria-label={`Share ${vehicleTitle}`}
        title="Share vehicle"
      >
        <ShareIcon className="h-6 w-6" />
      </button>

      {/* Gallery */}
      {onGalleryOpen && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onGalleryOpen();
          }}
          className={cn(
            "rounded-full p-1.5 text-gray-400 transition-all duration-200",
            "hover:bg-gray-100 hover:text-gray-600"
          )}
          aria-label={`View ${vehicleTitle} gallery`}
          title="View gallery"
        >
          <PhotoIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
