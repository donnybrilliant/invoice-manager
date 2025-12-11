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

## Styling Best Practices

### Explicit Color Styles for Dark Backgrounds

**IMPORTANT**: When creating templates with dark backgrounds (black, dark brown, dark grey, etc.), you **must** explicitly set the `color` style on **all child elements**, not just the parent container.

**Why?** The invoice system uses CSS isolation to prevent Tailwind dark mode from affecting invoices. A default dark text color rule applies to elements without explicit colors to prevent white-on-white text issues. This means child elements without explicit colors will get dark text, making them invisible on dark backgrounds.

**Correct Example:**

```tsx
<div style={{ background: "#3D2914", color: "#FDF6E3" }}>
  <span style={{ fontSize: "12px", color: "#FDF6E3" }}>TOTAL DUE</span>
  <span style={{ fontSize: "18px", color: "#FDF6E3" }}>
    {formatCurrencyWithCode(invoice.total, invoice.currency)}
  </span>
</div>
```

**Incorrect Example:**

```tsx
<div style={{ background: "#3D2914", color: "#FDF6E3" }}>
  <span style={{ fontSize: "12px" }}>
    TOTAL DUE {/* Missing explicit color - will be dark text! */}
  </span>
  <span style={{ fontSize: "18px" }}>
    {formatCurrencyWithCode(invoice.total, invoice.currency)}{" "}
    {/* Missing explicit color - will be dark text! */}
  </span>
</div>
```

**Rule of Thumb**: If a parent element has a dark background with light text, **every child element** that contains text must also have an explicit `color` style matching the parent's text color.
