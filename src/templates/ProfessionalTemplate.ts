import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getBankingDetails,
} from "./utils";

export const ProfessionalTemplate: InvoiceTemplate = {
  id: "professional",
  name: "Professional",
  description: "Clean and minimal business design",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; color: #374151;">${
            item.description
          }</td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">${
            item.quantity
          }</td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151;">${formatCurrencyWithCode(
            item.unit_price,
            invoice.currency
          )}</td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: 600;">${formatCurrencyWithCode(
            item.amount,
            invoice.currency
          )}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 50px; background: white;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 2px solid #111827;">
          <div>
            ${
              profile?.logo_url
                ? `<img src="${profile.logo_url}" alt="Company Logo" style="max-width: 160px; max-height: 80px; margin-bottom: 20px;" />`
                : ""
            }
            <div style="font-weight: 700; font-size: 20px; color: #111827; margin-bottom: 8px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="color: #6b7280; font-size: 13px; line-height: 1.7;">
              ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
              ${getCompanyInfo(profile, "phone")} | ${getCompanyInfo(
      profile,
      "email"
    )}
              ${profile?.website ? `<br />${profile.website}` : ""}
              ${
                profile?.organization_number
                  ? `<br />Org: ${profile.organization_number}`
                  : ""
              }
              ${profile?.tax_number ? `<br />Tax: ${profile.tax_number}` : ""}
            </div>
          </div>
          <div style="text-align: right;">
            <h1 style="margin: 0 0 10px 0; font-size: 42px; color: #111827; font-weight: 300; letter-spacing: -1px;">INVOICE</h1>
            <div style="color: #6b7280; font-size: 15px; font-weight: 500;">#${
              invoice.invoice_number
            }</div>
          </div>
        </div>

        <!-- Invoice Details Grid -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 8px; color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Billed To</div>
            <div style="color: #111827; line-height: 1.7; font-size: 15px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${
                client.name
              }</div>
              ${
                client.email
                  ? `<div style="color: #6b7280; font-size: 14px;">${client.email}</div>`
                  : ""
              }
              ${
                client.phone
                  ? `<div style="color: #6b7280; font-size: 14px;">${client.phone}</div>`
                  : ""
              }
              ${
                formatClientAddress(client) !== "[No Address]"
                  ? `<div style="color: #6b7280; font-size: 14px; margin-top: 4px;">${formatClientAddress(
                      client
                    ).replace(/\n/g, "<br />")}</div>`
                  : ""
              }
            </div>
          </div>
          <div style="flex: 1; text-align: right;">
            <table style="margin-left: auto; border-spacing: 0;">
              <tr>
                <td style="padding: 6px 16px 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Issue Date</td>
                <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 500;">${formatDate(
                  invoice.issue_date
                )}</td>
              </tr>
              <tr>
                <td style="padding: 6px 16px 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Due Date</td>
                <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 500;">${formatDate(
                  invoice.due_date
                )}</td>
              </tr>
              <tr>
                <td style="padding: 6px 16px 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Status</td>
                <td style="padding: 6px 0;">
                  <span style="display: inline-block; padding: 4px 10px; background: #f3f4f6; color: #111827; border-radius: 3px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${invoice.status}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background-color: #111827;">
              <th style="padding: 14px 16px; text-align: left; font-weight: 600; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
              <th style="padding: 14px 16px; text-align: center; font-weight: 600; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 80px;">Qty</th>
              <th style="padding: 14px 16px; text-align: right; font-weight: 600; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Rate</th>
              <th style="padding: 14px 16px; text-align: right; font-weight: 600; color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 50px;">
          ${
            invoice.notes
              ? `
          <div style="flex: 1; max-width: 400px;">
            <div style="margin-bottom: 8px; color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Notes</div>
            <p style="color: #374151; line-height: 1.7; margin: 0; font-size: 14px;">${invoice.notes}</p>
          </div>
          `
              : '<div style="flex: 1;"></div>'
          }
          <div style="width: 320px;">
            <table style="width: 100%; border-spacing: 0;">
              <tr>
                <td style="padding: 10px 16px 10px 0; color: #6b7280; font-weight: 600; font-size: 14px;">Subtotal</td>
                <td style="padding: 10px 0; text-align: right; color: #111827; font-size: 15px;">${formatCurrencyWithCode(
                  invoice.subtotal,
                  invoice.currency
                )}</td>
              </tr>
              <tr>
                <td style="padding: 10px 16px 10px 0; color: #6b7280; font-weight: 600; font-size: 14px;">Tax (${
                  invoice.tax_rate
                }%)</td>
                <td style="padding: 10px 0; text-align: right; color: #111827; font-size: 15px;">${formatCurrencyWithCode(
                  invoice.tax_amount,
                  invoice.currency
                )}</td>
              </tr>
              <tr style="border-top: 2px solid #111827;">
                <td style="padding: 16px 16px 0 0; color: #111827; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Total</td>
                <td style="padding: 16px 0 0 0; text-align: right; color: #111827; font-weight: 700; font-size: 26px;">${formatCurrencyWithCode(
                  invoice.total,
                  invoice.currency
                )}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Payment Information -->
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 2px;">
          <div style="margin-bottom: 8px; color: #111827; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Payment Information</div>
          <div style="color: #374151; line-height: 1.8; font-size: 14px;">
            ${getBankingDetails(
              profile,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}
          </div>
          ${
            profile?.payment_instructions
              ? `
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; line-height: 1.7;">
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
