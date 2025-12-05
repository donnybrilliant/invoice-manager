import { CompanyProfile, Client } from "../types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCompanyInfo(
  profile: CompanyProfile | null,
  field: keyof CompanyProfile
): string {
  if (!profile || !profile[field]) {
    return "[Not Set]";
  }
  return String(profile[field]);
}

export function formatCompanyAddress(profile: CompanyProfile | null): string {
  if (!profile) return "[Not Set]";

  const parts: string[] = [];

  if (profile.street_address) {
    parts.push(profile.street_address);
  }

  // European format: Postal Code City
  const cityLine: string[] = [];
  if (profile.postal_code) cityLine.push(profile.postal_code);
  if (profile.city) cityLine.push(profile.city);

  if (cityLine.length > 0) {
    parts.push(cityLine.join(" "));
  }

  if (profile.state) {
    parts.push(profile.state);
  }

  if (profile.country) {
    parts.push(profile.country);
  }

  return parts.length > 0 ? parts.join("\n") : "[Not Set]";
}

export function getBankingDetails(
  profile: CompanyProfile | null,
  showAccountNumber: boolean = true,
  showIban: boolean = true,
  showSwiftBic: boolean = true
): string {
  if (!profile) return "";

  const details: string[] = [];

  if (showAccountNumber && profile.account_number) {
    details.push(
      `<div><strong>Account Number:</strong> ${profile.account_number}</div>`
    );
  }

  if (showIban && profile.iban) {
    details.push(`<div><strong>IBAN:</strong> ${profile.iban}</div>`);
  }

  if (showSwiftBic && profile.swift_bic) {
    details.push(`<div><strong>SWIFT/BIC:</strong> ${profile.swift_bic}</div>`);
  }

  return details.length > 0
    ? details.join("")
    : '<div style="color: #9ca3af; font-size: 14px;">[Payment information not set]</div>';
}

export function getPaymentInformation(
  profile: CompanyProfile | null,
  invoice: { kid_number?: string | null; due_date: string; total: number; currency: string },
  showAccountNumber: boolean = true,
  showIban: boolean = true,
  showSwiftBic: boolean = true
): string {
  const details: string[] = [];

  // Banking details
  if (profile) {
    if (showAccountNumber && profile.account_number) {
      details.push(
        `<div><strong>Account Number:</strong> ${profile.account_number}</div>`
      );
    }

    if (showIban && profile.iban) {
      details.push(`<div><strong>IBAN:</strong> ${profile.iban}</div>`);
    }

    if (showSwiftBic && profile.swift_bic) {
      details.push(`<div><strong>SWIFT/BIC:</strong> ${profile.swift_bic}</div>`);
    }
  }

  // KID number (from invoice, not client)
  if (invoice.kid_number) {
    details.push(`<div><strong>KID:</strong> ${invoice.kid_number}</div>`);
  }

  // Due date
  details.push(`<div><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</div>`);

  // Amount Due (with comma as decimal separator)
  const currencySymbol = invoice.currency === "EUR" ? "€" : 
                         invoice.currency === "NOK" ? "kr" :
                         invoice.currency === "USD" ? "$" :
                         invoice.currency === "GBP" ? "£" : invoice.currency;
  const amountWithComma = formatAmountWithComma(invoice.total);
  details.push(`<div><strong>Amount Due:</strong> ${currencySymbol} ${amountWithComma}</div>`);

  return details.length > 0
    ? details.join("")
    : '<div style="color: #9ca3af; font-size: 14px;">[Payment information not set]</div>';
}

export function formatClientAddress(client: Client): string {
  const parts: string[] = [];

  if (client.street_address) {
    parts.push(client.street_address);
  }

  // European format: Postal Code City
  const cityLine: string[] = [];
  if (client.postal_code) cityLine.push(client.postal_code);
  if (client.city) cityLine.push(client.city);

  if (cityLine.length > 0) {
    parts.push(cityLine.join(" "));
  }

  if (client.state) {
    parts.push(client.state);
  }

  if (client.country) {
    parts.push(client.country);
  }

  return parts.length > 0 ? parts.join("\n") : "[No Address]";
}

export function formatCurrencyWithCode(
  amount: number,
  currency: string = "EUR"
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
  
  // Ensure space between currency symbol and amount
  // Handles formats like "€1,234.56" -> "€ 1,234.56" or "kr1,234.56" -> "kr 1,234.56"
  return formatted.replace(/([€$£]|kr)(\d)/, "$1 $2");
}

export function formatAmountWithComma(amount: number): string {
  // Format number with comma as decimal separator (e.g., 49.99 -> 49,99)
  return amount.toFixed(2).replace(".", ",");
}

export function formatCurrencyWithCodeAndSpace(
  amount: number,
  currency: string = "EUR"
): string {
  const formatted = formatCurrencyWithCode(amount, currency);
  // Ensure there's a space between currency symbol and amount
  return formatted.replace(/([€$£]|kr)\s*(\d)/, "$1 $2");
}
