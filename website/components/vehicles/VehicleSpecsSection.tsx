import { PortableText } from "@portabletext/react";
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
            Specs
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Highlights Column */}
          <div className="space-y-6">
            <h3 className="font-chromatic text-xl uppercase tracking-tight text-white">
              Highlights
            </h3>
            {vehicle.highlights && vehicle.highlights.length > 0 ? (
              <div className="prose prose-invert max-w-none space-y-4">
                <PortableText
                  value={vehicle.highlights}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="text-sm leading-relaxed text-white/80">
                          {children}
                        </p>
                      ),
                      h2: ({ children }) => (
                        <h2 className="font-chromatic text-lg uppercase tracking-tight text-white">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold text-white">
                          {children}
                        </h3>
                      ),
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => (
                        <ul className="list-disc space-y-2 pl-5 text-sm text-white/80">
                          {children}
                        </ul>
                      ),
                      number: ({ children }) => (
                        <ol className="list-decimal space-y-2 pl-5 text-sm text-white/80">
                          {children}
                        </ol>
                      ),
                    },
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4 text-sm leading-relaxed text-white/80">
                <p>
                  This block is a highlight about the car and describes what makes it
                  particularly remarkable for a collector.
                </p>
                <p>
                  This block is a highlight about the car and describes what makes it
                  particularly remarkable for a collector.
                </p>
                <p>
                  This block is a highlight about the car and describes what makes it
                  particularly remarkable for a collector.
                </p>
              </div>
            )}
          </div>

          {/* Specs Grid Column */}
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
