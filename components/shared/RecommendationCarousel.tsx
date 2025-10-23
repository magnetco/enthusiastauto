import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatMileage } from "@/lib/utils/format";
import { urlFor } from "@/sanity/lib/image";
import Price from "@/components/price";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type RecommendationType = "product" | "vehicle";

interface RecommendationCarouselProps {
  items: Product[] | VehicleListItem[];
  type: RecommendationType;
  title: string;
  emptyMessage?: string;
  emptyCta?: {
    text: string;
    href: string;
  };
  hideIfEmpty?: boolean;
}

function isProduct(item: Product | VehicleListItem): item is Product {
  return "handle" in item && "vendor" in item;
}

function isVehicle(item: Product | VehicleListItem): item is VehicleListItem {
  return "chassis" in item && "mileage" in item;
}

/**
 * Product card for recommendations
 * Simplified version of ProductCard (server component, no cart)
 */
function ProductRecommendationCard({ product }: { product: Product }) {
  const imageUrl = product.images[0]?.url || product.featuredImage?.url;
  const imageAlt =
    product.images[0]?.altText || `${product.title} by ${product.vendor}`;
  const isInStock = product.availableForSale;

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block h-full"
      aria-label={`View ${product.title}`}
    >
      <Card className="h-full overflow-hidden border-gray-200 transition-shadow duration-200 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          {/* Out of Stock Badge */}
          {!isInStock && (
            <div className="absolute right-2.5 top-2.5">
              <Badge
                variant="secondary"
                className="bg-muted px-2 py-0.5 text-xs text-muted-foreground shadow-md"
              >
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          {/* Product Title */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight text-foreground group-hover:text-red-500">
            {product.title}
          </h3>

          {/* Vendor */}
          <p className="mb-2 text-xs text-gray-400">{product.vendor}</p>

          {/* Price */}
          <div className="text-sm font-semibold text-red-500">
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
              className="text-sm font-semibold text-red-500"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Vehicle card for recommendations
 * Simplified version of VehicleCard
 */
function VehicleRecommendationCard({ vehicle }: { vehicle: VehicleListItem }) {
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
      aria-label={`View ${vehicle.listingTitle}`}
    >
      <Card className="h-full overflow-hidden border-gray-200 transition-shadow duration-200 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={vehicle.listingTitle}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* SOLD Overlay */}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-md bg-white/90 px-6 py-3">
                <span className="text-2xl font-bold text-gray-900">SOLD</span>
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
          <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-red-500">
            {vehicle.listingTitle}
          </h3>

          {/* Chassis Badge */}
          <div className="mb-3">
            <Badge
              variant="outline"
              className="border-gray-600 text-xs text-gray-300"
            >
              {vehicle.chassis}
            </Badge>
          </div>

          {/* Price and Mileage */}
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-red-500">
              {formatCurrency(vehicle.listingPrice, vehicle.showCallForPrice)}
            </p>
            <p className="text-gray-400">{formatMileage(vehicle.mileage)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * RecommendationCarousel Component
 * Polymorphic component for displaying product or vehicle recommendations
 * with responsive grid layout and empty state handling
 */
export function RecommendationCarousel({
  items,
  type,
  title,
  emptyMessage,
  emptyCta,
  hideIfEmpty = false,
}: RecommendationCarouselProps) {
  // If no items and hideIfEmpty is true, don't render anything
  if (items.length === 0 && hideIfEmpty) {
    return null;
  }

  // Default empty messages based on type
  const defaultEmptyMessage =
    type === "product"
      ? "No compatible parts currently available. Check back soon or contact us for custom recommendations."
      : "No vehicles currently in stock with this part. View our full inventory to explore available vehicles.";

  const defaultEmptyCta =
    type === "product"
      ? { text: "Browse All Parts", href: "/search" }
      : { text: "Browse All Vehicles", href: "/vehicles" };

  return (
    <section
      className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-5 sm:py-12"
      aria-labelledby={`${type}-recommendations-heading`}
    >
      {/* Section Header */}
      <div className="mb-6">
        <h2
          id={`${type}-recommendations-heading`}
          className="text-2xl font-bold text-foreground sm:text-3xl"
        >
          {title}
        </h2>
      </div>

      {/* Items Grid or Empty State */}
      {items.length > 0 ? (
        <div
          className={cn(
            "grid gap-4 sm:gap-6",
            type === "product"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2",
          )}
        >
          {items.map((item) => {
            if (type === "product" && isProduct(item)) {
              return (
                <ProductRecommendationCard key={item.id} product={item} />
              );
            } else if (type === "vehicle" && isVehicle(item)) {
              return (
                <VehicleRecommendationCard key={item._id} vehicle={item} />
              );
            }
            return null;
          })}
        </div>
      ) : (
        <Alert className="border-muted bg-muted/10">
          <InfoCircledIcon className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {emptyMessage || defaultEmptyMessage}
          </AlertDescription>
          {(emptyCta || defaultEmptyCta) && (
            <div className="mt-4">
              <Link
                href={(emptyCta || defaultEmptyCta).href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                {(emptyCta || defaultEmptyCta).text}
              </Link>
            </div>
          )}
        </Alert>
      )}
    </section>
  );
}
