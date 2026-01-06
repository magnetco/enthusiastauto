"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { useEffect, useState } from "react";

export function StickyAddToCart({ product }: { product: Product }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when user scrolls past 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 p-4 lg:hidden transition-transform duration-300 z-50 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4 max-w-screen-xl mx-auto">
        <div className="flex flex-col">
          <h2 className="font-medium text-sm truncate max-w-[180px]">
            {product.title}
          </h2>
          <div className="text-lg font-bold text-blue-600">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
        <div className="flex-shrink-0 w-40">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
