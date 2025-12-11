/**
 * Minimal email template - Clean and simple design
 * Matches the Minimal Japanese invoice template style
 */

export const MinimalJapaneseEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 30px;
    }
    .invoice-details {
      padding: 20px 0;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total {
      font-size: 1.2em;
      font-weight: 600;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 22px;">Invoice {{invoiceNumber}}</h1>
    <p style="margin: 5px 0 0 0; color: #6b7280;">{{companyName}}</p>
  </div>
  <div>
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <p style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 4px;">{{message}}</p>
    {{/if}}
    <p>Please find attached your invoice {{invoiceNumber}}.</p>
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
    <p>If you have any questions, please contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 20px; font-size: 0.875em; color: #6b7280;">{{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
