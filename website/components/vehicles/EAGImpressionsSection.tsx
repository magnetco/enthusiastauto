import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { sanitizeHtml } from "@/lib/utils/sanitize";

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
          <div 
            className="prose prose-gray max-w-none text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(vehicle.history) }}
          />
        </div>
      </div>
    </section>
  );
}
