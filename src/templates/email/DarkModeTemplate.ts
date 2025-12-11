/**
 * Dark Mode email template - Dark background with modern styling
 * Matches the Dark Mode invoice template style
 */

export const DarkModeEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #0D0D0D;
    }
    body {
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #fff;
      padding: 0;
    }
    .email-wrapper {
      width: 100%;
      background: #0D0D0D;
      padding: 20px 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
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
      font-size: 48px;
      font-weight: 200;
      margin: 0;
      color: #fff;
      letter-spacing: -1px;
      margin-bottom: 8px;
    }
    .invoice-number {
      font-size: 14px;
      color: #00FFB2;
      font-family: 'SF Mono', monospace;
      margin-top: 8px;
    }
    .company-info {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #00FFB2;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <h1>Invoice</h1>
        <div class="invoice-number">#{{invoiceNumber}}</div>
        <div class="company-info">
          <div style="font-weight: 600; font-size: 16px; color: #fff; margin-bottom: 12px;">{{companyName}}</div>
        </div>
      </div>
      <div class="content">
        <p style="color: #E0E0E0; margin-bottom: 20px;">Dear {{clientName}},</p>
        {{#if message}}
        <div style="background: rgba(0,255,178,0.05); padding: 15px; border-left: 3px solid #00FFB2; margin: 20px 0; border-radius: 4px; color: #E0E0E0;">{{message}}</div>
        {{/if}}
        <p style="color: #E0E0E0; margin-bottom: 20px;">Please find attached your invoice {{invoiceNumber}}.</p>
        <div class="invoice-details">
          <div class="label" style="margin-bottom: 15px;">Invoice Details</div>
          <div class="detail-row">
            <span style="color: #B0B0B0; font-size: 13px;">Invoice Number:</span>
            <span style="font-weight: 600; color: #E0E0E0;">{{invoiceNumber}}</span>
          </div>
          <div class="detail-row">
            <span style="color: #B0B0B0; font-size: 13px;">Issue Date:</span>
            <span style="color: #E0E0E0;">{{issueDate}}</span>
          </div>
          <div class="detail-row">
            <span style="color: #B0B0B0; font-size: 13px;">Due Date:</span>
            <span style="color: #E0E0E0;">{{dueDate}}</span>
          </div>
          <div class="detail-row total">
            <span style="font-weight: 600;">Total Amount:</span>
            <span>{{total}} {{currency}}</span>
          </div>
        </div>
        <p style="color: #E0E0E0; margin-top: 20px;">If you have any questions about this invoice, please don't hesitate to contact us.</p>
        {{#if companyEmail}}
        <p style="margin-top: 30px; font-size: 0.875em; color: #B0B0B0;">Contact: {{companyEmail}}</p>
        {{/if}}
      </div>
    </div>
  </div>
</body>
</html>`;
