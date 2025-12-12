/**
 * Brutalist email template - Bold, stark design with thick black borders
 * Matches the Brutalist invoice template style
 */

export const BrutalistEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      line-height: 1.6;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    .header {
      border: 6px solid #000;
      padding: 30px 20px;
      margin-bottom: 20px;
      background-color: #fff;
    }
    .content {
      border: 6px solid #000;
      padding: 30px;
      background-color: #fff;
    }
    .invoice-details {
      border: 4px solid #000;
      padding: 20px;
      margin: 20px 0;
      background-color: #fff;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 3px solid #000;
      font-weight: bold;
    }
    .detail-row:last-child {
      border-bottom: none;
      border-top: 3px solid #000;
      margin-top: 10px;
      padding-top: 15px;
    }
    .total {
      font-size: 1.4em;
      font-weight: 900;
      text-transform: uppercase;
    }
    h1 {
      font-size: 36px;
      font-weight: 900;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE {{invoiceNumber}}</h1>
    <p style="margin: 10px 0 0 0; font-weight: bold; font-size: 14px;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px;">DEAR {{clientName}},</p>
    {{#if message}}
    <div style="border: 4px solid #000; padding: 15px; margin: 20px 0; background-color: #fff; font-weight: bold;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span>INVOICE NUMBER: </span>
        <span>{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span>ISSUE DATE: </span>
        <span>{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span>DUE DATE: </span>
        <span>{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span>TOTAL: </span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">IF YOU HAVE ANY QUESTIONS, CONTACT US.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; font-weight: bold;">CONTACT: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
