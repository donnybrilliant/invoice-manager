import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { BankAccount } from "../types";

export function useBankAccounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bankAccounts", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("currency", { ascending: true })
        .order("is_default_for_currency", { ascending: false })
        .order("display_name", { ascending: true });

      if (error) throw error;
      return (data || []) as BankAccount[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
}

interface UpsertBankAccountData {
  id?: string;
  display_name: string;
  currency: string;
  account_number?: string | null;
  iban?: string | null;
  swift_bic?: string | null;
  is_default_for_currency?: boolean;
  is_active?: boolean;
}

export function useUpsertBankAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpsertBankAccountData) => {
      if (!user) throw new Error("No user");

      if (!data.account_number && !data.iban) {
        throw new Error("Either account number or IBAN is required");
      }

      const payload = {
        user_id: user.id,
        display_name: data.display_name,
        currency: data.currency,
        account_number: data.account_number || null,
        iban: data.iban || null,
        swift_bic: data.swift_bic || null,
        is_default_for_currency: data.is_default_for_currency ?? false,
        is_active: data.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      if (data.id) {
        const { data: updated, error } = await supabase
          .from("bank_accounts")
          .update(payload)
          .eq("id", data.id)
          .eq("user_id", user.id)
          .select()
          .single();
        if (error) throw error;
        return updated as BankAccount;
      }

      const { data: created, error } = await supabase
        .from("bank_accounts")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return created as BankAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccounts", user?.id] });
    },
  });
}

export function useArchiveBankAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from("bank_accounts")
        .update({
          is_active: false,
          is_default_for_currency: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as BankAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccounts", user?.id] });
    },
  });
}

export function useDeleteBankAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("No user");

      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccounts", user?.id] });
    },
  });
}

export function useSetDefaultBankAccountForCurrency() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      currency,
    }: {
      id: string;
      currency: string;
    }) => {
      if (!user) throw new Error("No user");

      // Clear existing defaults for currency
      const { error: clearError } = await supabase
        .from("bank_accounts")
        .update({
          is_default_for_currency: false,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("currency", currency);

      if (clearError) throw clearError;

      // Set the new default
      const { data, error } = await supabase
        .from("bank_accounts")
        .update({
          is_default_for_currency: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as BankAccount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccounts", user?.id] });
    },
  });
}

