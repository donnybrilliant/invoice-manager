import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendSMTPEmail } from "./smtp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create Supabase client for user operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { invoiceId, recipientEmail, message, pdfBase64 } = await req.json();

    if (!invoiceId || !recipientEmail || !pdfBase64) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: invoiceId, recipientEmail, pdfBase64",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify user owns the invoice
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from("invoices")
      .select(
        `
        *,
        client:clients(*)
      `
      )
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (invoiceError || !invoice) {
      return new Response(
        JSON.stringify({ error: "Invoice not found or access denied" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get company profile
    const { data: companyProfile } = await supabaseClient
      .from("company_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Prepare email content
    const invoiceNumber = invoice.invoice_number;
    const clientName = invoice.client?.name || "Client";
    const total = invoice.total.toFixed(2);
    const currency = invoice.currency || "EUR";
    const companyName = companyProfile?.company_name || "Your Company";

    const emailSubject = `Invoice ${invoiceNumber} from ${companyName}`;

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
    .label {
      font-weight: 600;
      color: #6b7280;
    }
    .value {
      color: #111827;
    }
    .total {
      font-size: 1.25em;
      font-weight: 700;
      color: #1f2937;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.875em;
    }
    .message {
      background-color: white;
      padding: 15px;
      border-left: 4px solid #3b82f6;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">Invoice ${invoiceNumber}</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">from ${companyName}</p>
  </div>
  <div class="content">
    <p>Dear ${clientName},</p>
    ${
      message
        ? `<div class="message">${message.replace(/\n/g, "<br>")}</div>`
        : ""
    }
    <p>Please find attached your invoice ${invoiceNumber}.</p>
    <div class="invoice-details">
      <div class="detail-row">
        <span class="label">Invoice Number:</span>
        <span class="value">${invoiceNumber}</span>
      </div>
      <div class="detail-row">
        <span class="label">Issue Date:</span>
        <span class="value">${new Date(
          invoice.issue_date
        ).toLocaleDateString()}</span>
      </div>
      <div class="detail-row">
        <span class="label">Due Date:</span>
        <span class="value">${new Date(
          invoice.due_date
        ).toLocaleDateString()}</span>
      </div>
      <div class="detail-row total">
        <span>Total Amount:</span>
        <span>${total} ${currency}</span>
      </div>
    </div>
    <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
    <div class="footer">
      <p>This is an automated email. Please do not reply directly to this message.</p>
      ${companyProfile?.email ? `<p>Contact: ${companyProfile.email}</p>` : ""}
    </div>
  </div>
</body>
</html>
`;

    // Get SMTP configuration from environment variables
    // These should be set in your Supabase project secrets or .env.local for local testing
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFromEmail =
      companyProfile?.email ||
      Deno.env.get("SMTP_FROM_EMAIL") ||
      `noreply@${
        Deno.env.get("SUPABASE_URL")?.replace("https://", "").split(".")[0] ||
        "invoice"
      }.com`;
    const smtpFromName =
      companyName || Deno.env.get("SMTP_FROM_NAME") || "Invoice Manager";
    const smtpSecure = Deno.env.get("SMTP_SECURE") === "true"; // Use TLS/SSL

    if (!smtpHost || !smtpUser || !smtpPassword) {
      return new Response(
        JSON.stringify({
          error:
            "SMTP not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in Supabase project secrets.",
          details:
            "For local testing, create a .env.local file in supabase/functions/send-invoice-email/",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Convert base64 PDF to buffer for attachment
    const pdfBuffer = Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0));

    // Send email using SMTP
    try {
      await sendSMTPEmail({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          password: smtpPassword,
        },
        from: `${smtpFromName} <${smtpFromEmail}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: emailBody,
        attachments: [
          {
            filename: `Invoice-${invoiceNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    } catch (smtpError) {
      console.error("SMTP error:", smtpError);
      return new Response(
        JSON.stringify({
          error: "Failed to send email via SMTP",
          details: smtpError.message || String(smtpError),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailResult = { id: `smtp-${Date.now()}` };

    // Update invoice status to "sent" if it's currently "draft"
    if (invoice.status === "draft") {
      await supabaseClient
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", invoiceId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        emailId: emailResult.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to send email",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
