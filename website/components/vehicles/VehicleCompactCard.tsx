import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatMileage } from "@/lib/utils/format";
import { urlFor } from "@/lib/sanity/image";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

interface VehicleCompactCardProps {
  vehicle: VehicleListItem;
  priority?: boolean;
}

/**
 * Compact Vehicle Card Component
 * Smaller, denser card for compact grid view
 * Shows only essential information: image, title, chassis, price
 */
export function VehicleCompactCard({ vehicle, priority = false }: VehicleCompactCardProps) {
  const isSold = vehicle.status === "sold";

  // Select hero image based on status
  const heroImage = isSold ? vehicle.soldShot : vehicle.signatureShot;
  const imageUrl = heroImage
    ? urlFor(heroImage).width(400).height(300).url()
    : "https://placehold.co/400x300/e5e7eb/6b7280?text=No+Image";

  return (
    <Link
      href={`/vehicles/${vehicle.slug.current}`}
      className={`group block h-full transition-all duration-200 ${
        isSold ? "opacity-70" : ""
      }`}
    >
      <Card className="h-full overflow-hidden rounded-lg border hover:shadow-md">
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={vehicle.listingTitle}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* SOLD Overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-md bg-white/90 px-4 py-2">
                <span className="text-lg font-bold text-foreground">SOLD</span>
              </div>
            </div>
          )}

          {/* Status Badge */}
          {isSold && (
            <div className="absolute right-2 top-2">
              <Badge variant="destructive" className="text-xs">
                SOLD
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Vehicle Title */}
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
              {vehicle.listingTitle}
            </h3>

            {/* Chassis Badge */}
            <div>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {vehicle.chassis}
              </Badge>
            </div>

            {/* Price */}
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(vehicle.listingPrice, vehicle.showCallForPrice)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
