import { CompanyProfile, Client } from "../types";

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
