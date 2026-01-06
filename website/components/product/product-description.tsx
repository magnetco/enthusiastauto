"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";
import { FitmentInfo } from "./fitment-info";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      {/* Price Display */}
      <div className="mb-6">
        <span className="text-sm text-neutral-500">Price</span>
        <div className="mt-1 text-3xl font-bold text-neutral-900">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>

      {/* Fitment Information */}
      <FitmentInfo product={product} />

      {/* Variant Options */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Add to Cart */}
      <AddToCart product={product} />
    </div>
  );
}
