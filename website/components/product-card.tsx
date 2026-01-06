"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/shopify/types";
import { FitmentBadge } from "@/components/FitmentBadge";
import { useFilters } from "@/contexts/FilterContext";
import { matchVehicle } from "@/lib/utils/vehicle";
import { useCart } from "@/components/cart/cart-context";
import { addItem } from "@/components/cart/actions";
import Image from "next/image";
import Link from "next/link";
import Price from "@/components/price";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { startTransition } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const filterContext = useFilters();
  const filters = filterContext?.filters || { vehicle: null };
  const { addCartItem } = useCart();

  const isInStock = product.availableForSale;
  const imageUrl = product.images[0]?.url || product.featuredImage?.url;
  const imageAlt =
    product.images[0]?.altText || `${product.title} by ${product.vendor}`;

  // Determine fitment status when vehicle is selected
  const fitmentStatus = matchVehicle(product, filters.vehicle);
  const showFitmentBadge = filters.vehicle !== null;

  // Get default variant (first available variant)
  const defaultVariant = product.variants[0];

  // Handle Add to Cart
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent bubbling to parent link

    if (!defaultVariant || !isInStock) return;

    // Optimistic update wrapped in transition
    startTransition(() => {
      addCartItem(defaultVariant, product);
    });

    // Server action for Shopify persistence
    await addItem(null, defaultVariant.id);

    // Show success toast
    toast.success("Added to cart!", {
      description: product.title,
      duration: 3000,
    });
  };

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block h-full"
      aria-label={`View details for ${product.title}`}
    >
      <Card className="h-full overflow-hidden rounded-lg border transition-shadow duration-100">
        <div className="relative aspect-square overflow-hidden bg-muted/10">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-all duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}

            {/* Stock status badge - Only show if out of stock */}
            {!isInStock && (
              <div className="absolute right-2.5 top-2.5">
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground shadow-md text-xs px-2 py-0.5"
                >
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Add to Cart Button - Overlaid at bottom, shown on hover */}
            {isInStock && (
              <button
                onClick={handleAddToCart}
                aria-label={`Add ${product.title} to cart`}
                className="absolute bottom-2.5 left-2.5 right-2.5 rounded-md bg-accent/95 backdrop-blur-sm py-2 px-3.5 text-xs font-medium text-white opacity-0 transition-all duration-100 group-hover:opacity-100 hover:bg-accent shadow-[var(--shadow-medium)] flex items-center justify-center gap-1.5"
              >
                <ShoppingCartIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Add to Cart
              </button>
            )}
          </div>

        <CardContent className="p-4">
          <div className="space-y-1.5">
            {/* Product title - truncate to 2 lines */}
            <h3 id={`product-title-${product.id}`} className="line-clamp-2 text-sm font-medium leading-tight tracking-[-0.006em] text-foreground normal-case">
              {product.title}
            </h3>

            {/* Vendor */}
            <p className="text-xs font-medium text-muted-foreground">
              {product.vendor}
            </p>

            {/* Price */}
            <div>
              <Price
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                className="text-sm font-semibold text-foreground"
              />
            </div>

            {/* Fitment badge */}
            {showFitmentBadge && (
              <div className="pt-0">
                {fitmentStatus === "compatible" && (
                  <FitmentBadge
                    variant="compatible"
                    modelName={filters.vehicle?.model}
                    year={filters.vehicle?.year}
                  />
                )}
                {fitmentStatus === "universal" && (
                  <FitmentBadge variant="check-fitment" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
