/**
 * Responsive Utilities
 * 
 * Utilities for handling responsive behavior in invoice templates,
 * including breakpoint-based styles and container queries.
 */

import { breakpoints, containerBreakpoints, spacing, container } from './tokens';
import React from 'react';

export type Breakpoint = keyof typeof breakpoints;
export type ContainerBreakpoint = keyof typeof containerBreakpoints;

/**
 * Generate responsive CSS for a template
 */
export function generateResponsiveCSS(
  className: string,
  options: {
    padding?: boolean;
    fontSize?: boolean;
    layout?: 'flex' | 'grid';
    table?: boolean;
  } = {}
): string {
  const { padding = true, fontSize = false, layout, table = false } = options;
  
  let css = '';

  // Tablet breakpoint
  css += `
    @media (max-width: ${breakpoints.tablet}px) {
      ${padding ? `.${className} { padding: ${container.padding.tablet}px !important; }` : ''}
      ${fontSize ? `.${className} { font-size: ${spacing.lg}px !important; }` : ''}
      ${layout === 'flex' ? `.${className} { flex-direction: column !important; gap: ${spacing.lg}px !important; }` : ''}
      ${layout === 'grid' ? `.${className} { grid-template-columns: 1fr !important; gap: ${spacing.lg}px !important; }` : ''}
      ${table ? `
        .${className} table { font-size: 12px !important; }
        .${className} th, .${className} td { padding: 8px !important; font-size: 11px !important; }
      ` : ''}
    }
  `;

  // Mobile breakpoint
  css += `
    @media (max-width: ${breakpoints.mobile}px) {
      ${padding ? `.${className} { padding: ${container.padding.mobile}px !important; }` : ''}
      ${fontSize ? `.${className} { font-size: ${spacing.md}px !important; }` : ''}
      ${table ? `
        .${className} table { font-size: 10px !important; }
        .${className} th, .${className} td { padding: 6px 4px !important; font-size: 9px !important; }
      ` : ''}
    }
  `;

  return css;
}

/**
 * Generate container query CSS
 */
export function generateContainerQueryCSS(
  className: string,
  breakpoint: ContainerBreakpoint,
  styles: string
): string {
  return `
    @container (max-width: ${containerBreakpoints[breakpoint]}px) {
      .${className} {
        ${styles}
      }
    }
  `;
}

/**
 * Get responsive padding based on breakpoint
 */
export function getResponsivePadding(breakpoint?: Breakpoint): number {
  switch (breakpoint) {
    case 'mobile':
      return container.padding.mobile;
    case 'tablet':
      return container.padding.tablet;
    default:
      return container.padding.desktop;
  }
}

/**
 * Hook for responsive styles (for future use with media queries)
 */
export function useResponsiveStyles<T>(
  styles: {
    mobile?: T;
    tablet?: T;
    desktop: T;
  }
): T {
  // For now, return desktop styles
  // In a real implementation, this would use a media query hook
  return styles.desktop;
}

/**
 * Create a responsive style object
 */
export function createResponsiveStyle(
  baseStyle: React.CSSProperties,
  overrides?: {
    tablet?: Partial<React.CSSProperties>;
    mobile?: Partial<React.CSSProperties>;
  }
): React.CSSProperties {
  return {
    ...baseStyle,
    ...overrides?.tablet,
    ...overrides?.mobile,
  };
}

