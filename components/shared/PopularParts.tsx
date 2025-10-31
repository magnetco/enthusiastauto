import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import Section from "@/components/layout/section";

export async function PopularParts() {
  // Fetch products from Shopify (will be cached with 'days' cacheLife)
  // Get 8 products for the homepage showcase
  const products = await getProducts({
    sortKey: "BEST_SELLING",
    reverse: false,
  });

  // Limit to 8 products for homepage display
  const featuredProducts = products.slice(0, 8);

  // If no products, don't render section
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <Section className="py-8 sm:py-12 lg:py-16" aria-labelledby="popular-parts-heading">
      {/* Section Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2
            id="popular-parts-heading"
            className="text-title-2 font-bold text-foreground"
          >
            Popular Products
          </h2>
          <p className="mt-2 text-body-base text-muted-foreground sm:text-body-large">
            Premium BMW parts and accessories
          </p>
        </div>

        {/* Shop All CTA - Desktop */}
        <Link
          href="/search"
          aria-label="View all parts"
          className={cn(buttonVariants({ variant: "outline" }), "hidden sm:flex")}
        >
          Shop All Parts
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Shop All CTA - Mobile */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/search"
          aria-label="View all parts"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto",
          )}
        >
          Shop All Parts
        </Link>
      </div>
    </Section>
  );
}
