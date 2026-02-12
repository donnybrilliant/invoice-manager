import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Get token from URL query parameter or request body
    const url = new URL(req.url);
    let token = url.searchParams.get("token");

    // If not in query params, try request body (for POST requests)
    if (!token && req.method === "POST") {
      try {
        const body = await req.json();
        token = body.token;
      } catch {
        // Ignore JSON parse errors
      }
    }

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate token using database function
    const { data: invoiceData, error: validationError } =
      await supabaseAdmin.rpc("validate_invoice_share_token", {
        p_token: token,
      });

    if (validationError || !invoiceData || invoiceData.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const invoice = invoiceData[0];

    // Fetch full invoice data to get user_id
    const { data: fullInvoiceData, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .select("user_id")
      .eq("id", invoice.invoice_id)
      .single();

    if (invoiceError) {
      return new Response(JSON.stringify({ error: "Invoice not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch client data
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", invoice.client_id)
      .single();

    if (clientError) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch invoice items
    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoice.invoice_id)
      .order("created_at", { ascending: true });

    if (itemsError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch invoice items" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch company profile
    const { data: profileData } = await supabaseAdmin
      .from("company_profiles")
      .select("*")
      .eq("user_id", fullInvoiceData.user_id)
      .single();

    // Return invoice data
    return new Response(
      JSON.stringify({
        invoice: {
          id: invoice.invoice_id,
          invoice_number: invoice.invoice_number,
          client_id: invoice.client_id,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          sent_date: invoice.sent_date,
          status: invoice.status,
          subtotal: Number(invoice.subtotal),
          discount_percentage: Number(invoice.discount_percentage),
          discount_amount: Number(invoice.discount_amount),
          tax_rate: Number(invoice.tax_rate),
          tax_amount: Number(invoice.tax_amount),
          total: Number(invoice.total),
          currency: invoice.currency,
          language: invoice.language,
          locale: invoice.locale,
          bank_account_id: invoice.bank_account_id,
          payment_account_label: invoice.payment_account_label,
          payment_account_number: invoice.payment_account_number,
          payment_iban: invoice.payment_iban,
          payment_swift_bic: invoice.payment_swift_bic,
          payment_currency: invoice.payment_currency,
          notes: invoice.notes,
          template: invoice.template,
          show_account_number: invoice.show_account_number,
          show_iban: invoice.show_iban,
          show_swift_bic: invoice.show_swift_bic,
          kid_number: invoice.kid_number,
          created_at: invoice.created_at,
          updated_at: invoice.updated_at,
        },
        client: clientData,
        items: itemsData || [],
        profile: profileData || null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error validating token:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to validate token",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
