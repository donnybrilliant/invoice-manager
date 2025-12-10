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
  status text,
  subtotal numeric,
  discount_percentage numeric,
  discount_amount numeric,
  tax_rate numeric,
  tax_amount numeric,
  total numeric,
  currency text,
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
    i.status,
    i.subtotal,
    i.discount_percentage,
    i.discount_amount,
    i.tax_rate,
    i.tax_amount,
    i.total,
    i.currency,
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
