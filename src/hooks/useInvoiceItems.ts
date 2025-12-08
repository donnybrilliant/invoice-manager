import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { InvoiceItem } from "../types";

export function useInvoiceItems(invoiceId: string | undefined) {
  return useQuery({
    queryKey: ["invoiceItems", invoiceId],
    queryFn: async () => {
      if (!invoiceId) throw new Error("No invoice ID");

      const { data, error } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at");

      if (error) throw error;
      return (data || []) as InvoiceItem[];
    },
    enabled: !!invoiceId,
    staleTime: 30 * 1000, // 30 seconds
  });
}
