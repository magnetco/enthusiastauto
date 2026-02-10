import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TitleBlock } from "@/components/shared/TitleBlock";

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
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <TitleBlock
            title="Parts"
            description="Premium BMW parts and accessories from our catalog"
            id="popular-parts-heading"
            action={
              <Link
                href="/search"
                aria-label="View all parts"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 border-border text-foreground hover:bg-muted"
                )}
              >
                Shop All Parts
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
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
              "w-full gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
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
