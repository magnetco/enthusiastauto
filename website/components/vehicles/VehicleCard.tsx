import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatMileage } from "@/lib/utils/format";
import { urlFor } from "@/lib/sanity/image";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import { HeartIcon, FunnelIcon, ShareIcon } from "@heroicons/react/24/outline";

interface VehicleCardProps {
  vehicle: VehicleListItem;
  priority?: boolean; // For eager loading first 6 images
}

export function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
  const isSold = vehicle.status === "sold";

  // Select hero image based on status
  const heroImage = isSold ? vehicle.soldShot : vehicle.signatureShot;
  const imageUrl = heroImage
    ? urlFor(heroImage).width(600).height(400).url()
    : "https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image";

  // Format colors
  const colorInfo = vehicle.exteriorColor && vehicle.interiorColor
    ? `${vehicle.exteriorColor} / ${vehicle.interiorColor}`
    : null;

  return (
    <Link
      href={`/vehicles/${vehicle.slug.current}`}
      className={`group block h-full transition-all duration-200 ${
        isSold ? "opacity-70" : ""
      }`}
    >
      <Card className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 transition-all">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={vehicle.listingTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* SOLD Overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-md bg-white/90 px-6 py-3">
                <span className="text-xl font-bold text-gray-900">SOLD</span>
              </div>
            </div>
          )}

          {/* Status Badges - Top Left */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {vehicle.statusTag === "SALE PENDING" && (
              <Badge className="bg-red-600 text-white hover:bg-red-700 rounded-md">
                SALE PENDING
              </Badge>
            )}
            {vehicle.featuredVehicle && (
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 rounded-md">
                FEATURED
              </Badge>
            )}
            {vehicle.statusTag === "EAG SIGNATURE" && (
              <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-600 rounded-md">
                EAG SIGNATURE
              </Badge>
            )}
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Chassis Badge */}
            <div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-700">
                {vehicle.chassis}
              </span>
            </div>

            {/* Vehicle Title */}
            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
              {vehicle.listingTitle}
            </h3>

            {/* Price */}
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(vehicle.listingPrice, vehicle.showCallForPrice)}
            </p>

            {/* Mileage */}
            <p className="text-sm text-gray-600">{formatMileage(vehicle.mileage)}</p>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Vehicle Details */}
            <div className="space-y-1.5 text-sm text-gray-600">
              {/* VIN */}
              {vehicle.vin && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900 min-w-[80px]">VIN:</span>
                  <span className="break-all">{vehicle.vin}</span>
                </div>
              )}

              {/* Transmission */}
              {vehicle.transmission && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900 min-w-[80px]">Trans:</span>
                  <span>{vehicle.transmission}</span>
                </div>
              )}

              {/* Colors */}
              {colorInfo && (
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900 min-w-[80px]">Color:</span>
                  <span>{colorInfo}</span>
                </div>
              )}
            </div>

            {/* Key Features */}
            {vehicle.listingThumbnailFeatures && vehicle.listingThumbnailFeatures.length > 0 && (
              <>
                <div className="border-t border-gray-200" />
                <ul className="space-y-1 text-sm text-gray-600">
                  {vehicle.listingThumbnailFeatures.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Listed Date */}
            <div className="pt-2">
              <span className="text-xs text-gray-500">
                Listed {(() => {
                  const days = Math.floor(
                    (Date.now() - new Date(vehicle._createdAt).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return days === 0 ? 'today' : days === 1 ? '1 day ago' : `${days} days ago`;
                })()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
