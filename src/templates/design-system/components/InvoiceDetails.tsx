/**
 * InvoiceDetails Component
 *
 * Flexible invoice details component for dates and invoice information.
 */

import React from "react";
import { flexContainer, gridContainer } from "../layout";
import { generateResponsiveCSS } from "../responsive";
import { spacing } from "../tokens";

export interface InvoiceDetailsProps {
  issueDate: string;
  dueDate: string;
  sentDate?: string;
  layout?: "table" | "grid" | "flex";
  className?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({
  issueDate,
  dueDate,
  sentDate,
  layout = "flex",
  className = "invoice-details",
  style,
  labelStyle,
  valueStyle,
}) => {
  const responsiveCSS = generateResponsiveCSS(className, {
    layout: layout === "grid" ? "grid" : "flex",
  });

  const containerStyle = React.useMemo(() => {
    switch (layout) {
      case "grid":
        return gridContainer("1fr 1fr", spacing.lg);
      case "table":
        return {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: `${spacing.md}px ${spacing.xl}px`,
          width: "100%",
          alignItems: "baseline",
        };
      default:
        return {
          ...flexContainer("row", "space-between", "flex-start", spacing.xl),
          flexWrap: "wrap",
        };
    }
  }, [layout]);

  const details = [
    { label: "Issue Date", value: issueDate },
    { label: "Due Date", value: dueDate },
    ...(sentDate ? [{ label: "Sent Date", value: sentDate }] : []),
  ];

  if (layout === "table") {
    return (
      <>
        <style>{responsiveCSS}</style>
        <style>{`
          /* When parent container is narrow (wrapped), align left and remove margins */
          .classic-info-section {
            container-type: inline-size;
          }
          .professional-details-grid {
            container-type: inline-size;
          }
          @container (max-width: 600px) {
            .classic-info-section > div:last-child .${className},
            .professional-details-grid > div:last-child .${className},
            .classic-info-section > div:last-child .invoice-details-right,
            .professional-details-grid > div:last-child .invoice-details-right {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding: 0 !important;
              text-align: left !important;
            }
            .classic-info-section > div:last-child .${className} > div,
            .professional-details-grid > div:last-child .${className} > div,
            .classic-info-section > div:last-child .invoice-details-right > div,
            .professional-details-grid > div:last-child .invoice-details-right > div {
              text-align: left !important;
            }
          }
        `}</style>
        <div className={className} style={{ ...containerStyle, ...style }}>
          {details.map((detail, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                minWidth: 0,
                flexShrink: 1,
                flexBasis: "auto",
              }}
            >
              <span
                style={{
                  padding: `${spacing.sm}px ${spacing.xl}px ${spacing.sm}px 0`,
                  color: "rgba(0, 0, 0, 0.6)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  ...labelStyle,
                }}
              >
                {detail.label}:
              </span>
              <span style={{ padding: `${spacing.sm}px 0`, whiteSpace: "nowrap", ...valueStyle }}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{responsiveCSS}</style>
      <div
        className={className}
        style={{ ...containerStyle, ...style }}
        aria-label="Invoice details"
      >
        {details.map((detail, index) => (
          <div key={index}>
            <div
              style={{
                fontSize: spacing.base,
                color: "rgba(0, 0, 0, 0.6)",
                marginBottom: spacing.sm,
                ...labelStyle,
              }}
            >
              {detail.label}
            </div>
            <div style={{ fontSize: spacing.lg, ...valueStyle }}>
              {detail.value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
