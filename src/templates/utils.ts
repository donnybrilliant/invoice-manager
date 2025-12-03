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
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
