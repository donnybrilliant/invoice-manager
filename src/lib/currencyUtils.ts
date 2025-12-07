/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    EUR: "€",
    NOK: "NOK",
    USD: "$",
    GBP: "£",
    SEK: "SEK",
    DKK: "DKK",
  };
  return symbols[currency] || currency;
}
