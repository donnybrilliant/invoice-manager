import React from "react";
import { InvoiceItem } from "../types";
import { formatCurrencyWithCode } from "../lib/formatting";

export interface InvoiceItemListStyles {
  // Typography
  headerFontSize?: string | number;
  bodyFontSize?: string | number;
  fontFamily?: string;
  headerFontWeight?: number | string;
  bodyFontWeight?: number | string;
  amountFontWeight?: number | string;
  headerTextTransform?: string;
  headerLetterSpacing?: string;

  // Colors
  headerTextColor?: string;
  headerBgColor?: string;
  bodyTextColor?: string;
  borderColor?: string;
  amountColor?: string;
  alternatingRowColor?: string;

  // Spacing
  headerPadding?: string;
  bodyPadding?: string;
  borderWidth?: string;
  borderBottomWidth?: string;

  // Layout
  columnWidths?: {
    description?: string;
    quantity?: string;
    unitPrice?: string;
    amount?: string;
  };

  // Table styling
  tableLayout?: "auto" | "fixed";
  borderCollapse?: "collapse" | "separate";
  headerBorderBottom?: string;
  rowBorderBottom?: string;

  // Responsive scales (0.7-1.0)
  tabletScale?: number;
  mobileScale?: number;

  // Additional styles
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  descriptionCellStyle?: React.CSSProperties;
  quantityCellStyle?: React.CSSProperties;
  unitPriceCellStyle?: React.CSSProperties;
  amountCellStyle?: React.CSSProperties;
}

interface InvoiceItemListProps {
  items: InvoiceItem[];
  currency: string;
  styles?: InvoiceItemListStyles;
  className?: string;
  headerLabels?: {
    description?: string;
    quantity?: string;
    unitPrice?: string;
    amount?: string;
  };
}

export const InvoiceItemList: React.FC<InvoiceItemListProps> = ({
  items,
  currency,
  styles = {},
  className = "",
  headerLabels = {},
}) => {
  const {
    description: descriptionLabel = "Description",
    quantity: quantityLabel = "Qty",
    unitPrice: unitPriceLabel = "Rate",
    amount: amountLabel = "Amount",
  } = headerLabels;
  const {
    // Typography defaults
    headerFontSize = "11px",
    bodyFontSize = "15px",
    fontFamily,
    headerFontWeight = 600,
    bodyFontWeight = "normal",
    amountFontWeight = 800,
    headerTextTransform = "uppercase",
    headerLetterSpacing = "2px",

    // Color defaults
    headerTextColor = "rgba(0, 0, 0, 0.6)",
    headerBgColor = "transparent",
    bodyTextColor = "#000",
    borderColor = "rgba(0, 0, 0, 0.2)",
    amountColor,
    alternatingRowColor,

    // Spacing defaults
    headerPadding = "15px 0",
    bodyPadding = "20px 0",
    borderWidth = "1px",
    borderBottomWidth = "1px",

    // Layout defaults - better distribution favoring Rate/Amount
    columnWidths = {},
    tableLayout,
    borderCollapse = "collapse",
    headerBorderBottom,
    rowBorderBottom,

    // Responsive defaults
    tabletScale = 0.85,
    mobileScale = 0.7,

    // Additional styles
    headerStyle = {},
    bodyStyle = {},
    descriptionCellStyle = {},
    quantityCellStyle = {},
    unitPriceCellStyle = {},
    amountCellStyle = {},
  } = styles;

  // Convert numeric font sizes to strings if needed
  const getFontSize = (size: string | number | undefined): string => {
    if (typeof size === "number") {
      return `${size}px`;
    }
    return size || "inherit";
  };

  const headerFontSizeStr = getFontSize(headerFontSize);
  const bodyFontSizeStr = getFontSize(bodyFontSize);

  // Generate unique class name for this instance to avoid conflicts
  const instanceId = React.useMemo(
    () => Math.random().toString(36).substr(2, 9),
    []
  );
  const containerClass = `invoice-item-list-${instanceId}`;

  // Build responsive CSS
  const responsiveCSS = `
    .${containerClass} {
      container-type: inline-size;
      width: 100%;
    }

    /* Container queries for fine-grained control */
    @container (max-width: 600px) {
      .${containerClass} table {
        font-size: clamp(${
          parseFloat(headerFontSizeStr) * mobileScale
        }px, 2.5cqw, ${headerFontSizeStr}) !important;
      }
      .${containerClass} th {
        padding: calc(${headerPadding} * ${mobileScale}) !important;
        font-size: clamp(${
          parseFloat(headerFontSizeStr) * mobileScale
        }px, 2.5cqw, ${headerFontSizeStr}) !important;
      }
      .${containerClass} td {
        padding: calc(${bodyPadding} * ${mobileScale}) !important;
        font-size: clamp(${
          parseFloat(bodyFontSizeStr) * mobileScale
        }px, 2.5cqw, ${bodyFontSizeStr}) !important;
      }
    }

    @container (max-width: 400px) {
      .${containerClass} th,
      .${containerClass} td {
        font-size: clamp(9px, 2cqw, ${bodyFontSizeStr}) !important;
        padding: 6px 4px !important;
      }
    }

    /* Media queries as fallback */
    @media (max-width: 768px) {
      .${containerClass} table {
        font-size: clamp(${
          parseFloat(headerFontSizeStr) * tabletScale
        }px, 2vw, ${headerFontSizeStr}) !important;
      }
      .${containerClass} th {
        padding: calc(${headerPadding} * ${tabletScale}) !important;
        font-size: clamp(${
          parseFloat(headerFontSizeStr) * tabletScale
        }px, 2vw, ${headerFontSizeStr}) !important;
      }
      .${containerClass} td {
        padding: calc(${bodyPadding} * ${tabletScale}) !important;
        font-size: clamp(${
          parseFloat(bodyFontSizeStr) * tabletScale
        }px, 2vw, ${bodyFontSizeStr}) !important;
      }
    }

    @media (max-width: 480px) {
      .${containerClass} th,
      .${containerClass} td {
        font-size: clamp(9px, 2.5vw, ${bodyFontSizeStr}) !important;
        padding: 6px 4px !important;
      }
    }

    /* Mobile card layout below 435px */
    @container (max-width: 435px) {
      .${containerClass} table {
        border: none !important;
        font-size: ${headerFontSizeStr} !important;
        box-shadow: none !important;
        background: transparent !important;
      }
      
      .${containerClass} thead {
        display: none !important;
      }
      
      .${containerClass} tbody {
        display: block !important;
      }
      
      .${containerClass} tr {
        display: block !important;
        width: 100% !important;
        border-left: 1px solid ${borderColor} !important;
        border-right: 1px solid ${borderColor} !important;
        border-top: 1px solid ${borderColor} !important;
        border-bottom: 1px solid ${borderColor} !important;
        margin-bottom: 0 !important;
        padding: 12px !important;
        border-radius: 0 !important;
        background: ${alternatingRowColor || "#fff"} !important;
        box-shadow: none !important;
      }
      
      .${containerClass} tr:not(:first-child) {
        border-top: 2px solid ${borderColor} !important;
        margin-top: 0 !important;
      }
      
      .${containerClass} tr:last-child {
        margin-bottom: 0 !important;
      }
      
      .${containerClass} td {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 6px 12px !important;
        border-bottom: 1px solid ${borderColor}40 !important;
        text-align: right !important;
        position: relative !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        font-size: ${headerFontSizeStr} !important;
      }
      
      .${containerClass} td * {
        font-size: ${headerFontSizeStr} !important;
      }
      
      .${containerClass} td[data-label]:nth-child(2),
      .${containerClass} td[data-label]:nth-child(3),
      .${containerClass} td[data-label]:nth-child(4) {
        font-size: ${headerFontSizeStr} !important;
      }
      
      .${containerClass} td:last-child {
        border-bottom: 1px solid ${borderColor}40 !important;
        font-weight: ${
          typeof amountFontWeight === "number"
            ? amountFontWeight
            : amountFontWeight
        } !important;
        font-size: ${headerFontSizeStr} !important;
        color: ${bodyTextColor} !important;
        background: transparent !important;
      }
      
      .${containerClass} td:last-child * {
        color: ${bodyTextColor} !important;
      }
      
      .${containerClass} td:before {
        content: attr(data-label) ":" !important;
        position: absolute !important;
        left: 12px !important;
        font-weight: 600 !important;
        color: ${bodyTextColor} !important;
        font-size: ${headerFontSizeStr} !important;
        text-transform: ${headerTextTransform} !important;
      }
      
      .${containerClass} td:last-child:before {
        color: ${bodyTextColor} !important;
      }
      
      .${containerClass} td[data-label]:first-child {
        display: block !important;
        padding-bottom: 10px !important;
        margin-bottom: 6px !important;
        border-bottom: 2px solid ${borderColor} !important;
        padding: 10px 12px !important;
        font-weight: ${
          typeof bodyFontWeight === "number"
            ? bodyFontWeight
            : bodyFontWeight === "bold" || bodyFontWeight === "700"
            ? 700
            : 400
        } !important;
        white-space: normal !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        text-align: left !important;
        font-size: ${bodyFontSizeStr} !important;
        box-shadow: none !important;
        color: ${bodyTextColor} !important;
        visibility: visible !important;
      }
      
      .${containerClass} td[data-label]:first-child * {
        font-size: ${bodyFontSizeStr} !important;
        color: ${bodyTextColor} !important;
        visibility: visible !important;
      }
      
      .${containerClass} td[data-label]:first-child:before {
        display: none !important;
      }
    }
    
    @media (max-width: 435px) {
      .${containerClass} table {
        border: none !important;
        font-size: ${headerFontSizeStr} !important;
        box-shadow: none !important;
        background: transparent !important;
      }
      
      .${containerClass} thead {
        display: none !important;
      }
      
      .${containerClass} tbody {
        display: block !important;
      }
      
      .${containerClass} tr {
        display: block !important;
        width: 100% !important;
        border-left: 1px solid ${borderColor} !important;
        border-right: 1px solid ${borderColor} !important;
        border-top: 1px solid ${borderColor} !important;
        border-bottom: 1px solid ${borderColor} !important;
        margin-bottom: 0 !important;
        padding: 12px !important;
        border-radius: 0 !important;
        background: ${alternatingRowColor || "#fff"} !important;
        box-shadow: none !important;
      }
      
      .${containerClass} tr:not(:first-child) {
        border-top: 2px solid ${borderColor} !important;
        margin-top: 0 !important;
      }
      
      .${containerClass} tr:last-child {
        margin-bottom: 0 !important;
      }
      
      .${containerClass} td {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 6px 12px !important;
        border-bottom: 1px solid ${borderColor}40 !important;
        text-align: right !important;
        position: relative !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        font-size: ${headerFontSizeStr} !important;
      }
      
      .${containerClass} td * {
        font-size: ${headerFontSizeStr} !important;
      }
      
      .${containerClass} td[data-label]:nth-child(2),
      .${containerClass} td[data-label]:nth-child(3),
      .${containerClass} td[data-label]:nth-child(4) {
        font-size: ${headerFontSizeStr} !important;
      }
      
      .${containerClass} td:last-child {
        border-bottom: 1px solid ${borderColor}40 !important;
        font-weight: ${
          typeof amountFontWeight === "number"
            ? amountFontWeight
            : amountFontWeight
        } !important;
        font-size: ${headerFontSizeStr} !important;
        color: ${bodyTextColor} !important;
        background: transparent !important;
      }
      
      .${containerClass} td:last-child * {
        color: ${bodyTextColor} !important;
      }
      
      .${containerClass} td:before {
        content: attr(data-label) ":" !important;
        position: absolute !important;
        left: 12px !important;
        font-weight: 600 !important;
        color: ${bodyTextColor} !important;
        font-size: ${headerFontSizeStr} !important;
        text-transform: ${headerTextTransform} !important;
      }
      
      .${containerClass} td:last-child:before {
        color: ${bodyTextColor} !important;
      }
      
      .${containerClass} td[data-label]:first-child {
        display: block !important;
        padding-bottom: 10px !important;
        margin-bottom: 6px !important;
        border-bottom: 2px solid ${borderColor} !important;
        padding: 10px 12px !important;
        font-weight: ${
          typeof bodyFontWeight === "number"
            ? bodyFontWeight
            : bodyFontWeight === "bold" || bodyFontWeight === "700"
            ? 700
            : 400
        } !important;
        white-space: normal !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        text-align: left !important;
        font-size: ${bodyFontSizeStr} !important;
        box-shadow: none !important;
        color: ${bodyTextColor} !important;
        visibility: visible !important;
      }
      
      .${containerClass} td[data-label]:first-child * {
        font-size: ${bodyFontSizeStr} !important;
        color: ${bodyTextColor} !important;
        visibility: visible !important;
      }
      
      .${containerClass} td[data-label]:first-child:before {
        display: none !important;
      }
    }
  `;

  const defaultHeaderBorderBottom =
    headerBorderBottom || `${borderWidth} solid ${borderColor}`;
  const defaultRowBorderBottom =
    rowBorderBottom || `${borderBottomWidth} solid ${borderColor}`;

  // Determine table layout - use fixed if columnWidths are provided, otherwise auto
  const finalTableLayout =
    tableLayout || (Object.keys(columnWidths).length > 0 ? "fixed" : "auto");

  // Set smart default column widths if none provided and using fixed layout
  const finalColumnWidths =
    Object.keys(columnWidths).length > 0
      ? columnWidths
      : finalTableLayout === "fixed"
      ? {
          description: "40%", // Can shrink when content is short
          quantity: "10%",
          unitPrice: "25%", // More space for currency+value
          amount: "25%", // More space for currency+value
        }
      : {};

  return (
    <>
      <style>{responsiveCSS}</style>
      <div
        className={`${containerClass} ${className}`}
        style={{
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse,
            tableLayout: finalTableLayout,
            fontFamily: fontFamily || "inherit",
            ...(bodyStyle as React.CSSProperties),
          }}
        >
          <thead>
            <tr style={{ borderBottom: defaultHeaderBorderBottom }}>
              <th
                style={{
                  padding: headerPadding,
                  textAlign: "left",
                  fontSize: headerFontSizeStr,
                  fontWeight: headerFontWeight,
                  color: headerTextColor,
                  backgroundColor: headerBgColor,
                  textTransform: headerTextTransform,
                  letterSpacing: headerLetterSpacing,
                  width: finalColumnWidths.description,
                  ...(headerStyle as React.CSSProperties),
                }}
              >
                {descriptionLabel}
              </th>
              <th
                style={{
                  padding: headerPadding,
                  textAlign: "center",
                  fontSize: headerFontSizeStr,
                  fontWeight: headerFontWeight,
                  color: headerTextColor,
                  backgroundColor: headerBgColor,
                  textTransform: headerTextTransform,
                  letterSpacing: headerLetterSpacing,
                  width: finalColumnWidths.quantity,
                  ...(headerStyle as React.CSSProperties),
                }}
              >
                {quantityLabel}
              </th>
              <th
                style={{
                  padding: headerPadding,
                  textAlign: "right",
                  fontSize: headerFontSizeStr,
                  fontWeight: headerFontWeight,
                  color: headerTextColor,
                  backgroundColor: headerBgColor,
                  textTransform: headerTextTransform,
                  letterSpacing: headerLetterSpacing,
                  width: finalColumnWidths.unitPrice,
                  whiteSpace: "nowrap",
                  ...(headerStyle as React.CSSProperties),
                }}
              >
                {unitPriceLabel}
              </th>
              <th
                style={{
                  padding: headerPadding,
                  textAlign: "right",
                  fontSize: headerFontSizeStr,
                  fontWeight: headerFontWeight,
                  color: headerTextColor,
                  backgroundColor: headerBgColor,
                  textTransform: headerTextTransform,
                  letterSpacing: headerLetterSpacing,
                  width: finalColumnWidths.amount,
                  whiteSpace: "nowrap",
                  ...(headerStyle as React.CSSProperties),
                }}
              >
                {amountLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id || index}
                style={{
                  backgroundColor:
                    alternatingRowColor && index % 2 === 0
                      ? alternatingRowColor
                      : "transparent",
                }}
              >
                <td
                  data-label={descriptionLabel}
                  style={{
                    padding: bodyPadding,
                    borderBottom: defaultRowBorderBottom,
                    fontSize: bodyFontSizeStr,
                    fontWeight: bodyFontWeight,
                    color: bodyTextColor,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: finalTableLayout === "fixed" ? 0 : "auto",
                    ...(descriptionCellStyle as React.CSSProperties),
                    ...(bodyStyle as React.CSSProperties),
                  }}
                >
                  {item.description}
                </td>
                <td
                  data-label={quantityLabel}
                  style={{
                    padding: bodyPadding,
                    borderBottom: defaultRowBorderBottom,
                    textAlign: "center",
                    fontSize: bodyFontSizeStr,
                    fontWeight: bodyFontWeight,
                    color: bodyTextColor,
                    ...(quantityCellStyle as React.CSSProperties),
                    ...(bodyStyle as React.CSSProperties),
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  data-label={unitPriceLabel}
                  style={{
                    padding: bodyPadding,
                    borderBottom: defaultRowBorderBottom,
                    fontSize: bodyFontSizeStr,
                    fontWeight: bodyFontWeight,
                    color: bodyTextColor,
                    whiteSpace: "nowrap",
                    ...(unitPriceCellStyle as React.CSSProperties),
                    ...(bodyStyle as React.CSSProperties),
                    // Ensure right alignment is always applied (after custom styles)
                    textAlign: "right",
                  }}
                >
                  {formatCurrencyWithCode(item.unit_price, currency)}
                </td>
                <td
                  data-label={amountLabel}
                  style={{
                    padding: bodyPadding,
                    borderBottom: defaultRowBorderBottom,
                    fontSize: bodyFontSizeStr,
                    fontWeight: amountFontWeight,
                    color: amountColor || bodyTextColor,
                    whiteSpace: "nowrap",
                    ...(amountCellStyle as React.CSSProperties),
                    ...(bodyStyle as React.CSSProperties),
                    // Ensure right alignment is always applied (after custom styles)
                    textAlign: "right",
                  }}
                >
                  {formatCurrencyWithCode(item.amount, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
