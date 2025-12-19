/**
 * Table Utilities
 * 
 * Utilities for table-specific styling, column widths, and cell styles.
 */

import React from 'react';
import { tableColumnWidths } from './tokens';
import { getCurrencyCellStyle, getDescriptionCellStyle } from './text';
import { preventOverflow } from './styles';

export interface TableColumnWidths {
  description?: string;
  quantity?: string;
  unitPrice?: string;
  amount?: string;
}

/**
 * Returns standardized column width configuration
 */
export function getTableColumnWidths(
  customWidths?: TableColumnWidths
): TableColumnWidths {
  if (customWidths && Object.keys(customWidths).length > 0) {
    return customWidths;
  }
  return tableColumnWidths.default;
}

/**
 * Returns table styles with overflow prevention
 */
export function getTableStyles(overrides?: React.CSSProperties): React.CSSProperties {
  return {
    ...preventOverflow(),
    width: '100%',
    borderCollapse: 'collapse',
    ...overrides,
  };
}

/**
 * Standardized styles for currency cells (unitPrice, amount)
 * Ensures currency code and number stay on same line
 */
export function getCurrencyCellStyles(
  unitPriceOverrides?: React.CSSProperties,
  amountOverrides?: React.CSSProperties
): {
  unitPrice: React.CSSProperties;
  amount: React.CSSProperties;
} {
  return {
    unitPrice: getCurrencyCellStyle(unitPriceOverrides),
    amount: getCurrencyCellStyle(amountOverrides),
  };
}

/**
 * Standardized styles for description cells with truncation support
 */
export function getDescriptionCellStyles(
  tableLayout: 'auto' | 'fixed' = 'auto',
  overrides?: React.CSSProperties
): React.CSSProperties {
  return getDescriptionCellStyle(tableLayout, overrides);
}

/**
 * Get default table layout based on whether column widths are provided
 */
export function getTableLayout(
  columnWidths?: TableColumnWidths
): 'auto' | 'fixed' {
  if (columnWidths && Object.keys(columnWidths).length > 0) {
    return 'fixed';
  }
  return 'auto';
}

