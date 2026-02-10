"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatMileage } from "@/lib/utils/format";
import { urlFor } from "@/lib/sanity/image";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface VehicleComparisonProps {
  vehicles: VehicleListItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveVehicle: (vehicleId: string) => void;
}

/**
 * Vehicle Comparison Modal
 * Side-by-side comparison of up to 3 vehicles
 */
export function VehicleComparison({
  vehicles,
  isOpen,
  onClose,
  onRemoveVehicle,
}: VehicleComparisonProps) {
  if (vehicles.length === 0) {
    return null;
  }

  const comparisonRows = [
    { label: "Price", getValue: (v: VehicleListItem) => formatCurrency(v.listingPrice, v.showCallForPrice) },
    { label: "Mileage", getValue: (v: VehicleListItem) => formatMileage(v.mileage) },
    { label: "Chassis", getValue: (v: VehicleListItem) => v.chassis },
    { label: "Transmission", getValue: (v: VehicleListItem) => v.transmission || "N/A" },
    { label: "Drivetrain", getValue: (v: VehicleListItem) => v.drive || "N/A" },
    { label: "Engine", getValue: (v: VehicleListItem) => v.engineType && v.engineSize ? `${v.engineType} ${v.engineSize}` : "N/A" },
    { label: "Exterior Color", getValue: (v: VehicleListItem) => v.exteriorColor || "N/A" },
    { label: "Interior Color", getValue: (v: VehicleListItem) => v.interiorColor || "N/A" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Compare Vehicles</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-40 border-b border-gray-200 p-4 text-left text-sm font-medium text-gray-700">
                  Specification
                </th>
                {vehicles.map((vehicle) => (
                  <th key={vehicle._id} className="border-b border-gray-200 p-4">
                    <div className="relative space-y-3">
                      {/* Remove button */}
                      <button
                        onClick={() => onRemoveVehicle(vehicle._id)}
                        className="absolute right-0 top-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Remove from comparison"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>

                      {/* Vehicle Image */}
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={
                            vehicle.signatureShot
                              ? urlFor(vehicle.signatureShot).width(300).height(225).url()
                              : "https://placehold.co/300x225/e5e7eb/6b7280?text=No+Image"
                          }
                          alt={vehicle.listingTitle}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      </div>

                      {/* Vehicle Title */}
                      <Link
                        href={`/vehicles/${vehicle.slug.current}`}
                        className="block text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {vehicle.listingTitle}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.label} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border-b border-gray-200 p-4 text-sm font-medium text-gray-700">
                    {row.label}
                  </td>
                  {vehicles.map((vehicle) => (
                    <td key={vehicle._id} className="border-b border-gray-200 p-4 text-center text-sm text-gray-900">
                      {row.getValue(vehicle)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Features Row */}
              <tr className="bg-white">
                <td className="border-b border-gray-200 p-4 text-sm font-medium text-gray-700">
                  Features
                </td>
                {vehicles.map((vehicle) => (
                  <td key={vehicle._id} className="border-b border-gray-200 p-4">
                    {vehicle.listingThumbnailFeatures && vehicle.listingThumbnailFeatures.length > 0 ? (
                      <ul className="space-y-1 text-left text-xs text-gray-600">
                        {vehicle.listingThumbnailFeatures.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-gray-400">No features listed</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
