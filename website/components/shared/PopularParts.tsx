import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { BMWMStripesHorizontal } from "@/components/icons/bmw-m-stripes";

export async function PopularParts() {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PopularParts.tsx:9',message:'PopularParts start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H7'})}).catch(()=>{});
  // #endregion
  
  // Fetch products from Shopify (will be cached with 'days' cacheLife)
  // Get 8 products for the homepage showcase
  const products = await getProducts({
    sortKey: "BEST_SELLING",
    reverse: false,
  });
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PopularParts.tsx:20',message:'PopularParts success',data:{count:products?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H7'})}).catch(()=>{});
  // #endregion

  // Limit to 8 products for homepage display
  const featuredProducts = products.slice(0, 8);

  // If no products, don't render section
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section
      className="relative bg-background py-16 sm:py-20 lg:py-24"
      aria-labelledby="popular-parts-heading"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header - Matching the inventory style */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-16">
          <div>
            {/* Section Label */}
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-body-small font-medium text-muted-foreground">
                //
              </span>
              <BMWMStripesHorizontal className="h-0.5 w-8" />
            </div>

            <h2
              id="popular-parts-heading"
              className="font-mono text-body-small font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              // Parts
            </h2>

            <p className="mt-3 text-title-1 font-bold text-foreground sm:text-hero">
              Popular Products
            </p>

            <p className="mt-3 max-w-md text-body-base text-muted-foreground sm:text-body-large">
              Premium BMW parts and accessories from our catalog
            </p>
          </div>

          {/* Shop All CTA - Desktop */}
          <Link
            href="/search"
            aria-label="View all parts"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "hidden gap-2 sm:inline-flex"
            )}
          >
            Shop All Parts
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Shop All CTA - Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/search"
            aria-label="View all parts"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full gap-2"
            )}
          >
            Shop All Parts
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
