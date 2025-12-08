import type { Invoice, InvoiceItem, Client, CompanyProfile } from "../types";
import { formatDateISO, formatAmount, generateInvoiceFilename } from "./utils";

/**
 * Converts country name to ISO alpha-2 code
 * Handles common country names and returns ISO codes for PEPPOL compliance
 *
 * @param country - Country name or code
 * @returns ISO alpha-2 country code (defaults to "NO" if not recognized)
 */
function getCountryCode(country: string | null | undefined): string {
  if (!country) {
    return "NO"; // Default to Norway
  }

  // If already an ISO code (2 uppercase letters), return as-is
  if (/^[A-Z]{2}$/.test(country)) {
    return country;
  }

  // Map common country names to ISO codes
  const countryMap: Record<string, string> = {
    norway: "NO",
    sweden: "SE",
    denmark: "DK",
    finland: "FI",
    germany: "DE",
    france: "FR",
    spain: "ES",
    italy: "IT",
    netherlands: "NL",
    belgium: "BE",
    poland: "PL",
    "united kingdom": "GB",
    "united states": "US",
    canada: "CA",
    australia: "AU",
  };

  const normalized = country.toLowerCase().trim();
  return countryMap[normalized] || "NO"; // Default to NO if not found
}

/**
 * Removes spaces from IBAN for PEPPOL compliance
 *
 * @param iban - IBAN string that may contain spaces
 * @returns IBAN without spaces
 */
function sanitizeIBAN(iban: string): string {
  return iban.replace(/\s+/g, "");
}

/**
 * Generates an EHF (Elektronisk Handelsformat) XML file from invoice data
 * EHF is Norway's standard for electronic invoicing, based on UBL 2.1 and PEPPOL BIS Billing 3.0
 *
 * @param invoice - The invoice data
 * @param items - Array of invoice line items
 * @param client - The client/customer data
 * @param profile - The company profile (supplier) data
 * @returns XML string in EHF format
 */
export function generateEHFXML(
  invoice: Invoice,
  items: InvoiceItem[],
  client: Client,
  profile: CompanyProfile | null
): string {
  if (!profile) {
    throw new Error("Company profile is required for EHF generation");
  }

  if (!profile.organization_number) {
    throw new Error(
      "Company organization number is required for EHF generation"
    );
  }

  if (!client.organization_number) {
    throw new Error(
      "Client organization number is required for EHF generation"
    );
  }

  // Determine country code (convert to ISO alpha-2, default to NO for Norway)
  const supplierCountry = getCountryCode(profile.country);
  const customerCountry = getCountryCode(client.country);

  // Determine scheme ID for organization numbers
  // 0192 = Norwegian organization number (required by PEPPOL for Norway)
  // 0002 = French SIRENE identifier (ISO 6523)
  // For Norway, PEPPOL requires schemeID 0192
  const getSchemeID = (country: string): string => {
    return country === "NO" ? "0192" : "0192"; // Default to 0192 (can be extended for other countries)
  };

  // Determine tax category code based on tax rate
  // S = Standard rate (for positive tax rates like 25% MVA, 20% VAT, etc.)
  // Z = Zero rated (for 0% tax rate - still taxable but at 0%)
  // E = Exempt (for exempt items, but we use Z for 0% as it's more common in Norway)
  const getTaxCategoryCode = (taxRate: number): string => {
    if (taxRate === 0) {
      return "Z"; // Zero rated
    }
    return "S"; // Standard rate
  };

  // Calculate tax exclusive amount (subtotal after discount)
  const taxExclusiveAmount = invoice.subtotal - invoice.discount_amount;

  // Namespace URIs
  const UBL_NS = "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2";
  const CBC_NS =
    "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2";
  const CAC_NS =
    "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2";

  // Create XML document
  const doc = document.implementation.createDocument(
    UBL_NS,
    "ubl:Invoice",
    null
  );
  const root = doc.documentElement;

  // Set namespace declarations on root element
  root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:cac", CAC_NS);
  root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:cbc", CBC_NS);
  root.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:ubl", UBL_NS);

  // Helper to create elements with namespace
  const ele = (
    parent: Element | Document,
    ns: string,
    localName: string,
    text?: string,
    attrs?: Record<string, string>
  ): Element => {
    const element = doc.createElementNS(ns, localName);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    parent.appendChild(element);
    return element;
  };

  // UBL Version
  ele(root, CBC_NS, "UBLVersionID", "2.1");

  // Customization ID - PEPPOL BIS Billing 3.0 compliant
  ele(
    root,
    CBC_NS,
    "CustomizationID",
    "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0"
  );

  // Profile ID - PEPPOL BIS Billing 3.0
  ele(root, CBC_NS, "ProfileID", "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0");

  // Invoice ID
  ele(root, CBC_NS, "ID", invoice.invoice_number);

  // Issue Date
  ele(root, CBC_NS, "IssueDate", formatDateISO(invoice.issue_date));

  // Invoice Type Code (380 = Commercial Invoice)
  ele(root, CBC_NS, "InvoiceTypeCode", "380");

  // Document Currency Code
  ele(root, CBC_NS, "DocumentCurrencyCode", invoice.currency);

  // Accounting Supplier Party (Your Company)
  const supplierParty = ele(
    ele(root, CAC_NS, "AccountingSupplierParty"),
    CAC_NS,
    "Party"
  );

  // Supplier Endpoint ID (organization number)
  ele(supplierParty, CBC_NS, "EndpointID", profile.organization_number, {
    schemeID: getSchemeID(supplierCountry),
  });

  // Supplier Party Identification
  ele(
    ele(supplierParty, CAC_NS, "PartyIdentification"),
    CBC_NS,
    "ID",
    profile.organization_number,
    { schemeID: getSchemeID(supplierCountry) }
  );

  // Supplier Party Name
  ele(
    ele(supplierParty, CAC_NS, "PartyName"),
    CBC_NS,
    "Name",
    profile.company_name || ""
  );

  // Supplier Postal Address
  const supplierAddress = ele(supplierParty, CAC_NS, "PostalAddress");
  if (profile.street_address) {
    ele(supplierAddress, CBC_NS, "StreetName", profile.street_address);
  }
  if (profile.postal_code) {
    ele(supplierAddress, CBC_NS, "PostalZone", profile.postal_code);
  }
  if (profile.city) {
    ele(supplierAddress, CBC_NS, "CityName", profile.city);
  }
  if (profile.state) {
    ele(supplierAddress, CBC_NS, "CountrySubentity", profile.state);
  }
  ele(
    ele(supplierAddress, CAC_NS, "Country"),
    CBC_NS,
    "IdentificationCode",
    supplierCountry
  );

  // Supplier Tax Scheme
  if (profile.tax_number || profile.organization_number) {
    const supplierTax = ele(supplierParty, CAC_NS, "PartyTaxScheme");
    ele(
      supplierTax,
      CBC_NS,
      "CompanyID",
      profile.tax_number || profile.organization_number
    );
    ele(ele(supplierTax, CAC_NS, "TaxScheme"), CBC_NS, "ID", "VAT");
  }

  // Supplier Legal Entity
  const supplierLegal = ele(supplierParty, CAC_NS, "PartyLegalEntity");
  ele(supplierLegal, CBC_NS, "RegistrationName", profile.company_name || "");
  ele(supplierLegal, CBC_NS, "CompanyID", profile.organization_number, {
    schemeID: getSchemeID(supplierCountry),
  });

  // Supplier Contact
  if (profile.email || profile.phone) {
    const supplierContact = ele(supplierParty, CAC_NS, "Contact");
    if (profile.email) {
      ele(supplierContact, CBC_NS, "ElectronicMail", profile.email);
    }
    if (profile.phone) {
      ele(supplierContact, CBC_NS, "Telephone", profile.phone);
    }
  }

  // Accounting Customer Party (Client)
  const customerParty = ele(
    ele(root, CAC_NS, "AccountingCustomerParty"),
    CAC_NS,
    "Party"
  );

  // Customer Endpoint ID
  ele(customerParty, CBC_NS, "EndpointID", client.organization_number, {
    schemeID: getSchemeID(customerCountry),
  });

  // Customer Party Identification
  ele(
    ele(customerParty, CAC_NS, "PartyIdentification"),
    CBC_NS,
    "ID",
    client.organization_number,
    { schemeID: getSchemeID(customerCountry) }
  );

  // Customer Party Name
  ele(ele(customerParty, CAC_NS, "PartyName"), CBC_NS, "Name", client.name);

  // Customer Postal Address
  const customerAddress = ele(customerParty, CAC_NS, "PostalAddress");
  if (client.street_address) {
    ele(customerAddress, CBC_NS, "StreetName", client.street_address);
  }
  if (client.postal_code) {
    ele(customerAddress, CBC_NS, "PostalZone", client.postal_code);
  }
  if (client.city) {
    ele(customerAddress, CBC_NS, "CityName", client.city);
  }
  if (client.state) {
    ele(customerAddress, CBC_NS, "CountrySubentity", client.state);
  }
  ele(
    ele(customerAddress, CAC_NS, "Country"),
    CBC_NS,
    "IdentificationCode",
    customerCountry
  );

  // Customer Tax Scheme
  if (client.tax_number || client.organization_number) {
    const customerTax = ele(customerParty, CAC_NS, "PartyTaxScheme");
    ele(
      customerTax,
      CBC_NS,
      "CompanyID",
      client.tax_number || client.organization_number
    );
    ele(ele(customerTax, CAC_NS, "TaxScheme"), CBC_NS, "ID", "VAT");
  }

  // Customer Legal Entity
  const customerLegal = ele(customerParty, CAC_NS, "PartyLegalEntity");
  ele(customerLegal, CBC_NS, "RegistrationName", client.name);
  ele(customerLegal, CBC_NS, "CompanyID", client.organization_number, {
    schemeID: getSchemeID(customerCountry),
  });

  // Payment Means
  const paymentMeans = ele(root, CAC_NS, "PaymentMeans");
  // Payment means code: 30 = Credit Transfer
  ele(paymentMeans, CBC_NS, "PaymentMeansCode", "30");

  // Payment ID (KID number if available, otherwise invoice number)
  const paymentId = invoice.kid_number || invoice.invoice_number;
  ele(paymentMeans, CBC_NS, "PaymentID", paymentId);

  // Payee Financial Account
  if (profile.iban || profile.account_number) {
    const payeeAccount = ele(paymentMeans, CAC_NS, "PayeeFinancialAccount");
    if (profile.iban) {
      // Remove spaces from IBAN for PEPPOL compliance
      const sanitizedIBAN = sanitizeIBAN(profile.iban);
      ele(payeeAccount, CBC_NS, "ID", sanitizedIBAN);
    } else if (profile.account_number) {
      ele(payeeAccount, CBC_NS, "ID", profile.account_number);
    }
    if (profile.company_name) {
      ele(payeeAccount, CBC_NS, "Name", profile.company_name);
    }
    // Financial Institution Branch (BIC/SWIFT)
    if (profile.swift_bic) {
      ele(
        ele(payeeAccount, CAC_NS, "FinancialInstitutionBranch"),
        CBC_NS,
        "ID",
        profile.swift_bic
      );
    }
  }

  // Payment Terms
  const paymentTerms = ele(root, CAC_NS, "PaymentTerms");
  // Payment Due Date (required for PEPPOL compliance)
  ele(paymentTerms, CBC_NS, "PaymentDueDate", formatDateISO(invoice.due_date));
  // Note with due date (optional, but helpful)
  ele(
    paymentTerms,
    CBC_NS,
    "Note",
    `Due date: ${formatDateISO(invoice.due_date)}`
  );

  // Tax Total
  const taxTotal = ele(root, CAC_NS, "TaxTotal");
  ele(taxTotal, CBC_NS, "TaxAmount", formatAmount(invoice.tax_amount), {
    currencyID: invoice.currency,
  });

  // Tax Subtotal (always include, even for 0% tax)
  const taxSubtotal = ele(taxTotal, CAC_NS, "TaxSubtotal");
  ele(taxSubtotal, CBC_NS, "TaxableAmount", formatAmount(taxExclusiveAmount), {
    currencyID: invoice.currency,
  });
  ele(taxSubtotal, CBC_NS, "TaxAmount", formatAmount(invoice.tax_amount), {
    currencyID: invoice.currency,
  });

  const taxCategory = ele(taxSubtotal, CAC_NS, "TaxCategory");
  const taxCategoryCode = getTaxCategoryCode(invoice.tax_rate);
  ele(taxCategory, CBC_NS, "ID", taxCategoryCode);
  ele(taxCategory, CBC_NS, "Percent", formatAmount(invoice.tax_rate));
  ele(ele(taxCategory, CAC_NS, "TaxScheme"), CBC_NS, "ID", "VAT");

  // Legal Monetary Total
  const monetaryTotal = ele(root, CAC_NS, "LegalMonetaryTotal");
  ele(
    monetaryTotal,
    CBC_NS,
    "LineExtensionAmount",
    formatAmount(invoice.subtotal),
    {
      currencyID: invoice.currency,
    }
  );
  ele(
    monetaryTotal,
    CBC_NS,
    "TaxExclusiveAmount",
    formatAmount(taxExclusiveAmount),
    {
      currencyID: invoice.currency,
    }
  );
  ele(
    monetaryTotal,
    CBC_NS,
    "TaxInclusiveAmount",
    formatAmount(invoice.total),
    {
      currencyID: invoice.currency,
    }
  );
  ele(
    monetaryTotal,
    CBC_NS,
    "AllowanceTotalAmount",
    formatAmount(invoice.discount_amount),
    {
      currencyID: invoice.currency,
    }
  );
  ele(monetaryTotal, CBC_NS, "ChargeTotalAmount", "0.00", {
    currencyID: invoice.currency,
  });
  ele(monetaryTotal, CBC_NS, "PayableAmount", formatAmount(invoice.total), {
    currencyID: invoice.currency,
  });

  // Invoice Lines
  items.forEach((item, index) => {
    const invoiceLine = ele(root, CAC_NS, "InvoiceLine");
    ele(invoiceLine, CBC_NS, "ID", String(index + 1));

    // Invoiced Quantity
    ele(invoiceLine, CBC_NS, "InvoicedQuantity", formatAmount(item.quantity), {
      unitCode: "EA",
    });

    // Line Extension Amount (item total)
    ele(invoiceLine, CBC_NS, "LineExtensionAmount", formatAmount(item.amount), {
      currencyID: invoice.currency,
    });

    // Item
    const itemElement = ele(invoiceLine, CAC_NS, "Item");
    ele(itemElement, CBC_NS, "Name", item.description);

    // Classified Tax Category (always include, even for 0% tax)
    const itemTaxCategory = ele(itemElement, CAC_NS, "ClassifiedTaxCategory");
    const itemTaxCategoryCode = getTaxCategoryCode(invoice.tax_rate);
    ele(itemTaxCategory, CBC_NS, "ID", itemTaxCategoryCode);
    ele(itemTaxCategory, CBC_NS, "Percent", formatAmount(invoice.tax_rate));
    ele(ele(itemTaxCategory, CAC_NS, "TaxScheme"), CBC_NS, "ID", "VAT");

    // Price
    const price = ele(invoiceLine, CAC_NS, "Price");
    ele(price, CBC_NS, "PriceAmount", formatAmount(item.unit_price), {
      currencyID: invoice.currency,
    });
  });

  // Serialize to XML string
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(doc);

  // Add XML declaration
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;
}

/**
 * Downloads an EHF XML file
 *
 * @param xmlContent - The XML content as a string
 * @param filename - The filename for the downloaded file
 */
export function downloadEHFXML(xmlContent: string, filename: string): void {
  // Ensure filename has .xml extension
  const xmlFilename = filename.endsWith(".xml") ? filename : `${filename}.xml`;

  // Create blob with XML content
  const blob = new Blob([xmlContent], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  // Create temporary link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = xmlFilename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a standardized filename for EHF XML files
 * Format: invoice-{invoice-number}-{customer-name}-{date}.xml
 *
 * @param invoiceNumber - The invoice number
 * @param customerName - The customer/client name (optional)
 * @param date - The invoice date (optional)
 * @returns Formatted filename
 */
export function generateEHFFilename(
  invoiceNumber: string,
  customerName?: string,
  date?: string
): string {
  return generateInvoiceFilename(invoiceNumber, "xml", customerName, date);
}
