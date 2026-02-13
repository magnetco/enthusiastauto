import { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

// Skeleton loader for product cards - matches the new cleaner card design
export function ProductCardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full bg-gray-200" />
      {/* Content skeleton */}
      <div className="flex-1 p-6 flex flex-col">
        <Skeleton className="h-6 w-20 mb-3 rounded-md bg-gray-200" />
        <Skeleton className="h-5 w-full mb-2 bg-gray-200" />
        <Skeleton className="h-5 w-3/4 mb-4 bg-gray-200" />
        <div className="border-t border-gray-200 mb-4" />
        <div className="mt-auto space-y-3">
          <Skeleton className="h-6 w-28 bg-gray-200" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// Loading state - displays skeleton loaders
export function ProductGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Empty state - clean design matching the new card style
export function ProductGridEmpty() {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
      <svg
        className="mb-3 h-12 w-12 text-gray-300"
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
      <h3 className="mb-1.5 text-base font-semibold text-gray-900">
        No products found
      </h3>
      <p className="text-sm text-gray-600">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
