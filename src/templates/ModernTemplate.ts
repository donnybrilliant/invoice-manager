import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const ModernTemplate: InvoiceTemplate = {
  id: "modern",
  name: "Modern",
  description: "Contemporary design with colored accents",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item, index) => `
        <tr style="background-color: ${index % 2 === 0 ? "#f9fafb" : "white"};">
          <td style="padding: 16px; border-left: 4px solid #3b82f6;">${
            item.description
          }</td>
          <td style="padding: 16px; text-align: center;">${item.quantity}</td>
          <td style="padding: 16px; text-align: right;">${formatCurrencyWithCode(
            item.unit_price,
            invoice.currency
          )}</td>
          <td style="padding: 16px; text-align: right; font-weight: 600; color: #1f2937;">${formatCurrencyWithCode(
            item.amount,
            invoice.currency
          )}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        <!-- Colored Header Bar -->
        <div style="height: 8px; background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%); margin-bottom: 30px; border-radius: 4px;"></div>
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px;">
          <div>
            ${
              profile?.logo_url
                ? `<img src="${profile.logo_url}" alt="Company Logo" style="max-width: 150px; max-height: 80px; margin-bottom: 15px;" />`
                : ""
            }
            <h1 style="margin: 0; font-size: 36px; color: #3b82f6; font-weight: 700; letter-spacing: -0.5px;">INVOICE</h1>
            <div style="color: #6b7280; font-size: 16px; margin-top: 5px;">#${
              invoice.invoice_number
            }</div>
          </div>
          <div style="text-align: right; padding: 20px; background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); border-radius: 8px;">
            <div style="font-weight: 700; font-size: 18px; color: #1f2937; margin-bottom: 8px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="color: #6b7280; font-size: 13px; line-height: 1.6;">
              ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
              ${getCompanyInfo(profile, "phone")}<br />
              ${getCompanyInfo(profile, "email")}
              ${profile?.website ? `<br />${profile.website}` : ""}
              ${
                profile?.organization_number
                  ? `<br />Org: ${profile.organization_number}`
                  : ""
              }
              ${profile?.tax_number ? `<br />Tax: ${profile.tax_number}` : ""}
            </div>
          </div>
        </div>

        <!-- Invoice Info Cards -->
        <div style="display: flex; gap: 20px; margin-bottom: 40px;">
          <div style="flex: 1; padding: 20px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <h3 style="margin: 0 0 12px 0; color: #3b82f6; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Bill To</h3>
            <div style="color: #1f2937; line-height: 1.7; font-size: 14px;">
              <strong style="font-size: 16px;">${client.name}</strong><br />
              ${client.email || ""}<br />
              ${client.phone || ""}<br />
              ${formatClientAddress(client).replace(/\n/g, "<br />")}
            </div>
          </div>
          <div style="flex: 1; padding: 20px; background: #f9fafb; border-left: 4px solid #8b5cf6; border-radius: 4px;">
            <h3 style="margin: 0 0 12px 0; color: #8b5cf6; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Invoice Details</h3>
            <div style="color: #1f2937; line-height: 1.7; font-size: 14px;">
              <div><strong>Issue Date:</strong> ${formatDate(
                invoice.issue_date
              )}</div>
              <div><strong>Due Date:</strong> ${formatDate(
                invoice.due_date
              )}</div>
              <div><strong>Status:</strong> <span style="display: inline-block; padding: 2px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${
                invoice.status
              }</span></div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);">
              <th style="padding: 16px; text-align: left; font-weight: 600; color: white; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
              <th style="padding: 16px; text-align: center; font-weight: 600; color: white; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 100px;">Qty</th>
              <th style="padding: 16px; text-align: right; font-weight: 600; color: white; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Unit Price</th>
              <th style="padding: 16px; text-align: right; font-weight: 600; color: white; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="width: 350px; padding: 24px; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Subtotal:</td>
                <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 16px;">${formatCurrencyWithCode(
                  invoice.subtotal,
                  invoice.currency
                )}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tax (${
                  invoice.tax_rate
                }%):</td>
                <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 16px;">${formatCurrencyWithCode(
                  invoice.tax_amount,
                  invoice.currency
                )}</td>
              </tr>
              <tr style="border-top: 2px solid #d1d5db;">
                <td style="padding: 16px 0 0 0; color: #1f2937; font-weight: 700; font-size: 18px;">Total Due:</td>
                <td style="padding: 16px 0 0 0; text-align: right; color: #3b82f6; font-weight: 700; font-size: 24px;">${formatCurrencyWithCode(
                  invoice.total,
                  invoice.currency
                )}</td>
              </tr>
            </table>
          </div>
        </div>

        ${
          invoice.notes
            ? `
        <div style="margin-bottom: 40px; padding: 20px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 13px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Notes</h3>
          <p style="color: #78350f; line-height: 1.6; margin: 0; font-size: 14px;">${invoice.notes}</p>
        </div>
        `
            : ""
        }

        <!-- Payment Information -->
        <div style="padding: 24px; background: white; border: 2px solid #e5e7eb; border-radius: 8px;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 700; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 20px; background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%); margin-right: 10px; border-radius: 2px;"></span>
            Payment Information
          </h3>
          <div style="color: #374151; line-height: 1.8; font-size: 14px;">
            ${getPaymentInformation(
              profile,
              invoice,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}
          </div>
          ${
            profile?.payment_instructions
              ? `
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; line-height: 1.6;">
            ${profile.payment_instructions}
          </div>
          `
              : ""
          }
        </div>

        <!-- Colored Footer Bar -->
        <div style="height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%); margin-top: 30px; border-radius: 4px;"></div>
      </div>
    `;
  },
};
