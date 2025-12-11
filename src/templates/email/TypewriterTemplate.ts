/**
 * Typewriter email template - Vintage paper look with Courier font
 * Matches the Typewriter invoice template style
 */

export const TypewriterEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.8;
      color: #5D4E37;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #FDF6E3;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23FDF6E3" width="100" height="100"/><circle fill="%23F5E6C8" cx="50" cy="50" r="1"/></svg>');
    }
    .header {
      border-bottom: 2px dashed #8B7355;
      padding: 20px 0;
      margin-bottom: 30px;
    }
    .content {
      padding: 30px 0;
    }
    .invoice-details {
      border: 2px dashed #8B7355;
      padding: 20px;
      margin: 20px 0;
      background-color: rgba(139,115,85,0.05);
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #8B7355;
    }
    .detail-row:last-child {
      border-bottom: none;
      border-top: 2px dashed #8B7355;
      margin-top: 10px;
      padding-top: 15px;
    }
    .total {
      font-size: 1.2em;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    h1 {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      color: #5D4E37;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE {{invoiceNumber}}</h1>
    <p style="margin: 10px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #8B7355;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <div style="border: 2px dashed #8B7355; padding: 15px; margin: 20px 0; background-color: rgba(139,115,85,0.05);">{{message}}</div>
    {{/if}}
    <p>Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Invoice Number:</span>
        <span>{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Issue Date:</span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Due Date:</span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span>TOTAL AMOUNT:</span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 11px; color: #8B7355; text-transform: uppercase; letter-spacing: 1px;">Contact: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
