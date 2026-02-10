"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChassisFilterProps {
  selectedChassis: string[];
  onChassisToggle: (chassis: string) => void;
  className?: string;
}

// Available chassis types with their display names
const CHASSIS_OPTIONS = [
  { id: "e24", label: "E24" },
  { id: "e26", label: "E26" },
  { id: "e28", label: "E28" },
  { id: "e30", label: "E30" },
  { id: "e31", label: "E31" },
  { id: "e34", label: "E34" },
  { id: "e36", label: "E36" },
  { id: "e39", label: "E39" },
  { id: "e46", label: "E46" },
  { id: "e60", label: "E60" },
  { id: "e82", label: "E82" },
  { id: "e9x", label: "E9X" },
  { id: "f87", label: "F87" },
  { id: "f8x", label: "F8X" },
  { id: "g8x", label: "G8X" },
  { id: "z3", label: "Z3" },
  { id: "z4", label: "Z4" },
  { id: "z8", label: "Z8" },
  { id: "sav", label: "SAV" },
  { id: "other", label: "Other" },
];

/**
 * Chassis Filter Component
 * Displays BMW chassis illustrations in a horizontal grid
 * Multi-select with opacity changes for non-selected items
 */
export function ChassisFilter({
  selectedChassis,
  onChassisToggle,
  className,
}: ChassisFilterProps) {
  const hasSelection = selectedChassis.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {CHASSIS_OPTIONS.map((chassis) => {
          const isSelected = selectedChassis.includes(chassis.id);
          const shouldDim = hasSelection && !isSelected;

          return (
            <button
              key={chassis.id}
              onClick={() => onChassisToggle(chassis.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg border-2 border-transparent p-3 transition-all duration-200",
                "hover:border-blue-500 hover:bg-blue-50/50",
                isSelected && "border-blue-500 bg-blue-50/30",
                shouldDim && "opacity-40"
              )}
              aria-label={`Filter by ${chassis.label}`}
              aria-pressed={isSelected}
            >
              {/* Chassis Illustration */}
              <div className="relative h-16 w-full">
                <Image
                  src={`/chassis-icons/${chassis.id}.avif`}
                  alt={`${chassis.label} chassis`}
                  fill
                  className="object-contain transition-transform duration-200 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              </div>

              {/* Chassis Label */}
              <span
                className={cn(
                  "font-headline text-xs font-semibold uppercase tracking-wide transition-colors",
                  isSelected ? "text-blue-600" : "text-neutral-700 group-hover:text-blue-600"
                )}
              >
                {chassis.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
