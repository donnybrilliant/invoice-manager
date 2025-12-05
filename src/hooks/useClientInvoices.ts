import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Invoice } from "../types";

export function useClientInvoices(clientId: string | undefined) {
  return useQuery({
    queryKey: ["clientInvoices", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("No client ID");

      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("client_id", clientId)
        .order("issue_date", { ascending: false });

      if (error) throw error;
      return (data || []) as Invoice[];
    },
    enabled: !!clientId,
    staleTime: 60 * 1000, // 1 minute
  });
}
