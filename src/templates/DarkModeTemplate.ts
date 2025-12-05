import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const DarkModeTemplate: InvoiceTemplate = {
  id: "dark-mode",
  name: "Dark Mode",
  description: "Sleek dark theme with neon accents",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item, index) => `
        <tr style="background: ${index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'};">
          <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #E0E0E0; font-size: 14px;">${item.description}</td>
          <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: center; color: #A0A0A0;">${item.quantity}</td>
          <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; color: #A0A0A0;">${formatCurrencyWithCode(item.unit_price, invoice.currency)}</td>
          <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; color: #00FFB2; font-weight: 600;">${formatCurrencyWithCode(item.amount, invoice.currency)}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 50px; background: linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%); color: #fff; border-radius: 12px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div>
            ${profile?.logo_url ? `<img src="${profile.logo_url}" alt="Logo" style="max-width: 140px; max-height: 70px; margin-bottom: 20px; filter: brightness(0) invert(1);" />` : ""}
            <div style="font-size: 48px; font-weight: 200; color: #fff; letter-spacing: -1px; margin-bottom: 8px;">
              Invoice
            </div>
            <div style="font-size: 14px; color: #00FFB2; font-family: 'SF Mono', monospace;">
              #${invoice.invoice_number}
            </div>
          </div>
          <div style="text-align: right; padding: 25px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="font-weight: 600; font-size: 16px; color: #fff; margin-bottom: 12px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="font-size: 13px; color: #808080; line-height: 1.8;">
              ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
              ${getCompanyInfo(profile, "email")}
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px;">
          <div style="padding: 25px; background: rgba(0,255,178,0.05); border-radius: 8px; border: 1px solid rgba(0,255,178,0.2);">
            <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #00FFB2; margin-bottom: 15px;">Bill To</div>
            <div style="font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 10px;">${client.name}</div>
            <div style="font-size: 13px; color: #808080; line-height: 1.8;">
              ${formatClientAddress(client).replace(/\n/g, "<br />")}<br />
              ${client.email}
            </div>
          </div>
          <div style="padding: 25px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
              <div>
                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060; margin-bottom: 8px;">Issued</div>
                <div style="font-size: 15px; color: #E0E0E0;">${formatDate(invoice.issue_date)}</div>
              </div>
              <div>
                <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060; margin-bottom: 8px;">Due</div>
                <div style="font-size: 15px; color: #FF6B6B;">${formatDate(invoice.due_date)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; margin-bottom: 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 18px 20px; background: rgba(255,255,255,0.05); text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060;">Description</th>
                <th style="padding: 18px 20px; background: rgba(255,255,255,0.05); text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060;">Qty</th>
                <th style="padding: 18px 20px; background: rgba(255,255,255,0.05); text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060;">Rate</th>
                <th style="padding: 18px 20px; background: rgba(255,255,255,0.05); text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 50px;">
          <div style="width: 320px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden;">
            <div style="display: flex; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <span style="font-size: 13px; color: #808080;">Subtotal</span>
              <span style="font-size: 14px; color: #E0E0E0;">${formatCurrencyWithCode(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <span style="font-size: 13px; color: #808080;">Tax</span>
              <span style="font-size: 14px; color: #E0E0E0;">${formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 20px; background: linear-gradient(135deg, rgba(0,255,178,0.15) 0%, rgba(0,255,178,0.05) 100%);">
              <span style="font-size: 14px; font-weight: 600; color: #fff;">Total Due</span>
              <span style="font-size: 28px; font-weight: 300; color: #00FFB2;">${formatCurrencyWithCode(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div style="padding: 25px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 25px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #606060; margin-bottom: 15px;">Payment Information</div>
          <div style="font-size: 13px; color: #A0A0A0; line-height: 1.9; font-family: 'SF Mono', monospace;">${getPaymentInformation(
              profile,
              invoice,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}</div>
        </div>

        ${invoice.notes ? `
        <div style="padding: 25px; background: rgba(255,107,107,0.05); border-radius: 8px; border: 1px solid rgba(255,107,107,0.2);">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #FF6B6B; margin-bottom: 15px;">Notes</div>
          <div style="font-size: 13px; color: #A0A0A0; line-height: 1.8;">${invoice.notes}</div>
        </div>
        ` : ""}
      </div>
    `;
  },
};
