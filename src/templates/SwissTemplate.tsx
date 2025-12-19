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
import { InvoiceContainer, TotalsSection, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, gridContainer, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const SwissTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("swiss-template", {
    padding: true,
    table: true,
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
      <InvoiceContainer
        className="swiss-template"
        maxWidth={794}
        padding={{ desktop: 60, tablet: 30, mobile: 20 }}
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* Red Accent Bar */}
        <div
          style={{
            width: "60px",
            height: "8px",
            background: "#FF0000",
            marginBottom: "80px",
          }}
        />

        {/* Header */}
        <div
          className="swiss-header"
          style={{
            ...gridContainer("1fr 1fr", 80),
            marginBottom: "80px",
          }}
        >
          <div>
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Logo"
                style={{
                  maxWidth: "140px",
                  maxHeight: "70px",
                  marginBottom: spacing["2xl"],
                }}
              />
            )}
            <div
              style={{
                fontSize: spacing.base,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#999",
                marginBottom: spacing.sm,
              }}
            >
              From
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: spacing["3xl"],
                color: "#000",
                marginBottom: spacing.md,
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{ fontSize: spacing.md, color: "#666", lineHeight: 1.8 }}
            >
              {companyDetails}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              className="swiss-title"
              style={{
                fontSize: "64px",
                fontWeight: 300,
                color: "#000",
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              Invoice
            </div>
            <div
              style={{
                fontSize: spacing.lg,
                color: "#999",
                marginTop: spacing.xl,
              }}
            >
              No. {invoice.invoice_number}
            </div>
          </div>
        </div>

        {/* Client & Dates */}
        <div
          className="swiss-client-dates"
          style={{
            ...gridContainer("2fr 1fr", 80),
            marginBottom: spacing["5xl"],
            paddingBottom: spacing["3xl"],
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: spacing.base,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#999",
                marginBottom: spacing.sm,
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: spacing["3xl"],
                color: "#000",
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
              style={{ fontSize: spacing.md, color: "#666", lineHeight: 1.8 }}
            >
              {clientAddress}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: spacing["2xl"] }}>
              <div
                style={{
                  fontSize: spacing.base,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                  marginBottom: spacing.xs,
                }}
              >
                Issue Date
              </div>
              <div style={{ fontSize: spacing.xl, color: "#000" }}>
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: spacing.base,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                  marginBottom: spacing.xs,
                }}
              >
                Due Date
              </div>
              <div
                style={{
                  fontSize: spacing.xl,
                  color: "#FF0000",
                  fontWeight: 600,
                }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: spacing["2xl"] }}>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    color: "#999",
                    marginBottom: spacing.xs,
                  }}
                >
                  Sent Date
                </div>
                <div style={{ fontSize: spacing.xl, color: "#000" }}>
                  {formatDate(invoice.sent_date)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="swiss-table" style={{ marginBottom: spacing["4xl"] }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: spacing.base,
              bodyFontSize: spacing.lg,
              headerPadding: `${spacing.base}px 0`,
              bodyPadding: `${spacing.base}px 0`,
              headerTextColor: "#999",
              bodyTextColor: "#333",
              borderColor: "#e0e0e0",
              headerBorderBottom: "2px solid #000",
              rowBorderBottom: "1px solid #e0e0e0",
              headerFontWeight: 500,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "3px",
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              amountColor: "#000",
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
            label: "Total",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          style={{
            width: "280px",
            marginBottom: spacing["5xl"],
          }}
          rowStyle={{
            ...flexContainer("row", "space-between", "center"),
            padding: `${spacing.md}px 0`,
            borderBottom: "1px solid #e0e0e0",
          }}
          labelStyle={{
            fontSize: spacing.md,
            color: "#666",
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            fontSize: spacing.lg,
            color: "#333",
          }}
          totalRowStyle={{
            padding: `${spacing.lg}px 0`,
            borderTop: "2px solid #000",
            marginTop: spacing.md,
          }}
          totalLabelStyle={{
            fontSize: spacing.base,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#000",
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            fontSize: "28px",
            fontWeight: 300,
            color: "#000",
          }}
        />

        {/* Payment & Notes */}
        <div
          className="swiss-payment-notes"
          style={{
            ...gridContainer("1fr 1fr", spacing["5xl"]),
            paddingTop: spacing["3xl"],
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Section
            title="Payment Information"
            titleStyle={{
              fontSize: spacing.base,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#999",
              marginBottom: spacing.xl,
            }}
            contentStyle={{
              fontSize: spacing.md,
              color: "#333",
              lineHeight: 1.9,
            }}
          >
            <PaymentInformation
              profile={profile}
              invoice={invoice}
              style={{
                item: { marginBottom: "4px" },
              }}
            />
          </Section>
          {invoice.notes && (
            <Section
              title="Notes"
              titleStyle={{
                fontSize: spacing.base,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#999",
                marginBottom: spacing.xl,
              }}
              contentStyle={{
                fontSize: spacing.md,
                color: "#333",
                lineHeight: 1.9,
              }}
            >
              {invoice.notes}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "80px", textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "4px",
              background: "#FF0000",
              margin: "0 auto",
            }}
          />
        </div>
      </InvoiceContainer>
    </>
  );
};

export const SwissTemplate = {
  id: "swiss" as const,
  name: "Swiss",
  description: "Grid-based International Typographic Style",
  Component: SwissTemplateComponent,
};
