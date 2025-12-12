/**
 * Formatting utility functions for dates, currencies, and amounts
 */

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

export function formatCurrencyWithCode(
  amount: number,
  currency: string = "EUR"
): string {
  // Map currencies to their appropriate locales for correct number formatting
  const currencyLocaleMap: Record<string, string> = {
    NOK: "nb-NO", // Norwegian: 1 593,75 (space for thousands, comma for decimal)
    SEK: "sv-SE", // Swedish: 1 593,75
    DKK: "da-DK", // Danish: 1 593,75
    EUR: "de-DE", // German locale for EUR: 1.593,75
    USD: "en-US", // US: 1,593.75
    GBP: "en-GB", // UK: 1,593.75
  };

  const locale =
    currencyLocaleMap[currency] || (currency === "EUR" ? "de-DE" : "en-US");

  // Format the number with appropriate locale (without currency style to get just the number part)
  const numberPart = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Always return format: "CURRENCY_CODE number"
  // e.g., "EUR 1.593,75", "USD 1,593.75", "NOK 1 593,75"
  return `${currency} ${numberPart}`;
}

export function formatAmountWithComma(amount: number): string {
  // Format number with comma as decimal separator (e.g., 49.99 -> 49,99)
  return amount.toFixed(2).replace(".", ",");
}

/**
 * Format just the number part of a currency amount (without currency symbol/code)
 * Uses the appropriate locale formatting for the currency
 */
export function formatCurrencyAmountOnly(
  amount: number,
  currency: string = "EUR"
): string {
  // Map currencies to their appropriate locales for correct number formatting
  const currencyLocaleMap: Record<string, string> = {
    NOK: "nb-NO", // Norwegian: 1 593,75 (space for thousands, comma for decimal)
    SEK: "sv-SE", // Swedish: 1 593,75
    DKK: "da-DK", // Danish: 1 593,75
    EUR: "de-DE", // German locale for EUR: 1.593,75
    USD: "en-US", // US: 1,593.75
    GBP: "en-GB", // UK: 1,593.75
  };

  const locale =
    currencyLocaleMap[currency] || (currency === "EUR" ? "de-DE" : "en-US");

  // Format the number with appropriate locale (without currency style)
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted;
}

export function formatCurrencyWithCodeAndSpace(
  amount: number,
  currency: string = "EUR"
): string {
  // formatCurrencyWithCode already includes the space between currency code and amount
  return formatCurrencyWithCode(amount, currency);
}
