/**
 * Email template registry
 * Maps invoice template IDs to corresponding email templates
 */

import { DefaultEmailTemplate } from "./DefaultTemplate";
import { ModernEmailTemplate } from "./ModernTemplate";
import { ProfessionalEmailTemplate } from "./ProfessionalTemplate";
import { MinimalJapaneseEmailTemplate } from "./MinimalJapaneseTemplate";
import { BrutalistEmailTemplate } from "./BrutalistTemplate";
import { DarkModeEmailTemplate } from "./DarkModeTemplate";
import { NeoBrutalistEmailTemplate } from "./NeoBrutalistTemplate";
import { SwissEmailTemplate } from "./SwissTemplate";
import { TypewriterEmailTemplate } from "./TypewriterTemplate";
import { CutoutBrutalistEmailTemplate } from "./CutoutBrutalistTemplate";
import { ConstructivistEmailTemplate } from "./ConstructivistTemplate";
import { ColorPopStackedEmailTemplate } from "./ColorPopStackedTemplate";
import { ColorPopMinimalEmailTemplate } from "./ColorPopMinimalTemplate";
import { ColorPopGridEmailTemplate } from "./ColorPopGridTemplate";
import { ColorPopDiagonalEmailTemplate } from "./ColorPopDiagonalTemplate";
import { ColorPopBrutalistEmailTemplate } from "./ColorPopBrutalistTemplate";

// Map invoice template IDs to email templates
export const emailTemplates: Record<string, string> = {
  classic: DefaultEmailTemplate,
  modern: ModernEmailTemplate,
  professional: ProfessionalEmailTemplate,
  "minimal-japanese": MinimalJapaneseEmailTemplate,
  brutalist: BrutalistEmailTemplate,
  "dark-mode": DarkModeEmailTemplate,
  "neo-brutalist": NeoBrutalistEmailTemplate,
  swiss: SwissEmailTemplate,
  typewriter: TypewriterEmailTemplate,
  "cutout-brutalist": CutoutBrutalistEmailTemplate,
  constructivist: ConstructivistEmailTemplate,
  "color-pop-stacked": ColorPopStackedEmailTemplate,
  "color-pop-minimal": ColorPopMinimalEmailTemplate,
  "color-pop-grid": ColorPopGridEmailTemplate,
  "color-pop-diagonal": ColorPopDiagonalEmailTemplate,
  "color-pop-brutalist": ColorPopBrutalistEmailTemplate,
  // Fallback
  default: DefaultEmailTemplate,
};

/**
 * Get email template by invoice template ID
 */
export function getEmailTemplateByInvoiceTemplate(
  invoiceTemplateId: string | null | undefined
): string {
  const templateId = invoiceTemplateId || "classic";
  return emailTemplates[templateId] || DefaultEmailTemplate;
}

/**
 * Get default email template
 */
export function getDefaultEmailTemplate(): string {
  return DefaultEmailTemplate;
}
