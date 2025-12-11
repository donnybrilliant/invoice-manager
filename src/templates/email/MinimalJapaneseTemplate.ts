/**
 * Minimal Japanese email template - Clean and elegant design with Japanese typography
 * Matches the Minimal Japanese invoice template style
 */

export const MinimalJapaneseEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Hiragino Mincho Pro', 'Yu Mincho', Georgia, serif;
      line-height: 1.8;
      color: #2D2A26;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 30px;
      background-color: #FDFCFA;
      position: relative;
    }
    .vertical-line {
      position: absolute;
      left: 30px;
      top: 40px;
      bottom: 40px;
      width: 1px;
      background: linear-gradient(180deg, transparent 0%, #C9B99A 20%, #C9B99A 80%, transparent 100%);
    }
    .header {
      text-align: center;
      padding: 20px 0 30px 0;
      margin-bottom: 30px;
      border-bottom: 1px solid #E8E4DF;
    }
    .japanese-label {
      font-size: 12px;
      color: #C9B99A;
      letter-spacing: 8px;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .invoice-title {
      font-size: 36px;
      font-weight: 300;
      color: #2D2A26;
      letter-spacing: 4px;
      margin: 0;
    }
    .title-line {
      width: 40px;
      height: 1px;
      background: #2D2A26;
      margin: 20px auto;
    }
    .invoice-number {
      font-size: 13px;
      color: #8A847B;
      letter-spacing: 2px;
      margin-top: 10px;
    }
    .company-name {
      font-size: 18px;
      font-weight: 500;
      color: #2D2A26;
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    .content {
      padding: 20px 0;
    }
    .invoice-details {
      padding: 25px 0;
      margin: 25px 0;
      border-top: 1px solid #E8E4DF;
      border-bottom: 1px solid #E8E4DF;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
    .detail-label {
      color: #8A847B;
      font-size: 12px;
      letter-spacing: 1px;
    }
    .total {
      font-size: 1.3em;
      font-weight: 500;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #E8E4DF;
      color: #2D2A26;
    }
    .message-box {
      margin: 25px 0;
      padding: 20px;
      background-color: #F9F8F6;
      border-left: 2px solid #C9B99A;
      border-radius: 2px;
      font-size: 14px;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="vertical-line"></div>
  <div class="header">
    <div class="japanese-label">請求書</div>
    <h1 class="invoice-title">INVOICE</h1>
    <div class="title-line"></div>
    <div class="invoice-number">No. {{invoiceNumber}}</div>
  </div>
  <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #E8E4DF;">
    <div class="company-name">{{companyName}}</div>
    {{#if companyEmail}}
    <div style="font-size: 12px; color: #8A847B; line-height: 2;">{{companyEmail}}</div>
    {{/if}}
  </div>
  <div class="content">
    <p style="margin-bottom: 20px; font-size: 14px; line-height: 1.8;">Dear {{clientName}},</p>
    {{#if message}}
    <div class="message-box">{{message}}</div>
    {{/if}}
    <p style="margin-bottom: 25px; font-size: 14px; line-height: 1.8;">Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span class="detail-label">Invoice Number:</span>
        <span>{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Issue Date:</span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span>Total:</span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="margin-top: 25px; font-size: 14px; line-height: 1.8;">If you have any questions, please contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; color: #8A847B; text-align: center;">{{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
