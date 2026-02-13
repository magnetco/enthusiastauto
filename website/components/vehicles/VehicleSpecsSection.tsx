import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface VehicleSpecsSectionProps {
  vehicle: VehicleDetail;
}

export function VehicleSpecsSection({ vehicle }: VehicleSpecsSectionProps) {
  const specs = [
    {
      label: "VIN",
      value: vehicle.vin || "Not available",
    },
    {
      label: "Mileage",
      value: `${vehicle.mileage.toLocaleString()} mi`,
    },
    {
      label: "Transmission",
      value: vehicle.transmission,
    },
    {
      label: "Engine Size",
      value: vehicle.engineSize,
    },
    {
      label: "Engine Code",
      value: vehicle.engineCodes,
    },
    {
      label: "Exterior Color",
      value: vehicle.exteriorColor,
    },
    {
      label: "Interior Color",
      value: vehicle.interiorColor,
    },
    {
      label: "Drivetrain",
      value: vehicle.drive,
    },
    {
      label: "Body Style",
      value: vehicle.bodyStyle,
    },
    {
      label: "Fuel Type",
      value: vehicle.engineType,
    },
  ];

  return (
    <section
      id="specifications"
      className="bg-[#141721] py-16 sm:py-20"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 23, 33, 0.95), rgba(20, 23, 33, 0.95)), url(${vehicle.signatureShot?.asset?.url || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-white sm:text-3xl">
            Specifications
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg bg-white p-6 shadow-xl sm:p-8">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.label} className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {spec.label}
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
