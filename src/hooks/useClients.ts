import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Client } from "../types";

export function useClients() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["clients", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      return (data || []) as Client[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

interface CreateClientData {
  name: string;
  email?: string | null;
  phone?: string | null;
  organization_number?: string | null;
  tax_number?: string | null;
  kid_number?: string | null;
  street_address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export function useCreateClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientData) => {
      if (!user) throw new Error("No user");

      const { data: result, error } = await supabase
        .from("clients")
        .insert({ user_id: user.id, ...data })
        .select()
        .single();

      if (error) throw error;
      return result as Client;
    },
    onSuccess: (newClient) => {
      // Optimistically add the new client to cache (maintain alphabetical order)
      queryClient.setQueryData<Client[]>(
        ["clients", user?.id],
        (oldClients = []) => {
          const updated = [...oldClients, newClient];
          return updated.sort((a, b) => a.name.localeCompare(b.name));
        }
      );
      // Still invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["clients", user?.id] });
    },
  });
}

interface UpdateClientData {
  name?: string;
  email?: string | null;
  phone?: string | null;
  organization_number?: string | null;
  tax_number?: string | null;
  kid_number?: string | null;
  street_address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export function useUpdateClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateClientData;
    }) => {
      const { data: result, error } = await supabase
        .from("clients")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", user?.id] });
    },
  });
}

export function useDeleteClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    // Optimistic update: remove client from cache immediately
    onMutate: async (id) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["clients", user?.id] });

      // Snapshot the previous value for rollback
      const previousClients = queryClient.getQueryData<Client[]>([
        "clients",
        user?.id,
      ]);

      // Optimistically remove the client from cache
      if (previousClients) {
        queryClient.setQueryData<Client[]>(
          ["clients", user?.id],
          previousClients.filter((client) => client.id !== id)
        );
      }

      // Return context with the snapshotted value for rollback
      return { previousClients };
    },
    // If mutation fails, rollback to previous value
    onError: (_err, _id, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(
          ["clients", user?.id],
          context.previousClients
        );
      }
    },
    // Invalidate to ensure consistency (but UI already updated optimistically)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", user?.id] });
      // Also invalidate invoices since they reference clients
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
    },
  });
}
