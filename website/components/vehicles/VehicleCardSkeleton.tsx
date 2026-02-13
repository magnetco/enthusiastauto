import { Card, CardContent } from "@/components/ui/card";

export function VehicleCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />

      {/* Content Skeleton */}
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Chassis Badge */}
          <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200" />

          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Price */}
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

          {/* Mileage */}
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Details */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface VehicleGridSkeletonProps {
  count?: number;
}

export function VehicleGridSkeleton({ count = 6 }: VehicleGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
