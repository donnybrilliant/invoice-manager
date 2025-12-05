import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const NeoBrutalistTemplate: InvoiceTemplate = {
  id: "neo-brutalist",
  name: "Neo Brutalist",
  description: "Bold colors with raw brutalist structure and thick shadows",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item, index) => `
        <tr>
          <td style="padding: 14px 16px; border: 3px solid #000; background: ${index % 2 === 0 ? '#fff' : '#FFEB3B'}; font-family: 'Arial Black', sans-serif; font-size: 13px;">${item.description}</td>
          <td style="padding: 14px 16px; border: 3px solid #000; background: ${index % 2 === 0 ? '#fff' : '#FFEB3B'}; text-align: center; font-weight: 900;">${item.quantity}</td>
          <td style="padding: 14px 16px; border: 3px solid #000; background: ${index % 2 === 0 ? '#fff' : '#FFEB3B'}; text-align: right;">${formatCurrencyWithCode(item.unit_price, invoice.currency)}</td>
          <td style="padding: 14px 16px; border: 3px solid #000; background: #FF5722; color: #fff; text-align: right; font-weight: 900;">${formatCurrencyWithCode(item.amount, invoice.currency)}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Arial Black', Helvetica, sans-serif; max-width: 800px; margin: 0 auto; padding: 50px; background: #E8F5E9; border: 5px solid #000; box-shadow: 12px 12px 0px #000;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px;">
          <div style="background: #FF5722; border: 4px solid #000; padding: 25px; box-shadow: 8px 8px 0px #000; transform: rotate(-2deg);">
            <div style="font-size: 48px; font-weight: 900; color: #fff; line-height: 1; text-shadow: 3px 3px 0px #000;">
              INVOICE
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #FFEB3B; margin-top: 8px;">
              #${invoice.invoice_number}
            </div>
          </div>
          <div style="background: #fff; border: 4px solid #000; padding: 20px; box-shadow: 6px 6px 0px #000; max-width: 260px;">
            ${profile?.logo_url ? `<img src="${profile.logo_url}" alt="Logo" style="max-width: 100px; max-height: 50px; margin-bottom: 12px;" />` : ""}
            <div style="font-weight: 900; font-size: 16px; margin-bottom: 8px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="font-size: 11px; line-height: 1.7; font-family: Arial, sans-serif;">
              ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
              ${getCompanyInfo(profile, "email")}
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div style="display: flex; gap: 20px; margin-bottom: 40px;">
          <div style="flex: 1; background: #2196F3; border: 4px solid #000; padding: 20px; box-shadow: 6px 6px 0px #000;">
            <div style="font-size: 12px; font-weight: 900; color: #fff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">→ BILL TO</div>
            <div style="font-size: 18px; font-weight: 900; color: #FFEB3B; margin-bottom: 8px;">${client.name}</div>
            <div style="font-size: 12px; color: #fff; line-height: 1.7; font-family: Arial, sans-serif;">
              ${formatClientAddress(client).replace(/\n/g, "<br />")}<br />
              ${client.email}
            </div>
          </div>
          <div style="background: #FFEB3B; border: 4px solid #000; padding: 20px; box-shadow: 6px 6px 0px #000;">
            <div style="margin-bottom: 15px;">
              <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">ISSUED</div>
              <div style="font-size: 16px; font-weight: 900; margin-top: 4px;">${formatDate(invoice.issue_date)}</div>
            </div>
            <div>
              <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">DUE DATE</div>
              <div style="font-size: 16px; font-weight: 900; margin-top: 4px; color: #D32F2F;">${formatDate(invoice.due_date)}</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="background: #fff; border: 4px solid #000; box-shadow: 8px 8px 0px #000; margin-bottom: 40px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 16px; border: 3px solid #000; background: #9C27B0; color: #fff; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Item</th>
                <th style="padding: 16px; border: 3px solid #000; background: #9C27B0; color: #fff; text-align: center; font-size: 12px; text-transform: uppercase;">Qty</th>
                <th style="padding: 16px; border: 3px solid #000; background: #9C27B0; color: #fff; text-align: right; font-size: 12px; text-transform: uppercase;">Rate</th>
                <th style="padding: 16px; border: 3px solid #000; background: #9C27B0; color: #fff; text-align: right; font-size: 12px; text-transform: uppercase;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="background: #000; border: 4px solid #000; box-shadow: 8px 8px 0px #FF5722; padding: 0; min-width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 14px 20px; border-bottom: 3px solid #333; color: #fff;">
              <span style="font-size: 13px; text-transform: uppercase;">Subtotal</span>
              <span style="font-weight: 900;">${formatCurrencyWithCode(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 14px 20px; border-bottom: 3px solid #333; color: #fff;">
              <span style="font-size: 13px; text-transform: uppercase;">Tax</span>
              <span style="font-weight: 900;">${formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 20px; background: #FFEB3B; color: #000;">
              <span style="font-size: 16px; text-transform: uppercase; font-weight: 900;">TOTAL DUE</span>
              <span style="font-size: 28px; font-weight: 900;">${formatCurrencyWithCode(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div style="background: #fff; border: 4px solid #000; padding: 20px; box-shadow: 6px 6px 0px #2196F3;">
          <div style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">💰 Payment Details</div>
          <div style="font-size: 13px; line-height: 1.8; font-family: Arial, sans-serif;">${getPaymentInformation(
              profile,
              invoice,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}</div>
        </div>

        ${invoice.notes ? `
        <div style="margin-top: 20px; background: #FFEB3B; border: 4px dashed #000; padding: 20px;">
          <div style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">📝 Notes</div>
          <div style="font-size: 13px; line-height: 1.8; font-family: Arial, sans-serif;">${invoice.notes}</div>
        </div>
        ` : ""}
      </div>
    `;
  },
};
