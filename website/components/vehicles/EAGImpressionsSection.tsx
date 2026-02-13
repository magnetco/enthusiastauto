import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";
import { TitleBlock } from "@/components/shared/TitleBlock";

interface EAGImpressionsSectionProps {
  vehicle: VehicleDetail;
}

export function EAGImpressionsSection({ vehicle }: EAGImpressionsSectionProps) {
  if (!vehicle.history || vehicle.history.trim().length === 0) {
    return null;
  }

  return (
    <section id="eag-impressions" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TitleBlock title="EAG Impressions" id="eag-impressions-title" className="mb-12" />

        <div className="mx-auto max-w-4xl">
          <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
            {vehicle.history}
          </div>
        </div>
      </div>
    </section>
  );
}
