import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CompatiblePartsSkeletonProps {
  count?: number;
}

/**
 * Skeleton loading state for the compatible parts section
 * Displays animated placeholder cards while parts data loads
 */
export function CompatiblePartsSkeleton({
  count = 8,
}: CompatiblePartsSkeletonProps) {
  return (
    <section
      className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-5 sm:py-12"
      aria-label="Loading compatible parts"
    >
      {/* Section Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 sm:h-9" />
      </div>

      {/* Parts Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <PartCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

/**
 * Individual part card skeleton
 */
function PartCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-border">
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Card Content Skeleton */}
      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-3/4" />

        {/* Vendor */}
        <Skeleton className="mb-2 h-3 w-1/2" />

        {/* Price */}
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}

