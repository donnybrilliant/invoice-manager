import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          address: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string | null;
          address?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string | null;
          address?: string | null;
          phone?: string | null;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          client_id: string;
          user_id: string;
          issue_date: string;
          due_date: string;
          status: string;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          client_id: string;
          user_id: string;
          issue_date?: string;
          due_date: string;
          status?: string;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          client_id?: string;
          user_id?: string;
          issue_date?: string;
          due_date?: string;
          status?: string;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity?: number;
          unit_price?: number;
          amount?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          unit_price?: number;
          amount?: number;
          created_at?: string;
        };
      };
    };
  };
};
