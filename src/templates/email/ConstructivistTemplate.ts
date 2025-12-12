/**
 * Constructivist email template - Soviet-era constructivist art style
 * Matches the Constructivist invoice template style
 */

export const ConstructivistEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Impact', 'Arial Black', sans-serif;
      line-height: 1.6;
      color: #000;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #F5F0E1;
    }
    .header {
      background: #CC0000;
      color: #fff;
      padding: 30px 20px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 150%;
      height: 60px;
      background: repeating-linear-gradient(45deg, #CC0000, #CC0000 20px, #000 20px, #000 40px);
      transform: rotate(-3deg) translateX(-50px) translateY(-10px);
    }
    .content {
      border: 3px solid #000;
      border-left: 8px solid #CC0000;
      padding: 30px;
      background: #fff;
    }
    .invoice-details {
      border: 3px solid #000;
      padding: 20px;
      margin: 20px 0;
      background: #fff;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 2px solid #000;
      font-family: 'Courier New', monospace;
    }
    .detail-row:last-child {
      border-bottom: none;
      border-top: 2px solid #000;
      margin-top: 10px;
      padding-top: 15px;
    }
    .total {
      font-size: 1.4em;
      font-weight: 900;
      text-transform: uppercase;
    }
    h1 {
      font-size: 48px;
      font-weight: 900;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -4px;
      line-height: 0.85;
      position: relative;
      z-index: 1;
    }
    .invoice-number {
      background: #000;
      color: #F5F0E1;
      padding: 10px 20px;
      display: inline-block;
      margin-top: 15px;
      transform: skewX(-5deg);
      position: relative;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INV<span style="color: #000;">OICE</span></h1>
    <div class="invoice-number">
      <span style="font-size: 12px; letter-spacing: 3px;">NO. {{invoiceNumber}}</span>
    </div>
    <p style="margin: 15px 0 0 0; font-weight: bold; font-size: 14px; position: relative; z-index: 1;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px; font-size: 16px;">DEAR {{clientName}},</p>
    {{#if message}}
    <div style="background: #000; color: #F5F0E1; padding: 15px; margin: 20px 0; border: 3px solid #CC0000; font-family: 'Courier New', monospace;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-size: 11px; letter-spacing: 3px;">INVOICE NUMBER: </span>
        <span style="font-weight: 900;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 11px; letter-spacing: 3px;">ISSUE DATE: </span>
        <span style="font-weight: 900;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-size: 11px; letter-spacing: 3px;">DUE DATE: </span>
        <span style="font-weight: 900; color: #CC0000;">{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span style="font-size: 14px; letter-spacing: 3px;">TOTAL: </span>
        <span>{{total}} {{currency}}</span>
      </div>
    </div>
    <p style="font-weight: bold; margin-top: 20px;">IF YOU HAVE ANY QUESTIONS, CONTACT US.</p>
    {{#if companyEmail}}
    <p style="margin-top: 30px; font-size: 12px; font-weight: bold; font-family: 'Courier New', monospace;">CONTACT: {{companyEmail}}</p>
    {{/if}}
  </div>
</body>
</html>`;
