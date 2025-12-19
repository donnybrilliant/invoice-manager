import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import { getCompanyInfo, formatClientAddress } from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";
import { InvoiceContainer, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopBrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("color-pop-brutalist-template", {
    padding: true,
    table: true,
    layout: "flex",
  });

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
      <InvoiceContainer
        className="color-pop-brutalist-template"
        maxWidth={794}
        padding={{ desktop: 0, tablet: 0, mobile: 0 }}
        background={colors.white}
        style={{
          fontFamily: "'Arial Black', Helvetica, sans-serif",
          border: "6px solid " + colors.black,
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            background: colors.primary,
            padding: `${spacing["2xl"]}px ${spacing["3xl"]}px`,
            borderBottom: "6px solid " + colors.black,
          }}
        >
          <div
            className="color-pop-brutalist-header"
            style={{
              ...flexContainer("row", "space-between", "center"),
              flexWrap: "wrap",
              containerType: "inline-size",
            }}
          >
            <div
              className="invoice-header-text"
              style={{
                fontSize: "clamp(32px, 7vw, 56px)",
                fontWeight: 900,
                color: colors.white,
                textShadow: "4px 4px 0 " + colors.black,
                letterSpacing: "-2px",
              }}
            >
              INVOICE
            </div>
            <div
              className="color-pop-brutalist-invoice-number"
              style={{
                background: colors.secondary,
                border: "4px solid " + colors.black,
                padding: `${spacing.md}px ${spacing["4xl"]}px`,
                boxShadow: "6px 6px 0 " + colors.black,
                whiteSpace: "nowrap",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: spacing.md,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Invoice No.
              </div>
              <div
                className="invoice-number-value"
                style={{
                  fontSize: "clamp(14px, 3vw, 24px)",
                  fontWeight: 900,
                  wordBreak: "break-all",
                }}
              >
                #{invoice.invoice_number}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Strip */}
        <div
          style={{
            background: colors.tertiary,
            padding: `${spacing.xl}px ${spacing["3xl"]}px`,
            borderBottom: "4px solid " + colors.black,
          }}
        >
          <div
            style={{
              ...flexContainer("row", "space-between", "center"),
              flexWrap: "wrap",
              gap: spacing.md,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: spacing["3xl"] }}>
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: spacing.md,
                fontWeight: 700,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {getCompanyInfo(profile, "email")} •{" "}
              {getCompanyInfo(profile, "phone")}
            </div>
          </div>
        </div>

        <div
          style={{ padding: spacing["3xl"] }}
          className="color-pop-brutalist-content"
        >
          {/* Info Cards Row */}
          <div
            className="color-pop-brutalist-info-cards"
            style={{
              ...flexContainer("row", "flex-start", "stretch", spacing.lg),
              marginBottom: spacing["3xl"],
            }}
          >
            {/* Bill To */}
            <div
              style={{
                flex: 1,
                background: colors.quad,
                border: "4px solid " + colors.black,
                boxShadow: "8px 8px 0 " + colors.black,
              }}
            >
              <div
                style={{
                  background: colors.black,
                  color: colors.white,
                  padding: `${spacing.md}px ${spacing.base}px`,
                  fontSize: spacing.md,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                → Bill To
              </div>
              <div style={{ padding: spacing.lg }}>
                <div
                  style={{
                    fontSize: spacing.lg,
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
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {clientAddress}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div
              style={{
                width: "200px",
                ...flexContainer("column", "flex-start", "stretch", spacing.md),
              }}
            >
              <div
                style={{
                  background: colors.secondary,
                  border: "4px solid " + colors.black,
                  padding: spacing.xl,
                  boxShadow: "4px 4px 0 " + colors.black,
                }}
              >
                <div
                  style={{
                    fontSize: spacing.sm,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Issued
                </div>
                <div
                  style={{
                    fontSize: spacing["3xl"],
                    fontWeight: 900,
                    marginTop: spacing.xs,
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div
                style={{
                  background: colors.primary,
                  color: colors.white,
                  border: "4px solid " + colors.black,
                  padding: spacing.xl,
                  boxShadow: "4px 4px 0 " + colors.black,
                }}
              >
                <div
                  style={{
                    fontSize: spacing.sm,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Due Date
                </div>
                <div
                  style={{
                    fontSize: spacing["3xl"],
                    fontWeight: 900,
                    marginTop: spacing.xs,
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div
            style={{
              border: "4px solid " + colors.black,
              boxShadow: "8px 8px 0 " + colors.black,
              marginBottom: spacing["3xl"],
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <InvoiceItemList
              items={items}
              currency={invoice.currency}
              styles={{
                headerFontSize: `${spacing.md}px`,
                bodyFontSize: `${spacing.lg}px`,
                headerPadding: `${spacing["3xl"]}px`,
                bodyPadding: `${spacing.base}px`,
                headerTextColor: colors.black,
                headerBgColor: colors.tertiary,
                bodyTextColor: colors.black,
                borderColor: colors.black,
                headerBorderBottom: "none",
                rowBorderBottom: "none",
                headerFontWeight: "normal",
                headerTextTransform: "uppercase",
                headerLetterSpacing: "3px",
                bodyFontWeight: 900,
                amountFontWeight: 900,
                amountColor: colors.white,
                fontFamily: "'Arial Black', sans-serif",
                alternatingRowColor: colors.secondary,
                descriptionCellStyle: {
                  border: "4px solid " + colors.black,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: 0,
                },
                quantityCellStyle: {
                  border: "4px solid " + colors.black,
                  fontSize: spacing.base,
                },
                unitPriceCellStyle: {
                  border: "4px solid " + colors.black,
                },
                amountCellStyle: {
                  border: "4px solid " + colors.black,
                  background: colors.primary,
                  fontSize: spacing.xl,
                },
                headerStyle: {
                  border: "4px solid " + colors.black,
                },
                bodyStyle: {
                  marginBottom: 0,
                },
              }}
            />
          </div>

          {/* Totals */}
          <div
            style={{
              ...flexContainer("row", "flex-end", "flex-start"),
              marginBottom: spacing["3xl"],
            }}
          >
            <div
              style={{
                width: "340px",
                border: "4px solid " + colors.black,
                boxShadow: "8px 8px 0 " + colors.tertiary,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.xl}px ${spacing.lg}px`,
                  borderBottom: "3px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: spacing.lg,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: spacing.base,
                    ...getCurrencyStyle(),
                  }}
                >
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.xl}px ${spacing.lg}px`,
                  borderBottom: "3px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: spacing.lg,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Tax
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: spacing.base,
                    ...getCurrencyStyle(),
                  }}
                >
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: spacing.lg,
                  background: colors.primary,
                  color: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: spacing["3xl"],
                    textTransform: "uppercase",
                    fontWeight: 900,
                    letterSpacing: "2px",
                    color: colors.white,
                  }}
                >
                  Total
                </span>
                <span
                  className="total-amount-value"
                  style={{
                    fontSize: "clamp(18px, 4vw, 32px)",
                    fontWeight: 900,
                    color: colors.white,
                    ...getCurrencyStyle(),
                  }}
                >
                  {formatCurrencyWithCode(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <Section
            title="Payment Information"
            style={{
              background: colors.quad,
              border: "4px solid " + colors.black,
              boxShadow: "6px 6px 0 " + colors.black,
            }}
            titleStyle={{
              background: colors.black,
              color: colors.white,
              padding: `${spacing.md}px ${spacing.base}px`,
              fontSize: spacing.md,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: 0,
            }}
            contentStyle={{
              padding: spacing.lg,
              fontSize: spacing.md,
              lineHeight: 1.8,
              fontFamily: "Arial, sans-serif",
            }}
          >
            <PaymentInformation profile={profile} invoice={invoice} />
          </Section>

          {invoice.notes && (
            <Section
              title="Notes"
              style={{
                marginTop: spacing.lg,
                background: colors.secondary,
                border: "4px dashed " + colors.black,
                padding: spacing.lg,
              }}
              titleStyle={{
                fontSize: spacing.md,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: spacing.md,
              }}
              contentStyle={{
                fontSize: spacing.md,
                lineHeight: 1.8,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {invoice.notes}
            </Section>
          )}
        </div>
      </InvoiceContainer>
    </>
  );
};

export const ColorPopBrutalistTemplate = {
  id: "color-pop-brutalist" as const,
  name: "Color Pop Brutalist",
  description: "Vibrant multi-color brutalist with bold primary accents",
  Component: ColorPopBrutalistTemplateComponent,
};
