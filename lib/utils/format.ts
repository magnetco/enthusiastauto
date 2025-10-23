/**
 * Formats a price value for display
 * @param price - The price in dollars
 * @param showCallForPrice - Whether to show "Call for Price" instead of actual price
 * @returns Formatted price string with commas and dollar sign, or "Call for Price"
 */
export function formatCurrency(
  price?: number,
  showCallForPrice?: boolean
): string {
  if (showCallForPrice || price === null || price === undefined) {
    return "Call for Price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats mileage for display
 * @param mileage - The mileage value
 * @returns Formatted mileage string with commas and " miles" suffix
 */
export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat("en-US").format(mileage)} miles`;
}
