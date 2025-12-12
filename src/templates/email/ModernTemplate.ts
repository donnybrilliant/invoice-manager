/**
 * Modern email template - Contemporary design with gradient accents
 * Matches the Modern invoice template style
 */

export const ModernEmailTemplate = `<!DOCTYPE html>
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
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .invoice-details {
      background: linear-gradient(to right, #f3f4f6, #ffffff);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #667eea;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .total {
      font-size: 1.25em;
      font-weight: 700;
      color: #667eea;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 28px;">Invoice {{invoiceNumber}}</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.95;">from {{companyName}}</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">{{message}}</div>
    {{/if}}
    <p>Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span>Invoice Number: </span>
        <span>{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span>Issue Date: </span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span>Due Date: </span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span>Total Amount: </span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; color: #6b7280; font-size: 0.875em;">Contact: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
