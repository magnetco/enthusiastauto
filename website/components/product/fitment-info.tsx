"use client";

import { FitmentBadge } from "@/components/FitmentBadge";
import { parseFitmentTag } from "@/lib/utils/vehicle";
import { Product } from "@/lib/shopify/types";
import { useFilters } from "@/contexts/FilterContext";

export function FitmentInfo({ product }: { product: Product }) {
  const context = useFilters();
  const vehicle = context?.filters?.vehicle || null;

  // Extract all BMW fitment tags from product tags
  const fitmentTags = product.tags
    .map((tag) => {
      const parsed = parseFitmentTag(tag);
      return parsed ? { tag, parsed } : null;
    })
    .filter(
      (
        item,
      ): item is {
        tag: string;
        parsed: NonNullable<ReturnType<typeof parseFitmentTag>>;
      } => item !== null,
    );

  // If no fitment tags, don't show fitment section at all
  if (fitmentTags.length === 0) {
    return null;
  }

  // Separate matching and non-matching fitments
  const matchingFitments = fitmentTags.filter(
    ({ parsed }) =>
      vehicle && parsed.model === vehicle.model && parsed.year === vehicle.year,
  );
  const otherFitments = fitmentTags.filter(
    ({ parsed }) =>
      !vehicle ||
      parsed.model !== vehicle.model ||
      parsed.year !== vehicle.year,
  );

  return (
    <div className="mb-6 rounded-lg border border-border bg-background p-4">
      <h3 className="mb-3 text-sm font-medium text-foreground">
        Fitment Information
      </h3>

      {/* Show matching fitments prominently if vehicle is selected */}
      {matchingFitments.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {matchingFitments.map(({ tag, parsed }) => (
              <FitmentBadge
                key={tag}
                variant="compatible"
                modelName={parsed.model}
                year={parsed.year}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show other compatible vehicles as simple text list */}
      {otherFitments.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">
            {matchingFitments.length > 0 ? "Also fits:" : "Compatible with:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {otherFitments.map(({ tag, parsed }) => (
              <span
                key={tag}
                className="inline-flex rounded border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {parsed.model} {parsed.year}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
