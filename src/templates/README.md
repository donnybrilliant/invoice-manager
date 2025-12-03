# Invoice Templates

This directory contains the invoice template system for rendering invoices in different styles.

## Available Templates

### 1. Classic Template

- **ID**: `classic`
- **Description**: Traditional invoice design with yellow footer
- **Features**:
  - Clean, professional layout
  - Yellow footer section for payment information
  - Traditional styling with clear sections

### 2. Modern Template

- **ID**: `modern`
- **Description**: Contemporary design with colored accents
- **Features**:
  - Gradient colored header and footer bars
  - Colored left borders on line items
  - Contemporary card-based layout
  - Vibrant blue and purple color scheme

### 3. Professional Template

- **ID**: `professional`
- **Description**: Clean and minimal business design
- **Features**:
  - Minimalist black and white design
  - Clean lines and business-appropriate styling
  - Sophisticated typography
  - Maximum readability

## Usage

```typescript
import { getTemplate, templates } from "./templates";
import { InvoiceTemplateData } from "./templates/types";

// Get a specific template
const template = getTemplate("modern");

// Prepare data
const data: InvoiceTemplateData = {
  invoice: invoiceData,
  items: invoiceItems,
  client: clientData,
  profile: companyProfile,
};

// Render the invoice
const html = template.render(data);
```

## Template Structure

Each template implements the `InvoiceTemplate` interface:

```typescript
interface InvoiceTemplate {
  id: "classic" | "modern" | "professional";
  name: string;
  description: string;
  render: (data: InvoiceTemplateData) => string;
}
```

## Adding New Templates

1. Create a new file in `src/templates/` (e.g., `MyTemplate.ts`)
2. Implement the `InvoiceTemplate` interface
3. Add the template to the registry in `src/templates/index.ts`
4. Update the template ID type in `src/templates/types.ts`
