import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getFeaturedVehicles } from "@/lib/sanity/queries/vehicles";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TitleBlock } from "@/components/shared/TitleBlock";

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
      className="relative bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-vehicles-heading"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <TitleBlock
            title="Inventory"
            description="This is our carefully curated selection of cars available to purchase right now. Pin your favorites or ask a question."
            id="featured-vehicles-heading"
            action={
              <Link
                href="/vehicles"
                aria-label="View all vehicles"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                )}
              >
                See all cars
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
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
              "w-full gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
            )}
          >
            See all cars
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
