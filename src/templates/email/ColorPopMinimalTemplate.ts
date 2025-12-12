/**
 * Color Pop Minimal email template - Clean minimal layout with bold color accents
 * Matches the Color Pop Minimal invoice template style
 */

export const ColorPopMinimalEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: hsl(0, 0%, 100%);
    }
    .header {
      padding: 30px 20px;
      margin-bottom: 30px;
      border-bottom: 3px solid hsl(0, 0%, 0%);
    }
    .content {
      padding: 30px 20px;
    }
    .invoice-details {
      padding: 25px;
      background: hsla(201, 100%, 70%, 0.2);
      border-left: 4px solid hsl(201, 100%, 70%);
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid hsla(0, 0%, 0%, 0.15);
    }
    .detail-row:last-child {
      border-bottom: none;
      margin-top: 10px;
      padding: 20px 0;
      background: linear-gradient(90deg, hsl(358, 100%, 67%) 0%, hsl(44, 100%, 68%) 100%);
      margin-left: -25px;
      margin-right: -25px;
      padding-left: 25px;
      padding-right: 25px;
    }
    .total {
      font-size: 1.5em;
      font-weight: 900;
      color: hsl(0, 0%, 100%);
    }
    h1 {
      font-size: 36px;
      font-weight: 900;
      margin: 0;
      letter-spacing: -2px;
      line-height: 1;
    }
    .invoice-number {
      font-size: 20px;
      font-weight: 300;
      color: hsla(0, 0%, 0%, 0.5);
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Invoice</h1>
    <div class="invoice-number">#{{invoiceNumber}}</div>
    <p style="margin: 15px 0 0 0; font-weight: bold; font-size: 14px;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="margin-bottom: 20px; font-size: 16px;">Dear {{clientName}},</p>
    {{#if message}}
    <div style="background: hsla(137, 79%, 54%, 0.2); padding: 15px; margin: 20px 0; border-left: 4px solid hsl(137, 79%, 54%);">{{message}}</div>
    {{/if}}
    <p>Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="color: hsla(0, 0%, 0%, 0.6);">Invoice Number: </span>
        <span style="font-weight: 600;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="color: hsla(0, 0%, 0%, 0.6);">Issue Date: </span>
        <span style="font-weight: 600;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="color: hsla(0, 0%, 0%, 0.6);">Due Date: </span>
        <span style="font-weight: 600;">{{dueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 14px; font-weight: 900; color: hsl(0, 0%, 100%); text-transform: uppercase; letter-spacing: 2px;">Total</span>
        <span class="total">{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="margin-top: 20px;">If you have any questions about this invoice, please don't hesitate to contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; color: hsla(0, 0%, 0%, 0.6); font-size: 0.875em;">Contact: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
