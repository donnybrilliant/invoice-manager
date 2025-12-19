/**
 * TotalsSection Component
 *
 * Totals display component for subtotal, tax, and total.
 */

import React from "react";
import { flexContainer } from "../layout";
import { generateContainerQueryCSS } from "../responsive";
import { spacing } from "../tokens";
import { getCurrencyStyle } from "../text";

export interface TotalsSectionProps {
  subtotal: {
    label: string;
    amount: string;
  };
  tax: {
    label: string;
    amount: string;
    rate?: number;
  };
  total: {
    label: string;
    amount: string;
  };
  layout?: "right-aligned" | "full-width" | "flex";
  className?: string;
  style?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  totalRowStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  amountStyle?: React.CSSProperties;
  totalLabelStyle?: React.CSSProperties;
  totalAmountStyle?: React.CSSProperties;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  subtotal,
  tax,
  total,
  layout = "right-aligned",
  className = "totals-section",
  style,
  rowStyle,
  totalRowStyle,
  labelStyle,
  amountStyle,
  totalLabelStyle,
  totalAmountStyle,
}) => {
  const containerCSS = generateContainerQueryCSS(
    "totals-container",
    "totalsWrap",
    `
      .totals-section {
        width: 100% !important;
        max-width: 100% !important;
      }
      /* Default: much larger fonts on bigger containers - bigger than invoice list */
      .totals-section [data-total-amount] {
        font-size: clamp(32px, 8cqw, 64px) !important;
      }
      .totals-section [data-total-label] {
        font-size: clamp(24px, 6cqw, 48px) !important;
      }
      .totals-section [data-amount] {
        font-size: clamp(20px, 5cqw, 36px) !important;
      }
      /* Medium containers: slightly smaller but still large */
      @container (max-width: 400px) {
        .totals-section [data-total-amount] {
          font-size: clamp(28px, 7cqw, 56px) !important;
        }
        .totals-section [data-total-label] {
          font-size: clamp(20px, 5cqw, 40px) !important;
        }
        .totals-section [data-amount] {
          font-size: clamp(18px, 4.5cqw, 32px) !important;
        }
      }
      /* Small containers: smaller fonts but still prominent */
      @container (max-width: 300px) {
        .totals-section [data-total-amount] {
          font-size: clamp(24px, 6cqw, 48px) !important;
        }
        .totals-section [data-total-label] {
          font-size: clamp(18px, 4.5cqw, 36px) !important;
        }
        .totals-section [data-amount] {
          font-size: clamp(16px, 4cqw, 28px) !important;
        }
      }
      /* Very small containers: smallest but still larger than invoice list */
      @container (max-width: 250px) {
        .totals-section [data-total-amount] {
          font-size: clamp(20px, 5cqw, 40px) !important;
        }
        .totals-section [data-total-label] {
          font-size: clamp(16px, 4cqw, 32px) !important;
        }
        .totals-section [data-amount] {
          font-size: clamp(14px, 3.5cqw, 24px) !important;
        }
      }
    `
  );

  const containerStyle = React.useMemo(() => {
    if (layout === "full-width") {
      return { width: "100%" };
    }
    if (layout === "flex") {
      return flexContainer("column", "flex-start", "stretch");
    }
    return {
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
    };
  }, [layout]);

  const totalsContainerStyle = React.useMemo(() => {
    if (layout === "full-width") {
      return { width: "100%" };
    }
    return {
      width: layout === "flex" ? "100%" : "320px",
      maxWidth: "100%",
      minWidth: 0,
      containerType: "inline-size" as const,
      boxSizing: "border-box" as const,
    };
  }, [layout]);

  return (
    <>
      <style>{containerCSS}</style>
      <section
        className="totals-container"
        style={containerStyle}
        aria-label="Invoice totals"
      >
        <div
          className={className}
          style={{ ...totalsContainerStyle, ...style }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: `${spacing.md}px ${spacing.lg}px`,
              gap: spacing.md,
              boxSizing: "border-box",
              minWidth: 0,
              ...rowStyle,
            }}
          >
            <span
              style={{
                minWidth: 0,
                flexShrink: 1,
                ...labelStyle,
              }}
            >
              {subtotal.label}
            </span>
            <span
              data-amount
              style={{
                ...getCurrencyStyle(),
                flexShrink: 0,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "right",
                ...amountStyle,
              }}
            >
              {subtotal.amount}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: `${spacing.md}px ${spacing.lg}px`,
              gap: spacing.md,
              boxSizing: "border-box",
              minWidth: 0,
              ...rowStyle,
            }}
          >
            <span
              style={{
                minWidth: 0,
                flexShrink: 1,
                ...labelStyle,
              }}
            >
              {tax.label}
              {tax.rate !== undefined && ` (${tax.rate}%)`}
            </span>
            <span
              data-amount
              style={{
                ...getCurrencyStyle(),
                flexShrink: 0,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "right",
                ...amountStyle,
              }}
            >
              {tax.amount}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: `${spacing.md}px ${spacing.lg}px`,
              gap: spacing.md,
              boxSizing: "border-box",
              minWidth: 0,
              ...rowStyle,
              ...totalRowStyle,
            }}
          >
            <span
              data-total-label
              style={{
                minWidth: 0,
                flexShrink: 1,
                ...totalLabelStyle,
              }}
            >
              {total.label}
            </span>
            <span
              data-total-amount
              style={{
                ...getCurrencyStyle(),
                flexShrink: 0,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "right",
                ...totalAmountStyle,
              }}
            >
              {total.amount}
            </span>
          </div>
        </div>
      </section>
    </>
  );
};
