import { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

// Skeleton loader for product cards - matches light mode card design with brand colors
export function ProductCardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-[#DFE5EA]">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full bg-[#DFE5EA]" />
      {/* Content skeleton */}
      <div className="flex-1 p-4 flex flex-col">
        <Skeleton className="h-3 w-16 mb-2 bg-[#DFE5EA]" />
        <Skeleton className="h-4 w-full mb-1 bg-[#DFE5EA]" />
        <Skeleton className="h-4 w-3/4 mb-auto bg-[#DFE5EA]" />
        <div className="mt-3 pt-3 border-t border-[#DFE5EA]">
          <Skeleton className="h-6 w-24 bg-[#DFE5EA]" />
        </div>
      </div>
    </div>
  );
}

// Loading state - displays skeleton loaders
export function ProductGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Empty state - light mode design with brand colors
export function ProductGridEmpty() {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#CCCCCC] bg-[#f8f8f8]">
      <svg
        className="mb-3 h-12 w-12 text-[#CCCCCC]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="mb-1.5 text-[15px] font-medium text-[#282a30]">
        No products found
      </h3>
      <p className="text-sm text-[#6f6e77]">
        Check back soon for new BMW parts and accessories.
      </p>
    </div>
  );
}

// Main ProductGrid component
export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return <ProductGridLoading />;
  }

  if (!products || products.length === 0) {
    return <ProductGridEmpty />;
  }

  return (
    <section aria-label="Product list">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
