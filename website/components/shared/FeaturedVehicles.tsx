import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getFeaturedVehicles } from "@/lib/sanity/queries/vehicles";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { BMWMStripesHorizontal } from "@/components/icons/bmw-m-stripes";

export async function FeaturedVehicles() {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FeaturedVehicles.tsx:9',message:'FeaturedVehicles start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
  // #endregion
  
  // Fetch 4 featured vehicles from Sanity CMS
  const vehicles = await getFeaturedVehicles(4);
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FeaturedVehicles.tsx:16',message:'FeaturedVehicles success',data:{count:vehicles?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
  // #endregion

  // If no featured vehicles, don't render section
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <section
      className="relative bg-background py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-vehicles-heading"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header - Redesigned with // INVENTORY style */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-16">
          <div>
            {/* Section Label */}
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-body-small font-medium text-muted-foreground">
                //
              </span>
              <BMWMStripesHorizontal className="h-0.5 w-8" />
            </div>

            <h2
              id="featured-vehicles-heading"
              className="font-mono text-body-small font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              // Inventory
            </h2>

            <p className="mt-3 text-title-1 font-bold text-foreground sm:text-hero">
              Featured Vehicles
            </p>

            <p className="mt-3 max-w-md text-body-base text-muted-foreground sm:text-body-large">
              Hand-selected BMW automobiles from our current collection
            </p>
          </div>

          {/* Browse All CTA - Desktop */}
          <Link
            href="/vehicles"
            aria-label="View all vehicles"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "hidden gap-2 sm:inline-flex"
            )}
          >
            View All Vehicles
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {vehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              priority={index < 2} // Prioritize first 2 images
            />
          ))}
        </div>

        {/* Browse All CTA - Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/vehicles"
            aria-label="View all vehicles"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full gap-2"
            )}
          >
            View All Vehicles
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
