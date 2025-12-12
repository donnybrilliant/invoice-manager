import React from "react";

/**
 * InvoiceContainer - Simple wrapper component for invoice content
 *
 * Uses CSS isolation to completely separate invoices from Tailwind dark mode.
 * All templates use inline styles, so we only need isolation - no conditionals needed.
 *
 * Usage:
 *   <InvoiceContainer>
 *     <TemplateComponent {...props} />
 *   </InvoiceContainer>
 */
interface InvoiceContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function InvoiceContainer({
  children,
  className = "",
  style,
}: InvoiceContainerProps) {
  return (
    <div className={`invoice-container ${className}`} style={style}>
      {children}
    </div>
  );
}
