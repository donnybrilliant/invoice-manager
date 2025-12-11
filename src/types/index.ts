export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  client_number: string;
  street_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  organization_number: string | null;
  tax_number: string | null;
  kid_number: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  user_id: string;
  issue_date: string;
  due_date: string;
  sent_date: string | null;
  status: "draft" | "sent" | "paid" | "overdue";
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes: string | null;
  template: string;
  show_account_number?: boolean;
  show_iban?: boolean;
  show_swift_bic?: boolean;
  kid_number?: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
}

export interface InvoiceWithDetails extends Invoice {
  items: InvoiceItem[];
}

export interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  organization_number: string | null;
  tax_number: string | null;
  street_address: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  account_number: string | null;
  iban: string | null;
  swift_bic: string | null;
  currency: string;
  payment_instructions: string | null;
  logo_url: string | null;
  use_custom_email_template: boolean;
  email_template: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceShare {
  id: string;
  invoice_id: string;
  token: string;
  expires_at: string;
  created_at: string;
  viewed_at: string | null;
}
