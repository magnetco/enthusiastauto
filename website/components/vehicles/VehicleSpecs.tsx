import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface VehicleSpecsProps {
  vehicle: VehicleDetail;
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    {
      label: "Engine",
      value: `${vehicle.engineSize} (${vehicle.engineCodes})`,
    },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Drivetrain", value: vehicle.drive },
    { label: "Body Style", value: vehicle.bodyStyle },
    { label: "Exterior Color", value: vehicle.exteriorColor },
    { label: "Interior Color", value: vehicle.interiorColor },
    { label: "VIN", value: vehicle.vin || "Not available" },
    { label: "Chassis Code", value: vehicle.chassis },
    { label: "Fuel Type", value: vehicle.engineType },
  ];

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">Specifications</h2>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {specs.map((spec) => (
          <div key={spec.label} className="space-y-1">
            <dt className="text-sm font-medium text-gray-400">{spec.label}</dt>
            <dd className="text-base text-white">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
