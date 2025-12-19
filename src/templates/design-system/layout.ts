/**
 * Layout Utilities
 * 
 * Utilities for common layout patterns, flex/grid helpers, and alignment.
 */

import React from 'react';
import { spacing } from './tokens';

/**
 * Create full-width container style
 */
export function fullWidth(overrides?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    boxSizing: 'border-box',
    ...overrides,
  };
}

/**
 * Create stretch container style
 */
export function stretchContainer(overrides?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    boxSizing: 'border-box',
    flex: '1 1 auto',
    ...overrides,
  };
}

/**
 * Create flex container style
 */
export function flexContainer(
  direction: 'row' | 'column' = 'row',
  justify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' = 'flex-start',
  align: 'flex-start' | 'flex-end' | 'center' | 'stretch' = 'stretch',
  gap?: number
): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    ...(gap !== undefined && { gap: `${gap}px` }),
  };
}

/**
 * Create grid container style
 */
export function gridContainer(
  columns: string | number = '1fr',
  gap?: number,
  rows?: string | number
): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
    ...(rows && {
      gridTemplateRows: typeof rows === 'number' ? `repeat(${rows}, 1fr)` : rows,
    }),
    ...(gap !== undefined && { gap: `${gap}px` }),
  };
}

/**
 * Default alignment: left for text
 */
export function textAlign(overrides?: React.CSSProperties): React.CSSProperties {
  return {
    textAlign: 'left',
    ...overrides,
  };
}

/**
 * Default alignment: right for numbers/currency
 */
export function numberAlign(overrides?: React.CSSProperties): React.CSSProperties {
  return {
    textAlign: 'right',
    ...overrides,
  };
}

/**
 * Create responsive container with max-width
 */
export function containerStyle(
  maxWidth: number = 800,
  overrides?: React.CSSProperties
): React.CSSProperties {
  return {
    maxWidth: `${maxWidth}px`,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    ...overrides,
  };
}

