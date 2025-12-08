# Invoice Manager

A modern, full-featured invoice management system built with React, TypeScript, Tailwind CSS, and Supabase. Designed for Norwegian and European businesses with support for international banking, multiple currencies, and VAT/MVA compliance.

## Features

### Invoice Management

- ✅ Create, edit, and manage invoices
- ✅ Multiple professional PDF templates (Classic, Modern, Professional)
- ✅ Automatic invoice numbering
- ✅ Tax/VAT/MVA calculations
- ✅ Discount support
- ✅ Multi-currency support (EUR, NOK, USD, etc.)
- ✅ Invoice status tracking (Draft, Sent, Paid, Overdue)
- ✅ PDF export with company branding
- ✅ EHF (Elektronisk Handelsformat) export for Norwegian e-invoicing

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

- Node.js 18+ and npm
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

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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
│   │   └── TemplateSelector.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                 # Utilities
│   │   ├── supabase.ts      # Supabase client
│   │   ├── pdfUtils.ts      # PDF generation
│   │   ├── ehfGenerator.ts  # EHF XML generation
│   │   └── utils.ts         # Shared utilities
│   ├── templates/           # Invoice PDF templates
│   │   ├── ClassicTemplate.ts
│   │   ├── ModernTemplate.ts
│   │   ├── ProfessionalTemplate.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/          # Database migrations
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

### Exporting EHF (Electronic Invoice Format)

1. Open an invoice
2. Click the **EHF export** button (FileCode icon)
3. The EHF XML file will be downloaded
4. Format: PEPPOL BIS Billing 3.0 compliant UBL 2.1 XML
5. Requirements:
   - Both company and client must have organization numbers
   - All required fields must be filled in

## Invoice Templates

### Classic Template

Traditional invoice design with a yellow footer section. Professional and widely recognized format.

### Modern Template

Contemporary design with gradient colored accents and card-based layout. Perfect for creative businesses.

### Professional Template

Minimalist black and white design with clean lines. Ideal for corporate and professional services.

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

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
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
