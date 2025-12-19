/**
 * Design System Tokens
 * 
 * Centralized design tokens for invoice templates including breakpoints,
 * spacing, typography, and layout constants.
 */

// Breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

// Container query breakpoints
export const containerBreakpoints = {
  totalsWrap: 600,
  mobileCard: 435,
  extraSmall: 400,
} as const;

// Spacing scale (4px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 40,
  '4xl': 50,
  '5xl': 60,
} as const;

// Typography scale
export const typography = {
  fontSize: {
    xs: '9px',
    sm: '10px',
    base: '11px',
    md: '13px',
    lg: '14px',
    xl: '15px',
    '2xl': '16px',
    '3xl': '18px',
    '4xl': '24px',
    '5xl': '28px',
    '6xl': '32px',
    '7xl': '36px',
    '8xl': '48px',
    '9xl': '72px',
  },
  fontWeight: {
    light: 200,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

// Container settings
export const container = {
  maxWidth: {
    standard: 800,
    alternative: 794,
  },
  padding: {
    desktop: 50,
    tablet: 25,
    mobile: 15,
  },
} as const;

// Table column width ratios
export const tableColumnWidths = {
  default: {
    description: '40%',
    quantity: '10%',
    unitPrice: '25%',
    amount: '25%',
  },
} as const;

// Responsive scale factors
export const responsiveScales = {
  tablet: 0.85,
  mobile: 0.7,
} as const;

