/**
 * Dark Mode email template - Dark background with modern styling
 * Matches the Dark Mode invoice template style
 */

export const DarkModeEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #fff;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%);
    }
    .header {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 30px 0;
      margin-bottom: 30px;
    }
    .content {
      padding: 30px 0;
    }
    .invoice-details {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 25px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .detail-row:last-child {
      border-bottom: none;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    .total {
      font-size: 1.3em;
      font-weight: 600;
      color: #fff;
    }
    h1 {
      font-size: 32px;
      font-weight: 200;
      margin: 0;
      color: #fff;
      letter-spacing: -1px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Invoice {{invoiceNumber}}</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.7; font-size: 14px;">from {{companyName}}</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <div style="background: rgba(255,255,255,0.08); padding: 15px; border-left: 3px solid rgba(255,255,255,0.3); margin: 20px 0; border-radius: 4px;">{{message}}</div>
    {{/if}}
    <p>Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="opacity: 0.8;">Invoice Number:</span>
        <span>{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="opacity: 0.8;">Issue Date:</span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="opacity: 0.8;">Due Date:</span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span>Total Amount:</span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="opacity: 0.9;">If you have any questions about this invoice, please don't hesitate to contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 0.875em; opacity: 0.7;">Contact: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
