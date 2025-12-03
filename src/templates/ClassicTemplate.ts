import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrency,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
} from "./utils";

export const ClassicTemplate: InvoiceTemplate = {
  id: "classic",
  name: "Classic",
  description: "Traditional invoice design with yellow footer",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
            item.description
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
            item.unit_price
          )}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
            item.amount
          )}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #1f2937; padding-bottom: 20px;">
          <div>
            ${
              profile?.logo_url
                ? `<img src="${profile.logo_url}" alt="Company Logo" style="max-width: 150px; max-height: 80px; margin-bottom: 10px;" />`
                : ""
            }
            <h1 style="margin: 0; font-size: 32px; color: #1f2937;">INVOICE</h1>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold; font-size: 18px; color: #1f2937; margin-bottom: 8px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              ${getCompanyInfo(profile, "address")}<br />
              ${getCompanyInfo(profile, "phone")}<br />
              ${getCompanyInfo(profile, "email")}
              ${profile?.website ? `<br />${profile.website}` : ""}
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
          <div>
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px; text-transform: uppercase;">Bill To:</h3>
            <div style="color: #374151; line-height: 1.6;">
              <strong>${client.name}</strong><br />
              ${client.email || ""}<br />
              ${client.phone || ""}<br />
              ${formatClientAddress(client).replace(/\n/g, "<br />")}
            </div>
          </div>
          <div style="text-align: right;">
            <table style="margin-left: auto;">
              <tr>
                <td style="padding: 4px 12px 4px 0; color: #6b7280; font-weight: 600;">Invoice #:</td>
                <td style="padding: 4px 0; color: #1f2937;">${
                  invoice.invoice_number
                }</td>
              </tr>
              <tr>
                <td style="padding: 4px 12px 4px 0; color: #6b7280; font-weight: 600;">Issue Date:</td>
                <td style="padding: 4px 0; color: #1f2937;">${formatDate(
                  invoice.issue_date
                )}</td>
              </tr>
              <tr>
                <td style="padding: 4px 12px 4px 0; color: #6b7280; font-weight: 600;">Due Date:</td>
                <td style="padding: 4px 0; color: #1f2937;">${formatDate(
                  invoice.due_date
                )}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #1f2937; border-bottom: 2px solid #d1d5db;">Description</th>
              <th style="padding: 12px; text-align: center; font-weight: 600; color: #1f2937; border-bottom: 2px solid #d1d5db; width: 100px;">Qty</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #1f2937; border-bottom: 2px solid #d1d5db; width: 120px;">Unit Price</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; color: #1f2937; border-bottom: 2px solid #d1d5db; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <table style="width: 300px;">
            <tr>
              <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600;">Subtotal:</td>
              <td style="padding: 8px 0; text-align: right; color: #1f2937;">${formatCurrency(
                invoice.subtotal
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600;">Tax (${
                invoice.tax_rate
              }%):</td>
              <td style="padding: 8px 0; text-align: right; color: #1f2937;">${formatCurrency(
                invoice.tax_amount
              )}</td>
            </tr>
            <tr style="border-top: 2px solid #d1d5db;">
              <td style="padding: 12px 12px 12px 0; color: #1f2937; font-weight: 700; font-size: 18px;">Total:</td>
              <td style="padding: 12px 0; text-align: right; color: #1f2937; font-weight: 700; font-size: 18px;">${formatCurrency(
                invoice.total
              )}</td>
            </tr>
          </table>
        </div>

        ${
          invoice.notes
            ? `
        <div style="margin-bottom: 40px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px; text-transform: uppercase;">Notes:</h3>
          <p style="color: #6b7280; line-height: 1.6; margin: 0;">${invoice.notes}</p>
        </div>
        `
            : ""
        }

        <!-- Yellow Footer with Payment Information -->
        <div style="background-color: #fef3c7; padding: 24px; border-radius: 8px; margin-top: 40px;">
          <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 700;">Payment Information</h3>
          ${
            profile?.bank_name || profile?.account_number
              ? `
          <div style="color: #78350f; line-height: 1.8; font-size: 14px;">
            ${
              profile.bank_name
                ? `<div><strong>Bank:</strong> ${profile.bank_name}</div>`
                : ""
            }
            ${
              profile.account_number
                ? `<div><strong>Account Number:</strong> ${profile.account_number}</div>`
                : ""
            }
            ${
              profile.routing_number
                ? `<div><strong>Routing Number:</strong> ${profile.routing_number}</div>`
                : ""
            }
          </div>
          `
              : '<div style="color: #78350f; font-size: 14px;">[Payment information not set]</div>'
          }
          ${
            profile?.payment_instructions
              ? `
          <div style="margin-top: 12px; color: #78350f; font-size: 14px; line-height: 1.6;">
            ${profile.payment_instructions}
          </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  },
};
