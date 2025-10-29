import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getFeaturedVehicles } from "@/lib/sanity/queries/vehicles";
import { cn } from "@/lib/utils";

export async function FeaturedVehicles() {
  // Fetch 4 featured vehicles from Sanity CMS
  const vehicles = await getFeaturedVehicles(4);

  // If no featured vehicles, don't render section
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <section
      className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-5 sm:py-16 lg:px-6"
      aria-labelledby="featured-vehicles-heading"
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2
            id="featured-vehicles-heading"
            className="text-title-2 font-bold text-foreground"
          >
            Featured Vehicles
          </h2>
          <p className="mt-2 text-body-base text-muted-foreground sm:text-body-large">
            Hand-picked BMW vehicles from our current inventory
          </p>
        </div>

        {/* Browse All CTA - Desktop */}
        <Link
          href="/vehicles"
          aria-label="View all vehicles"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "hidden sm:flex",
          )}
        >
          Browse All Vehicles
        </Link>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
            priority={index < 2} // Prioritize first 2 images
          />
        ))}
      </div>

      {/* Browse All CTA - Mobile */}
      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/vehicles"
          aria-label="View all vehicles"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto",
          )}
        >
          Browse All Vehicles
        </Link>
      </div>
    </section>
  );
}
