/**
 * InvoiceHeader Component
 * 
 * Flexible header component supporting logo, title, invoice number, and company info.
 */

import React from 'react';
import { flexContainer } from '../layout';
import { generateResponsiveCSS } from '../responsive';
import { spacing } from '../tokens';

export interface InvoiceHeaderProps {
  logo?: {
    url: string;
    alt?: string;
    maxWidth?: number;
    maxHeight?: number;
  };
  title: string;
  invoiceNumber: string;
  companyInfo?: {
    name: string;
    details: React.ReactNode;
  };
  layout?: 'side-by-side' | 'stacked';
  className?: string;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  invoiceNumberStyle?: React.CSSProperties;
  companyInfoStyle?: React.CSSProperties;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  logo,
  title,
  invoiceNumber,
  companyInfo,
  layout = 'side-by-side',
  className = 'invoice-header',
  style,
  titleStyle,
  invoiceNumberStyle,
  companyInfoStyle,
}) => {
  const responsiveCSS = generateResponsiveCSS(className, {
    layout: 'flex',
  });

  const headerStyle = React.useMemo(
    () =>
      flexContainer(
        layout === 'stacked' ? 'column' : 'row',
        'space-between',
        'flex-start',
        spacing.lg
      ),
    [layout]
  );

  return (
    <>
      <style>{responsiveCSS}</style>
      <header
        className={className}
        style={{ ...headerStyle, ...style }}
        aria-label="Invoice header"
      >
        <div>
          {logo && (
            <img
              src={logo.url}
              alt={logo.alt || 'Company Logo'}
              style={{
                maxWidth: logo.maxWidth || 150,
                maxHeight: logo.maxHeight || 80,
                marginBottom: spacing.md,
              }}
            />
          )}
          <h1 style={titleStyle}>{title}</h1>
          <div style={invoiceNumberStyle}>#{invoiceNumber}</div>
        </div>
        {companyInfo && (
          <div style={companyInfoStyle}>
            <div style={{ fontWeight: 600, marginBottom: spacing.sm }}>
              {companyInfo.name}
            </div>
            <div>{companyInfo.details}</div>
          </div>
        )}
      </header>
    </>
  );
};

