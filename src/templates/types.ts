import { Invoice, InvoiceItem, CompanyProfile, Client } from "../types";

export interface InvoiceTemplateData {
  invoice: Invoice;
  items: InvoiceItem[];
  client: Client;
  profile: CompanyProfile | null;
}

export interface InvoiceTemplate {
  id: "classic" | "modern" | "professional" | "brutalist" | "dark-mode" | "minimal-japanese" | "neo-brutalist" | "swiss" | "typewriter";
  name: string;
  description: string;
  render: (data: InvoiceTemplateData) => string;
}
