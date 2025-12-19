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
import {
  InvoiceContainer,
  InvoiceHeader,
  TotalsSection,
  Section,
} from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, gridContainer, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const DarkModeTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("darkmode-template", {
    padding: true,
    table: true,
    layout: "flex",
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
        /* Ensure all text in dark mode template maintains proper contrast */
        .darkmode-template * {
          color: inherit;
        }
        .darkmode-template strong {
          color: inherit;
          font-weight: 600;
        }
      `}</style>
      <InvoiceContainer
        className="darkmode-template"
        maxWidth={794}
        padding={{ desktop: 50, tablet: 25, mobile: 15 }}
        background="linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)"
        style={{
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#fff",
          borderRadius: "12px",
        }}
      >
        {/* Header */}
        <InvoiceHeader
          className="darkmode-header"
          logo={
            profile?.logo_url
              ? {
                  url: profile.logo_url,
                  alt: "Logo",
                  maxWidth: 140,
                  maxHeight: 70,
                }
              : undefined
          }
          title="Invoice"
          invoiceNumber={invoice.invoice_number}
          companyInfo={{
            name: getCompanyInfo(profile, "company_name"),
            details: companyDetails,
          }}
          layout="side-by-side"
          style={{
            marginBottom: spacing["4xl"],
            paddingBottom: spacing["2xl"],
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
          titleStyle={{
            fontSize: "48px",
            fontWeight: 200,
            color: "#fff",
            letterSpacing: "-1px",
            marginBottom: spacing.sm,
          }}
          invoiceNumberStyle={{
            fontSize: spacing.lg,
            color: "#00FFB2",
            fontFamily: "'SF Mono', monospace",
          }}
          companyInfoStyle={{
            textAlign: "right",
            padding: spacing["2xl"],
            background: "rgba(255,255,255,0.03)",
            borderRadius: spacing.sm,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        {/* Info Grid */}
        <div
          className="darkmode-info-grid"
          style={{
            ...gridContainer("1fr 1fr", spacing["2xl"]),
            marginBottom: spacing["4xl"],
          }}
        >
          <div
            style={{
              padding: spacing["2xl"],
              background: "rgba(0,255,178,0.05)",
              borderRadius: spacing.sm,
              border: "1px solid rgba(0,255,178,0.2)",
              maxWidth: "300px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: spacing.base,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#00FFB2",
                marginBottom: spacing.lg,
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontSize: spacing["3xl"],
                fontWeight: 600,
                color: "#fff",
                marginBottom: spacing.md,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontSize: spacing.md,
                color: "#D0D0D0",
                lineHeight: 1.8,
              }}
            >
              {clientAddress}
            </div>
          </div>
          <div
            style={{
              padding: spacing["2xl"],
              background: "rgba(255,255,255,0.03)",
              borderRadius: spacing.sm,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                ...gridContainer("1fr 1fr", spacing["2xl"]),
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#D0D0D0",
                    marginBottom: spacing.sm,
                  }}
                >
                  Issued
                </div>
                <div style={{ fontSize: spacing.xl, color: "#E0E0E0" }}>
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#D0D0D0",
                    marginBottom: spacing.sm,
                  }}
                >
                  Due
                </div>
                <div style={{ fontSize: spacing.xl, color: "#FF6B6B" }}>
                  {formatDate(invoice.due_date)}
                </div>
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <div
                    style={{
                      fontSize: spacing.base,
                      color: "#D0D0D0",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: spacing.xs,
                    }}
                  >
                    Sent Date
                  </div>
                  <div style={{ fontSize: spacing.xl, color: "#60A5FA" }}>
                    {formatDate(invoice.sent_date)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: spacing["3xl"] }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            className="darkmode-table"
            styles={{
              headerFontSize: spacing.base,
              bodyFontSize: spacing.lg,
              headerPadding: "18px 20px",
              bodyPadding: "16px 20px",
              headerTextColor: "#D0D0D0",
              headerBgColor: "rgba(255,255,255,0.05)",
              bodyTextColor: "#E0E0E0",
              borderColor: "rgba(255,255,255,0.1)",
              headerBorderBottom: "none",
              rowBorderBottom: "1px solid rgba(255,255,255,0.1)",
              headerFontWeight: 600,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              amountColor: "#00FFB2",
              alternatingRowColor: "rgba(255,255,255,0.02)",
              quantityCellStyle: { color: "#D0D0D0" },
              unitPriceCellStyle: { color: "#D0D0D0" },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              bodyStyle: { marginBottom: 0 },
            }}
          />
        </div>

        {/* Totals */}
        <TotalsSection
          subtotal={{
            label: "Subtotal",
            amount: formatCurrencyWithCode(invoice.subtotal, invoice.currency),
          }}
          tax={{
            label: "Tax",
            amount: formatCurrencyWithCode(
              invoice.tax_amount,
              invoice.currency
            ),
          }}
          total={{
            label: "Total Due",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          style={{
            width: "320px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: spacing.sm,
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: spacing["4xl"],
          }}
          rowStyle={{
            ...flexContainer("row", "space-between", "center"),
            padding: `${spacing.base}px ${spacing.lg}px`,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          labelStyle={{
            fontSize: spacing.md,
            color: "#D0D0D0",
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            fontSize: spacing.lg,
            color: "#E0E0E0",
          }}
          totalRowStyle={{
            padding: spacing.lg,
            background:
              "linear-gradient(135deg, rgba(0,255,178,0.15) 0%, rgba(0,255,178,0.05) 100%)",
          }}
          totalLabelStyle={{
            fontSize: spacing.lg,
            fontWeight: 600,
            color: "#fff",
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            fontSize: "28px",
            fontWeight: 300,
            color: "#00FFB2",
          }}
        />

        {/* Payment Info */}
        <Section
          title="Payment Information"
          style={{
            padding: spacing["2xl"],
            background: "rgba(255,255,255,0.02)",
            borderRadius: spacing.sm,
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: spacing["2xl"],
          }}
          titleStyle={{
            fontSize: spacing.base,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#D0D0D0",
            marginBottom: spacing.lg,
          }}
          contentStyle={{
            fontSize: spacing.md,
            color: "#D0D0D0",
            lineHeight: 1.9,
            fontFamily: "'SF Mono', monospace",
          }}
        >
          <PaymentInformation
            profile={profile}
            invoice={invoice}
            style={{
              item: { marginBottom: "4px", color: "#D0D0D0" },
              empty: { color: "#D0D0D0" },
            }}
          />
        </Section>

        {/* Notes */}
        {invoice.notes && (
          <Section
            title="Notes"
            style={{
              padding: spacing["2xl"],
              background: "rgba(255,107,107,0.05)",
              borderRadius: spacing.sm,
              border: "1px solid rgba(255,107,107,0.2)",
            }}
            titleStyle={{
              fontSize: spacing.base,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#FF6B6B",
              marginBottom: spacing.lg,
            }}
            contentStyle={{
              fontSize: spacing.md,
              color: "#D0D0D0",
              lineHeight: 1.8,
            }}
          >
            {invoice.notes}
          </Section>
        )}
      </InvoiceContainer>
    </>
  );
};

export const DarkModeTemplate = {
  id: "dark-mode" as const,
  name: "Dark Mode",
  description: "Sleek dark theme with neon accents",
  Component: DarkModeTemplateComponent,
};
