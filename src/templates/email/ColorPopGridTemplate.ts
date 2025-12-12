/**
 * Color Pop Grid email template - Grid-based brutalist layout with color blocks
 * Matches the Color Pop Grid invoice template style
 */

export const ColorPopGridEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: hsl(0, 0%, 100%);
    }
    .header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      border: 5px solid hsl(0, 0%, 0%);
      margin-bottom: 20px;
    }
    .header-cell {
      padding: 25px 15px;
      text-align: center;
    }
    .header-cell-1 { background: hsl(358, 100%, 67%); border-right: 5px solid hsl(0, 0%, 0%); }
    .header-cell-2 { background: hsl(44, 100%, 68%); border-right: 5px solid hsl(0, 0%, 0%); }
    .header-cell-3 { background: hsl(137, 79%, 54%); border-right: 5px solid hsl(0, 0%, 0%); }
    .header-cell-4 { background: hsl(201, 100%, 70%); }
    .content {
      border: 5px solid hsl(0, 0%, 0%);
      padding: 30px;
      background: hsl(0, 0%, 100%);
    }
    .invoice-details {
      padding: 20px;
      background: hsla(201, 100%, 70%, 0.3);
      border-top: 5px solid hsl(0, 0%, 0%);
      margin-top: 20px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 2px solid hsl(0, 0%, 0%);
    }
    .detail-row:last-child {
      border-bottom: none;
      margin-top: 15px;
      padding-top: 15px;
    }
    .total {
      background: hsl(358, 100%, 67%);
      color: hsl(0, 0%, 100%);
      padding: 20px;
      text-align: center;
      margin-top: 15px;
    }
    h1 {
      font-size: 24px;
      font-weight: 900;
      margin: 0;
      color: hsl(0, 0%, 100%);
    }
    .header-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 900;
      margin-bottom: 8px;
      color: hsl(0, 0%, 0%);
    }
    .header-value {
      font-size: 16px;
      font-weight: 900;
      color: hsl(0, 0%, 0%);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-cell header-cell-1">
      <div style="font-size: 11px; color: hsl(0, 0%, 100%); text-transform: uppercase; letter-spacing: 3px; font-weight: 900;">Invoice</div>
      <div style="font-size: 24px; color: hsl(0, 0%, 100%); font-weight: 900; margin-top: 8px;">#{{invoiceNumber}}</div>
    </div>
    <div class="header-cell header-cell-2">
      <div class="header-label">Issue Date</div>
      <div class="header-value">{{issueDate}}</div>
    </div>
    <div class="header-cell header-cell-3">
      <div class="header-label">Due Date</div>
      <div class="header-value">{{dueDate}}</div>
    </div>
    <div class="header-cell header-cell-4">
      <div class="header-label">Total Due</div>
      <div class="header-value">{{total}} {{currency}}</div>
    </div>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px; font-size: 16px;">DEAR {{clientName}},</p>
    <p style="margin-bottom: 15px; font-size: 14px;">FROM: {{companyName}}</p>
    {{#if message}}
    <div style="background: hsla(137, 79%, 54%, 0.3); border: 3px solid hsl(0, 0%, 0%); padding: 15px; margin: 20px 0;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Invoice Number: </span>
        <span style="font-weight: 900;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Issue Date: </span>
        <span style="font-weight: 900;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Due Date: </span>
        <span style="font-weight: 900;">{{dueDate}}</span>
      </div>
      <div class="total">
        <div style="font-size: 10px; color: hsl(0, 0%, 100%); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Total</div>
        <div style="font-size: 24px; font-weight: 900; color: hsl(0, 0%, 100%);">{{total}} {{currency}}</div>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">IF YOU HAVE ANY QUESTIONS, CONTACT US.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; font-weight: bold;">CONTACT: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
