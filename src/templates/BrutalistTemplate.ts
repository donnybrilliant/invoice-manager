import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const BrutalistTemplate: InvoiceTemplate = {
  id: "brutalist",
  name: "Brutalist",
  description: "Raw, industrial design with heavy borders and monospace type",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 16px; border: 3px solid #000; font-family: 'Courier New', monospace; font-size: 13px; text-transform: uppercase;">${item.description}</td>
          <td style="padding: 12px 16px; border: 3px solid #000; text-align: center; font-family: 'Courier New', monospace; font-weight: 900;">${item.quantity}</td>
          <td style="padding: 12px 16px; border: 3px solid #000; text-align: right; font-family: 'Courier New', monospace;">${formatCurrencyWithCode(item.unit_price, invoice.currency)}</td>
          <td style="padding: 12px 16px; border: 3px solid #000; text-align: right; font-family: 'Courier New', monospace; font-weight: 900; background: #000; color: #fff;">${formatCurrencyWithCode(item.amount, invoice.currency)}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 800px; margin: 0 auto; padding: 40px; background: #fff; border: 6px solid #000;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 6px solid #000;">
          <div>
            <div style="font-size: 72px; font-weight: 900; color: #000; line-height: 0.9; letter-spacing: -4px;">
              INV<br/>OICE
            </div>
            <div style="font-size: 24px; font-weight: 900; margin-top: 10px; background: #000; color: #fff; padding: 8px 16px; display: inline-block;">
              #${invoice.invoice_number}
            </div>
          </div>
          <div style="text-align: right; border: 3px solid #000; padding: 20px; max-width: 280px;">
            ${profile?.logo_url ? `<img src="${profile.logo_url}" alt="Logo" style="max-width: 120px; max-height: 60px; margin-bottom: 15px; filter: grayscale(100%);" />` : ""}
            <div style="font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">
              ${getCompanyInfo(profile, "company_name")}
            </div>
            <div style="font-size: 11px; line-height: 1.8; text-transform: uppercase;">
              ${formatCompanyAddress(profile).replace(/\n/g, "<br />")}<br />
              ${getCompanyInfo(profile, "phone")}<br />
              ${getCompanyInfo(profile, "email")}
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-bottom: 40px; border: 3px solid #000;">
          <div style="padding: 20px; border-right: 3px solid #000;">
            <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px; background: #000; color: #fff; padding: 6px 10px; display: inline-block;">BILL TO</div>
            <div style="font-size: 18px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px;">${client.name}</div>
            <div style="font-size: 12px; line-height: 1.8; text-transform: uppercase;">
              ${formatClientAddress(client).replace(/\n/g, "<br />")}<br />
              ${client.email}
            </div>
          </div>
          <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666;">ISSUED</div>
                <div style="font-size: 14px; font-weight: 900; margin-top: 4px;">${formatDate(invoice.issue_date)}</div>
              </div>
              <div>
                <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #666;">DUE</div>
                <div style="font-size: 14px; font-weight: 900; margin-top: 4px;">${formatDate(invoice.due_date)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr>
              <th style="padding: 16px; border: 3px solid #000; background: #000; color: #fff; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 3px;">DESCRIPTION</th>
              <th style="padding: 16px; border: 3px solid #000; background: #000; color: #fff; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 3px;">QTY</th>
              <th style="padding: 16px; border: 3px solid #000; background: #000; color: #fff; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 3px;">RATE</th>
              <th style="padding: 16px; border: 3px solid #000; background: #000; color: #fff; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 3px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
          <div style="width: 320px; border: 6px solid #000;">
            <div style="display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 3px solid #000;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">SUBTOTAL</span>
              <span style="font-weight: 900;">${formatCurrencyWithCode(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 3px solid #000;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">TAX</span>
              <span style="font-weight: 900;">${formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 20px 16px; background: #000; color: #fff;">
              <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 3px; font-weight: 900;">TOTAL</span>
              <span style="font-size: 24px; font-weight: 900;">${formatCurrencyWithCode(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div style="border: 3px solid #000; padding: 20px; margin-bottom: 30px;">
          <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px;">PAYMENT INFORMATION</div>
          <div style="font-size: 13px; line-height: 1.8;">${getPaymentInformation(
              profile,
              invoice,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}</div>
        </div>

        ${invoice.notes ? `
        <div style="border: 3px dashed #000; padding: 20px;">
          <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px;">NOTES</div>
          <div style="font-size: 13px; line-height: 1.8;">${invoice.notes}</div>
        </div>
        ` : ""}
      </div>
    `;
  },
};
