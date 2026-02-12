import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Invoice } from "../types";

export function useInvoices(options?: { enabled?: boolean }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      // First, mark any overdue invoices automatically
      try {
        const { error: overdueError } = await supabase.rpc(
          "mark_overdue_invoices_for_user",
          { user_uuid: user.id }
        );
        // Don't throw on error - just log it, as this is a background operation
        if (overdueError) {
          console.warn("Error marking overdue invoices:", overdueError);
        }
      } catch (err) {
        // Function might not exist yet if migration hasn't run
        console.warn("Could not mark overdue invoices:", err);
      }

      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          client:clients(*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Invoice[];
    },
    enabled: !!user && (options?.enabled ?? true),
    staleTime: 60 * 1000, // 1 minute
  });
}

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `INV-${year}${month}-${random}`;
}

interface InvoiceItemInput {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface CreateInvoiceData {
  client_id: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  language: string;
  locale: string;
  bank_account_id: string;
  notes?: string | null;
  template: string;
  show_account_number?: boolean;
  show_iban?: boolean;
  show_swift_bic?: boolean;
  kid_number?: string | null;
  items: InvoiceItemInput[];
}

export function useCreateInvoice() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvoiceData) => {
      if (!user) throw new Error("No user");

      const invoice_number = generateInvoiceNumber();

      // Create invoice (include client relationship to match cache structure)
      const { data: newInvoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          invoice_number,
          client_id: data.client_id,
          issue_date: data.issue_date,
          due_date: data.due_date,
          status: "draft",
          subtotal: data.subtotal,
          tax_rate: data.tax_rate,
          tax_amount: data.tax_amount,
          total: data.total,
          currency: data.currency,
          language: data.language,
          locale: data.locale,
          bank_account_id: data.bank_account_id,
          notes: data.notes || null,
          template: data.template,
          show_account_number: data.show_account_number ?? true,
          show_iban: data.show_iban ?? false,
          show_swift_bic: data.show_swift_bic ?? false,
          kid_number: data.kid_number || null,
        })
        .select(
          `
          *,
          client:clients(*)
        `
        )
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const itemsToInsert = data.items
        .filter((item) => item.description.trim())
        .map((item) => ({
          invoice_id: newInvoice.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      return newInvoice as Invoice;
    },
    onSuccess: (newInvoice) => {
      // Optimistically add the new invoice to cache (at the beginning of the list)
      queryClient.setQueryData<Invoice[]>(
        ["invoices", user?.id],
        (oldInvoices = []) => [newInvoice, ...oldInvoices]
      );
      // Still invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
    },
  });
}

interface UpdateInvoiceData {
  client_id: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  language: string;
  locale: string;
  bank_account_id: string;
  notes?: string | null;
  template: string;
  show_account_number?: boolean;
  show_iban?: boolean;
  show_swift_bic?: boolean;
  kid_number?: string | null;
  items: InvoiceItemInput[];
}

export function useUpdateInvoice() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInvoiceData;
    }) => {
      // Check if invoice is paid - prevent editing paid invoices
      const { data: currentInvoice, error: fetchError } = await supabase
        .from("invoices")
        .select("status")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (currentInvoice?.status === "paid") {
        throw new Error(
          "Cannot edit a paid invoice. To make changes, create a new invoice or credit note."
        );
      }

      // Update invoice
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({
          client_id: data.client_id,
          issue_date: data.issue_date,
          due_date: data.due_date,
          subtotal: data.subtotal,
          tax_rate: data.tax_rate,
          tax_amount: data.tax_amount,
          total: data.total,
          currency: data.currency,
          language: data.language,
          locale: data.locale,
          bank_account_id: data.bank_account_id,
          notes: data.notes || null,
          template: data.template,
          show_account_number: data.show_account_number ?? true,
          show_iban: data.show_iban ?? false,
          show_swift_bic: data.show_swift_bic ?? false,
          kid_number: data.kid_number || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (invoiceError) throw invoiceError;

      // Delete all existing items
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);

      if (deleteError) throw deleteError;

      // Insert updated items
      const itemsToInsert = data.items
        .filter((item) => item.description.trim())
        .map((item) => ({
          invoice_id: id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["invoiceItems"] });
    },
  });
}

export function useDeleteInvoice() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    // Optimistic update: remove invoice from cache immediately
    onMutate: async (id) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["invoices", user?.id] });

      // Snapshot the previous value for rollback
      const previousInvoices = queryClient.getQueryData<Invoice[]>([
        "invoices",
        user?.id,
      ]);

      // Optimistically remove the invoice from cache
      if (previousInvoices) {
        queryClient.setQueryData<Invoice[]>(
          ["invoices", user?.id],
          previousInvoices.filter((invoice) => invoice.id !== id)
        );
      }

      // Return context with the snapshotted value for rollback
      return { previousInvoices };
    },
    // If mutation fails, rollback to previous value
    onError: (_err, _id, context) => {
      if (context?.previousInvoices) {
        queryClient.setQueryData(
          ["invoices", user?.id],
          context.previousInvoices
        );
      }
    },
    // Invalidate to ensure consistency (but UI already updated optimistically)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["invoiceItems"] });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Check current invoice status
      const { data: currentInvoice, error: fetchError } = await supabase
        .from("invoices")
        .select("status")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Prevent ANY status changes for paid invoices (backend protection)
      if (currentInvoice?.status === "paid") {
        throw new Error(
          "Cannot change status of a paid invoice. Paid invoices are locked to prevent accidental changes."
        );
      }

      // Get full invoice data to check due_date
      const { data: fullInvoice, error: fullInvoiceError } = await supabase
        .from("invoices")
        .select("due_date")
        .eq("id", id)
        .single();

      if (fullInvoiceError) throw fullInvoiceError;

      // Prevent manually setting overdue if invoice is not actually overdue (backend protection)
      if (status === "overdue") {
        const today = new Date().toISOString().split("T")[0];
        const dueDate = new Date(fullInvoice.due_date);
        const todayDate = new Date(today);

        if (dueDate >= todayDate) {
          throw new Error(
            "Cannot manually set invoice as overdue. Overdue status is automatically applied when the due date has passed."
          );
        }
      }

      // If changing from overdue to sent/draft, update due_date to prevent immediate re-marking as overdue
      // Update due_date to today if it's in the past (gives at least today as the new due date)
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const dueDate = new Date(fullInvoice.due_date);
      const todayDate = new Date(today);

      const updateData: {
        status: string;
        updated_at: string;
        sent_date?: string;
        due_date?: string;
      } = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "sent") {
        // Set sent_date to today if not already set
        updateData.sent_date = today;
      }

      // If changing from overdue to sent/draft, and due_date is in the past, update it to today
      // This prevents the invoice from being immediately marked as overdue again
      if (
        currentInvoice?.status === "overdue" &&
        (status === "sent" || status === "draft")
      ) {
        if (dueDate < todayDate) {
          updateData.due_date = today;
        }
      }

      const { error } = await supabase
        .from("invoices")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      return { id, status, updateData };
    },
    // Optimistic update: update cache immediately before server responds
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["invoices", user?.id] });

      // Snapshot the previous value for rollback
      const previousInvoices = queryClient.getQueryData<Invoice[]>([
        "invoices",
        user?.id,
      ]);

      // Optimistically update the cache
      if (previousInvoices) {
        const today = new Date().toISOString().split("T")[0];
        const invoiceToUpdate = previousInvoices.find((inv) => inv.id === id);
        const dueDate = invoiceToUpdate
          ? new Date(invoiceToUpdate.due_date)
          : null;
        const todayDate = new Date(today);

        queryClient.setQueryData<Invoice[]>(
          ["invoices", user?.id],
          previousInvoices.map((invoice) => {
            if (invoice.id !== id) return invoice;

            const updates: Partial<Invoice> = {
              status: status as Invoice["status"],
              updated_at: new Date().toISOString(),
            };

            // Set sent_date if changing to sent
            if (status === "sent" && !invoice.sent_date) {
              updates.sent_date = today;
            }

            // Update due_date if changing from overdue to sent/draft
            if (
              invoice.status === "overdue" &&
              (status === "sent" || status === "draft") &&
              dueDate &&
              dueDate < todayDate
            ) {
              updates.due_date = today;
            }

            return { ...invoice, ...updates };
          })
        );
      }

      // Return context with the snapshotted value for rollback
      return { previousInvoices };
    },
    // If mutation fails, rollback to previous value
    onError: (_err, _variables, context) => {
      if (context?.previousInvoices) {
        queryClient.setQueryData(
          ["invoices", user?.id],
          context.previousInvoices
        );
      }
    },
    // Always refetch after success to ensure consistency (but UI already updated optimistically)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
    },
  });
}
