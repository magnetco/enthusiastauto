import Image from "next/image";
import { VehicleContactForm } from "./VehicleContactForm";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface VehicleInquirySectionProps {
  vehicle: VehicleDetail;
  vehicleSlug: string;
  vehicleYear: number;
}

export function VehicleInquirySection({
  vehicle,
  vehicleSlug,
  vehicleYear,
}: VehicleInquirySectionProps) {
  // Get signature shot for top image
  const topImage = vehicle.signatureShot?.asset?.url;

  // Get first interior gallery image for bottom image
  const bottomImage =
    vehicle.galleryImages?.[3]?.asset?.url ||
    vehicle.galleryImages?.[4]?.asset?.url;

  return (
    <section id="inquiry" className="bg-[#141721] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-white sm:text-3xl">
            Contact Us
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images Column */}
          <div className="space-y-4">
            {topImage && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={topImage}
                  alt={`${vehicle.listingTitle} - Exterior`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
            {bottomImage && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={bottomImage}
                  alt={`${vehicle.listingTitle} - Interior`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="rounded-lg border border-gray-700 bg-white p-6 shadow-sm sm:p-8">
            <VehicleContactForm
              slug={vehicleSlug}
              title={vehicle.listingTitle}
              year={vehicleYear}
              make="BMW"
              model={vehicle.listingTitle.split(" ").pop() || ""}
              price={vehicle.listingPrice || 0}
              status={vehicle.status}
              source="Inquiry Section"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
