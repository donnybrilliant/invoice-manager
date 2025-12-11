/**
 * Professional email template - Minimalist black and white design
 * Matches the Professional invoice template style
 */

export const ProfessionalEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 3px solid #000;
      padding: 20px 0;
      margin-bottom: 30px;
    }
    .content {
      background-color: #ffffff;
      padding: 30px 0;
    }
    .invoice-details {
      border: 1px solid #000;
      padding: 20px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: 2px solid #000;
      margin-top: 10px;
      padding-top: 15px;
    }
    .total {
      font-size: 1.3em;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 2px;">INVOICE {{invoiceNumber}}</h1>
    <p style="margin: 5px 0 0 0; font-size: 14px;">{{companyName}}</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <div style="padding: 15px; border-left: 2px solid #000; margin: 20px 0; background-color: #f9f9f9;">{{message}}</div>
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
    <p style="margin-top: 30px; font-size: 0.875em; color: #666;">Contact: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
