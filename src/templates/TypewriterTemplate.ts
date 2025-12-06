import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const TypewriterTemplate: InvoiceTemplate = {
  id: "typewriter",
  name: "Typewriter",
  description: "Vintage typewriter aesthetic with stamps and seals",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px dashed #8B7355;">${
            item.description
          }</td>
          <td style="padding: 10px 12px; border-bottom: 1px dashed #8B7355; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 10px 12px; border-bottom: 1px dashed #8B7355; text-align: right;">${formatCurrencyWithCode(
            item.unit_price,
            invoice.currency
          )}</td>
          <td style="padding: 10px 12px; border-bottom: 1px dashed #8B7355; text-align: right;">${formatCurrencyWithCode(
            item.amount,
            invoice.currency
          )}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 800px; margin: 0 auto; padding: 50px; background: #FDF6E3; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\"><rect fill=\"%23FDF6E3\" width=\"100\" height=\"100\"/><circle fill=\"%23F5E6C8\" cx=\"50\" cy=\"50\" r=\"1\"/></svg>'); position: relative;">
        <!-- Paper texture overlay -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(rgba(253,246,227,0) 0%, rgba(245,230,200,0.3) 100%); pointer-events: none;"></div>
        
        <!-- Stamp -->
        <div style="position: absolute; top: 40px; right: 60px; width: 100px; height: 100px; border: 4px double #8B0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg); opacity: 0.7;">
          <div style="text-align: center; color: #8B0000; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
            INVOICE<br/>
            <span style="font-size: 9px;">ORIGINAL</span>
          </div>
        </div>

        <!-- Header -->
        <div style="position: relative; margin-bottom: 50px; padding-bottom: 25px; border-bottom: 2px solid #8B7355;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              ${
                profile?.logo_url
                  ? `<img src="${profile.logo_url}" alt="Logo" style="max-width: 120px; max-height: 60px; margin-bottom: 15px; filter: sepia(50%);" />`
                  : ""
              }
              <div style="font-size: 36px; font-weight: bold; color: #3D2914; letter-spacing: 8px; text-transform: uppercase;">
                I N V O I C E
              </div>
              <div style="font-size: 14px; color: #8B7355; margin-top: 8px; letter-spacing: 4px;">
                No. ${invoice.invoice_number}
              </div>
            </div>
            <div style="text-align: right; max-width: 250px;">
              <div style="font-weight: bold; font-size: 14px; color: #3D2914; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">
                ${getCompanyInfo(profile, "company_name")}
              </div>
              <div style="font-size: 12px; color: #5D4E37; line-height: 1.8;">
                ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
                Tel: ${getCompanyInfo(profile, "phone")}<br />
                ${getCompanyInfo(profile, "email")}
              </div>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div style="position: relative; display: flex; justify-content: space-between; margin-bottom: 40px; padding: 25px; background: rgba(139,115,85,0.08); border: 1px dashed #8B7355;">
          <div>
            <div style="font-size: 11px; font-weight: bold; color: #8B7355; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px;">BILLED TO:</div>
            <div style="font-size: 16px; font-weight: bold; color: #3D2914; margin-bottom: 8px; text-transform: uppercase;">${
              client.name
            }</div>
            <div style="font-size: 12px; color: #5D4E37; line-height: 1.8;">
              ${formatClientAddress(client).replace(/\n/g, "<br />")}<br />
              ${client.email}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 18px;">
              <div style="font-size: 10px; color: #8B7355; text-transform: uppercase; letter-spacing: 2px;">Date Issued</div>
              <div style="font-size: 14px; color: #3D2914; margin-top: 4px; text-decoration: underline;">${formatDate(
                invoice.issue_date
              )}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: #8B7355; text-transform: uppercase; letter-spacing: 2px;">Payment Due</div>
              <div style="font-size: 14px; color: #8B0000; margin-top: 4px; font-weight: bold; text-decoration: underline;">${formatDate(
                invoice.due_date
              )}</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="position: relative; width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr>
              <th style="padding: 12px; border-bottom: 2px solid #8B7355; border-top: 2px solid #8B7355; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #5D4E37;">Description</th>
              <th style="padding: 12px; border-bottom: 2px solid #8B7355; border-top: 2px solid #8B7355; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #5D4E37;">Qty</th>
              <th style="padding: 12px; border-bottom: 2px solid #8B7355; border-top: 2px solid #8B7355; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #5D4E37;">Rate</th>
              <th style="padding: 12px; border-bottom: 2px solid #8B7355; border-top: 2px solid #8B7355; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #5D4E37;">Amount</th>
            </tr>
          </thead>
          <tbody style="color: #3D2914; font-size: 13px;">
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="position: relative; display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="width: 280px; border: 2px solid #8B7355; background: rgba(139,115,85,0.05);">
            <div style="display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px dashed #8B7355;">
              <span style="font-size: 12px; color: #5D4E37; text-transform: uppercase; letter-spacing: 1px;">Subtotal</span>
              <span style="color: #3D2914;">${formatCurrencyWithCode(
                invoice.subtotal,
                invoice.currency
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px dashed #8B7355;">
              <span style="font-size: 12px; color: #5D4E37; text-transform: uppercase; letter-spacing: 1px;">Tax</span>
              <span style="color: #3D2914;">${formatCurrencyWithCode(
                invoice.tax_amount,
                invoice.currency
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 16px; background: #3D2914; color: #FDF6E3;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">TOTAL DUE</span>
              <span style="font-size: 18px; font-weight: bold;">${formatCurrencyWithCode(
                invoice.total,
                invoice.currency
              )}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div style="position: relative; border: 1px dashed #8B7355; padding: 20px; margin-bottom: 25px; background: rgba(139,115,85,0.05);">
          <div style="font-size: 11px; font-weight: bold; color: #5D4E37; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px;">Payment Instructions:</div>
          <div style="font-size: 12px; color: #3D2914; line-height: 1.9;">${getPaymentInformation(
            profile,
            invoice,
            invoice.show_account_number,
            invoice.show_iban,
            invoice.show_swift_bic
          )}</div>
        </div>

        ${
          invoice.notes
            ? `
        <div style="position: relative; padding: 20px; border-left: 4px solid #8B7355; background: rgba(139,115,85,0.05);">
          <div style="font-size: 11px; font-weight: bold; color: #5D4E37; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px;">Memo:</div>
          <div style="font-size: 12px; color: #3D2914; line-height: 1.8; font-style: italic;">${invoice.notes}</div>
        </div>
        `
            : ""
        }

        <!-- Footer -->
        <div style="position: relative; margin-top: 50px; text-align: center; color: #8B7355; font-size: 11px; letter-spacing: 2px;">
          — Thank you for your business —
        </div>
      </div>
    `;
  },
};
