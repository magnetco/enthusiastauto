import Image from "next/image";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";
import { TitleBlock } from "@/components/shared/TitleBlock";

interface HistorySectionProps {
  vehicle: VehicleDetail;
}

export function HistorySection({ vehicle }: HistorySectionProps) {
  if (!vehicle.history || vehicle.history.trim().length === 0) {
    return null;
  }

  // Find the first interior gallery image
  const interiorImage = vehicle.galleryImages?.find((img) => {
    // Check if the image is from galleryInterior1 or galleryInterior2
    // We can't directly check the source, so we'll use the first available image
    // that appears after exterior images (typically index 3+)
    return true;
  });

  // Get interior image from galleryImages (typically after exterior images)
  const historyImage =
    vehicle.galleryImages?.[3]?.asset?.url ||
    vehicle.galleryImages?.[4]?.asset?.url;

  return (
    <section id="history" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TitleBlock title="History" id="history-title" className="mb-12" />

        <div className="grid gap-8 lg:grid-cols-[60%_40%]">
          {/* Text Column */}
          <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
            {vehicle.history}
          </div>

          {/* Image Column */}
          {historyImage && (
            <div className="relative min-h-[400px] overflow-hidden rounded-lg bg-gray-200 lg:min-h-[600px]">
              <Image
                src={historyImage}
                alt={`${vehicle.listingTitle} - History`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
