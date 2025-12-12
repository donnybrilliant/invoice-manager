/**
 * Cutout Brutalist email template - Paper cutout collage style
 * Matches the Cutout Brutalist invoice template style
 */

export const CutoutBrutalistEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #FAF8F5 0%, #F0EDE8 100%);
    }
    .header {
      background: #fff;
      border: 3px solid #000;
      padding: 30px 20px;
      margin-bottom: 20px;
      box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
      transform: rotate(-2deg);
      position: relative;
    }
    .content {
      background: #fff;
      border: 2px solid #000;
      padding: 30px;
      box-shadow: 6px 6px 0 #FFE4B5;
      position: relative;
      z-index: 1;
    }
    .invoice-details {
      background: #FFE4B5;
      border: 2px solid #000;
      padding: 20px;
      margin: 20px 0;
      transform: rotate(0.3deg);
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px dashed #ccc;
      font-family: 'Courier New', monospace;
    }
    .detail-row:last-child {
      border-bottom: none;
      border-top: 2px solid #000;
      margin-top: 10px;
      padding-top: 15px;
      font-weight: 900;
    }
    .total {
      font-size: 1.4em;
      font-weight: 900;
      font-family: 'Arial Black', sans-serif;
    }
    h1 {
      font-family: 'Impact', 'Arial Black', sans-serif;
      font-size: 48px;
      font-weight: 900;
      margin: 0;
      letter-spacing: -3px;
      line-height: 1;
    }
    .invoice-number {
      background: #1A535C;
      color: #fff;
      padding: 10px 20px;
      display: inline-block;
      margin-top: 10px;
      transform: rotate(3deg);
      box-shadow: 5px 5px 0 rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INV<span style="background: #FF6B35; color: #fff; padding: 0 10px;">OI</span>CE</h1>
    <div class="invoice-number">
      <div style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 3px;">NUMBER</div>
      <div style="font-family: 'Arial Black', sans-serif; font-size: 22px; margin-top: 5px;">{{invoiceNumber}}</div>
    </div>
    <p style="margin: 15px 0 0 0; font-weight: bold; font-size: 14px;">FROM: {{companyName}}</p>
  </div>
  <div class="content">
    <p style="font-weight: bold; margin-bottom: 20px; font-size: 16px;">DEAR {{clientName}},</p>
    {{#if message}}
    <div style="background: #fff; border-left: 6px solid #FF6B35; padding: 15px 20px; margin: 20px 0; box-shadow: 4px 4px 0 rgba(0,0,0,0.1); font-style: italic;">{{message}}</div>
    {{/if}}
    <p style="font-weight: bold;">PLEASE FIND ATTACHED YOUR INVOICE {{invoiceNumber}}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px;">INVOICE NUMBER: </span>
        <span style="font-weight: 900;">{{invoiceNumber}}</span>
      </div>
      <div class="detail-row">
        <span style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px;">ISSUE DATE: </span>
        <span style="font-weight: 900;">{{issueDate}}</span>
      </div>
      <div class="detail-row">
        <span style="font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px;">DUE DATE: </span>
        <span style="font-weight: 900;">{{dueDate}}</span>
      </div>
      <div class="detail-row total">
        <span style="font-family: 'Courier New', monospace; font-size: 13px; letter-spacing: 3px;">TOTAL DUE: </span>
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
