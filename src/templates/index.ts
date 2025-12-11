import { InvoiceTemplate } from "./types";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { BrutalistTemplate } from "./BrutalistTemplate";
import { DarkModeTemplate } from "./DarkModeTemplate";
import { MinimalJapaneseTemplate } from "./MinimalJapaneseTemplate";
import { NeoBrutalistTemplate } from "./NeoBrutalistTemplate";
import { SwissTemplate } from "./SwissTemplate";
import { TypewriterTemplate } from "./TypewriterTemplate";
import { CutoutBrutalistTemplate } from "./CutoutBrutalistTemplate";
import { ConstructivistTemplate } from "./ConstructivistTemplate";
import { ColorPopStackedTemplate } from "./ColorPopStackedTemplate";
import { ColorPopMinimalTemplate } from "./ColorPopMinimalTemplate";
import { ColorPopGridTemplate } from "./ColorPopGridTemplate";
import { ColorPopDiagonalTemplate } from "./ColorPopDiagonalTemplate";
import { ColorPopBrutalistTemplate } from "./ColorPopBrutalistTemplate";

export * from "./types";

// Template Registry
export const templates: InvoiceTemplate[] = [
  ClassicTemplate,
  ModernTemplate,
  ProfessionalTemplate,
  BrutalistTemplate,
  DarkModeTemplate,
  MinimalJapaneseTemplate,
  NeoBrutalistTemplate,
  SwissTemplate,
  TypewriterTemplate,
  CutoutBrutalistTemplate,
  ConstructivistTemplate,
  ColorPopStackedTemplate,
  ColorPopMinimalTemplate,
  ColorPopGridTemplate,
  ColorPopDiagonalTemplate,
  ColorPopBrutalistTemplate,
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
