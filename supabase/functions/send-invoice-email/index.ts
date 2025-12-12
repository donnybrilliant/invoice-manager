import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Email template is now rendered in the frontend and sent as emailHtml

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler = async (req: Request) => {
  // Handle CORS preflight
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

    // Create Supabase client
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
    const {
      invoiceId,
      recipientEmail,
      message,
      pdfBase64,
      emailHtml,
      pdfFilename,
    } = await req.json();

    if (!invoiceId || !recipientEmail || !emailHtml) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: invoiceId, recipientEmail, emailHtml",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify user owns the invoice (minimal check for security)
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from("invoices")
      .select("id, invoice_number, user_id")
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

    // Get Resend configuration (read at request time, not module load time)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendFromEmail =
      Deno.env.get("RESEND_FROM_EMAIL") ||
      Deno.env.get("SMTP_FROM_EMAIL") ||
      Deno.env.get("SMTP_ADMIN_EMAIL");
    const resendFromName =
      Deno.env.get("RESEND_FROM_NAME") ||
      Deno.env.get("SMTP_FROM_NAME") ||
      Deno.env.get("SMTP_SENDER_NAME") ||
      "Invoice Manager";

    // Minimal logging for debugging
    console.log("Sending invoice email:", {
      invoiceId,
      recipientEmail,
      hasPdf: !!pdfBase64,
    });

    // Check Resend configuration
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          error: "Resend not configured. Please set RESEND_API_KEY.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!resendFromEmail) {
      return new Response(
        JSON.stringify({
          error:
            "Resend from email not configured. Please set RESEND_FROM_EMAIL, SMTP_FROM_EMAIL, or SMTP_ADMIN_EMAIL to an email address using your verified domain (e.g., invoice@vierweb.no).",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get company profile for reply-to email
    const { data: companyProfile } = await supabaseClient
      .from("company_profiles")
      .select("email, company_name")
      .eq("user_id", user.id)
      .single();

    // Email HTML is pre-rendered in the frontend
    // No template processing needed here

    // Prepare email payload
    const emailPayload: {
      from: string;
      to: string[];
      subject: string;
      html: string;
      reply_to: string;
      attachments?: Array<{ filename: string; content: string }>;
    } = {
      from: `${resendFromName} <${resendFromEmail}>`,
      to: [recipientEmail],
      subject: `Invoice ${invoice.invoice_number} from ${
        companyProfile?.company_name || "Your Company"
      }`,
      html: emailHtml,
      reply_to: companyProfile?.email || resendFromEmail,
    };

    // Add PDF attachment if provided
    if (pdfBase64 && typeof pdfBase64 === "string") {
      emailPayload.attachments = [
        {
          filename: pdfFilename || `invoice-${invoice.invoice_number}.pdf`,
          content: pdfBase64, // Resend accepts base64 string directly
        },
      ];
    }

    // Send email using Resend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    let res: Response;
    try {
      res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(emailPayload),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        return new Response(
          JSON.stringify({
            error: "Email service timeout - request took too long",
          }),
          {
            status: 504,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: data.message || "Unknown error",
        }),
        {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update invoice status to "sent" and set sent_date to today
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const { error: updateError } = await supabaseClient
      .from("invoices")
      .update({
        status: "sent",
        sent_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Error updating invoice status:", updateError);
      // Don't fail the request if status update fails - email was sent successfully
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
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
};

Deno.serve(handler);
