/**
 * Color Pop Diagonal email template - Dynamic diagonal stripes with color accents
 * Matches the Color Pop Diagonal invoice template style
 */

export const ColorPopDiagonalEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Arial Black', sans-serif;
      line-height: 1.6;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: hsl(0, 0%, 100%);
      position: relative;
      overflow: hidden;
    }
    .header {
      background: hsl(358, 100%, 67%);
      padding: 30px 20px;
      margin-bottom: 20px;
      position: relative;
      border: 6px solid hsl(0, 0%, 0%);
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(45deg, transparent, transparent 10px, hsla(0, 0%, 0%, 0.1) 10px, hsla(0, 0%, 0%, 0.1) 20px);
    }
    .content {
      border: 6px solid hsl(0, 0%, 0%);
      padding: 30px;
      background: hsl(0, 0%, 100%);
    }
    .invoice-details {
      border-top: 4px solid hsl(0, 0%, 0%);
      padding: 25px;
      background: hsla(44, 100%, 68%, 0.3);
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 2px solid hsl(0, 0%, 0%);
      background: hsl(0, 0%, 100%);
      padding-left: 20px;
      padding-right: 20px;
    }
    .detail-row:last-child {
      border-bottom: none;
      border-top: 4px solid hsl(0, 0%, 0%);
      margin-top: 10px;
      padding-top: 20px;
      background: hsl(358, 100%, 67%);
      color: hsl(0, 0%, 100%);
    }
    .total {
      font-size: 1.5em;
      font-weight: 900;
    }
    h1 {
      font-size: 48px;
      font-weight: 900;
      margin: 0;
      color: hsl(0, 0%, 100%);
      text-shadow: 5px 5px 0 hsl(0, 0%, 0%);
      line-height: 1;
      position: relative;
      z-index: 1;
    }
    .invoice-number {
      font-size: 12px;
      color: hsl(0, 0%, 100%);
      text-transform: uppercase;
      letter-spacing: 5px;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }
    .amount-box {
      background: hsl(0, 0%, 0%);
      color: hsl(0, 0%, 100%);
      padding: 15px 25px;
      transform: rotate(3deg);
      box-shadow: 6px 6px 0 hsl(44, 100%, 68%);
      position: relative;
      z-index: 1;
      margin-top: 15px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="invoice-number">Invoice</div>
    <h1>#{{invoiceNumber}}</h1>
    <div class="amount-box">
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px;">Amount Due</div>
      <div style="font-size: 24px; font-weight: 900;">{{total}} {{currency}}</div>
    </div>
    <p style="margin: 15px 0 0 0; font-weight: bold; font-size: 14px; position: relative; z-index: 1;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px; font-size: 16px;">DEAR {{clientName}},</p>
    {{#if message}}
    <div style="background: hsla(137, 79%, 54%, 0.2); border: 4px solid hsl(0, 0%, 0%); padding: 15px; margin: 20px 0; position: relative;">
      <div style="position: absolute; top: 10px; left: 10px; font-size: 40px; color: hsla(137, 79%, 54%, 0.4); font-weight: 900; line-height: 1;">"</div>
      <div style="position: relative; z-index: 1; padding-left: 30px;">{{message}}</div>
    </div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Invoice Number: </span>
        <span style="font-weight: 800;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Issue Date: </span>
        <span style="font-weight: 800;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Due Date: </span>
        <span style="font-weight: 800;">{{dueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">Total</span>
        <span class="total">{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">IF YOU HAVE ANY QUESTIONS, CONTACT US.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; font-weight: bold;">CONTACT: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
