import React from "react";

/**
 * InvoiceContainer - Reusable wrapper component for invoice content
 *
 * Ensures consistent styling and dark mode isolation across:
 * - Preview views
 * - Template selector thumbnails
 * - PDF generation
 * - Print views
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
    <div
      className={`invoice-light-mode ${className}`}
      style={{
        backgroundColor: "#ffffff",
        color: "#1f2937",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
