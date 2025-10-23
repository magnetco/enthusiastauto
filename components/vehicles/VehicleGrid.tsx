import { VehicleCard } from "./VehicleCard";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

interface VehicleGridProps {
  vehicles: VehicleListItem[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
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
