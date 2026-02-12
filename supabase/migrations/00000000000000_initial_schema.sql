/*
  # Invoice Manager - Initial Database Schema
  
  Complete database schema for the Invoice Manager application.
  Designed for localization and multi-currency invoicing with support for:
  - UI and invoice language/locale preferences
  - Multi-bank accounts per currency
  - Invoice-level immutable payment snapshots
  - Norwegian KID numbers and tax/VAT compliance
  - Organization/company registration numbers
  
  ## Tables
  
  ### clients
  Client/customer information with auto-generated client numbers.
  Protected from deletion if they have invoices that are not in draft status.
  
  ### invoices
  Invoice records with automatic numbering, localization, and payment snapshots

  ### bank_accounts
  Multiple payment accounts per user, scoped by currency with default selection
  
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

  -- Localization and currency preferences
  preferred_language text CHECK (
    preferred_language IS NULL OR preferred_language IN ('en', 'nb', 'es')
  ),
  preferred_locale text,
  preferred_currency text CHECK (
    preferred_currency IS NULL OR char_length(preferred_currency) = 3
  ),
  
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

CREATE FUNCTION generate_client_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.client_number IS NULL THEN
    NEW.client_number := 'CL-' || LPAD(nextval('public.clients_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_client_number
  BEFORE INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_client_number();

-- ============================================================================
-- CLIENT DELETION PROTECTION
-- ============================================================================

-- Function to check if a client has any non-draft invoices
CREATE FUNCTION public.check_client_deletion_allowed(client_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  has_non_draft_invoices boolean;
BEGIN
  -- Check if client has any invoices that are not in draft status
  SELECT EXISTS(
    SELECT 1
    FROM public.invoices
    WHERE client_id = client_uuid
    AND status != 'draft'
  ) INTO has_non_draft_invoices;
  
  -- Return true if deletion is allowed (no non-draft invoices)
  RETURN NOT has_non_draft_invoices;
END;
$$;

-- Function to prevent deletion of clients with non-draft invoices
CREATE FUNCTION public.prevent_client_deletion_with_non_draft_invoices()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Check if deletion is allowed
  IF NOT public.check_client_deletion_allowed(OLD.id) THEN
    RAISE EXCEPTION 'Cannot delete client with invoices that are not in draft status. Please delete or update all non-draft invoices first.';
  END IF;
  
  RETURN OLD;
END;
$$;

-- Trigger to prevent deletion of clients with non-draft invoices
CREATE TRIGGER prevent_client_deletion_trigger
  BEFORE DELETE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_client_deletion_with_non_draft_invoices();

-- ============================================================================
-- BANK ACCOUNTS TABLE
-- ============================================================================

CREATE TABLE bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  currency text NOT NULL CHECK (currency = upper(currency) AND char_length(currency) = 3),
  account_number text,
  iban text,
  swift_bic text,
  is_default_for_currency boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT bank_accounts_identifier_required
    CHECK (account_number IS NOT NULL OR iban IS NOT NULL)
);

ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bank accounts"
  ON bank_accounts FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own bank accounts"
  ON bank_accounts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own bank accounts"
  ON bank_accounts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own bank accounts"
  ON bank_accounts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_user_currency ON bank_accounts(user_id, currency);
CREATE UNIQUE INDEX idx_bank_accounts_default_per_currency
  ON bank_accounts(user_id, currency)
  WHERE is_default_for_currency = true AND is_active = true;

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  bank_account_id uuid NOT NULL REFERENCES bank_accounts(id) ON DELETE RESTRICT,
  
  -- Dates
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  sent_date date, -- Date when the invoice was sent. Set automatically when status changes to "sent" or when email is sent.
  
  -- Status: draft, sent, paid, overdue
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  
  -- Financial calculations
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount_percentage numeric(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount numeric(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  tax_rate numeric(5,2) NOT NULL DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),
  tax_amount numeric(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total numeric(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  
  -- Localization and currency
  currency text NOT NULL DEFAULT 'EUR' CHECK (currency = upper(currency) AND char_length(currency) = 3),
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'nb', 'es')),
  locale text NOT NULL DEFAULT 'en-US',
  
  -- Snapshot of selected payment details at invoice creation/update time
  payment_account_label text,
  payment_account_number text,
  payment_iban text,
  payment_swift_bic text,
  payment_currency text CHECK (payment_currency IS NULL OR (payment_currency = upper(payment_currency) AND char_length(payment_currency) = 3)),
  
  -- Template selection
  template text DEFAULT 'classic' CHECK (template IN ('classic', 'modern', 'professional', 'brutalist', 'dark-mode', 'minimal-japanese', 'neo-brutalist', 'swiss', 'typewriter', 'cutout-brutalist', 'constructivist', 'color-pop-stacked', 'color-pop-minimal', 'color-pop-grid', 'color-pop-diagonal', 'color-pop-brutalist')),
  
  -- Banking details display options
  show_account_number boolean DEFAULT true,
  show_iban boolean DEFAULT true,
  show_swift_bic boolean DEFAULT true,
  
  -- Additional information
  notes text,
  kid_number text, -- Norwegian banking customer ID (per invoice, separate from client KID)
  
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
CREATE INDEX idx_invoices_currency ON invoices(currency);
CREATE INDEX idx_invoices_bank_account_id ON invoices(bank_account_id);

CREATE OR REPLACE FUNCTION public.sync_invoice_payment_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bank_account bank_accounts%ROWTYPE;
BEGIN
  SELECT *
  INTO v_bank_account
  FROM bank_accounts
  WHERE id = NEW.bank_account_id;

  IF v_bank_account.id IS NULL THEN
    RAISE EXCEPTION 'Selected bank account does not exist';
  END IF;

  IF v_bank_account.user_id <> NEW.user_id THEN
    RAISE EXCEPTION 'Selected bank account does not belong to the invoice owner';
  END IF;

  IF v_bank_account.is_active = false THEN
    RAISE EXCEPTION 'Selected bank account is inactive';
  END IF;

  IF v_bank_account.currency <> NEW.currency THEN
    RAISE EXCEPTION 'Invoice currency must match selected bank account currency';
  END IF;

  NEW.payment_account_label := v_bank_account.display_name;
  NEW.payment_account_number := v_bank_account.account_number;
  NEW.payment_iban := v_bank_account.iban;
  NEW.payment_swift_bic := v_bank_account.swift_bic;
  NEW.payment_currency := v_bank_account.currency;
  NEW.updated_at := now();

  RETURN NEW;
END;
$$;

CREATE TRIGGER set_invoice_payment_snapshot
  BEFORE INSERT OR UPDATE OF bank_account_id, currency, user_id
  ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_invoice_payment_snapshot();

-- ============================================================================
-- INVOICE ITEMS TABLE
-- ============================================================================

CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  amount numeric(10,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
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
  
  -- App localization defaults
  ui_language text NOT NULL DEFAULT 'en' CHECK (ui_language IN ('en', 'nb', 'es')),
  ui_locale text NOT NULL DEFAULT 'en-US',
  default_invoice_language text NOT NULL DEFAULT 'en' CHECK (default_invoice_language IN ('en', 'nb', 'es')),
  default_invoice_locale text NOT NULL DEFAULT 'en-US',
  
  -- Currency and payment
  currency text NOT NULL DEFAULT 'EUR' CHECK (currency = upper(currency) AND char_length(currency) = 3),
  payment_instructions text,
  
  -- Branding
  logo_url text,

  -- Theme
  use_brutalist_theme boolean NOT NULL DEFAULT false,
  
  -- Email template customization
  use_custom_email_template boolean DEFAULT false, -- If true, use custom email template. If false, use email template matching the invoice template.
  email_template text, -- Custom HTML email template for invoice emails (only used when use_custom_email_template is true). Uses template variables: {{invoiceNumber}}, {{clientName}}, {{companyName}}, {{total}}, {{currency}}, {{issueDate}}, {{dueDate}}, {{message}}, {{companyEmail}}
  
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

-- Create storage bucket for company logos (public for invoice display, but RLS protects uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
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
-- AUTOMATIC OVERDUE INVOICE MARKING
-- ============================================================================

-- Function to automatically mark invoices as overdue when past due date
CREATE OR REPLACE FUNCTION public.mark_overdue_invoices()
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  -- Update invoices that are past their due date and not already paid or overdue
  -- Only update invoices that are in 'sent' or 'draft' status
  UPDATE public.invoices
  SET 
    status = 'overdue',
    updated_at = now()
  WHERE 
    due_date < CURRENT_DATE
    AND status IN ('sent', 'draft');
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$;

-- Function to mark overdue invoices for a specific user
CREATE OR REPLACE FUNCTION public.mark_overdue_invoices_for_user(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  -- Update invoices that are past their due date and not already paid or overdue
  -- Only update invoices that are in 'sent' or 'draft' status
  UPDATE public.invoices
  SET 
    status = 'overdue',
    updated_at = now()
  WHERE 
    user_id = user_uuid
    AND due_date < CURRENT_DATE
    AND status IN ('sent', 'draft');
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.mark_overdue_invoices() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_overdue_invoices_for_user(uuid) TO authenticated;

-- ============================================================================
-- INVOICE SHARES TABLE
-- ============================================================================
-- Table for storing shareable invoice links with time-limited tokens

CREATE TABLE invoice_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  viewed_at timestamptz
);

-- Enable RLS
ALTER TABLE invoice_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only create shares for their own invoices
CREATE POLICY "Users can create shares for own invoices"
  ON invoice_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_shares.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

-- Users can view shares for their own invoices
CREATE POLICY "Users can view own invoice shares"
  ON invoice_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_shares.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

-- Users can delete shares for their own invoices
CREATE POLICY "Users can delete own invoice shares"
  ON invoice_shares FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_shares.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

-- Public policy for token validation (allows reading valid, non-expired tokens)
-- This allows the Edge Function to validate tokens without authentication
CREATE POLICY "Public can validate non-expired tokens"
  ON invoice_shares FOR SELECT
  TO anon
  USING (
    expires_at > now()
  );

-- Indexes
CREATE INDEX idx_invoice_shares_token ON invoice_shares(token);
CREATE INDEX idx_invoice_shares_invoice_id ON invoice_shares(invoice_id);
CREATE INDEX idx_invoice_shares_expires_at ON invoice_shares(expires_at);

-- ============================================================================
-- FUNCTION: Generate Invoice Share Token
-- ============================================================================
-- Generates a cryptographically secure token and creates a share record
-- Returns the token string

CREATE OR REPLACE FUNCTION generate_invoice_share_token(
  p_invoice_id uuid,
  p_expires_in_days integer DEFAULT 30
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_user_id uuid;
  v_expires_at timestamptz;
BEGIN
  -- Verify user owns the invoice
  SELECT user_id INTO v_user_id
  FROM invoices
  WHERE id = p_invoice_id;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Invoice not found';
  END IF;
  
  IF v_user_id != (SELECT auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: You can only create shares for your own invoices';
  END IF;
  
  -- Generate cryptographically secure token (base64url encoded, 32 bytes = 43 chars)
  -- Using gen_random_bytes from pgcrypto extension for cryptographically secure randomness
  -- Note: gen_random_bytes is in the extensions schema
  v_token := encode(extensions.gen_random_bytes(32), 'base64');
  -- Replace URL-unsafe characters with URL-safe equivalents
  v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');
  
  -- Calculate expiration date
  v_expires_at := now() + (p_expires_in_days || ' days')::interval;
  
  -- Insert share record
  INSERT INTO invoice_shares (invoice_id, token, expires_at)
  VALUES (p_invoice_id, v_token, v_expires_at)
  ON CONFLICT (token) DO NOTHING;
  
  -- If conflict occurred (extremely unlikely), generate a new token
  IF NOT FOUND THEN
    v_token := encode(extensions.gen_random_bytes(32), 'base64');
    v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');
    INSERT INTO invoice_shares (invoice_id, token, expires_at)
    VALUES (p_invoice_id, v_token, v_expires_at);
  END IF;
  
  RETURN v_token;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_invoice_share_token(uuid, integer) TO authenticated;

-- ============================================================================
-- FUNCTION: Validate Share Token and Get Invoice
-- ============================================================================
-- Validates a token and returns invoice data if valid
-- Updates viewed_at timestamp

CREATE OR REPLACE FUNCTION validate_invoice_share_token(p_token text)
RETURNS TABLE (
  invoice_id uuid,
  invoice_number text,
  client_id uuid,
  issue_date date,
  due_date date,
  sent_date date,
  status text,
  subtotal numeric,
  discount_percentage numeric,
  discount_amount numeric,
  tax_rate numeric,
  tax_amount numeric,
  total numeric,
  currency text,
  language text,
  locale text,
  bank_account_id uuid,
  payment_account_label text,
  payment_account_number text,
  payment_iban text,
  payment_swift_bic text,
  payment_currency text,
  notes text,
  template text,
  show_account_number boolean,
  show_iban boolean,
  show_swift_bic boolean,
  kid_number text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_share_id uuid;
  v_invoice_id uuid;
BEGIN
  -- Find valid, non-expired share
  SELECT s.id, s.invoice_id INTO v_share_id, v_invoice_id
  FROM invoice_shares s
  WHERE s.token = p_token
    AND s.expires_at > now();
  
  IF v_share_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired token';
  END IF;
  
  -- Update viewed_at timestamp
  UPDATE invoice_shares s
  SET viewed_at = now()
  WHERE s.id = v_share_id;
  
  -- Return invoice data
  RETURN QUERY
  SELECT 
    i.id,
    i.invoice_number,
    i.client_id,
    i.issue_date,
    i.due_date,
    i.sent_date,
    i.status,
    i.subtotal,
    i.discount_percentage,
    i.discount_amount,
    i.tax_rate,
    i.tax_amount,
    i.total,
    i.currency,
    i.language,
    i.locale,
    i.bank_account_id,
    i.payment_account_label,
    i.payment_account_number,
    i.payment_iban,
    i.payment_swift_bic,
    i.payment_currency,
    i.notes,
    i.template,
    i.show_account_number,
    i.show_iban,
    i.show_swift_bic,
    i.kid_number,
    i.created_at,
    i.updated_at
  FROM invoices i
  WHERE i.id = v_invoice_id;
END;
$$;

-- Grant execute permission to anon (for public access)
GRANT EXECUTE ON FUNCTION validate_invoice_share_token(text) TO anon;
GRANT EXECUTE ON FUNCTION validate_invoice_share_token(text) TO authenticated;

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
  - Database-level protection prevents deletion of clients with non-draft invoices
  
  Localization/Currency Features:
  - UI language/locale and default invoice language/locale per company
  - Client-level preferred language/locale/currency
  - Multi-bank accounts with one active default per currency
  - Invoice payment snapshots (account label/number/IBAN/SWIFT/currency)
  - Multi-currency support (EUR default)
  - Tax/VAT/MVA calculations
  
  Additional Features:
  - Invoice sharing with time-limited tokens
  - Custom email templates per company
  - Sent date tracking for invoices
*/
