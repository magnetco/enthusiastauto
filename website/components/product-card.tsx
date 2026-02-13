"use client";

import { Product } from "@/lib/shopify/types";
import { FitmentBadge } from "@/components/FitmentBadge";
import { matchVehicle } from "@/lib/utils/vehicle";
import { useCart } from "@/components/cart/cart-context";
import { addItem } from "@/components/cart/actions";
import Image from "next/image";
import Link from "next/link";
import Price from "@/components/price";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { startTransition, useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
  vehicle?: { model: string; year: number } | null;
}

export function ProductCard({ product, vehicle = null }: ProductCardProps) {
  // Try to get vehicle from FilterContext if available (client-side only)
  const [filters, setFilters] = useState<{ vehicle: any }>({ vehicle });
  
  useEffect(() => {
    // Only try to access FilterContext on client side after mount
    if (typeof window === "undefined") return;
    
    // Use dynamic import to prevent SSR evaluation
    // This will only work if FilterProvider is mounted in the component tree
    import("@/contexts/FilterContext").then((mod) => {
      try {
        // useFilters hook requires FilterProvider to be in the tree
        // If it's not available, it will return null, which is fine
        const context = mod.useFilters();
        if (context?.filters) {
          setFilters(context.filters);
        }
      } catch {
        // FilterContext not available, keep default vehicle prop
      }
    }).catch(() => {
      // FilterContext module not available, keep default
    });
  }, []);
  const { addCartItem } = useCart();

  const isInStock = product.availableForSale;
  const imageUrl = product.images[0]?.url || product.featuredImage?.url;
  const imageAlt =
    product.images[0]?.altText || `${product.title} by ${product.vendor}`;

  // Determine fitment status when vehicle is selected
  const fitmentStatus = matchVehicle(product, filters?.vehicle || null);
  const showFitmentBadge = filters?.vehicle !== null && filters?.vehicle !== undefined;

  // Get default variant (first available variant)
  const defaultVariant = product.variants[0];

  // Handle Add to Cart
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || !isInStock) return;

    startTransition(() => {
      addCartItem(defaultVariant, product);
    });

    await addItem(null, defaultVariant.id);

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
      <article className="h-full flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-200 border border-gray-200 hover:shadow-lg hover:border-gray-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
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
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-gray-300">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}

          {/* Stock status badge */}
          {!isInStock && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide bg-gray-900/90 text-white backdrop-blur-sm">
                Sold Out
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast("Added to wishlist", { duration: 2000 });
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105 shadow-sm"
            aria-label="Add to wishlist"
          >
            <HeartIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Vendor Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
              {product.vendor}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-4" />

          {/* Price & Actions */}
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Price
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                className="text-lg font-bold text-blue-600 tabular-nums"
              />

              {showFitmentBadge && (
                <div className="shrink-0">
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

            {/* Add to Cart Button */}
            {isInStock && (
              <button
                onClick={handleAddToCart}
                aria-label={`Add ${product.title} to cart`}
                className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-200"
              >
                <ShoppingCartIcon className="w-4 h-4" aria-hidden="true" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
