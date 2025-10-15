"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    e.stopPropagation();

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
    <article className="group">
      <Link
        href={`/product/${product.handle}`}
        className="block"
        aria-label={`View ${product.title}`}
      >
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                No image
              </div>
            )}

            {/* Stock status badge */}
            <div className="absolute right-2 top-2">
              <Badge
                variant={isInStock ? "default" : "secondary"}
                className={
                  isInStock
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-neutral-500 text-white"
                }
              >
                {isInStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          <CardContent className="space-y-2 p-4">
            {/* Product title - truncate to 2 lines */}
            <h3 className="line-clamp-2 font-outfit text-base font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
              {product.title}
            </h3>

            {/* Vendor */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {product.vendor}
            </p>

            {/* Price */}
            <div className="pt-1">
              <Price
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Fitment badge */}
            {showFitmentBadge && (
              <div className="pt-1">
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
          </CardContent>
        </Card>
      </Link>

      {/* Add to Cart Button - Outside the Link to prevent navigation */}
      <div className="mt-3">
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          aria-label={`Add ${product.title} to cart`}
          className="w-full rounded-full bg-blue-600 py-3 px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:opacity-60 dark:disabled:bg-neutral-700 flex items-center justify-center gap-2 min-h-[44px]"
        >
          <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
