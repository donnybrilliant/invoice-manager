import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Invoice, InvoiceItem } from '../types';

export function useInvoices() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('invoices')
        .select(
          `
          *,
          client:clients(*)
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Invoice[];
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });
}

function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
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
      if (!user) throw new Error('No user');

      const invoice_number = generateInvoiceNumber();

      // Create invoice
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number,
          client_id: data.client_id,
          issue_date: data.issue_date,
          due_date: data.due_date,
          status: 'draft',
          subtotal: data.subtotal,
          tax_rate: data.tax_rate,
          tax_amount: data.tax_amount,
          total: data.total,
          currency: data.currency,
          notes: data.notes || null,
          template: data.template,
          show_account_number: data.show_account_number ?? true,
          show_iban: data.show_iban ?? false,
          show_swift_bic: data.show_swift_bic ?? false,
          kid_number: data.kid_number || null,
        })
        .select()
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
          .from('invoice_items')
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      return newInvoice as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', user?.id] });
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
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceData }) => {
      // Update invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({
          client_id: data.client_id,
          issue_date: data.issue_date,
          due_date: data.due_date,
          subtotal: data.subtotal,
          tax_rate: data.tax_rate,
          tax_amount: data.tax_amount,
          total: data.total,
          currency: data.currency,
          notes: data.notes || null,
          template: data.template,
          show_account_number: data.show_account_number ?? true,
          show_iban: data.show_iban ?? false,
          show_swift_bic: data.show_swift_bic ?? false,
          kid_number: data.kid_number || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (invoiceError) throw invoiceError;

      // Delete all existing items
      const { error: deleteError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', id);

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
          .from('invoice_items')
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['invoiceItems'] });
    },
  });
}

export function useDeleteInvoice() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['invoiceItems'] });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('invoices')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', user?.id] });
    },
  });
}

