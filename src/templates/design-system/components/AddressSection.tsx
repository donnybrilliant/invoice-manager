/**
 * AddressSection Component
 * 
 * Two-column address layout component for "From" and "Bill To" sections.
 */

import React from 'react';
import { flexContainer, gridContainer } from '../layout';
import { generateResponsiveCSS } from '../responsive';
import { spacing } from '../tokens';

export interface AddressSectionProps {
  from: {
    label?: string;
    name: string;
    address: React.ReactNode;
  };
  billTo: {
    label?: string;
    name: string;
    address: React.ReactNode;
  };
  layout?: 'flex' | 'grid';
  className?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  nameStyle?: React.CSSProperties;
  addressStyle?: React.CSSProperties;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  from,
  billTo,
  layout = 'flex',
  className = 'address-section',
  style,
  labelStyle,
  nameStyle,
  addressStyle,
}) => {
  const responsiveCSS = generateResponsiveCSS(className, {
    layout: layout === 'flex' ? 'flex' : 'grid',
  });

  const containerStyle = React.useMemo(() => {
    if (layout === 'grid') {
      return gridContainer('1fr 1fr', spacing['5xl']);
    }
    return flexContainer('row', 'space-between', 'flex-start', spacing['5xl']);
  }, [layout]);

  return (
    <>
      <style>{responsiveCSS}</style>
      <address
        className={className}
        style={{ ...containerStyle, ...style }}
        aria-label="Invoice addresses"
      >
        <div>
          {from.label && (
            <div
              style={{
                fontSize: spacing.base,
                textTransform: 'uppercase',
                marginBottom: spacing.lg,
                ...labelStyle,
              }}
            >
              {from.label}
            </div>
          )}
          <div
            style={{
              fontWeight: 600,
              fontSize: spacing['3xl'],
              marginBottom: spacing.md,
              ...nameStyle,
            }}
          >
            {from.name}
          </div>
          <div
            style={{
              fontSize: spacing.lg,
              lineHeight: 1.8,
              ...addressStyle,
            }}
          >
            {from.address}
          </div>
        </div>
        <div>
          {billTo.label && (
            <div
              style={{
                fontSize: spacing.base,
                textTransform: 'uppercase',
                marginBottom: spacing.lg,
                ...labelStyle,
              }}
            >
              {billTo.label}
            </div>
          )}
          <div
            style={{
              fontWeight: 600,
              fontSize: spacing['3xl'],
              marginBottom: spacing.md,
              ...nameStyle,
            }}
          >
            {billTo.name}
          </div>
          <div
            style={{
              fontSize: spacing.lg,
              lineHeight: 1.8,
              ...addressStyle,
            }}
          >
            {billTo.address}
          </div>
        </div>
      </address>
    </>
  );
};

