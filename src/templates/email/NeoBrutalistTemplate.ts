/**
 * Neo-Brutalist email template - Bright colors, bold borders, box shadows
 * Matches the Neo-Brutalist invoice template style
 */

export const NeoBrutalistEmailTemplate = `<!DOCTYPE html>
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
      background-color: #E8F5E9;
    }
    .header {
      background: #FF5722;
      border: 5px solid #000;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 8px 8px 0px #000;
      transform: rotate(-1deg);
    }
    .content {
      background-color: #fff;
      border: 4px solid #000;
      padding: 30px;
      box-shadow: 6px 6px 0px #000;
    }
    .invoice-details {
      background-color: #fff;
      border: 4px solid #000;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 4px 4px 0px #000;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 2px solid #000;
      font-weight: bold;
    }
    .detail-row:last-child {
      border-bottom: none;
      border-top: 3px solid #000;
      margin-top: 10px;
      padding-top: 15px;
    }
    .total {
      font-size: 1.3em;
      font-weight: 900;
      text-transform: uppercase;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      margin: 0;
      color: #fff;
      text-shadow: 3px 3px 0px #000;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Invoice {{invoiceNumber}}</h1>
    <p style="margin: 10px 0 0 0; color: #fff; font-weight: bold;">from {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold;">Dear {{clientName}},</p>
    {{#if message}}
    <div style="background-color: #FFF9C4; border: 3px solid #000; padding: 15px; margin: 20px 0; box-shadow: 3px 3px 0px #000; font-weight: bold;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span>Invoice Number:</span>
        <span>{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span>Issue Date:</span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span>Due Date:</span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span>Total:</span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">If you have any questions, contact us!</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 0.875em; font-weight: bold;">Contact: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
