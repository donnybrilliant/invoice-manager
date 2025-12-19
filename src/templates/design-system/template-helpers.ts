/**
 * Template Helper Utilities
 * 
 * Utilities for generating responsive CSS, merging styles, and common patterns.
 */

import React from 'react';
import { generateResponsiveCSS, generateContainerQueryCSS } from './responsive';
import { mergeStyles } from './styles';

/**
 * Generate responsive CSS for a template
 */
export function createTemplateStyles(
  className: string,
  options: {
    padding?: boolean;
    fontSize?: boolean;
    layout?: 'flex' | 'grid';
    table?: boolean;
    containerQueries?: Array<{
      breakpoint: 'totalsWrap' | 'mobileCard' | 'extraSmall';
      styles: string;
    }>;
  } = {}
): string {
  let css = generateResponsiveCSS(className, options);

  // Add container queries if specified
  if (options.containerQueries) {
    options.containerQueries.forEach(({ breakpoint, styles }) => {
      css += generateContainerQueryCSS(className, breakpoint, styles);
    });
  }

  return css;
}

/**
 * Safely merge style objects with proper handling of conflicting properties
 */
export function mergeStylesSafely(
  ...styles: (React.CSSProperties | undefined | null)[]
): React.CSSProperties {
  return mergeStyles(...styles);
}

/**
 * Create overflow prevention CSS
 */
export function createOverflowPreventionCSS(className: string): string {
  return `
    .${className} {
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
  `;
}

/**
 * Create responsive padding CSS
 */
export function createResponsivePaddingCSS(
  className: string,
  desktop: number = 50,
  tablet: number = 25,
  mobile: number = 15
): string {
  return `
    .${className} {
      padding: ${desktop}px;
    }
    @media (max-width: 768px) {
      .${className} {
        padding: ${tablet}px !important;
      }
    }
    @media (max-width: 480px) {
      .${className} {
        padding: ${mobile}px !important;
      }
    }
  `;
}

/**
 * Create common style pattern generators
 */
export const stylePatterns = {
  /**
   * Create a bordered container
   */
  bordered: (width: number = 1, color: string = 'rgba(0, 0, 0, 0.2)') => ({
    border: `${width}px solid ${color}`,
    boxSizing: 'border-box' as const,
  }),

  /**
   * Create a rounded container
   */
  rounded: (radius: number = 8) => ({
    borderRadius: `${radius}px`,
  }),

  /**
   * Create a padded container
   */
  padded: (padding: number = 20) => ({
    padding: `${padding}px`,
  }),

  /**
   * Create a flex container that stacks on mobile
   */
  responsiveFlex: (gap: number = 20) => ({
    display: 'flex',
    gap: `${gap}px`,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  }),
};

