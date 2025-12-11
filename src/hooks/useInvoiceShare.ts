import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Invoice, InvoiceItem, Client } from "../types";

/**
 * Generate a share token for an invoice
 */
export function useGenerateShareToken() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      invoiceId,
      expiresInDays = 30,
    }: {
      invoiceId: string;
      expiresInDays?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc(
        "generate_invoice_share_token",
        {
          p_invoice_id: invoiceId,
          p_expires_in_days: expiresInDays,
        }
      );

      if (error) throw error;
      return data as string;
    },
  });
}

/**
 * Get shareable URL for an invoice
 * If no token exists, generates one automatically
 */
export function useShareLink(invoiceId: string | null) {
  const { user } = useAuth();
  const generateToken = useGenerateShareToken();

  return useQuery({
    queryKey: ["invoice-share", invoiceId, user?.id],
    queryFn: async () => {
      if (!invoiceId || !user) return null;

      // Check if share already exists
      const { data: existingShares, error: fetchError } = await supabase
        .from("invoice_shares")
        .select("token, expires_at")
        .eq("invoice_id", invoiceId)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingShares && !fetchError) {
        const baseUrl = window.location.origin;
        return {
          url: `${baseUrl}/invoice/${existingShares.token}`,
          expiresAt: existingShares.expires_at,
        };
      }

      // Generate new token if none exists
      const token = await generateToken.mutateAsync({
        invoiceId,
        expiresInDays: 30,
      });

      const { data: shareData, error: shareError } = await supabase
        .from("invoice_shares")
        .select("expires_at")
        .eq("token", token)
        .single();

      if (shareError) throw shareError;

      const baseUrl = window.location.origin;
      return {
        url: `${baseUrl}/invoice/${token}`,
        expiresAt: shareData.expires_at,
      };
    },
    enabled: !!invoiceId && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Validate a share token and get invoice data
 * Uses Edge Function for public access (works without authentication)
 */
export function useValidateShareToken(token: string | null) {
  return useQuery({
    queryKey: ["validate-share-token", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");

      // Use Edge Function for public access
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/validate-share-token?token=${encodeURIComponent(
          token
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Invalid or expired token");
      }

      const result = await response.json();

      // Construct full invoice object from Edge Function response
      const invoice: Invoice = {
        id: result.invoice.id,
        invoice_number: result.invoice.invoice_number,
        client_id: result.invoice.client_id,
        user_id: "", // Not needed for public view
        issue_date: result.invoice.issue_date,
        due_date: result.invoice.due_date,
        status: result.invoice.status as Invoice["status"],
        subtotal: Number(result.invoice.subtotal),
        discount_percentage: Number(result.invoice.discount_percentage),
        discount_amount: Number(result.invoice.discount_amount),
        tax_rate: Number(result.invoice.tax_rate),
        tax_amount: Number(result.invoice.tax_amount),
        total: Number(result.invoice.total),
        currency: result.invoice.currency,
        notes: result.invoice.notes,
        template: result.invoice.template,
        show_account_number: result.invoice.show_account_number,
        show_iban: result.invoice.show_iban,
        show_swift_bic: result.invoice.show_swift_bic,
        kid_number: result.invoice.kid_number,
        sent_date: result.invoice.sent_date || null,
        created_at: result.invoice.created_at,
        updated_at: result.invoice.updated_at,
        client: result.client as Client,
      };

      return {
        invoice,
        items: (result.items || []) as InvoiceItem[],
        profile: result.profile,
      };
    },
    enabled: !!token,
    retry: false,
  });
}
