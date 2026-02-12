/**
 * Utility functions for rendering email templates
 * Single source of truth: templates are in src/templates/email/
 */

import { getEmailTemplateByInvoiceTemplate } from "../templates/email";
import { formatDate } from "./formatting";

/**
 * Replace template variables in email template
 * Supports {{variable}} syntax and {{#if variable}}...{{/if}} conditionals
 */
function replaceTemplateVariables(
  template: string,
  data: {
    invoiceNumber: string;
    clientName: string;
    companyName: string;
    total: string;
    currency: string;
    issueDate: string;
    dueDate: string;
    locale?: string;
    language?: string;
    message?: string;
    companyEmail?: string;
  }
): string {
  const formattedIssueDate = formatDate(data.issueDate, {
    locale: data.locale,
    language: data.language,
  });
  const formattedDueDate = formatDate(data.dueDate, {
    locale: data.locale,
    language: data.language,
  });
  const formattedMessage = data.message
    ? data.message.replace(/\n/g, "<br>")
    : "";

  let result = template;

  // Handle {{#if variable}}...{{/if}} conditionals
  // Message conditional
  if (data.message) {
    result = result.replace(/\{\{#if message\}\}([\s\S]*?)\{\{\/if\}\}/g, "$1");
  } else {
    result = result.replace(/\{\{#if message\}\}([\s\S]*?)\{\{\/if\}\}/g, "");
  }

  // CompanyEmail conditional
  if (data.companyEmail) {
    result = result.replace(
      /\{\{#if companyEmail\}\}([\s\S]*?)\{\{\/if\}\}/g,
      "$1"
    );
  } else {
    result = result.replace(
      /\{\{#if companyEmail\}\}([\s\S]*?)\{\{\/if\}\}/g,
      ""
    );
  }

  // Replace simple variables
  result = result
    .replace(/\{\{invoiceNumber\}\}/g, data.invoiceNumber)
    .replace(/\{\{clientName\}\}/g, data.clientName)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{total\}\}/g, data.total)
    .replace(/\{\{currency\}\}/g, data.currency)
    .replace(/\{\{issueDate\}\}/g, formattedIssueDate)
    .replace(/\{\{dueDate\}\}/g, formattedDueDate)
    .replace(/\{\{message\}\}/g, formattedMessage)
    .replace(/\{\{companyEmail\}\}/g, data.companyEmail || "");

  return result;
}

/**
 * Render email template HTML
 * Determines which template to use based on company profile settings and invoice template
 */
export function renderEmailTemplate(data: {
  invoiceNumber: string;
  clientName: string;
  companyName: string;
  total: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  locale?: string;
  language?: string;
  message?: string;
  companyEmail?: string;
  useCustomTemplate?: boolean;
  customTemplate?: string | null;
  invoiceTemplateId?: string | null;
}): string {
  let template: string;

  // If custom template is enabled and provided, use it
  if (data.useCustomTemplate && data.customTemplate) {
    template = data.customTemplate;
  } else {
    // Otherwise, use the email template matching the invoice template
    template = getEmailTemplateByInvoiceTemplate(data.invoiceTemplateId);
  }

  // Replace template variables
  return replaceTemplateVariables(template, {
    invoiceNumber: data.invoiceNumber,
    clientName: data.clientName,
    companyName: data.companyName,
    total: data.total,
    currency: data.currency,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    locale: data.locale,
    language: data.language,
    message: data.message,
    companyEmail: data.companyEmail,
  });
}
