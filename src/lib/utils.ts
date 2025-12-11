/**
 * General utility functions for the invoice manager application
 */

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

/**
 * Sanitizes a string for use in filenames
 * Removes special characters and replaces spaces with hyphens
 *
 * @param str - The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeFilename(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formats a date string as YYYY-MM-DD (ISO format)
 * Used for EHF XML and other standardized date formats
 *
 * @param dateString - The date string to format
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDateISO(dateString: string): string {
  return new Date(dateString).toISOString().split("T")[0];
}

/**
 * Formats a number to 2 decimal places as a string
 * Used for currency amounts in EHF XML and other standardized formats
 *
 * @param amount - The amount to format
 * @returns Formatted amount string with 2 decimal places
 */
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Generates a standardized filename for invoice files
 * Format: invoice-{invoice-number}-{customer-name}-{date}.{extension}
 *
 * @param invoiceNumber - The invoice number
 * @param extension - The file extension (e.g., "pdf", "xml")
 * @param customerName - The customer/client name (optional)
 * @param date - The invoice date (optional)
 * @returns Formatted filename
 */
export function generateInvoiceFilename(
  invoiceNumber: string,
  extension: string,
  customerName?: string,
  date?: string
): string {
  // Sanitize invoice number for filename
  const sanitizedInvoiceNumber = sanitizeFilename(invoiceNumber);

  let filename = sanitizedInvoiceNumber;

  if (customerName) {
    // Sanitize customer name for filename
    const sanitizedName = sanitizeFilename(customerName);
    filename += `-${sanitizedName}`;
  }

  if (date) {
    // Format date as YYYY-MM-DD
    const dateStr = formatDateISO(date);
    filename += `-${dateStr}`;
  }

  // Ensure extension doesn't have leading dot
  const cleanExtension = extension.startsWith(".")
    ? extension.slice(1)
    : extension;

  return `${filename}.${cleanExtension}`;
}

/**
 * Generates filename for downloaded invoice PDFs
 * Format: {invoice-number}-{client-name}-{issue-date}.pdf
 *
 * @param invoiceNumber - The invoice number
 * @param clientName - The client name
 * @param issueDate - The invoice issue date
 * @returns Formatted filename
 */
export function generateInvoiceFilenameForDownload(
  invoiceNumber: string,
  clientName: string,
  issueDate: string
): string {
  return generateInvoiceFilename(invoiceNumber, "pdf", clientName, issueDate);
}

/**
 * Generates filename for email invoice PDFs
 * Format: {invoice-number}-{company-name}-{due-date}.pdf
 *
 * @param invoiceNumber - The invoice number
 * @param companyName - The company name
 * @param dueDate - The invoice due date
 * @returns Formatted filename
 */
export function generateInvoiceFilenameForEmail(
  invoiceNumber: string,
  companyName: string,
  dueDate: string
): string {
  return generateInvoiceFilename(invoiceNumber, "pdf", companyName, dueDate);
}
