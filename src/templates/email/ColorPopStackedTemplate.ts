/**
 * Color Pop Stacked email template - Vertical stacked cards layout
 * Matches the Color Pop Stacked invoice template style
 */

export const ColorPopStackedEmailTemplate = `<!DOCTYPE html>
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
      background: hsl(0, 0%, 0%);
    }
    .header {
      background: hsl(0, 0%, 100%);
      border: 6px solid hsl(0, 0%, 0%);
      padding: 30px 20px;
      margin-bottom: 20px;
      box-shadow: 12px 12px 0 hsl(358, 100%, 67%);
    }
    .content {
      background: hsl(0, 0%, 100%);
      border: 6px solid hsl(0, 0%, 0%);
      padding: 30px;
      box-shadow: 12px 12px 0 hsl(358, 100%, 67%);
    }
    .invoice-details {
      background: hsla(44, 100%, 68%, 0.4);
      border-top: 6px solid hsl(0, 0%, 0%);
      padding: 25px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid hsla(0, 0%, 0%, 0.2);
    }
    .detail-row:last-child {
      border-bottom: none;
      margin-top: 15px;
      padding-top: 15px;
    }
    .total {
      background: hsl(358, 100%, 67%);
      color: hsl(0, 0%, 100%);
      padding: 15px 20px;
      display: inline-block;
      box-shadow: 6px 6px 0 hsl(0, 0%, 0%);
      margin-top: 10px;
    }
    h1 {
      font-size: 48px;
      font-weight: 900;
      margin: 0;
      letter-spacing: -4px;
      line-height: 0.9;
    }
    .invoice-number {
      background: hsl(358, 100%, 67%);
      color: hsl(0, 0%, 100%);
      padding: 10px 20px;
      display: inline-block;
      margin-top: 15px;
      font-weight: 900;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <div class="invoice-number">#{{invoiceNumber}}</div>
    <p style="margin: 15px 0 0 0; font-weight: bold; font-size: 14px;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px; font-size: 16px;">DEAR {{clientName}},</p>
    {{#if message}}
    <div style="background: hsla(137, 79%, 54%, 0.3); border: 4px solid hsl(0, 0%, 0%); padding: 15px; margin: 20px 0;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-size: 13px;">Invoice Number: </span>
        <span style="font-weight: 800;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 13px;">Issue Date: </span>
        <span style="font-weight: 800;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 13px;">Due Date: </span>
        <span style="font-weight: 800;">{{dueDate}}</span>
      </div>
      <div class="total">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">Total</div>
        <div style="font-size: 28px; font-weight: 900;">{{total}} {{currency}}</div>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">IF YOU HAVE ANY QUESTIONS, CONTACT US.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; font-weight: bold;">CONTACT: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
