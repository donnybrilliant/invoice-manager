/**
 * Default/Classic email template - Traditional design with dark header
 * Matches the Classic invoice template style
 */

export const DefaultEmailTemplate = `<!DOCTYPE html>
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
      background-color: #1f2937;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .invoice-details {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
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
      color: #1f2937;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">Invoice {{invoiceNumber}}</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">from {{companyName}}</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <div style="background-color: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">{{message}}</div>
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
        <span>Total Amount:</span>
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
