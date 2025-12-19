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
import { InvoiceContainer, AddressSection } from "./design-system";
import {
  createTemplateStyles,
  generateContainerQueryCSS,
} from "./design-system";
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

const ColorPopMinimalTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("color-pop-minimal-template", {
    padding: true,
  });

  // Add container query for totals wrapping
  const containerCSS = generateContainerQueryCSS(
    "totals-container",
    "totalsWrap",
    `
      .payment-info-wrapper {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        width: 100% !important;
        text-align: left !important;
      }
      .totals-section {
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        width: 100% !important;
      }
    `
  );

  // Format addresses
  const companyAddress = (
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
        className="color-pop-minimal-template"
        maxWidth={794}
        padding={{ desktop: 50, tablet: 30, mobile: 20 }}
        background={colors.white}
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      >
        {/* Minimal Header with Color Bar */}
        <div
          style={{
            ...flexContainer("row", "flex-start", "stretch"),
            marginBottom: spacing["5xl"],
          }}
        >
          <div
            style={{
              width: spacing.sm,
              background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 33%, ${colors.tertiary} 66%, ${colors.quad} 100%)`,
              marginRight: spacing["2xl"],
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                ...flexContainer("row", "space-between", "flex-start"),
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 900,
                    color: colors.black,
                    letterSpacing: "-2px",
                    lineHeight: 1,
                  }}
                >
                  Invoice
                </div>
                <div
                  style={{
                    fontSize: spacing["4xl"],
                    fontWeight: 300,
                    color: colors.black + "50",
                    marginTop: "5px",
                  }}
                >
                  #{invoice.invoice_number}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: spacing.md,
                    color: colors.black + "60",
                    marginBottom: spacing.xs,
                  }}
                >
                  Issue Date
                </div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 700,
                    marginBottom: spacing.lg,
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
                <div
                  style={{
                    fontSize: spacing.md,
                    color: colors.black + "60",
                    marginBottom: spacing.xs,
                  }}
                >
                  Due Date
                </div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 700,
                    color: colors.primary,
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Address Section */}
        <AddressSection
          className="address-section"
          from={{
            label: "From",
            name: getCompanyInfo(profile, "company_name"),
            address: companyAddress,
          }}
          billTo={{
            label: "Bill To",
            name: client.name,
            address: clientAddress,
          }}
          layout="flex"
          style={{
            gap: spacing["5xl"],
            marginBottom: spacing["4xl"],
            paddingBottom: spacing["4xl"],
            borderBottom: "3px solid " + colors.black,
            flexWrap: "wrap",
          }}
          labelStyle={{
            fontSize: spacing.base,
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontWeight: 700,
            marginBottom: spacing.lg,
          }}
          nameStyle={{
            fontSize: spacing["3xl"],
            fontWeight: 800,
            marginBottom: spacing.md,
          }}
          addressStyle={{
            fontSize: spacing.lg,
            lineHeight: 1.8,
            color: colors.black + "80",
          }}
        />

        {/* Items Table */}
        <div style={{ marginBottom: spacing["3xl"] }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: spacing.base,
              bodyFontSize: spacing.xl,
              headerPadding: `${spacing.lg}px 0`,
              bodyPadding: `${spacing.lg}px 0`,
              headerTextColor: colors.black + "60",
              bodyTextColor: colors.black,
              borderColor: colors.black + "20",
              headerBorderBottom: "3px solid " + colors.black,
              rowBorderBottom: "1px solid " + colors.black + "20",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 800,
              quantityCellStyle: { fontWeight: 700 },
              bodyStyle: { marginBottom: 0 },
            }}
          />
        </div>

        {/* Totals */}
        <div
          className="totals-container"
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: `${spacing.lg}px`,
            containerType: "inline-size",
          }}
        >
          <div
            className="totals-section"
            style={{ width: "260px", flex: "0 0 auto", minWidth: 0 }}
          >
            <div
              style={{
                ...flexContainer("row", "space-between", "center", spacing.md),
                padding: `${spacing.md}px ${spacing.lg}px`,
                borderBottom: "1px solid " + colors.black + "15",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{ color: colors.black + "60", ...getCurrencyStyle() }}
              >
                Subtotal
              </span>
              <span style={{ fontWeight: 600, ...getCurrencyStyle() }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                ...flexContainer("row", "space-between", "center", spacing.md),
                padding: `${spacing.md}px ${spacing.lg}px`,
                borderBottom: "1px solid " + colors.black + "15",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{ color: colors.black + "60", ...getCurrencyStyle() }}
              >
                Tax
              </span>
              <span style={{ fontWeight: 600, ...getCurrencyStyle() }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                ...flexContainer("row", "space-between", "center", spacing.md),
                padding: spacing.lg,
                marginTop: spacing.md,
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                marginLeft: `-${spacing.lg}px`,
                marginRight: `-${spacing.lg}px`,
                paddingLeft: spacing.lg,
                paddingRight: spacing.lg,
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontSize: spacing.lg,
                  fontWeight: 900,
                  color: colors.white,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  ...getCurrencyStyle(),
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: spacing["4xl"],
                  fontWeight: 900,
                  color: colors.white,
                  ...getCurrencyStyle(),
                }}
              >
                {formatCurrencyWithCode(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
          <div
            style={{
              padding: spacing["2xl"],
              background: colors.quad + "20",
              borderLeft: "4px solid " + colors.quad,
              flex: "0 1 320px",
              minWidth: "200px",
            }}
            className="payment-info-wrapper"
          >
            <div
              style={{
                fontSize: spacing.base,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: colors.black + "60",
                marginBottom: spacing.md,
              }}
            >
              Payment Information
            </div>
            <div
              style={{
                fontSize: spacing.md,
                lineHeight: 1.8,
                color: colors.black + "80",
              }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div
            style={{
              marginTop: spacing["3xl"],
              paddingTop: spacing["2xl"],
              borderTop: "1px dashed " + colors.black + "30",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: colors.tertiary,
                color: colors.black,
                padding: `${spacing.xs}px ${spacing.md}px`,
                fontSize: spacing.sm,
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 700,
                marginBottom: spacing.md,
              }}
            >
              Notes
            </div>
            <div
              style={{
                fontSize: spacing.lg,
                lineHeight: 1.8,
                color: colors.black + "70",
              }}
            >
              {invoice.notes}
            </div>
          </div>
        )}
      </InvoiceContainer>
    </>
  );
};

export const ColorPopMinimalTemplate = {
  id: "color-pop-minimal" as const,
  name: "Color Pop Minimal",
  description: "Clean minimal layout with bold color accents",
  Component: ColorPopMinimalTemplateComponent,
};
