import { InvoiceTemplate, InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
  getPaymentInformation,
} from "./utils";

export const MinimalJapaneseTemplate: InvoiceTemplate = {
  id: "minimal-japanese",
  name: "Minimal Japanese",
  description: "Zen-inspired minimalism with generous whitespace",
  render: (data: InvoiceTemplateData): string => {
    const { invoice, items, client, profile } = data;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 20px 0; border-bottom: 1px solid #E8E4DF; font-size: 14px; color: #2D2A26;">${item.description}</td>
          <td style="padding: 20px 0; border-bottom: 1px solid #E8E4DF; text-align: center; font-size: 14px; color: #8A847B;">${item.quantity}</td>
          <td style="padding: 20px 0; border-bottom: 1px solid #E8E4DF; text-align: right; font-size: 14px; color: #8A847B;">${formatCurrencyWithCode(item.unit_price, invoice.currency)}</td>
          <td style="padding: 20px 0; border-bottom: 1px solid #E8E4DF; text-align: right; font-size: 14px; color: #2D2A26; font-weight: 500;">${formatCurrencyWithCode(item.amount, invoice.currency)}</td>
        </tr>
      `
      )
      .join("");

    return `
      <div style="font-family: 'Hiragino Mincho Pro', 'Yu Mincho', Georgia, serif; max-width: 800px; margin: 0 auto; padding: 80px 60px; background: #FDFCFA;">
        <!-- Vertical Line Accent -->
        <div style="position: absolute; left: 40px; top: 80px; bottom: 80px; width: 1px; background: linear-gradient(180deg, transparent 0%, #C9B99A 20%, #C9B99A 80%, transparent 100%);"></div>

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 80px;">
          <div style="font-size: 12px; color: #C9B99A; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 20px;">請求書</div>
          <div style="font-size: 36px; font-weight: 300; color: #2D2A26; letter-spacing: 4px;">
            INVOICE
          </div>
          <div style="width: 40px; height: 1px; background: #2D2A26; margin: 25px auto;"></div>
          <div style="font-size: 13px; color: #8A847B; letter-spacing: 2px;">
            No. ${invoice.invoice_number}
          </div>
        </div>

        <!-- Company Info -->
        <div style="text-align: center; margin-bottom: 60px; padding-bottom: 40px; border-bottom: 1px solid #E8E4DF;">
          ${profile?.logo_url ? `<img src="${profile.logo_url}" alt="Logo" style="max-width: 100px; max-height: 50px; margin-bottom: 20px; opacity: 0.8;" />` : ""}
          <div style="font-size: 18px; font-weight: 500; color: #2D2A26; margin-bottom: 15px; letter-spacing: 2px;">
            ${getCompanyInfo(profile, "company_name")}
          </div>
          <div style="font-size: 12px; color: #8A847B; line-height: 2;">
            ${formatCompanyAddress(profile).replace(/\n/g, " · ")} · ${getCompanyInfo(profile, "email")}
          </div>
        </div>

        <!-- Client & Dates -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 60px;">
          <div>
            <div style="font-size: 10px; color: #C9B99A; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 15px;">御中</div>
            <div style="font-size: 20px; font-weight: 500; color: #2D2A26; margin-bottom: 12px;">${client.name}</div>
            <div style="font-size: 13px; color: #8A847B; line-height: 1.9;">
              ${formatClientAddress(client).replace(/\n/g, "<br />")}<br />
              ${client.email}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 25px;">
              <div style="font-size: 10px; color: #C9B99A; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">発行日</div>
              <div style="font-size: 14px; color: #2D2A26;">${formatDate(invoice.issue_date)}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: #C9B99A; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">支払期限</div>
              <div style="font-size: 14px; color: #B85C38;">${formatDate(invoice.due_date)}</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 50px;">
          <thead>
            <tr>
              <th style="padding: 15px 0; border-bottom: 2px solid #2D2A26; text-align: left; font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 4px; color: #8A847B;">品目</th>
              <th style="padding: 15px 0; border-bottom: 2px solid #2D2A26; text-align: center; font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 4px; color: #8A847B;">数量</th>
              <th style="padding: 15px 0; border-bottom: 2px solid #2D2A26; text-align: right; font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 4px; color: #8A847B;">単価</th>
              <th style="padding: 15px 0; border-bottom: 2px solid #2D2A26; text-align: right; font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 4px; color: #8A847B;">金額</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 60px;">
          <div style="width: 260px;">
            <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #E8E4DF;">
              <span style="font-size: 12px; color: #8A847B;">小計</span>
              <span style="font-size: 14px; color: #2D2A26;">${formatCurrencyWithCode(invoice.subtotal, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #E8E4DF;">
              <span style="font-size: 12px; color: #8A847B;">消費税</span>
              <span style="font-size: 14px; color: #2D2A26;">${formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 25px 0; border-top: 2px solid #2D2A26; margin-top: 15px;">
              <span style="font-size: 12px; color: #2D2A26; letter-spacing: 3px;">合計</span>
              <span style="font-size: 28px; font-weight: 300; color: #2D2A26;">${formatCurrencyWithCode(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div style="padding: 30px 0; border-top: 1px solid #E8E4DF; margin-bottom: 30px;">
          <div style="font-size: 10px; color: #C9B99A; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 15px;">振込先</div>
          <div style="font-size: 13px; color: #2D2A26; line-height: 2;">${getPaymentInformation(
              profile,
              invoice,
              invoice.show_account_number,
              invoice.show_iban,
              invoice.show_swift_bic
            )}</div>
        </div>

        ${invoice.notes ? `
        <div style="padding: 30px 0; border-top: 1px solid #E8E4DF;">
          <div style="font-size: 10px; color: #C9B99A; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 15px;">備考</div>
          <div style="font-size: 13px; color: #8A847B; line-height: 2;">${invoice.notes}</div>
        </div>
        ` : ""}

        <!-- Footer -->
        <div style="text-align: center; margin-top: 60px; padding-top: 40px;">
          <div style="width: 20px; height: 1px; background: #C9B99A; margin: 0 auto;"></div>
        </div>
      </div>
    `;
  },
};
