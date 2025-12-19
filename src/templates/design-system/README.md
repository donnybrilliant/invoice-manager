# Invoice Template Design System

A flexible design system for creating consistent, responsive, and accessible invoice templates.

## Overview

The design system provides reusable components, utilities, and patterns that reduce code duplication and ensure consistency across all invoice templates. It enforces critical standards like currency formatting, text truncation, overflow prevention, and responsive behavior.

## Key Features

- **Reusable Components**: Pre-built layout components for common invoice sections
- **Responsive Utilities**: Standardized breakpoints and responsive CSS generation
- **Style Utilities**: Theme creation, style merging, and common patterns
- **Text & Currency Utilities**: Enforced currency formatting and text truncation
- **Table Utilities**: Standardized table column widths and cell styles
- **Accessibility Helpers**: Semantic HTML and ARIA support

## Installation

The design system is already integrated into the project. Import from:

```typescript
import { 
  InvoiceContainer, 
  InvoiceHeader, 
  // ... other components
} from './templates/design-system';
```

## Core Principles

1. **Currency Integrity**: Currency codes and amounts must never break across lines
2. **Smart Truncation**: Text truncates intelligently, prioritizing currency columns
3. **No Overflow**: All components prevent overflow and handle edge cases
4. **Full Width Default**: Elements stretch to fill available space unless constrained
5. **Responsive Excellence**: Consistent responsive behavior across all templates

## Components

### InvoiceContainer

Base container with responsive padding and semantic structure.

```typescript
<InvoiceContainer
  maxWidth={800}
  padding={{ desktop: 50, tablet: 25, mobile: 15 }}
  background="white"
>
  {/* Content */}
</InvoiceContainer>
```

### InvoiceHeader

Flexible header component for logo, title, invoice number, and company info.

```typescript
<InvoiceHeader
  logo={{ url: profile.logo_url, alt: "Logo" }}
  title="INVOICE"
  invoiceNumber={invoice.invoice_number}
  companyInfo={{
    name: "Company Name",
    details: <div>Company details</div>
  }}
  layout="side-by-side"
/>
```

### AddressSection

Two-column address layout for "From" and "Bill To" sections.

```typescript
<AddressSection
  from={{
    label: "From",
    name: "Company Name",
    address: <div>Address details</div>
  }}
  billTo={{
    label: "Bill To",
    name: client.name,
    address: <div>Client address</div>
  }}
  layout="flex"
/>
```

### InvoiceDetails

Flexible component for invoice dates and information.

```typescript
<InvoiceDetails
  issueDate={formatDate(invoice.issue_date)}
  dueDate={formatDate(invoice.due_date)}
  sentDate={invoice.sent_date ? formatDate(invoice.sent_date) : undefined}
  layout="table"
/>
```

### TotalsSection

Totals display component for subtotal, tax, and total.

```typescript
<TotalsSection
  subtotal={{
    label: "Subtotal:",
    amount: formatCurrencyWithCode(invoice.subtotal, invoice.currency)
  }}
  tax={{
    label: "Tax",
    amount: formatCurrencyWithCode(invoice.tax_amount, invoice.currency),
    rate: invoice.tax_rate
  }}
  total={{
    label: "Total:",
    amount: formatCurrencyWithCode(invoice.total, invoice.currency)
  }}
  layout="right-aligned"
/>
```

### Section

Generic section wrapper for notes, payment info, etc.

```typescript
<Section
  title="Notes"
  ariaLabel="Invoice notes"
>
  {invoice.notes}
</Section>
```

## Utilities

### Text & Currency

```typescript
import { getCurrencyStyle, getTruncateStyle, getWrapStyle } from './design-system/text';

// Currency style (enforces whiteSpace: "nowrap")
const currencyStyle = getCurrencyStyle();

// Text truncation
const truncateStyle = getTruncateStyle();

// Text wrapping
const wrapStyle = getWrapStyle();
```

### Table Utilities

```typescript
import { 
  getTableColumnWidths, 
  getTableLayout,
  getCurrencyCellStyles,
  getDescriptionCellStyles 
} from './design-system/table';

// Get standard column widths
const columnWidths = getTableColumnWidths();

// Get table layout
const layout = getTableLayout(columnWidths);

// Get currency cell styles
const { unitPrice, amount } = getCurrencyCellStyles();

// Get description cell styles
const descriptionStyle = getDescriptionCellStyles('fixed');
```

### Layout Utilities

```typescript
import { fullWidth, stretchContainer, flexContainer, gridContainer } from './design-system/layout';

// Full width container
const containerStyle = fullWidth();

// Stretch container
const stretchStyle = stretchContainer();

// Flex container
const flexStyle = flexContainer('row', 'space-between', 'flex-start', 20);

// Grid container
const gridStyle = gridContainer('1fr 1fr', 30);
```

### Style Utilities

```typescript
import { 
  currencyStyle, 
  truncateStyle, 
  preventOverflow,
  mergeStyles 
} from './design-system/styles';

// Merge styles safely
const mergedStyle = mergeStyles(style1, style2, style3);

// Prevent overflow
const safeStyle = preventOverflow({ width: '100%' });
```

### Responsive Utilities

```typescript
import { 
  generateResponsiveCSS, 
  createTemplateStyles 
} from './design-system/responsive';

// Generate responsive CSS
const css = generateResponsiveCSS('my-template', {
  padding: true,
  fontSize: true,
  layout: 'flex'
});

// Create template styles
const templateCSS = createTemplateStyles('my-template', {
  padding: true,
  table: true,
  containerQueries: [
    { breakpoint: 'totalsWrap', styles: 'width: 100% !important;' }
  ]
});
```

## Tokens

### Breakpoints

```typescript
import { breakpoints, containerBreakpoints } from './design-system/tokens';

breakpoints.mobile   // 480px
breakpoints.tablet   // 768px
breakpoints.desktop  // 1024px

containerBreakpoints.totalsWrap  // 600px
containerBreakpoints.mobileCard  // 435px
containerBreakpoints.extraSmall  // 400px
```

### Spacing

```typescript
import { spacing } from './design-system/tokens';

spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.base  // 16px
spacing.lg    // 20px
spacing.xl    // 24px
spacing['2xl'] // 30px
spacing['3xl'] // 40px
spacing['4xl'] // 50px
spacing['5xl'] // 60px
```

### Typography

```typescript
import { typography } from './design-system/tokens';

typography.fontSize.xs    // '9px'
typography.fontSize.base  // '11px'
typography.fontSize.lg    // '14px'
// ... etc

typography.fontWeight.normal    // 400
typography.fontWeight.semibold  // 600
typography.fontWeight.bold       // 700
// ... etc
```

## Critical Standards

### Currency/Amount Handling

Currency codes and numbers must ALWAYS stay on the same line. Use `getCurrencyStyle()` or `currencyStyle()`:

```typescript
// ✅ Correct
<span style={getCurrencyStyle()}>
  {formatCurrencyWithCode(amount, currency)}
</span>

// ❌ Wrong - currency might break
<span>{formatCurrencyWithCode(amount, currency)}</span>
```

### Text Truncation

Descriptions should truncate when space is limited:

```typescript
// For truncation with ellipsis
<div style={getTruncateStyle()}>Long description text...</div>

// For wrapping
<div style={getWrapStyle()}>Long description text...</div>
```

### Table Column Behavior

- Description column can shrink/truncate
- Currency columns (unitPrice, amount) must maintain `whiteSpace: "nowrap"`
- Default column widths: description 40%, quantity 10%, unitPrice 25%, amount 25%

```typescript
import { getTableColumnWidths } from './design-system/table';

const columnWidths = getTableColumnWidths({
  description: "40%",
  quantity: "10%",
  unitPrice: "25%",
  amount: "25%"
});
```

### Overflow Prevention

All containers must prevent overflow:

```typescript
import { preventOverflow } from './design-system/styles';

<div style={preventOverflow()}>
  {/* Content */}
</div>
```

### Full Width/Stretch Behavior

Elements should stretch to fill available space:

```typescript
import { fullWidth, stretchContainer } from './design-system/layout';

// Full width
<div style={fullWidth()}>Content</div>

// Stretch in flex container
<div style={stretchContainer()}>Content</div>
```

## Example: Creating a New Template

```typescript
import React from 'react';
import { InvoiceTemplateData } from './types';
import { formatCurrencyWithCode, formatDate } from '../lib/formatting';
import {
  InvoiceContainer,
  InvoiceHeader,
  AddressSection,
  InvoiceDetails,
  TotalsSection,
  Section,
} from './design-system';
import { createTemplateStyles } from './design-system/template-helpers';
import { InvoiceItemList } from '../components/InvoiceItemList';
import { PaymentInformation } from './utils/PaymentInformation';

const MyTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles('my-template', {
    padding: true,
    table: true,
  });

  return (
    <>
      <style>{templateCSS}</style>
      <InvoiceContainer className="my-template">
        <InvoiceHeader
          title="INVOICE"
          invoiceNumber={invoice.invoice_number}
          companyInfo={{
            name: getCompanyInfo(profile, 'company_name'),
            details: <div>Company details</div>
          }}
        />
        
        <AddressSection
          from={{
            name: getCompanyInfo(profile, 'company_name'),
            address: <div>Company address</div>
          }}
          billTo={{
            name: client.name,
            address: <div>Client address</div>
          }}
        />
        
        <InvoiceDetails
          issueDate={formatDate(invoice.issue_date)}
          dueDate={formatDate(invoice.due_date)}
        />
        
        <InvoiceItemList items={items} currency={invoice.currency} />
        
        <TotalsSection
          subtotal={{
            label: 'Subtotal:',
            amount: formatCurrencyWithCode(invoice.subtotal, invoice.currency)
          }}
          tax={{
            label: 'Tax',
            amount: formatCurrencyWithCode(invoice.tax_amount, invoice.currency),
            rate: invoice.tax_rate
          }}
          total={{
            label: 'Total:',
            amount: formatCurrencyWithCode(invoice.total, invoice.currency)
          }}
        />
        
        {invoice.notes && (
          <Section title="Notes">
            {invoice.notes}
          </Section>
        )}
        
        <Section title="Payment Information">
          <PaymentInformation profile={profile} invoice={invoice} />
        </Section>
      </InvoiceContainer>
    </>
  );
};

export const MyTemplate = {
  id: 'my-template' as const,
  name: 'My Template',
  description: 'A custom template',
  Component: MyTemplateComponent,
};
```

## Migration Guide

To migrate an existing template to use the design system:

1. **Import components and utilities**:
   ```typescript
   import { InvoiceContainer, InvoiceHeader, ... } from './design-system';
   ```

2. **Replace container div** with `InvoiceContainer`:
   ```typescript
   // Before
   <div style={{ maxWidth: '800px', margin: '0 auto', padding: '50px' }}>
   
   // After
   <InvoiceContainer maxWidth={800} padding={{ desktop: 50, tablet: 25, mobile: 15 }}>
   ```

3. **Replace header section** with `InvoiceHeader`:
   ```typescript
   // Before
   <div style={headerStyle}>
     <h1>INVOICE</h1>
     <div>{companyInfo}</div>
   </div>
   
   // After
   <InvoiceHeader
     title="INVOICE"
     invoiceNumber={invoice.invoice_number}
     companyInfo={{ name: '...', details: <div>...</div> }}
   />
   ```

4. **Use design system utilities** for styles:
   ```typescript
   import { getCurrencyStyle, preventOverflow } from './design-system';
   
   // Use utilities instead of inline styles
   <span style={getCurrencyStyle()}>{amount}</span>
   ```

5. **Update responsive CSS** to use `createTemplateStyles`:
   ```typescript
   const templateCSS = createTemplateStyles('my-template', {
     padding: true,
     table: true,
   });
   ```

## Best Practices

1. **Always use currency utilities** for amounts to prevent line breaks
2. **Use design system tokens** for spacing, typography, and breakpoints
3. **Prevent overflow** on all containers
4. **Use semantic components** when possible for better accessibility
5. **Leverage responsive utilities** instead of writing custom media queries
6. **Merge styles safely** using `mergeStyles()` utility
7. **Follow column width standards** for tables

## API Reference

See the TypeScript definitions in each module for complete API documentation:

- `tokens.ts` - Design tokens
- `responsive.ts` - Responsive utilities
- `styles.ts` - Style utilities
- `layout.ts` - Layout utilities
- `text.ts` - Text and currency utilities
- `table.ts` - Table utilities
- `template-helpers.ts` - Template helper utilities
- `components/` - React components

## Support

For questions or issues, refer to the example implementation in `ClassicTemplate.tsx`.

