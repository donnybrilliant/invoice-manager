/**
 * Style Utilities
 * 
 * Utilities for creating themes, merging styles, and common style patterns.
 */

import React from 'react';
import { spacing, typography } from './tokens';

export interface Theme {
  colors: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    background?: string;
    text?: string;
    textMuted?: string;
    border?: string;
  };
  fonts?: {
    primary?: string;
    secondary?: string;
    mono?: string;
  };
}

/**
 * Create a theme object for a template
 */
export function createTheme(theme: Theme): Theme {
  return {
    colors: {
      background: '#fff',
      text: '#000',
      textMuted: 'rgba(0, 0, 0, 0.6)',
      border: 'rgba(0, 0, 0, 0.2)',
      ...theme.colors,
    },
    fonts: {
      primary: 'Arial, sans-serif',
      ...theme.fonts,
    },
  };
}

/**
 * Deep merge style objects
 */
export function mergeStyles(
  ...styles: (React.CSSProperties | undefined | null)[]
): React.CSSProperties {
  return styles.reduce((acc, style) => {
    if (!style) return acc;
    return { ...acc, ...style };
  }, {} as React.CSSProperties);
}

/**
 * Create border styles
 */
export function createBorder(
  width: number = 1,
  style: string = 'solid',
  color: string = 'rgba(0, 0, 0, 0.2)'
): React.CSSProperties {
  return {
    borderWidth: `${width}px`,
    borderStyle: style,
    borderColor: color,
  };
}

/**
 * Create background styles
 */
export function createBackground(
  color: string,
  gradient?: string
): React.CSSProperties {
  if (gradient) {
    return {
      background: gradient,
    };
  }
  return {
    backgroundColor: color,
  };
}

/**
 * Create shadow styles
 */
export function createShadow(
  level: 'sm' | 'md' | 'lg' = 'md'
): React.CSSProperties {
  const shadows = {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 1px 3px rgba(0,0,0,0.1)',
    lg: '0 4px 6px rgba(0,0,0,0.1)',
  };
  return {
    boxShadow: shadows[level],
  };
}

/**
 * Create currency/amount style that enforces same-line display
 */
export function currencyStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return mergeStyles(
    {
      whiteSpace: 'nowrap' as const,
      textAlign: 'right',
    },
    overrides
  );
}

/**
 * Create text truncation style
 */
export function truncateStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return mergeStyles(
    {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    overrides
  );
}

/**
 * Create text wrapping style
 */
export function wrapStyle(overrides?: React.CSSProperties): React.CSSProperties {
  return mergeStyles(
    {
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'normal',
    },
    overrides
  );
}

/**
 * Create overflow prevention style
 */
export function preventOverflow(overrides?: React.CSSProperties): React.CSSProperties {
  return mergeStyles(
    {
      overflow: 'hidden',
      boxSizing: 'border-box' as const,
      width: '100%',
    },
    overrides
  );
}

