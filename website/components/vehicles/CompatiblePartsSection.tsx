import { getPopularCompatibleParts } from "@/lib/shared/recommendations";
import { RecommendationCarousel } from "@/components/shared/RecommendationCarousel";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface CompatiblePartsSectionProps {
  vehicle: VehicleDetail;
  limit?: number;
}

/**
 * CompatiblePartsSection - Async Server Component
 *
 * Fetches and displays popular compatible parts for a vehicle.
 * Designed to be wrapped in React Suspense for deferred loading.
 *
 * Uses Shopify's BEST_SELLING sort to show most popular parts first.
 */
export async function CompatiblePartsSection({
  vehicle,
  limit = 8,
}: CompatiblePartsSectionProps) {
  // Fetch popular compatible parts (sorted by best selling)
  const compatibleParts = await getPopularCompatibleParts(vehicle, limit);

  return (
    <RecommendationCarousel
      items={compatibleParts}
      type="product"
      title="Popular Compatible Parts"
      emptyMessage="No compatible parts currently available for this vehicle. Check back soon or browse all parts."
      emptyCta={{
        text: "Browse All Parts",
        href: "/search",
      }}
      hideIfEmpty={false}
    />
  );
}

