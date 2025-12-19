import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatCompanyAddress,
  formatClientAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceContainer, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, gridContainer, flexContainer } from "./design-system";

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopGridTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("color-pop-grid-template", {
    padding: true,
    layout: "grid",
  });

  // Format company details
  const companyDetails = (
    <>
      {formatCompanyAddress(profile)
        .split("\n")
        .map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      {getCompanyInfo(profile, "email")}
      <br />
      {getCompanyInfo(profile, "phone")}
    </>
  );

  // Format client address
  const clientAddress = (
    <>
      {formatClientAddress(client)
        .split("\n")
        .map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      {client.email}
    </>
  );

  return (
    <>
      <style>{templateCSS}</style>
      <style>{`
        /* Prevent currency values from breaking across lines, but allow text to shrink */
        .color-pop-grid-template .rate-cell,
        .color-pop-grid-template .amount-cell {
          white-space: nowrap !important;
        }
      `}</style>
      <InvoiceContainer
        className="color-pop-grid-template"
        maxWidth={794}
        padding={{ desktop: 0, tablet: 0, mobile: 0 }}
        background={colors.white}
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          border: "5px solid " + colors.black,
        }}
      >
        {/* Top Grid Header */}
        <div
          className="color-pop-grid-header"
          style={{
            ...gridContainer("1fr 1fr 1fr 1fr", 0),
            borderBottom: "5px solid " + colors.black,
          }}
        >
          <div
            style={{
              background: colors.primary,
              padding: `${spacing["3xl"]}px ${spacing["2xl"]}px`,
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: spacing.lg,
                color: colors.white,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
              }}
            >
              Invoice
            </div>
            <div
              style={{
                fontSize: "36px",
                color: colors.white,
                fontWeight: 900,
                marginTop: spacing.sm,
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            style={{
              background: colors.secondary,
              padding: `${spacing["3xl"]}px ${spacing["2xl"]}px`,
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: spacing.sm,
              }}
            >
              Issue Date
            </div>
            <div style={{ fontSize: spacing.lg, fontWeight: 900 }}>
              {formatDate(invoice.issue_date)}
            </div>
          </div>
          <div
            style={{
              background: colors.tertiary,
              padding: `${spacing["3xl"]}px ${spacing["2xl"]}px`,
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: spacing.sm,
              }}
            >
              Due Date
            </div>
            <div style={{ fontSize: spacing.lg, fontWeight: 900 }}>
              {formatDate(invoice.due_date)}
            </div>
          </div>
          <div
            style={{
              background: colors.quad,
              padding: `${spacing["3xl"]}px ${spacing["2xl"]}px`,
            }}
          >
            <div
              style={{
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: spacing.sm,
              }}
            >
              Total Due
            </div>
            <div style={{ fontSize: spacing.lg, fontWeight: 900 }}>
              {formatCurrencyWithCode(invoice.total, invoice.currency)}
            </div>
          </div>
        </div>

        {/* Two Column Info */}
        <div
          className="color-pop-grid-info"
          style={{
            ...gridContainer("1fr 1fr", 0),
            borderBottom: "5px solid " + colors.black,
          }}
        >
          <div
            style={{
              padding: spacing["2xl"],
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                background: colors.black,
                color: colors.white,
                padding: "8px 14px",
                display: "inline-block",
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
                marginBottom: spacing.lg,
              }}
            >
              From
            </div>
            <div
              style={{
                fontSize: spacing["3xl"],
                fontWeight: 900,
                marginBottom: spacing.md,
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: spacing.md,
                lineHeight: 1.8,
                color: colors.black,
              }}
            >
              {companyDetails}
            </div>
          </div>
          <div
            style={{
              padding: spacing["2xl"],
              background: colors.secondary + "15",
            }}
          >
            <div
              style={{
                background: colors.primary,
                color: colors.white,
                padding: "8px 14px",
                display: "inline-block",
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
                marginBottom: spacing.lg,
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontSize: spacing["3xl"],
                fontWeight: 900,
                marginBottom: spacing.md,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontSize: spacing.md,
                lineHeight: 1.8,
                color: colors.black,
              }}
            >
              {clientAddress}
            </div>
          </div>
        </div>

        {/* Items Header */}
        <div
          className="items-header"
          style={{
            ...gridContainer("2fr 0.5fr 1fr 1fr", 0),
            background: colors.black,
            color: colors.white,
          }}
        >
          <div
            className="header-description"
            style={{
              padding: "14px 20px",
              fontSize: spacing.base,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              borderRight: "3px solid " + colors.white + "30",
              color: colors.white,
            }}
          >
            Description
          </div>
          <div
            className="header-qty"
            style={{
              padding: "14px 8px",
              fontSize: spacing.base,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "center",
              borderRight: "3px solid " + colors.white + "30",
              color: colors.white,
            }}
          >
            Qty
          </div>
          <div
            className="header-rate rate-cell"
            style={{
              padding: "14px 8px",
              fontSize: spacing.base,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "right",
              borderRight: "3px solid " + colors.white + "30",
              color: colors.white,
            }}
          >
            Rate
          </div>
          <div
            className="header-amount amount-cell"
            style={{
              padding: "14px 8px",
              fontSize: spacing.base,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "right",
              color: colors.white,
            }}
          >
            Amount
          </div>
        </div>

        {/* Items */}
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="item-row"
            style={{
              ...gridContainer("2fr 0.5fr 1fr 1fr", 0),
              borderBottom: "3px solid " + colors.black,
            }}
          >
            <div
              className="description-cell"
              style={{
                padding: `${spacing.base}px ${spacing.lg}px`,
                background: colors.white,
                fontWeight: 700,
                borderRight: "3px solid " + colors.black,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {item.description}
            </div>
            <div
              className="quantity-cell"
              style={{
                padding: `${spacing.base}px 8px`,
                background: [colors.secondary, colors.tertiary, colors.quad][
                  index % 3
                ],
                textAlign: "center",
                fontWeight: 900,
                borderRight: "3px solid " + colors.black,
                minWidth: 0,
              }}
            >
              {item.quantity}
            </div>
            <div
              className="rate-cell"
              style={{
                padding: `${spacing.base}px 8px`,
                background: colors.white,
                textAlign: "right",
                fontWeight: 700,
                borderRight: "3px solid " + colors.black,
                whiteSpace: "nowrap",
                fontSize: spacing.md,
                minWidth: 0,
              }}
            >
              {formatCurrencyWithCode(item.unit_price, invoice.currency)}
            </div>
            <div
              className="amount-cell"
              style={{
                padding: `${spacing.base}px 8px`,
                background: colors.primary,
                color: colors.white,
                textAlign: "right",
                fontWeight: 900,
                whiteSpace: "nowrap",
                fontSize: spacing.md,
                minWidth: 0,
              }}
            >
              {formatCurrencyWithCode(item.amount, invoice.currency)}
            </div>
          </div>
        ))}

        {/* Totals Grid */}
        <div
          className="color-pop-grid-totals"
          style={{
            ...gridContainer("2fr 2fr 1fr", 0),
            borderTop: "5px solid " + colors.black,
          }}
        >
          <div
            className="payment-info-section"
            style={{
              padding: spacing["2xl"],
              borderRight: "5px solid " + colors.black,
              background: colors.secondary,
            }}
          >
            <Section
              title="Payment Info"
              titleStyle={{
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: spacing.md,
                color: colors.black,
              }}
              contentStyle={{
                fontSize: spacing.md,
                lineHeight: 1.7,
                color: colors.black,
              }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </Section>
          </div>
          <div
            className="subtotal-section"
            style={{
              borderRight: "5px solid " + colors.black,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                ...flexContainer("row", "space-between", "center"),
                padding: `${spacing.xl}px ${spacing.lg}px`,
                borderBottom: "2px solid " + colors.black,
                gap: spacing.md,
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: spacing.md,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                ...flexContainer("row", "space-between", "center"),
                padding: `${spacing.xl}px ${spacing.lg}px`,
                gap: spacing.md,
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: spacing.md,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Tax
              </span>
              <span
                style={{
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
          </div>
          <div
            className="total-section"
            style={{
              background: colors.primary,
              padding: spacing["2xl"],
              ...flexContainer("column", "center", "center"),
            }}
          >
            <div
              style={{
                fontSize: spacing.sm,
                color: colors.white,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: spacing.sm,
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: colors.white,
              }}
            >
              {formatCurrencyWithCode(invoice.total, invoice.currency)}
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div
            style={{
              padding: spacing.lg,
              borderTop: "5px solid " + colors.black,
              background: colors.tertiary + "30",
            }}
          >
            <div
              style={{
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: spacing.sm,
              }}
            >
              Notes
            </div>
            <div style={{ fontSize: spacing.md, lineHeight: 1.7 }}>
              {invoice.notes}
            </div>
          </div>
        )}
      </InvoiceContainer>
    </>
  );
};

export const ColorPopGridTemplate = {
  id: "color-pop-grid" as const,
  name: "Color Pop Grid",
  description: "Grid-based brutalist layout with color blocks",
  Component: ColorPopGridTemplateComponent,
};
