import { VehicleCard } from "./VehicleCard";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

interface VehicleGridProps {
  vehicles: VehicleListItem[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
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
