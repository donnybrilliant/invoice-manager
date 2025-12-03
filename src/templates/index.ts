import { InvoiceTemplate } from "./types";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";

export * from "./types";

// Template Registry
export const templates: InvoiceTemplate[] = [
  ClassicTemplate,
  ModernTemplate,
  ProfessionalTemplate,
];

// Get template by ID
export function getTemplateById(id: string): InvoiceTemplate | undefined {
  return templates.find((template) => template.id === id);
}

// Get default template
export function getDefaultTemplate(): InvoiceTemplate {
  return ClassicTemplate;
}

// Get template or default
export function getTemplate(id?: string | null): InvoiceTemplate {
  if (!id) return getDefaultTemplate();
  return getTemplateById(id) || getDefaultTemplate();
}
