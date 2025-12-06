/*
  # Invoice Manager - Seed Data for Local Development
  
  This seed file creates:
  - A test user (test@example.com / password123)
  - 20 clients with realistic Norwegian/European data
  - 40 invoices with various statuses, dates, and templates
  - Invoice items for each invoice
  - A company profile for the test user
  
  ## Usage
  
  After running migrations, this seed file will automatically run when you reset your database:
  
  ```bash
  supabase db reset
  ```
  
  ## Test User Credentials
  
  Email: test@example.com
  Password: password123
  
  You can use these credentials to log in to the application and see all the seeded data.
  
  Note: The user is created automatically in the seed file, so you don't need to sign up manually.
*/

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- CREATE TEST USER
-- ============================================================================

DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  test_user_email text := 'test@example.com';
  test_user_password text := 'password123';
  password_hash text;
  instance_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
  identity_id uuid := '00000000-0000-0000-0000-000000000002'::uuid;
  
  -- Invoice creation variables
  client_ids uuid[];
  invoice_id_var uuid;
  client_id_var uuid;
  invoice_num int := 1;
  statuses text[] := ARRAY['draft', 'sent', 'paid', 'overdue', 'sent', 'paid', 'draft', 'sent'];
  status_var text;
  currencies text[] := ARRAY['NOK', 'EUR', 'USD', 'NOK', 'EUR'];
  currency_var text;
  subtotal_var numeric;
  tax_rate_var numeric;
  tax_amount_var numeric;
  discount_pct_var numeric;
  discount_amt_var numeric;
  total_var numeric;
  issue_date_var date;
  due_date_var date;
  template_var text;
  templates text[] := ARRAY['classic', 'modern', 'professional', 'brutalist', 'dark-mode', 'minimal-japanese', 'neo-brutalist', 'swiss', 'typewriter'];
  
  -- Invoice item variables (used in nested loop)
  item_desc text;
  item_qty numeric;
  item_price numeric;
  item_amount numeric;
  descriptions text[] := ARRAY[
    'Web Development Services',
    'Consulting Hours',
    'Design Services',
    'Hosting & Maintenance',
    'SEO Optimization',
    'Content Writing',
    'Photography Services',
    'Video Production',
    'Brand Identity Design',
    'Marketing Campaign',
    'Software License',
    'Training Sessions',
    'Technical Support',
    'Project Management',
    'Quality Assurance'
  ];
  
  -- Summary variables
  client_count int;
  invoice_count int;
  item_count int;
BEGIN
  -- Generate bcrypt hash for password
  -- Using crypt with gen_salt('bf') for bcrypt hashing
  password_hash := crypt(test_user_password, gen_salt('bf'));
  
  -- Create user in auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    test_user_id,
    instance_id,
    'authenticated',
    'authenticated',
    test_user_email,
    password_hash,
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    updated_at = NOW();
  
  -- Create auth.identities entry for the user
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    identity_id,
    test_user_id,
    test_user_id::text,
    jsonb_build_object('sub', test_user_id::text, 'email', test_user_email),
    'email',
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    provider_id = EXCLUDED.provider_id,
    identity_data = EXCLUDED.identity_data,
    updated_at = NOW();
  
  RAISE NOTICE 'Test user created: % (password: %)', test_user_email, test_user_password;
  
  -- ============================================================================
  -- COMPANY PROFILE
  -- ============================================================================
  
  INSERT INTO company_profiles (
    user_id,
    company_name,
    phone,
    email,
    website,
    organization_number,
    tax_number,
    street_address,
    postal_code,
    city,
    state,
    country,
    account_number,
    iban,
    swift_bic,
    currency,
    payment_instructions,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    'Nordic Design Studio AS',
    '+47 22 12 34 56',
    'hello@nordicdesign.no',
    'https://nordicdesign.no',
    '123456789',
    'NO123456789MVA',
    'Karl Johans gate 42',
    '0162',
    'Oslo',
    NULL,
    'Norway',
    '1234.56.78901',
    'NO93 1234 5678 901',
    'DABANO22',
    'NOK',
    'Payment due within 14 days. Please include invoice number in payment reference.',
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    updated_at = NOW();
  
  -- ============================================================================
  -- CLIENTS (20 clients)
  -- ============================================================================
  
  -- Reset the client number sequence to start from 1
  PERFORM setval('clients_number_seq', 1, false);
  
  -- Client data will be inserted with client_number set to NULL to trigger auto-generation
  -- We'll use a temporary table approach to insert clients
  CREATE TEMP TABLE IF NOT EXISTS temp_clients (
    name text,
    email text,
    phone text,
    organization_number text,
    tax_number text,
    kid_number text,
    street_address text,
    postal_code text,
    city text,
    state text,
    country text
  );
  
  INSERT INTO temp_clients VALUES
    ('Acme Corporation', 'contact@acme.com', '+47 22 11 22 33', '987654321', 'NO987654321MVA', '12345678901', 'Storgata 1', '0155', 'Oslo', NULL, 'Norway'),
    ('Bergen Tech Solutions', 'info@bergentech.no', '+47 55 12 34 56', '111222333', 'NO111222333MVA', '23456789012', 'Bryggen 5', '5003', 'Bergen', NULL, 'Norway'),
    ('Trondheim Marketing AS', 'hello@trondheimmarketing.no', '+47 73 45 67 89', '444555666', 'NO444555666MVA', '34567890123', 'Munkegata 10', '7030', 'Trondheim', NULL, 'Norway'),
    ('Stavanger Energy', 'contact@stavangerenergy.no', '+47 51 23 45 67', '777888999', 'NO777888999MVA', '45678901234', 'Olav Vs gate 3', '4005', 'Stavanger', NULL, 'Norway'),
    ('Tromsø Arctic Services', 'info@tromsoarctic.no', '+47 77 65 43 21', '123789456', 'NO123789456MVA', '56789012345', 'Storgata 25', '9008', 'Tromsø', NULL, 'Norway'),
    ('Oslo Consulting Group', 'hello@osloconsulting.no', '+47 22 98 76 54', '456123789', 'NO456123789MVA', '67890123456', 'Aker Brygge 12', '0250', 'Oslo', NULL, 'Norway'),
    ('Kristiansand Logistics', 'contact@kristiansandlog.no', '+47 38 12 34 56', '789456123', 'NO789456123MVA', '78901234567', 'Vestre Strandgate 7', '4612', 'Kristiansand', NULL, 'Norway'),
    ('Drammen Manufacturing', 'info@drammenmfg.no', '+47 32 21 43 65', '321654987', 'NO321654987MVA', '89012345678', 'Bragernes Torg 2', '3017', 'Drammen', NULL, 'Norway'),
    ('Ålesund Shipping Co', 'hello@alesundshipping.no', '+47 70 12 34 56', '654987321', 'NO654987321MVA', '90123456789', 'Keiser Wilhelms gate 15', '6002', 'Ålesund', NULL, 'Norway'),
    ('Bodø Fisheries', 'contact@bodofisheries.no', '+47 75 54 32 10', '987321654', 'NO987321654MVA', '01234567890', 'Storgata 8', '8001', 'Bodø', NULL, 'Norway'),
    ('Haugesund Oil Services', 'info@haugesundoil.no', '+47 52 87 65 43', '147258369', 'NO147258369MVA', '12345098765', 'Haraldsgata 20', '5525', 'Haugesund', NULL, 'Norway'),
    ('Sandnes Retail Group', 'hello@sandnesretail.no', '+47 51 43 21 65', '258369147', 'NO258369147MVA', '23456109876', 'Storgata 45', '4306', 'Sandnes', NULL, 'Norway'),
    ('Moss Engineering', 'contact@mosseng.no', '+47 69 21 43 65', '369147258', 'NO369147258MVA', '34567210987', 'Storgata 30', '1501', 'Moss', NULL, 'Norway'),
    ('Fredrikstad Construction', 'info@fredrikstadcon.no', '+47 69 32 14 56', '741852963', 'NO741852963MVA', '45678321098', 'Storgata 15', '1601', 'Fredrikstad', NULL, 'Norway'),
    ('Sarpsborg Technology', 'hello@sarpsborgtech.no', '+47 69 14 25 36', '852963741', 'NO852963741MVA', '56789432109', 'Storgata 22', '1701', 'Sarpsborg', NULL, 'Norway'),
    ('Skien Furniture', 'contact@skienfurniture.no', '+47 35 98 76 54', '963741852', 'NO963741852MVA', '67890543210', 'Hovedgata 8', '3724', 'Skien', NULL, 'Norway'),
    ('Porsgrunn Chemicals', 'info@porsgrunnchem.no', '+47 35 87 65 43', '159753486', 'NO159753486MVA', '78901654321', 'Storgata 12', '3901', 'Porsgrunn', NULL, 'Norway'),
    ('Arendal Tourism', 'hello@arendaltourism.no', '+47 37 02 46 80', '357159486', 'NO357159486MVA', '89012765432', 'Langbryggen 5', '4801', 'Arendal', NULL, 'Norway'),
    ('Lillehammer Sports', 'contact@lillehammersports.no', '+47 61 28 47 36', '486357159', 'NO486357159MVA', '90123876543', 'Storgata 50', '2609', 'Lillehammer', NULL, 'Norway'),
    ('Hamar Agriculture', 'info@hamaragri.no', '+47 62 51 84 73', '753159486', 'NO753159486MVA', '01234987654', 'Torggata 3', '2317', 'Hamar', NULL, 'Norway');
  
  -- Insert clients with auto-generated client numbers
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    organization_number,
    tax_number,
    kid_number,
    street_address,
    postal_code,
    city,
    state,
    country,
    created_at
  )
  SELECT 
    test_user_id,
    name,
    email,
    phone,
    organization_number,
    tax_number,
    kid_number,
    street_address,
    postal_code,
    city,
    state,
    country,
    NOW() - (random() * interval '180 days')
  FROM temp_clients;
  
  DROP TABLE temp_clients;
  
  -- ============================================================================
  -- INVOICES (40 invoices)
  -- ============================================================================
  
  -- Get client IDs and create invoices
  -- Get all client IDs
  SELECT ARRAY_AGG(id) INTO client_ids
  FROM clients
  WHERE user_id = test_user_id;
  
  -- Create 40 invoices
  FOR i IN 1..40 LOOP
    -- Select random client
    client_id_var := client_ids[1 + floor(random() * array_length(client_ids, 1))::int];
    
    -- Select status (weighted towards sent/paid)
    status_var := statuses[1 + floor(random() * array_length(statuses, 1))::int];
    
    -- Select currency
    currency_var := currencies[1 + floor(random() * array_length(currencies, 1))::int];
    
    -- Select template
    template_var := templates[1 + floor(random() * array_length(templates, 1))::int];
    
    -- Generate dates based on status
    IF status_var = 'paid' THEN
      issue_date_var := CURRENT_DATE - (30 + floor(random() * 60)::int);
      due_date_var := issue_date_var + 14;
    ELSIF status_var = 'overdue' THEN
      issue_date_var := CURRENT_DATE - (60 + floor(random() * 30)::int);
      due_date_var := issue_date_var + 14;
    ELSIF status_var = 'sent' THEN
      issue_date_var := CURRENT_DATE - (7 + floor(random() * 14)::int);
      due_date_var := CURRENT_DATE + (7 + floor(random() * 14)::int);
    ELSE -- draft
      issue_date_var := CURRENT_DATE - floor(random() * 30)::int;
      due_date_var := CURRENT_DATE + (14 + floor(random() * 14)::int);
    END IF;
    
    -- Generate financial amounts
    subtotal_var := (100 + floor(random() * 9000)::int)::numeric;
    tax_rate_var := CASE 
      WHEN currency_var = 'NOK' THEN 25.00
      WHEN currency_var = 'EUR' THEN 21.00
      ELSE 20.00
    END;
    
    -- Random discount (20% chance)
    IF random() < 0.2 THEN
      discount_pct_var := (5 + floor(random() * 15)::int)::numeric;
      discount_amt_var := (subtotal_var * discount_pct_var / 100)::numeric(10,2);
    ELSE
      discount_pct_var := 0;
      discount_amt_var := 0;
    END IF;
    
    subtotal_var := subtotal_var - discount_amt_var;
    tax_amount_var := (subtotal_var * tax_rate_var / 100)::numeric(10,2);
    total_var := subtotal_var + tax_amount_var;
    
    -- Insert invoice
    INSERT INTO invoices (
        invoice_number,
        client_id,
        user_id,
        issue_date,
        due_date,
        status,
        subtotal,
        discount_percentage,
        discount_amount,
        tax_rate,
        tax_amount,
        total,
        currency,
        template,
        show_account_number,
        show_iban,
        show_swift_bic,
        notes,
        kid_number,
        created_at,
        updated_at
      ) VALUES (
        'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(invoice_num::text, 4, '0'),
        client_id_var,
        test_user_id,
      issue_date_var,
      due_date_var,
      status_var,
      subtotal_var,
      discount_pct_var,
      discount_amt_var,
      tax_rate_var,
      tax_amount_var,
      total_var,
      currency_var,
      template_var,
      true,
      true,
      true,
      CASE 
        WHEN random() < 0.3 THEN 'Payment due within 14 days. Thank you for your business!'
        WHEN random() < 0.5 THEN 'Please include invoice number in payment reference.'
        ELSE NULL
      END,
      CASE 
        WHEN random() < 0.4 THEN LPAD(floor(random() * 10000000000)::text, 10, '0')
        ELSE NULL
      END,
      issue_date_var::timestamptz,
      issue_date_var::timestamptz
    ) RETURNING id INTO invoice_id_var;
    
    -- Create 2-5 invoice items per invoice
    FOR j IN 1..(2 + floor(random() * 4)::int) LOOP
      item_desc := descriptions[1 + floor(random() * array_length(descriptions, 1))::int];
      item_qty := (1 + floor(random() * 10)::int)::numeric;
      item_price := (10 + floor(random() * 500)::int)::numeric(10,2);
      item_amount := (item_qty * item_price)::numeric(10,2);
      
      INSERT INTO invoice_items (
        invoice_id,
        description,
        quantity,
        unit_price,
        amount,
        created_at
      ) VALUES (
        invoice_id_var,
        item_desc,
        item_qty,
        item_price,
        item_amount,
        issue_date_var::timestamptz
      );
    END LOOP;
      
    invoice_num := invoice_num + 1;
  END LOOP;
  
  -- Update invoice totals to match sum of items (fix any rounding issues)
  UPDATE invoices i
    SET 
      subtotal = COALESCE((
        SELECT SUM(amount) 
        FROM invoice_items 
        WHERE invoice_id = i.id
      ), 0) - COALESCE(i.discount_amount, 0),
      tax_amount = (COALESCE((
        SELECT SUM(amount) 
        FROM invoice_items 
        WHERE invoice_id = i.id
      ), 0) - COALESCE(i.discount_amount, 0)) * i.tax_rate / 100,
      total = (COALESCE((
        SELECT SUM(amount) 
        FROM invoice_items 
        WHERE invoice_id = i.id
      ), 0) - COALESCE(i.discount_amount, 0)) * (1 + i.tax_rate / 100),
      updated_at = NOW()
    WHERE user_id = test_user_id;
    
  -- ============================================================================
  -- SUMMARY
  -- ============================================================================
  
  SELECT COUNT(*) INTO client_count FROM clients WHERE user_id = test_user_id;
  SELECT COUNT(*) INTO invoice_count FROM invoices WHERE user_id = test_user_id;
  SELECT COUNT(*) INTO item_count FROM invoice_items 
    WHERE invoice_id IN (SELECT id FROM invoices WHERE user_id = test_user_id);
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed data created successfully!';
  RAISE NOTICE 'User ID: %', test_user_id;
  RAISE NOTICE 'Clients created: %', client_count;
  RAISE NOTICE 'Invoices created: %', invoice_count;
  RAISE NOTICE 'Invoice items created: %', item_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'To use this data:';
  RAISE NOTICE '1. Log in to the app with the user account';
  RAISE NOTICE '2. You should see all the seeded clients and invoices';
  RAISE NOTICE '========================================';
END $$;

