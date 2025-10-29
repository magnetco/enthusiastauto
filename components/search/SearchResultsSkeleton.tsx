export function SearchResultsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-64 bg-muted rounded mb-2" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-10 w-24 bg-muted rounded" />
        <div className="h-10 w-24 bg-muted rounded" />
        <div className="h-10 w-24 bg-muted rounded" />
      </div>

      {/* Results Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <div className="h-[150px] w-[150px] bg-muted rounded flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-20 bg-muted rounded mb-2" />
                <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                <div className="h-8 w-32 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
