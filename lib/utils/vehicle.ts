import { Product } from "@/lib/shopify/types";
import { VehicleSelection } from "@/lib/types/filters";

export type ParsedFitmentTag = {
  make: string;
  model: string;
  trim: string;
  year: number;
};

/**
 * Parse a Shopify fitment tag in the format "BMW [Model] [Trim] [Year]"
 * Examples:
 *   "BMW X4 xDrive30i 2022" -> { make: "BMW", model: "X4", trim: "xDrive30i", year: 2022 }
 *   "BMW 335i Base 2010" -> { make: "BMW", model: "335i", trim: "Base", year: 2010 }
 *   "BMW 1 Series M Base 2011" -> { make: "BMW", model: "1 Series M", trim: "Base", year: 2011 }
 */
export function parseFitmentTag(tag: string): ParsedFitmentTag | null {
  // Regex to match "BMW [Model] [Trim] [Year]"
  // Model can contain spaces (e.g., "1 Series M")
  // Trim is typically one word (xDrive30i, M40i, Base)
  // Year is 4 digits
  const match = tag.match(/^BMW\s+(.+?)\s+([A-Za-z0-9]+)\s+(\d{4})$/);

  if (!match || !match[1] || !match[2] || !match[3]) return null;

  return {
    make: "BMW",
    model: match[1].trim(), // "X4", "335i", "1 Series M"
    trim: match[2], // "xDrive30i", "M40i", "Base"
    year: parseInt(match[3], 10), // 2022, 2010
  };
}

/**
 * Extract unique model options from all product fitment tags
 * Sorted alphabetically for dropdown display
 */
export function extractModelOptions(products: Product[]): string[] {
  const models = new Set<string>();

  products.forEach((product) => {
    product.tags.forEach((tag) => {
      const parsed = parseFitmentTag(tag);
      if (parsed) {
        models.add(parsed.model);
      }
    });
  });

  return Array.from(models).sort();
}

/**
 * Extract unique year options from all product fitment tags
 * Sorted in descending order (newest first) for dropdown display
 */
export function extractYearOptions(products: Product[]): number[] {
  const years = new Set<number>();

  products.forEach((product) => {
    product.tags.forEach((tag) => {
      const parsed = parseFitmentTag(tag);
      if (parsed) {
        years.add(parsed.year);
      }
    });
  });

  return Array.from(years).sort((a, b) => b - a); // Descending order
}

/**
 * Check if a product is compatible with the selected vehicle
 * Returns:
 *   - 'compatible': Product has fitment tag matching vehicle (model + year)
 *   - 'universal': No vehicle selected OR product has no fitment tags
 *   - 'incompatible': Product has fitment tags but doesn't match vehicle
 */
export function matchVehicle(
  product: Product,
  vehicle: VehicleSelection | null,
): "compatible" | "universal" | "incompatible" {
  if (!vehicle) return "universal"; // No vehicle selected, show all

  const fitmentTags = product.tags
    .map(parseFitmentTag)
    .filter((tag): tag is ParsedFitmentTag => tag !== null);

  if (fitmentTags.length === 0) return "universal"; // No fitment data, universal fit

  // Match on model and year (ignore trim)
  const isCompatible = fitmentTags.some(
    (tag) => tag.model === vehicle.model && tag.year === vehicle.year,
  );

  return isCompatible ? "compatible" : "incompatible";
}
