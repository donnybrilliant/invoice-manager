# Invoice Manager

A modern, full-featured invoice management system built with React, TypeScript, Tailwind CSS, and Supabase. Designed for Norwegian and European businesses with support for international banking, multiple currencies, and VAT/MVA compliance.

## Features

### Invoice Management

- ✅ Create, edit, and manage invoices
- ✅ 16 professional PDF templates (Classic, Modern, Professional, Brutalist, Dark Mode, Minimal Japanese, Neo Brutalist, Swiss, Typewriter, Cutout Brutalist, Constructivist, Color Pop Stacked/Minimal/Grid/Diagonal/Brutalist)
- ✅ Automatic invoice numbering
- ✅ Tax/VAT/MVA calculations
- ✅ Discount support
- ✅ Multi-currency support (EUR, NOK, USD, etc.)
- ✅ Invoice status tracking (Draft, Sent, Paid, Overdue)
- ✅ Sent date tracking
- ✅ PDF export with company branding
- ✅ EHF (Elektronisk Handelsformat) export for Norwegian e-invoicing
- ✅ Email invoices directly to clients via Resend API

### Client Management

- ✅ Comprehensive client database
- ✅ Automatic client numbering (CL-000001, CL-000002, etc.)
- ✅ Organization/Company registration numbers
- ✅ Tax/VAT/MVA numbers
- ✅ KID (Customer Identification) numbers for Norwegian banking
- ✅ Structured address fields (European format)
- ✅ Client invoice history

### Company Profile

- ✅ Company branding with logo upload
- ✅ Organization and tax numbers
- ✅ International banking support (IBAN, SWIFT/BIC)
- ✅ Multiple currency support
- ✅ Payment instructions and terms

### User Experience

- ✅ Clean, modern interface
- ✅ Dark mode support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Secure authentication
- ✅ Real-time data synchronization

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js 22.12+ (required by Vite 7 and React plugin)
- Supabase account (free tier works great)
- Modern web browser

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd invoice-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (takes ~2 minutes)
3. Go to Project Settings > API to find your credentials

#### Configure Environment Variables

1. **Copy the example env file:**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your Supabase credentials:**

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   The `.env.example` file contains detailed comments explaining each variable.

   **For local development** with Supabase CLI:

   ```env
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=<get from `supabase status` output>
   ```

#### Run Database Migration

You have two options:

**Option A: Using Supabase Dashboard (Recommended for beginners)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/00000000000000_initial_schema.sql`
5. Click **Run**

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

#### Set Up Storage Bucket

The migrations create a storage bucket for company logos. Verify it exists:

1. Go to **Storage** in your Supabase dashboard
2. You should see a bucket named `company-logos`
3. The bucket should be set to **Private** with RLS policies enabled

#### Seed Database for Local Development

For local development with Supabase CLI, the project includes a seed file that automatically creates test data:

```bash
# Reset the database (runs migrations + seed automatically)
supabase db reset
```

The seed file (`supabase/seed.sql`) creates:

- **Test user**: `test@example.com` / `password123`
- **20 clients** with realistic Norwegian/European business data
- **40 invoices** with various statuses (draft, sent, paid, overdue)
- **Invoice items** for each invoice
- **Company profile** for the test user

After running `supabase db reset`, you can immediately log in with the test credentials and see all the seeded data.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
invoice-manager/
├── src/
│   ├── components/          # React components
│   │   ├── Auth.tsx         # Authentication
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── CompanyProfile.tsx
│   │   ├── ClientForm.tsx
│   │   ├── ClientList.tsx
│   │   ├── ClientDetailView.tsx
│   │   ├── InvoiceForm.tsx
│   │   ├── InvoiceList.tsx
│   │   ├── InvoiceView.tsx
│   │   ├── TemplateSelector.tsx
│   │   ├── PublicInvoiceView.tsx  # Public invoice sharing
│   │   └── EmailTemplateSection.tsx  # Email template customization
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useClients.ts
│   │   ├── useInvoices.ts
│   │   ├── useInvoiceShare.ts
│   │   └── useCompanyProfile.ts
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts      # Supabase client
│   │   ├── pdfUtils.ts      # PDF generation
│   │   ├── ehfGenerator.ts  # EHF XML generation
│   │   ├── emailTemplateUtils.ts  # Email template rendering
│   │   └── utils.ts         # Shared utilities
│   ├── templates/           # Invoice PDF templates
│   │   ├── *.tsx            # 16 invoice templates
│   │   ├── email/           # Email templates (matching invoice templates)
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── migrations/          # Database migrations
│   └── functions/           # Edge Functions
│       ├── send-invoice-email/  # Email sending function
│       └── validate-share-token/  # Invoice sharing validation
├── public/                  # Static assets
├── .env                     # Environment variables (create this)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Database Schema

### Tables

#### `clients`

- Client information with automatic numbering
- Organization and tax numbers
- KID numbers for Norwegian banking
- Structured address fields

#### `invoices`

- Invoice details with automatic numbering
- Multi-currency support
- Discount and tax calculations
- Template selection
- Status tracking

#### `invoice_items`

- Line items for each invoice
- Quantity, unit price, and amount

#### `company_profiles`

- Company branding and information
- International banking details
- Logo storage

### Storage

#### `company-logos`

- Private bucket for company logo images
- Row Level Security (RLS) enabled
- User-specific access control

## Usage Guide

### First Time Setup

1. **Sign Up**: Create an account using email and password
2. **Company Profile**: Click your email in the header to set up your company profile
   - Add company name and logo
   - Enter organization and tax numbers
   - Configure banking details (IBAN, SWIFT/BIC)
   - Set default currency
3. **Add Clients**: Create your first client with all necessary details
4. **Create Invoice**: Generate your first invoice using one of the templates

### Creating an Invoice

1. Click **New Invoice** button
2. Select a client (or create a new one)
3. Choose invoice template
4. Set issue and due dates
5. Add line items (description, quantity, price)
6. Set tax rate and discount (if applicable)
7. Add notes or payment instructions
8. Save as draft or mark as sent

### Managing Clients

1. Go to **Clients** tab
2. Click **New Client** to add a client
3. Fill in all relevant information:
   - Basic info (name, email, phone)
   - Company details (org number, tax number)
   - KID number (optional, for Norwegian banking)
   - Address (European format: postal code + city)
4. View client details to see invoice history

### Generating PDFs

1. Open an invoice
2. Click **Download PDF**
3. The PDF will be generated with your selected template
4. Includes your company logo and branding

### Sending Invoices via Email

1. Open an invoice
2. Click **Send Email** button
3. Enter recipient email address
4. Optionally add a custom message
5. Click **Send** - the invoice PDF will be attached automatically
6. Email templates match your selected invoice template style
7. Invoices are automatically marked as "sent" with the current date

### Exporting EHF (Electronic Invoice Format)

1. Open an invoice
2. Click the **EHF export** button (FileCode icon)
3. The EHF XML file will be downloaded
4. Format: PEPPOL BIS Billing 3.0 compliant UBL 2.1 XML
5. Requirements:
   - Both company and client must have organization numbers
   - All required fields must be filled in

## Invoice Templates

The app includes 16 professional invoice templates to match different business styles:

### Classic Templates

- **Classic**: Traditional invoice design with a yellow footer section. Professional and widely recognized format.
- **Modern**: Contemporary design with gradient colored accents and card-based layout. Perfect for creative businesses.
- **Professional**: Minimalist black and white design with clean lines. Ideal for corporate and professional services.
- **Minimal Japanese**: Clean, minimalist design inspired by Japanese aesthetics with subtle typography.

### Brutalist Templates

- **Brutalist**: Bold, raw design with strong typography and geometric shapes.
- **Neo Brutalist**: Modern take on brutalist design with clean lines and bold colors.
- **Cutout Brutalist**: Brutalist design with cutout effects and layered elements.

### Color Pop Templates

- **Color Pop Stacked**: Vibrant color blocks in a stacked layout.
- **Color Pop Minimal**: Minimal design with strategic color accents.
- **Color Pop Grid**: Grid-based layout with colorful sections.
- **Color Pop Diagonal**: Dynamic diagonal color sections.
- **Color Pop Brutalist**: Bold brutalist design with vibrant colors.

### Design System Templates

- **Dark Mode**: Dark-themed template perfect for modern, tech-forward businesses.
- **Swiss**: Clean, grid-based design inspired by Swiss design principles.
- **Typewriter**: Retro-inspired design with typewriter aesthetics.
- **Constructivist**: Geometric, avant-garde design inspired by constructivist art.

Each template includes a matching email template for sending invoices to clients.

## Currency Support

The system supports multiple currencies:

- EUR (Euro) - Default
- NOK (Norwegian Krone)
- USD (US Dollar)
- GBP (British Pound)
- SEK (Swedish Krona)
- DKK (Danish Krone)

Set your default currency in Company Profile. Each invoice can use a different currency if needed.

## Norwegian Banking Features

### KID Numbers

- Customer Identification numbers for Norwegian banking
- Optional field per client
- Can be auto-generated or manually entered
- Used for automatic payment reconciliation

### MVA (VAT) Support

- Full support for Norwegian MVA numbers
- Tax calculations with configurable rates
- Proper formatting on invoices
- Support for 0% MVA (zero-rated)

### EHF (Elektronisk Handelsformat) Export

- **PEPPOL BIS Billing 3.0 compliant** electronic invoice format
- Based on **UBL 2.1** (Universal Business Language) standard
- Fully compliant with Norwegian e-invoicing requirements
- Features:
  - Proper namespace handling (cac, cbc, ubl)
  - ISO alpha-2 country codes (converts country names automatically)
  - Sanitized IBAN (removes spaces)
  - Payment due dates in structured format
  - Tax category codes (S for standard, Z for zero-rated)
  - Norwegian organization number scheme (0192)
  - All required PEPPOL fields included

**Usage**: Export invoices as EHF XML files directly from the invoice view. The files can be uploaded to PEPPOL-compliant e-invoicing systems or sent to clients who require electronic invoices.

## Dark Mode

Dark mode is supported and can be enabled by adding the `dark` class to the `<html>` element. This can be toggled programmatically or based on user preference.

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- Private storage buckets with user-specific access
- Environment variables for sensitive configuration

## Edge Functions

This project includes Supabase Edge Functions for extended functionality:

### Send Invoice Email

Sends invoices via email using the Resend API.

**Email Templates:**

- **Single source of truth**: Email templates are stored in `src/templates/email/` (frontend codebase)
- Templates match invoice template styles (classic, modern, professional, etc.)
- Custom templates can be created per company in Company Profile settings
- Templates are rendered in the frontend before sending to the Edge Function
- The Edge Function receives pre-rendered HTML (no template processing needed)

**How it works:**

1. Frontend determines which template to use (custom or matching invoice template)
2. Frontend renders the template with invoice data (replaces `{{variables}}`)
3. Pre-rendered HTML is sent to the Edge Function along with the PDF
4. Edge Function sends the email via Resend API

**Updating Email Templates:**
Simply modify templates in `src/templates/email/` - no migrations or database updates needed!

**Configuration:**

### Local Development

1. **Get a Resend API key** from [resend.com/api-keys](https://resend.com/api-keys)
2. **Verify your domain** in Resend (e.g., `vierweb.no`)
3. **Copy the example env file:**

   ```bash
   cp supabase/functions/send-invoice-email/.env.local.example \
      supabase/functions/send-invoice-email/.env.local
   ```

4. **Edit `.env.local` with your Resend credentials:**

   ```bash
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=invoice@vierweb.no  # Must use verified domain
   RESEND_FROM_NAME=Invoice Manager
   ```

5. **When serving the function locally, use the `--env-file` flag:**

   ```bash
   supabase functions serve send-invoice-email \
     --env-file supabase/functions/send-invoice-email/.env.local
   ```

   **Important**: The `--env-file` path must point to the `.env.local` file inside the Edge Function directory, not the root `.env` file. Each Edge Function has its own environment variables.

**Note**: The `.env.local` file is gitignored (via `*.local` pattern) and won't be committed to the repository.

### Production (Self-hosted/Coolify)

Set environment variables on your Edge Functions container/deployment:

```bash
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=invoice@vierweb.no
RESEND_FROM_NAME=Invoice Manager
```

**Fallback**: The function automatically falls back to `SMTP_ADMIN_EMAIL` and `SMTP_SENDER_NAME` if Resend-specific variables aren't set.

**PDF Attachments**: The function automatically includes the invoice PDF as an attachment when sent from the frontend. The PDF is generated client-side using jsPDF and sent as a base64-encoded string.

**Testing Locally:**

```bash
# 1. Start Supabase locally
supabase start

# 2. Make sure you have the Edge Function .env.local configured:
#    - File location: supabase/functions/send-invoice-email/.env.local
#    - See Configuration section above for setup instructions

# 3. Serve the function with environment variables
#    Note: The --env-file path must be relative to the project root
supabase functions serve send-invoice-email \
  --env-file supabase/functions/send-invoice-email/.env.local

# The function will be available at http://127.0.0.1:54321/functions/v1/send-invoice-email
```

**Troubleshooting:**

- If you get "no such file or directory", make sure the `.env.local` file exists in `supabase/functions/send-invoice-email/`
- The `--env-file` path is relative to your project root, not the function directory
- You can also use an absolute path: `--env-file /full/path/to/.env.local`

### Validate Share Token

Validates invoice share tokens for public invoice viewing (no authentication required).

**Testing Locally:**

```bash
# Serve the function locally
supabase functions serve validate-share-token

# Note: JWT verification is disabled in config.toml for this function
# No --no-verify-jwt flag needed - it's configured automatically
```

**Configuration**: The `validate-share-token` function has JWT verification disabled in `supabase/config.toml` via the `[functions.validate-share-token] verify_jwt = false` setting, so no additional flags are needed when serving locally.

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

### Testing Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Serve individual functions
supabase functions serve send-invoice-email --env-file supabase/functions/send-invoice-email/.env.local
supabase functions serve validate-share-token

# Or serve all functions
supabase functions serve
```

### Adding New Features

1. **New Invoice Template**: Create a new file in `src/templates/` implementing the `InvoiceTemplate` interface
2. **Database Changes**: Add new migration files in `supabase/migrations/`
3. **New Components**: Add to `src/components/` following existing patterns

## Troubleshooting

### Supabase Connection Issues

- Verify `.env` file has correct credentials
- Check Supabase project is active
- Ensure migrations have been run

### PDF Generation Issues

- Check browser console for errors
- Verify company logo URL is accessible
- Ensure all required invoice data is present

### Storage/Logo Upload Issues

- Verify storage bucket exists and is configured
- Check RLS policies are in place
- Ensure file size is under 5MB

### Edge Function Issues

- **Email sending fails**: Verify `RESEND_API_KEY` is set and domain is verified in Resend
- **Share token validation fails locally**: JWT verification is disabled in `config.toml` - no flags needed when serving locally
- **Environment variables not found**: Ensure variables are set on the Edge Functions container (not the main Supabase instance) for self-hosted setups

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation
- Review Supabase documentation for backend-related questions

## Roadmap

See `ADDITIONAL_IMPROVEMENTS.md` for planned features and enhancements.

---

Built with ❤️ for Norwegian and European businesses
