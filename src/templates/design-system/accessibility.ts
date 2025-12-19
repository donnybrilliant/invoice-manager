/**
 * Accessibility Utilities
 * 
 * Helpers for semantic HTML, ARIA labels, and accessibility features
 * in invoice templates.
 */

import React from 'react';

/**
 * Create semantic HTML structure for invoice sections
 */
export function createSemanticSection(
  type: 'header' | 'address' | 'details' | 'items' | 'totals' | 'payment' | 'notes',
  content: React.ReactNode,
  className?: string
): React.ReactElement {
  const Tag = getSemanticTag(type);
  const ariaLabel = getAriaLabel(type);

  return React.createElement(
    Tag,
    {
      className,
      'aria-label': ariaLabel,
      role: type === 'items' ? 'table' : undefined,
    },
    content
  );
}

/**
 * Get appropriate semantic HTML tag for section type
 */
function getSemanticTag(
  type: 'header' | 'address' | 'details' | 'items' | 'totals' | 'payment' | 'notes'
): keyof JSX.IntrinsicElements {
  switch (type) {
    case 'header':
      return 'header';
    case 'address':
      return 'address';
    case 'items':
      return 'section';
    case 'totals':
    case 'payment':
    case 'notes':
      return 'section';
    default:
      return 'div';
  }
}

/**
 * Get ARIA label for section type
 */
function getAriaLabel(
  type: 'header' | 'address' | 'details' | 'items' | 'totals' | 'payment' | 'notes'
): string {
  switch (type) {
    case 'header':
      return 'Invoice header';
    case 'address':
      return 'Invoice addresses';
    case 'details':
      return 'Invoice details';
    case 'items':
      return 'Invoice items';
    case 'totals':
      return 'Invoice totals';
    case 'payment':
      return 'Payment information';
    case 'notes':
      return 'Invoice notes';
    default:
      return '';
  }
}

/**
 * Create ARIA label for currency amount
 */
export function createCurrencyAriaLabel(
  amount: number,
  currency: string,
  label?: string
): string {
  const formatted = `${currency} ${amount.toFixed(2)}`;
  return label ? `${label}: ${formatted}` : formatted;
}

/**
 * Create print-friendly styles
 */
export function createPrintStyles(className: string): string {
  return `
    @media print {
      .${className} {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .${className} table {
        page-break-inside: auto;
      }
      .${className} tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  `;
}

