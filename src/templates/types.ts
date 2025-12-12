import { Invoice, InvoiceItem, CompanyProfile, Client } from "../types";
import { ComponentType } from "react";

export interface InvoiceTemplateData {
  invoice: Invoice;
  items: InvoiceItem[];
  client: Client;
  profile: CompanyProfile | null;
}

export interface InvoiceTemplate {
  id:
    | "classic"
    | "modern"
    | "professional"
    | "brutalist"
    | "dark-mode"
    | "minimal-japanese"
    | "neo-brutalist"
    | "swiss"
    | "typewriter"
    | "cutout-brutalist"
    | "constructivist"
    | "color-pop-stacked"
    | "color-pop-minimal"
    | "color-pop-grid"
    | "color-pop-diagonal"
    | "color-pop-brutalist";
  name: string;
  description: string;
  Component: ComponentType<InvoiceTemplateData>;
}
