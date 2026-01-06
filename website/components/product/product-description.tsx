import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";
import { Badge } from "components/ui/badge";
import { FitmentInfo } from "./fitment-info";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-8 flex flex-col border-b border-border/50 pb-8">
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">{product.title}</h1>
        <div className="flex gap-2 mb-4">
          {product.vendor && (
            <Badge variant="secondary" className="text-xs font-medium">{product.vendor}</Badge>
          )}
          <Badge variant={product.availableForSale ? "success" : "destructive"} className="text-xs font-medium">
            {product.availableForSale ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <div className="inline-flex w-fit items-center rounded-full bg-primary px-4 py-2.5 text-lg font-semibold text-primary-foreground shadow-md">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <FitmentInfo product={product} />
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-8 text-sm leading-relaxed text-muted-foreground"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
