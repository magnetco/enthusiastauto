import { getRecommendationsForUser } from '@/lib/recommendations/engine';
import { VehicleListItem } from '@/lib/sanity/queries/vehicles';
import { Product } from '@/lib/shopify/types';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import ProductGridItems from '@/components/layout/product-grid-items';
import { Card } from '@/components/ui/card';

interface RecommendationCarouselProps {
  userId?: string;
  title?: string;
  limit?: number;
  type?: 'vehicles' | 'parts' | 'all';
}

/**
 * Helper to check if item is a vehicle
 */
function isVehicle(item: any): item is VehicleListItem {
  return item && '_id' in item && 'chassis' in item && 'slug' in item;
}

/**
 * Helper to check if item is a product
 */
function isProduct(item: any): item is Product {
  return item && 'handle' in item && 'title' in item && !('chassis' in item);
}

/**
 * RecommendationCarousel - Server Component
 * Displays personalized recommendations based on user activity and garage
 *
 * @param userId - Optional user ID for personalized recommendations
 * @param title - Section title (default: "Recommended for You")
 * @param limit - Number of items to display (default: 6)
 * @param type - Filter by content type (vehicles|parts|all)
 */
export async function RecommendationCarousel({
  userId,
  title = 'Recommended for You',
  limit = 6,
  type = 'all',
}: RecommendationCarouselProps) {
  try {
    // Fetch recommendations
    const result = await getRecommendationsForUser(userId, {
      limit,
      type,
      excludeGarage: true,
    });

    // If no recommendations, don't render anything
    if (!result.items || result.items.length === 0) {
      return null;
    }

    // Adjust title for fallback recommendations
    const displayTitle = result.type === 'fallback' ? 'Popular Items' : title;

    // Separate vehicles and products
    const vehicles: VehicleListItem[] = [];
    const products: Product[] = [];

    result.items.forEach((item) => {
      if (isVehicle(item)) {
        vehicles.push(item);
      } else if (isProduct(item)) {
        products.push(item);
      }
    });

    return (
      <section className="w-full py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {displayTitle}
            </h2>
            {result.type === 'personalized' && (
              <p className="text-muted-foreground mt-2">
                Based on your garage and browsing history
              </p>
            )}
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Render vehicles */}
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}

            {/* Render products */}
            {products.length > 0 && (
              <ProductGridItems products={products} />
            )}
          </div>

          {/* Empty state - handled by not rendering */}
        </div>
      </section>
    );
  } catch (error) {
    console.error('[RecommendationCarousel] Error rendering:', error);
    // Fail silently - don't break the page
    return null;
  }
}
