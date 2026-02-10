import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface HistorySectionProps {
  vehicle: VehicleDetail;
}

export function HistorySection({ vehicle }: HistorySectionProps) {
  if (!vehicle.history || vehicle.history.trim().length === 0) {
    return null;
  }

  return (
    <section id="history" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            History
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
            {vehicle.history}
          </div>
        </div>
      </div>
    </section>
  );
}
