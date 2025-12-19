/**
 * InvoiceContainer Component
 * 
 * Base container component with responsive padding and semantic HTML structure.
 */

import React from 'react';
import { containerStyle } from '../layout';
import { createResponsivePaddingCSS } from '../template-helpers';
import { container } from '../tokens';

export interface InvoiceContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: number;
  padding?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  style?: React.CSSProperties;
  background?: string;
}

export const InvoiceContainer: React.FC<InvoiceContainerProps> = ({
  children,
  className = 'invoice-container',
  maxWidth = container.maxWidth.standard,
  padding,
  style,
  background,
}) => {
  const paddingDesktop = padding?.desktop ?? container.padding.desktop;
  const paddingTablet = padding?.tablet ?? container.padding.tablet;
  const paddingMobile = padding?.mobile ?? container.padding.mobile;

  const responsiveCSS = createResponsivePaddingCSS(
    className,
    paddingDesktop,
    paddingTablet,
    paddingMobile
  );

  const containerStyles = React.useMemo(
    () =>
      containerStyle(maxWidth, {
        background: background || 'white',
        ...style,
      }),
    [maxWidth, background, style]
  );

  return (
    <>
      <style>{responsiveCSS}</style>
      <div className={className} style={containerStyles}>
        {children}
      </div>
    </>
  );
};

