import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { CompanyProfile } from "../types";

export function useCompanyProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["companyProfile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data as CompanyProfile | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

interface UpdateCompanyProfileData {
  company_name?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  organization_number?: string | null;
  tax_number?: string | null;
  street_address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  account_number?: string | null;
  iban?: string | null;
  swift_bic?: string | null;
  currency?: string;
  payment_instructions?: string | null;
  logo_url?: string | null;
  use_custom_email_template?: boolean;
  email_template?: string | null;
}

export function useUpdateCompanyProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCompanyProfileData) => {
      if (!user) throw new Error("No user");

      const { data: result, error } = await supabase
        .from("company_profiles")
        .upsert(
          {
            user_id: user.id,
            ...data,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single();

      if (error) throw error;
      return result as CompanyProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile", user?.id] });
    },
  });
}
