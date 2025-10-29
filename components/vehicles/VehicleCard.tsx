import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatMileage } from "@/lib/utils/format";
import { urlFor } from "@/sanity/lib/image";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

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

  return (
    <Link
      href={`/vehicles/${vehicle.slug.current}`}
      className={`group block h-full transition-all duration-200 hover:scale-[1.02] ${
        isSold ? "opacity-70" : ""
      }`}
    >
      <Card className="h-full overflow-hidden border transition-shadow duration-200 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={vehicle.listingTitle}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* SOLD Overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-md bg-white/90 px-6 py-3">
                <span className="text-title-2 font-bold text-foreground">SOLD</span>
              </div>
            </div>
          )}

          {/* Status Badge */}
          {isSold && (
            <div className="absolute right-3 top-3">
              <Badge
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                SOLD
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          {/* Vehicle Title */}
          <h3 className="mb-2 text-body-large font-semibold text-foreground group-hover:text-primary">
            {vehicle.listingTitle}
          </h3>

          {/* Chassis Badge */}
          <div className="mb-3">
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              {vehicle.chassis}
            </Badge>
          </div>

          {/* Price and Mileage */}
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-primary">
              {formatCurrency(vehicle.listingPrice, vehicle.showCallForPrice)}
            </p>
            <p className="text-muted-foreground">{formatMileage(vehicle.mileage)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
