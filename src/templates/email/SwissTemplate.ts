/**
 * Swiss email template - Clean, minimal design with red accent
 * Matches the Swiss invoice template style
 */

export const SwissEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.8;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    .accent-bar {
      width: 60px;
      height: 8px;
      background: #FF0000;
      margin-bottom: 30px;
    }
    .header {
      padding: 20px 0;
      margin-bottom: 30px;
      border-bottom: 1px solid #e5e7eb;
    }
    .content {
      padding: 30px 0;
    }
    .invoice-details {
      padding: 20px 0;
      margin: 20px 0;
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .detail-row:last-child {
      border-bottom: none;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 2px solid #000;
    }
    .total {
      font-size: 1.2em;
      font-weight: 600;
      letter-spacing: 1px;
    }
    h1 {
      font-size: 48px;
      font-weight: 300;
      margin: 0;
      color: #000;
      letter-spacing: -2px;
    }
  </style>
</head>
<body>
  <div class="accent-bar"></div>
  <div class="header">
    <h1>INVOICE</h1>
    <p style="margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">{{invoiceNumber}}</p>
    <p style="margin: 20px 0 0 0; font-size: 12px; color: #6b7280;">{{companyName}}</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    {{#if message}}
    <p style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 2px solid #FF0000;">{{message}}</p>
    {{/if}}
    <p>Please find attached your invoice {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #6b7280;">Issue Date </span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #6b7280;">Due Date </span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Total </span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="margin-top: 30px;">If you have any questions, please contact us.</p>
    {{#if companyEmail}}
    <p style="margin-top: 20px; font-size: 11px; color: #6b7280; letter-spacing: 0.5px;">{{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
