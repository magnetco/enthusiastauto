import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import Price from "@/components/price";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isInStock = product.availableForSale;
  const imageUrl = product.images[0]?.url || product.featuredImage?.url;
  const imageAlt =
    product.images[0]?.altText || `${product.title} by ${product.vendor}`;

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

            {/* Compatibility indicator placeholder */}
            <div className="flex items-center gap-1 pt-1">
              <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Compatibility check coming soon
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}
