import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VehicleCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border-gray-200">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />

      {/* Content Skeleton */}
      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className="mb-2 h-6 w-3/4" />

        {/* Chassis Badge */}
        <Skeleton className="mb-3 h-5 w-16" />

        {/* Price */}
        <Skeleton className="mb-1 h-5 w-24" />

        {/* Mileage */}
        <Skeleton className="h-4 w-32" />
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
