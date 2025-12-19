/**
 * Text and Currency Utilities
 * 
 * Utilities for handling text truncation, currency formatting styles,
 * and description cell styling in tables.
 */

import React from 'react';
import { currencyStyle, truncateStyle, wrapStyle } from './styles';

/**
 * Returns styles that enforce currency/amount on same line
 */
export function getCurrencyStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return currencyStyle(overrides);
}

/**
 * Returns styles for text truncation with ellipsis
 */
export function getTruncateStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return truncateStyle(overrides);
}

/**
 * Returns styles for text wrapping
 */
export function getWrapStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return wrapStyle(overrides);
}

/**
 * Optimized styles for description cells in tables
 * Allows wrapping but can truncate if needed
 */
export function getDescriptionCellStyle(
  tableLayout: 'auto' | 'fixed' = 'auto',
  overrides?: React.CSSProperties
): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  };

  if (tableLayout === 'fixed') {
    baseStyle.maxWidth = 0; // Allows column to shrink
  }

  return {
    ...baseStyle,
    ...overrides,
  };
}

/**
 * Style for currency cells that must never break
 */
export function getCurrencyCellStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return {
    ...currencyStyle(),
    // Ensure currency stays together
    whiteSpace: 'nowrap',
    textAlign: 'right',
    ...overrides,
  };
}

