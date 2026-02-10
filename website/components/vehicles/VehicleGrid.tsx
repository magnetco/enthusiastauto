import { VehicleCard } from "./VehicleCard";
import { VehicleListItem as VehicleListItemComponent } from "./VehicleListItem";
import { VehicleCompactCard } from "./VehicleCompactCard";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { ViewMode } from "@/lib/hooks/useViewPreference";
import { cn } from "@/lib/utils";

interface VehicleGridProps {
  vehicles: VehicleListItem[];
  view?: ViewMode;
  onFavoriteToggle?: (vehicleId: string) => void;
  onCompareToggle?: (vehicle: VehicleListItem) => void;
  favoriteIds?: string[];
  comparisonIds?: string[];
}

export function VehicleGrid({
  vehicles,
  view = "grid",
  onFavoriteToggle,
  onCompareToggle,
  favoriteIds = [],
  comparisonIds = [],
}: VehicleGridProps) {
  // List view: single column
  if (view === "list") {
    return (
      <div className="space-y-6">
        {vehicles.map((vehicle, index) => (
          <VehicleListItemComponent
            key={vehicle._id}
            vehicle={vehicle}
            priority={index < 3} // Eager load first 3 images
            isFavorite={favoriteIds.includes(vehicle._id)}
            isInComparison={comparisonIds.includes(vehicle._id)}
            onFavoriteToggle={() => onFavoriteToggle?.(vehicle._id)}
            onCompareToggle={() => onCompareToggle?.(vehicle)}
          />
        ))}
      </div>
    );
  }

  // Compact view: 4 columns
  if (view === "compact") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vehicles.map((vehicle, index) => (
          <VehicleCompactCard
            key={vehicle._id}
            vehicle={vehicle}
            priority={index < 8} // Eager load first 8 images
          />
        ))}
      </div>
    );
  }

  // Grid view (default): 3 columns
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {vehicles.map((vehicle, index) => (
        <VehicleCard
          key={vehicle._id}
          vehicle={vehicle}
          priority={index < 6} // Eager load first 6 images
        />
      ))}
    </div>
  );
}
