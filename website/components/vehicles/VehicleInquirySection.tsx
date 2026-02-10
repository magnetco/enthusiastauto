import { VehicleContactForm } from "./VehicleContactForm";

interface VehicleInquirySectionProps {
  vehicleSlug: string;
  vehicleTitle: string;
  vehicleYear: number;
  vehiclePrice: number;
  vehicleStatus: "current" | "sold";
}

export function VehicleInquirySection({
  vehicleSlug,
  vehicleTitle,
  vehicleYear,
  vehiclePrice,
  vehicleStatus,
}: VehicleInquirySectionProps) {
  return (
    <section id="inquiry" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            Message Seller
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <VehicleContactForm
              slug={vehicleSlug}
              title={vehicleTitle}
              year={vehicleYear}
              make="BMW"
              model={vehicleTitle.split(" ").pop() || ""}
              price={vehiclePrice}
              status={vehicleStatus}
              source="Inquiry Section"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
