/*
  # Invoice Manager - Initial Database Schema
  
  Complete database schema for the Invoice Manager application.
  Designed for Norwegian and European businesses with support for:
  - Multi-currency invoicing (EUR, NOK, USD, etc.)
  - International banking (IBAN, SWIFT/BIC)
  - Norwegian KID numbers
  - Tax/VAT/MVA compliance
  - Organization/company registration numbers
  
  ## Tables
  
  ### clients
  Client/customer information with auto-generated client numbers
  
  ### invoices
  Invoice records with automatic numbering, multi-currency, and discount support
  
  ### invoice_items
  Line items for each invoice
  
  ### company_profiles
  Company branding and business information (one per user)
  
  ## Storage
  
  ### company-logos
  Private bucket for company logo images with user-specific access
  
  ## Security
  
  All tables use Row Level Security (RLS) with optimized policies.
  Users can only access their own data.
*/

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  
  -- Auto-generated client number (CL-000001, CL-000002, etc.)
  client_number text UNIQUE,
  
  -- Company information
  organization_number text,
  tax_number text,
  kid_number text UNIQUE, -- Norwegian banking customer ID
  
  -- Structured address (European format)
  street_address text,
  postal_code text,
  city text,
  state text,
  country text,
  
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies (optimized with subquery)
CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Auto-generate client numbers
CREATE SEQUENCE clients_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_number IS NULL THEN
    NEW.client_number := 'CL-' || LPAD(nextval('clients_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_client_number
  BEFORE INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION generate_client_number();

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  
  -- Dates
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  
  -- Status: draft, sent, paid, overdue
  status text NOT NULL DEFAULT 'draft',
  
  -- Financial calculations
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount_percentage numeric(5,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 0,
  tax_amount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  
  -- Currency (EUR, NOK, USD, etc.)
  currency text DEFAULT 'EUR',
  
  -- Template selection (classic, modern, professional)
  template text DEFAULT 'classic',
  
  -- Banking details display options
  show_account_number boolean DEFAULT true,
  show_iban boolean DEFAULT true,
  show_swift_bic boolean DEFAULT true,
  
  -- Additional information
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies (optimized with subquery)
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Indexes
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);

-- ============================================================================
-- INVOICE ITEMS TABLE
-- ============================================================================

CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (optimized with subquery)
CREATE POLICY "Users can view own invoice items"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can insert own invoice items"
  ON invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update own invoice items"
  ON invoice_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete own invoice items"
  ON invoice_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

-- Indexes
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ============================================================================
-- COMPANY PROFILES TABLE
-- ============================================================================

CREATE TABLE company_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company information
  company_name text,
  phone text,
  email text,
  website text,
  
  -- Registration and tax
  organization_number text,
  tax_number text, -- Tax/VAT/MVA number
  
  -- Structured address (European format)
  street_address text,
  postal_code text,
  city text,
  state text,
  country text,
  
  -- International banking
  account_number text,
  iban text,
  swift_bic text,
  
  -- Currency and payment
  currency text DEFAULT 'EUR',
  payment_instructions text,
  
  -- Branding
  logo_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (optimized with subquery)
CREATE POLICY "Users can view own company profile"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own company profile"
  ON company_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own company profile"
  ON company_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own company profile"
  ON company_profiles FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Indexes
CREATE INDEX idx_company_profiles_user_id ON company_profiles(user_id);

-- ============================================================================
-- STORAGE BUCKET FOR COMPANY LOGOS
-- ============================================================================

-- Create storage bucket for company logos (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for company-logos bucket
-- Users can only access their own logos (path format: {user_id}/*)

CREATE POLICY "Users can upload own logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'company-logos' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users can view own logos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users can update own logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users can delete own logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- ============================================================================
-- NOTES
-- ============================================================================

/*
  Performance Optimizations:
  - All RLS policies use (SELECT auth.uid()) instead of auth.uid() directly
    This prevents re-evaluation of the auth function for each row
  - Indexes on all foreign keys and user_id columns
  - Cascade deletes to maintain referential integrity
  
  Security:
  - Row Level Security enabled on all tables
  - Users can only access their own data
  - Storage bucket is private with user-specific policies
  - Password leak protection should be enabled in Supabase Auth settings
  
  Norwegian/European Features:
  - KID numbers for Norwegian banking
  - Organization and tax numbers
  - IBAN and SWIFT/BIC for international banking
  - European address format (postal code + city)
  - Multi-currency support (EUR default)
  - Tax/VAT/MVA calculations
*/
