/**
 * Color Pop Brutalist email template - Vibrant multi-color brutalist with bold primary accents
 * Matches the Color Pop Brutalist invoice template style
 */

export const ColorPopBrutalistEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Arial Black', Helvetica, sans-serif;
      line-height: 1.6;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: hsl(0, 0%, 100%);
    }
    .header {
      background: hsl(358, 100%, 67%);
      padding: 30px 20px;
      margin-bottom: 20px;
      border: 6px solid hsl(0, 0%, 0%);
    }
    .content {
      border: 6px solid hsl(0, 0%, 0%);
      padding: 30px;
      background: hsl(0, 0%, 100%);
    }
    .invoice-details {
      border: 4px solid hsl(0, 0%, 0%);
      box-shadow: 8px 8px 0 hsl(137, 79%, 54%);
      padding: 20px;
      margin: 20px 0;
      overflow: hidden;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 3px solid hsl(0, 0%, 0%);
      background: hsl(0, 0%, 100%);
    }
    .detail-row:last-child {
      border-bottom: none;
      padding: 20px;
      background: hsl(358, 100%, 67%);
      color: hsl(0, 0%, 100%);
    }
    .total {
      font-size: 1.6em;
      font-weight: 900;
    }
    h1 {
      font-size: 42px;
      font-weight: 900;
      margin: 0;
      color: hsl(0, 0%, 100%);
      text-shadow: 4px 4px 0 hsl(0, 0%, 0%);
      letter-spacing: -2px;
    }
    .invoice-number {
      background: hsl(44, 100%, 68%);
      border: 4px solid hsl(0, 0%, 0%);
      padding: 12px 24px;
      box-shadow: 6px 6px 0 hsl(0, 0%, 0%);
      display: inline-block;
      margin-top: 15px;
    }
    .invoice-number-label {
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .invoice-number-value {
      font-size: 24px;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <div class="invoice-number">
      <div class="invoice-number-label">Invoice No.</div>
      <div class="invoice-number-value">#{{invoiceNumber}}</div>
    </div>
    <p style="margin: 15px 0 0 0; font-weight: bold; font-size: 14px;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px; font-size: 16px;">DEAR {{clientName}},</p>
    {{#if message}}
    <div style="background: hsl(44, 100%, 68%); border: 4px dashed hsl(0, 0%, 0%); padding: 15px; margin: 20px 0;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Invoice Number: </span>
        <span style="font-weight: 900; font-size: 16px;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Issue Date: </span>
        <span style="font-weight: 900; font-size: 16px;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Due Date: </span>
        <span style="font-weight: 900; font-size: 16px;">{{dueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 18px; text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">Total</span>
        <span class="total">{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">IF YOU HAVE ANY QUESTIONS, CONTACT US.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; font-weight: bold;">CONTACT: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
