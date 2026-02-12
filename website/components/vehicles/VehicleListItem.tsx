"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatMileage } from "@/lib/utils/format";
import { urlFor } from "@/lib/sanity/image";
import type { VehicleListItem as VehicleListItemType } from "@/lib/sanity/queries/vehicles";
import { QuickActions } from "./QuickActions";
import { useState, useRef } from "react";

interface VehicleListItemProps {
  vehicle: VehicleListItemType;
  priority?: boolean;
  isFavorite?: boolean;
  isInComparison?: boolean;
  onFavoriteToggle?: () => void;
  onCompareToggle?: () => void;
}

/**
 * Vehicle List Item Component
 * Horizontal layout for detailed list view
 * Design specs from Figma:
 * - Border: 1px gray, 4px blue-800 on hover, red on click
 * - Corner radius: 8px
 * - Internal padding: 16px
 * - Image: 3:2 aspect ratio, 50% width
 * - Hover: Gradient shimmer effect
 */
export function VehicleListItem({
  vehicle,
  priority = false,
  isFavorite = false,
  isInComparison = false,
  onFavoriteToggle,
  onCompareToggle,
}: VehicleListItemProps) {
  const isSold = vehicle.status === "sold";
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const rafRef = useRef<number | undefined>(undefined);

  // Select hero image based on status
  const heroImage = isSold ? vehicle.soldShot : vehicle.signatureShot;
  const imageUrl = heroImage
    ? urlFor(heroImage).width(800).height(533).url()
    : "https://placehold.co/800x533/e5e7eb/6b7280?text=No+Image";

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  // Calculate shimmer gradient
  const shimmerStyle = mousePosition && isHovered
    ? {
        background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(82, 155, 202, 0.15) 0%, rgba(41, 38, 100, 0.1) 30%, transparent 60%)`,
      }
    : {};

  // Days on market calculation
  const daysListed = Math.floor(
    (Date.now() - new Date(vehicle._createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      ref={cardRef}
      href={`/vehicles/${vehicle.slug.current}`}
      className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:border-blue-800 hover:border-4 hover:shadow-lg active:border-red-500"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: isSold ? 0.7 : 1,
      }}
    >
      {/* Shimmer overlay */}
      {isHovered && mousePosition && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={shimmerStyle}
        />
      )}

      <div className="relative flex flex-col gap-4 p-4 md:flex-row md:gap-6">
        {/* Left Side: Image (50% width) */}
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-3/2 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={imageUrl}
              alt={vehicle.listingTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* SOLD Overlay */}
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="rounded-md bg-white/90 px-6 py-3">
                  <span className="text-title-2 font-bold text-foreground">SOLD</span>
                </div>
              </div>
            )}

            {/* Status Badges - Top Left */}
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {vehicle.statusTag === "SALE PENDING" && (
                <Badge className="bg-red-600 text-white hover:bg-red-700">
                  SALE PENDING
                </Badge>
              )}
              {vehicle.featuredVehicle && (
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  FEATURED VEHICLE
                </Badge>
              )}
            </div>

            {/* EAG Signature Badge - Top Right */}
            {vehicle.statusTag === "EAG SIGNATURE" && (
              <div className="absolute right-3 top-3">
                <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-600">
                  EAG SIGNATURE
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details (50% width) */}
        <div className="relative flex w-full flex-col gap-3 md:w-1/2">
          {/* Title and Price Row */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
              {vehicle.listingTitle}
            </h3>
            <p className="shrink-0 text-xl font-semibold text-primary">
              {formatCurrency(vehicle.listingPrice, vehicle.showCallForPrice)}
            </p>
          </div>

          {/* Color and Quick Actions Row */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {vehicle.exteriorColor && vehicle.interiorColor
                ? `${vehicle.exteriorColor} / ${vehicle.interiorColor}`
                : "Color information not available"}
            </p>
            <QuickActions
              vehicleId={vehicle.slug.current}
              vehicleTitle={vehicle.listingTitle}
              isFavorite={isFavorite}
              isInComparison={isInComparison}
              onFavoriteToggle={onFavoriteToggle}
              onCompareToggle={onCompareToggle}
            />
          </div>

          {/* Specs Section - Two Columns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Column: VIN, Transmission, Mileage */}
            <div className="space-y-2 text-sm">
              {vehicle.vin && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-700">VIN</span>
                  <span className="text-neutral-600">{vehicle.vin}</span>
                </div>
              )}
              {vehicle.transmission && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-700">Transmission</span>
                  <span className="text-neutral-600">{vehicle.transmission}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">Mileage</span>
                <span className="text-neutral-600">{formatMileage(vehicle.mileage)}</span>
              </div>
            </div>

            {/* Right Column: Features (bullet points) */}
            <div className="space-y-1">
              {vehicle.listingThumbnailFeatures && vehicle.listingThumbnailFeatures.length > 0 ? (
                <ul className="space-y-1 text-sm text-neutral-600">
                  {vehicle.listingThumbnailFeatures.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500">No features listed</p>
              )}
            </div>
          </div>

          {/* Bottom Row: Additional Info */}
          <div className="mt-auto flex items-center gap-4 text-xs text-neutral-500">
            <Badge variant="outline" className="text-xs">
              {vehicle.chassis}
            </Badge>
            {daysListed > 0 && (
              <span>Listed {daysListed} {daysListed === 1 ? "day" : "days"} ago</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
