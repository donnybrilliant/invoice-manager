import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const SwissTemplate: InvoiceTemplate = {
  id: "swiss",
  name: "Swiss",
  description: "Grid-based International Typographic Style",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; color: #333;">${item.description}</td>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0e0e0; text-align: center; font-size: 14px; color: #333;">${item.quantity}</td>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-size: 14px; color: #333;">${formatCurrencyWithCode(item.unit_price, invoice.currency)}</td>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-size: 14px; font-weight: 600; color: #000;">${formatCurrencyWithCode(item.amount, invoice.currency)}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 60px; background: #fff;">
        <!-- Red Accent Bar -->
        <div style="width: 60px; height: 8px; background: #FF0000; margin-bottom: 60px;"></div>
        
        <!-- Header -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; margin-bottom: 80px;">
          <div>
            ${profile?.logo_url ? `<img src="${profile.logo_url}" alt="Logo" style="max-width: 140px; max-height: 70px; margin-bottom: 30px;" />` : ""}
            <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 8px;">From</div>
            <div style="font-weight: 700; font-size: 18px; color: #000; margin-bottom: 12px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="font-size: 13px; color: #666; line-height: 1.8;">
              ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
              ${getCompanyInfo(profile, "email")}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 64px; font-weight: 300; color: #000; line-height: 1; letter-spacing: -2px;">
              Invoice
            </div>
            <div style="font-size: 14px; color: #999; margin-top: 15px;">
              No. ${invoice.invoice_number}
            </div>
          </div>
        </div>

        <!-- Client & Dates -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 80px; margin-bottom: 60px; padding-bottom: 40px; border-bottom: 1px solid #e0e0e0;">
          <div>
            <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 8px;">Bill To</div>
            <div style="font-weight: 700; font-size: 18px; color: #000; margin-bottom: 12px;">${client.name}</div>
            <div style="font-size: 13px; color: #666; line-height: 1.8;">
              ${formatClientAddress(client).replace(/\n/g, "<br />")}<br />
              ${client.email}
            </div>
          </div>
          <div>
            <div style="margin-bottom: 25px;">
              <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 6px;">Issue Date</div>
              <div style="font-size: 15px; color: #000;">${formatDate(invoice.issue_date)}</div>
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 6px;">Due Date</div>
              <div style="font-size: 15px; color: #FF0000; font-weight: 600;">${formatDate(invoice.due_date)}</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 50px;">
          <thead>
            <tr>
              <th style="padding: 16px 0; border-bottom: 2px solid #000; text-align: left; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999;">Description</th>
              <th style="padding: 16px 0; border-bottom: 2px solid #000; text-align: center; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999;">Qty</th>
              <th style="padding: 16px 0; border-bottom: 2px solid #000; text-align: right; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999;">Rate</th>
              <th style="padding: 16px 0; border-bottom: 2px solid #000; text-align: right; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 60px;">
          <div style="width: 280px;">
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
              <span style="font-size: 13px; color: #666;">Subtotal</span>
              <span style="font-size: 14px; color: #333;">${formatCurrencyWithCode(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
              <span style="font-size: 13px; color: #666;">Tax</span>
              <span style="font-size: 14px; color: #333;">${formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 20px 0; border-top: 2px solid #000; margin-top: 10px;">
              <span style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #000;">Total</span>
              <span style="font-size: 28px; font-weight: 300; color: #000;">${formatCurrencyWithCode(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <!-- Payment & Notes -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding-top: 40px; border-top: 1px solid #e0e0e0;">
          <div>
            <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 15px;">Payment Information</div>
            <div style="font-size: 13px; color: #333; line-height: 1.9;">${getPaymentInformation(
              profile,
              invoice,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}</div>
          </div>
          ${invoice.notes ? `
          <div>
            <div style="font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 15px;">Notes</div>
            <div style="font-size: 13px; color: #333; line-height: 1.9;">${invoice.notes}</div>
          </div>
          ` : ""}
        </div>

        <!-- Footer -->
        <div style="margin-top: 80px; text-align: center;">
          <div style="width: 40px; height: 4px; background: #FF0000; margin: 0 auto;"></div>
        </div>
      </div>
    `;
  },
};
