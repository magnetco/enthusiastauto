/**
 * Formats a price value for display
 * @param price - The price in dollars
 * @param showCallForPrice - Whether to show "Call for Price" instead of actual price
 * @param showUSD - Whether to show " USD" suffix (default: true)
 * @returns Formatted price string with commas and dollar sign, or "Call for Price"
 */
export function formatCurrency(
  price?: number,
  showCallForPrice?: boolean,
  showUSD: boolean = true
): string {
  if (showCallForPrice || price === null || price === undefined) {
    return "Call for Price";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return showUSD ? `${formatted} USD` : formatted;
}

/**
 * Formats mileage for display
 * @param mileage - The mileage value
 * @returns Formatted mileage string with commas and " miles" suffix
 */
export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat("en-US").format(mileage)} miles`;
}
