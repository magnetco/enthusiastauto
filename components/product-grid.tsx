import { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

// Skeleton loader for product cards
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

// Loading state - displays skeleton loaders
export function ProductGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Empty state
export function ProductGridEmpty() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
      <svg
        className="mb-4 h-12 w-12 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        No products found
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
    <main>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
