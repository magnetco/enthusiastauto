import { VehicleCard } from "./VehicleCard";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import { TitleBlock } from "@/components/shared/TitleBlock";

interface OtherCarsSectionProps {
  vehicles: VehicleListItem[];
}

export function OtherCarsSection({ vehicles }: OtherCarsSectionProps) {
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TitleBlock 
          title="Other Cars" 
          id="other-cars-title"
          description="This is our carefully curated selection of cars available to purchase right now. Pin your favorites or ask a question."
          className="mb-12" 
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
