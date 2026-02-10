import { VehicleCard } from "./VehicleCard";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";

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
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            Other Cars
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <p className="mb-8 text-center text-gray-600">
          This is our carefully curated selection of cars available to purchase
          right now. Pin your favorites or ask a question.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
