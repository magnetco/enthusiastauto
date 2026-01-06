import { Card, CardContent } from "@/components/ui/card";

export function VehicleCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-border bg-card">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />

      {/* Content Skeleton */}
      <CardContent className="p-4">
        {/* Title */}
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted" />

        {/* Chassis Badge */}
        <div className="mb-3 h-5 w-16 animate-pulse rounded bg-muted" />

        {/* Price */}
        <div className="mb-1 h-5 w-24 animate-pulse rounded bg-muted" />

        {/* Mileage */}
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

interface VehicleGridSkeletonProps {
  count?: number;
}

export function VehicleGridSkeleton({ count = 6 }: VehicleGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
