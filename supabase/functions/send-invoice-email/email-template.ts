/**
 * Format date as M/D/YYYY (e.g., 12/11/2025, 1/10/2026)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function createInvoiceEmailTemplate(data: {
  invoiceNumber: string;
  clientName: string;
  companyName: string;
  total: string;
  currency: string;
  issueDate: string;
  dueDate: string;
  message?: string;
  companyEmail?: string;
}): string {
  // Format dates using our utility function
  const formattedIssueDate = formatDate(data.issueDate);
  const formattedDueDate = formatDate(data.dueDate);
  return `
<!DOCTYPE html>
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
    <h1 style="margin: 0;">Invoice ${data.invoiceNumber}</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">from ${data.companyName}</p>
  </div>
  <div class="content">
    <p>Dear ${data.clientName},</p>
    ${
      data.message
        ? `<div style="background-color: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">${data.message.replace(
            /\n/g,
            "<br>"
          )}</div>`
        : ""
    }
    <p>Please find attached your invoice ${data.invoiceNumber}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span>Invoice Number:</span>
        <span>${data.invoiceNumber}</span>
      </div>
      <div class="detail-row">
        <span>Issue Date:</span>
        <span>${formattedIssueDate}</span>
      </div>
      <div class="detail-row">
        <span>Due Date:</span>
        <span>${formattedDueDate}</span>
      </div>
      <div class="detail-row total">
        <span>Total Amount:</span>
        <span>${data.total} ${data.currency}</span>
      </div>
    </div>
    <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
    ${
      data.companyEmail
        ? `<p style="margin-top: 30px; color: #6b7280; font-size: 0.875em;">Contact: ${data.companyEmail}</p>`
        : ""
    }
  </div>
</body>
</html>
  `.trim();
}
