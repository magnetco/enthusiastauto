"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { useEffect, useState } from "react";

export function StickyAddToCart({ product }: { product: Product }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when user scrolls past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-sm transition-transform duration-300 lg:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-sm font-medium text-foreground">
            {product.title}
          </h2>
          <div className="text-lg font-bold text-foreground">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
        <div className="w-36 flex-shrink-0">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
