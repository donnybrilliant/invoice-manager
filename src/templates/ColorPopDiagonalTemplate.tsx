import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatCompanyAddress,
  formatClientAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";
import { InvoiceContainer, Section } from "./design-system";
import {
  createTemplateStyles,
  generateContainerQueryCSS,
} from "./design-system";
import { spacing, flexContainer } from "./design-system";

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopDiagonalTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("color-pop-diagonal-template", {
    padding: true,
    table: true,
  });

  const containerCSS = generateContainerQueryCSS(
    "totals-container",
    "totalsWrap",
    `
      .totals-container .payment-info-wrapper {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        width: 100% !important;
        text-align: left !important;
        border-right: none !important;
        border-top: 4px solid hsl(0, 0%, 0%) !important;
      }
      .totals-container .totals-wrapper {
        width: 100% !important;
        flex: 1 1 100% !important;
      }
    `
  );

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
      <style>{containerCSS}</style>
      <InvoiceContainer
        className="color-pop-diagonal-template"
        maxWidth={794}
        padding={{ desktop: 0, tablet: 0, mobile: 0 }}
        background={colors.white}
        style={{
          fontFamily: "'Arial Black', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Diagonal stripe background */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-100px",
            width: "300px",
            height: "200px",
            background: colors.secondary,
            transform: "rotate(15deg)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "-150px",
            width: "400px",
            height: "80px",
            background: colors.tertiary,
            transform: "rotate(15deg)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            border: "6px solid " + colors.black,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: spacing["3xl"],
              background: colors.primary,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${colors.black}10 10px, ${colors.black}10 20px)`,
              }}
            />
            <div
              style={{
                position: "relative",
                ...flexContainer("row", "space-between", "flex-start"),
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: spacing.md,
                    color: colors.white,
                    textTransform: "uppercase",
                    letterSpacing: "5px",
                    marginBottom: spacing.sm,
                  }}
                >
                  Invoice
                </div>
                <div
                  style={{
                    fontSize: "64px",
                    color: colors.white,
                    fontWeight: 900,
                    lineHeight: 1,
                    textShadow: "5px 5px 0 " + colors.black,
                  }}
                >
                  #{invoice.invoice_number}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    background: colors.black,
                    color: colors.white,
                    padding: `${spacing.lg}px ${spacing["2xl"]}px`,
                    transform: "rotate(3deg)",
                    boxShadow: "6px 6px 0 " + colors.secondary,
                  }}
                >
                  <div
                    style={{
                      fontSize: spacing.sm,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: spacing.xs,
                      color: colors.white,
                    }}
                  >
                    Amount Due
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: colors.white,
                    }}
                  >
                    {formatCurrencyWithCode(invoice.total, invoice.currency)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Strip */}
          <div
            style={{
              ...flexContainer("row", "flex-start", "stretch"),
              borderBottom: "6px solid " + colors.black,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: `${spacing.xl}px ${spacing["2xl"]}px`,
                background: colors.tertiary,
                borderRight: "4px solid " + colors.black,
              }}
            >
              <span
                style={{
                  fontSize: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginRight: spacing.md,
                }}
              >
                Issued:
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatDate(invoice.issue_date)}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                padding: `${spacing.xl}px ${spacing["2xl"]}px`,
                background: colors.quad,
                borderRight: "4px solid " + colors.black,
              }}
            >
              <span
                style={{
                  fontSize: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginRight: spacing.md,
                }}
              >
                Due:
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatDate(invoice.due_date)}
              </span>
            </div>
            <div
              style={{
                flex: 1.5,
                padding: `${spacing.xl}px ${spacing["2xl"]}px`,
                background: colors.secondary,
              }}
            >
              <span style={{ fontWeight: 900 }}>
                {getCompanyInfo(profile, "company_name")}
              </span>
            </div>
          </div>

          {/* Addresses */}
          <div
            style={{
              ...flexContainer("row", "flex-start", "stretch"),
              borderBottom: "6px solid " + colors.black,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: spacing["2xl"],
                borderRight: "4px solid " + colors.black,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: colors.tertiary,
                  padding: "6px 12px",
                  fontSize: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: 900,
                  marginBottom: spacing.lg,
                  transform: "rotate(-2deg)",
                }}
              >
                From
              </div>
              <div
                style={{
                  fontSize: spacing.base,
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
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {companyDetails}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: spacing["2xl"],
                background: `linear-gradient(135deg, ${colors.quad}20 0%, ${colors.white} 100%)`,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: colors.primary,
                  color: colors.white,
                  padding: "6px 12px",
                  fontSize: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: 900,
                  marginBottom: spacing.lg,
                  transform: "rotate(-2deg)",
                }}
              >
                Bill To
              </div>
              <div
                style={{
                  fontSize: spacing.base,
                  fontWeight: 900,
                  marginBottom: spacing.md,
                }}
              >
                {client.name}
              </div>
              <div
                style={{
                  fontSize: spacing.md,
                  lineHeight: 1.8,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {clientAddress}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: spacing.base,
              bodyFontSize: spacing.lg,
              headerPadding: `${spacing.base}px ${spacing.lg}px`,
              bodyPadding: `${spacing["3xl"]}px ${spacing.lg}px`,
              headerTextColor: colors.white,
              headerBgColor: colors.black,
              bodyTextColor: colors.black,
              borderColor: colors.black,
              headerBorderBottom: "none",
              rowBorderBottom: "2px solid " + colors.black,
              headerFontWeight: "normal",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: 600,
              amountFontWeight: 900,
              alternatingRowColor: colors.quad + "20",
              quantityCellStyle: { fontWeight: 800 },
              bodyStyle: { marginBottom: 0 },
            }}
          />

          {/* Totals */}
          <div
            className="totals-container"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "0",
              borderTop: "4px solid " + colors.black,
              containerType: "inline-size",
            }}
          >
            <div
              className="totals-wrapper"
              style={{ flex: "1 1 280px", minWidth: "280px" }}
            >
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.xl}px ${spacing["2xl"]}px`,
                  borderBottom: "2px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: spacing.md,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Subtotal
                </span>
                <span style={{ fontWeight: 800 }}>
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.xl}px ${spacing["2xl"]}px`,
                  borderBottom: "4px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: spacing.md,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Tax
                </span>
                <span style={{ fontWeight: 800 }}>
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: spacing["2xl"],
                  background: colors.primary,
                  color: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: spacing.lg,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 900,
                  }}
                >
                  Total
                </span>
                <span style={{ fontSize: "26px", fontWeight: 900 }}>
                  {formatCurrencyWithCode(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
            <div
              style={{
                padding: spacing["2xl"],
                background: colors.secondary + "30",
                borderRight: "4px solid " + colors.black,
                flex: "0 1 320px",
                minWidth: "200px",
              }}
              className="payment-info-wrapper"
            >
              <Section
                title="Payment Details"
                titleStyle={{
                  fontSize: spacing.sm,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 900,
                  marginBottom: spacing.md,
                }}
                contentStyle={{
                  fontSize: spacing.md,
                  lineHeight: 1.7,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <PaymentInformation profile={profile} invoice={invoice} />
              </Section>
            </div>
          </div>

          {invoice.notes && (
            <div
              style={{
                padding: spacing["2xl"],
                borderTop: "4px solid " + colors.black,
                background: colors.tertiary + "20",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: spacing.lg,
                  left: spacing.lg,
                  fontSize: "60px",
                  color: colors.tertiary + "40",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                "
              </div>
              <div
                style={{
                  fontSize: spacing.base,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 900,
                  marginBottom: spacing.md,
                }}
              >
                Notes
              </div>
              <div
                style={{
                  fontSize: spacing.md,
                  lineHeight: 1.7,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {invoice.notes}
              </div>
            </div>
          )}
        </div>
      </InvoiceContainer>
    </>
  );
};

export const ColorPopDiagonalTemplate = {
  id: "color-pop-diagonal" as const,
  name: "Color Pop Diagonal",
  description: "Dynamic diagonal stripes with color accents",
  Component: ColorPopDiagonalTemplateComponent,
};
