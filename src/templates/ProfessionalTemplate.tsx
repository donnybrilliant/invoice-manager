import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";
import {
  InvoiceContainer,
  InvoiceHeader,
  InvoiceDetails,
  TotalsSection,
  Section,
} from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const ProfessionalTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("professional-template", {
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
      {getCompanyInfo(profile, "phone")} | {getCompanyInfo(profile, "email")}
      {profile?.website && (
        <>
          <br />
          {profile.website}
        </>
      )}
      {profile?.organization_number && (
        <>
          <br />
          Org: {profile.organization_number}
        </>
      )}
      {profile?.tax_number && (
        <>
          <br />
          Tax: {profile.tax_number}
        </>
      )}
    </>
  );

  // Format client address
  const clientAddress = (
    <>
      {client.email && (
        <div style={{ color: "#6b7280", fontSize: spacing.lg }}>
          {client.email}
        </div>
      )}
      {client.phone && (
        <div style={{ color: "#6b7280", fontSize: spacing.lg }}>
          {client.phone}
        </div>
      )}
      {formatClientAddress(client) !== "[No Address]" && (
        <div
          style={{
            color: "#6b7280",
            fontSize: spacing.lg,
            marginTop: spacing.xs,
          }}
        >
          {formatClientAddress(client)
            .split("\n")
            .map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <style>{templateCSS}</style>
      <style>{`
        .professional-currency-value {
          white-space: nowrap !important;
        }
      `}</style>
      <InvoiceContainer
        className="professional-template"
        maxWidth={794}
        padding={{ desktop: 50, tablet: 25, mobile: 15 }}
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {/* Header */}
        <InvoiceHeader
          className="professional-header"
          logo={
            profile?.logo_url
              ? {
                  url: profile.logo_url,
                  alt: "Company Logo",
                  maxWidth: 160,
                  maxHeight: 80,
                }
              : undefined
          }
          title="INVOICE"
          invoiceNumber={invoice.invoice_number}
          companyInfo={{
            name: getCompanyInfo(profile, "company_name"),
            details: companyDetails,
          }}
          layout="side-by-side"
          style={{
            marginBottom: spacing["4xl"],
            paddingBottom: spacing["2xl"],
            borderBottom: "2px solid #111827",
          }}
          titleStyle={{
            margin: "0 0 10px 0",
            fontSize: "42px",
            color: "#111827",
            fontWeight: 300,
            letterSpacing: "-1px",
          }}
          invoiceNumberStyle={{
            color: "#6b7280",
            fontSize: spacing.xl,
            fontWeight: 500,
          }}
          companyInfoStyle={{
            color: "#6b7280",
            fontSize: spacing.md,
            lineHeight: 1.7,
          }}
        />

        {/* Invoice Details Grid */}
          <div
            className="professional-details-grid"
            style={{
              ...flexContainer("row", "space-between", "flex-start"),
              flexWrap: "wrap",
              gap: spacing.lg,
              marginBottom: spacing["4xl"],
            }}
          >
          <div style={{ flex: 1, minWidth: 0, maxWidth: "300px" }}>
            <div
              style={{
                marginBottom: spacing.sm,
                color: "#6b7280",
                fontSize: spacing.base,
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              Billed To
            </div>
            <div
              style={{
                color: "#111827",
                lineHeight: 1.7,
                fontSize: spacing.xl,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: spacing.xs,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  display: "block",
                }}
              >
                {client.name}
              </div>
              {clientAddress}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "right", minWidth: 0, flexShrink: 1 }}>
            <InvoiceDetails
              issueDate={formatDate(invoice.issue_date)}
              dueDate={formatDate(invoice.due_date)}
              sentDate={
                invoice.status === "sent" && invoice.sent_date
                  ? formatDate(invoice.sent_date)
                  : undefined
              }
              layout="table"
              style={{ marginLeft: "auto" }}
              className="invoice-details-right"
              labelStyle={{
                padding: "6px 16px 6px 0",
                color: "#6b7280",
                fontSize: spacing.md,
                fontWeight: 600,
              }}
              valueStyle={{
                padding: "6px 0",
                color: "#111827",
                fontSize: spacing.lg,
                fontWeight: 500,
              }}
            />
          </div>
        </div>

        {/* Items Table */}
        <div
          className="professional-table"
          style={{ marginBottom: spacing["3xl"], paddingBottom: spacing.md }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: spacing.md,
              bodyFontSize: spacing.lg,
              headerPadding: "14px 16px",
              bodyPadding: "14px 16px",
              headerTextColor: "white",
              headerBgColor: "#111827",
              bodyTextColor: "#374151",
              borderColor: "#e5e7eb",
              headerBorderBottom: "none",
              rowBorderBottom: "1px solid #e5e7eb",
              headerFontWeight: 600,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "0.5px",
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              amountColor: "#111827",
              columnWidths: {
                quantity: "80px",
                unitPrice: "120px",
                amount: "120px",
              },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              bodyStyle: {
                marginBottom: 0,
                border: "1px solid #e5e7eb",
              },
            }}
          />
        </div>

        {/* Totals Section */}
        <div
          className="professional-totals-section"
          style={{
            ...flexContainer("row", "space-between", "flex-start"),
            marginBottom: spacing["4xl"],
          }}
        >
          {invoice.notes ? (
            <div style={{ flex: 1, maxWidth: "400px" }}>
              <Section
                title="Notes"
                titleStyle={{
                  marginBottom: spacing.sm,
                  color: "#6b7280",
                  fontSize: spacing.base,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "1px",
                }}
                contentStyle={{
                  color: "#374151",
                  lineHeight: 1.7,
                  margin: 0,
                  fontSize: spacing.lg,
                }}
              >
                {invoice.notes}
              </Section>
            </div>
          ) : (
            <div style={{ flex: 1 }}></div>
          )}
          <TotalsSection
            subtotal={{
              label: "Subtotal",
              amount: formatCurrencyWithCode(
                invoice.subtotal,
                invoice.currency
              ),
            }}
            tax={{
              label: "Tax",
              amount: formatCurrencyWithCode(
                invoice.tax_amount,
                invoice.currency
              ),
              rate: invoice.tax_rate,
            }}
            total={{
              label: "Total",
              amount: formatCurrencyWithCode(invoice.total, invoice.currency),
            }}
            layout="right-aligned"
            style={{
              width: "320px",
              maxWidth: "100%",
              minWidth: 0,
            }}
            rowStyle={{
              padding: "10px 16px 10px 0",
              color: "#6b7280",
              fontWeight: 600,
              fontSize: spacing.lg,
              ...getCurrencyStyle(),
            }}
            amountStyle={{
              ...getCurrencyStyle(),
              padding: "10px 0",
              color: "#111827",
              fontSize: spacing.xl,
              minWidth: "100px",
            }}
            totalRowStyle={{
              borderTop: "2px solid #111827",
            }}
            totalLabelStyle={{
              padding: `${spacing.base}px 16px 0 0`,
              color: "#111827",
              fontWeight: 700,
              fontSize: spacing.base,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              ...getCurrencyStyle(),
            }}
            totalAmountStyle={{
              ...getCurrencyStyle(),
              padding: `${spacing.base}px 0 0 0`,
              color: "#111827",
              fontWeight: 700,
              fontSize: "26px",
              minWidth: "120px",
            }}
          />
        </div>

        {/* Payment Information */}
        <Section
          title="Payment Information"
          style={{
            padding: spacing["2xl"],
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "2px",
          }}
          titleStyle={{
            marginBottom: spacing.sm,
            color: "#111827",
            fontSize: spacing.base,
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
          contentStyle={{
            color: "#374151",
            lineHeight: 1.8,
            fontSize: spacing.lg,
          }}
        >
          <PaymentInformation
            profile={profile}
            invoice={invoice}
            style={{
              item: { marginBottom: "4px" },
            }}
          />
          {profile?.payment_instructions && (
            <div
              style={{
                marginTop: spacing.base,
                paddingTop: spacing.base,
                borderTop: "1px solid #e5e7eb",
                color: "#6b7280",
                fontSize: spacing.md,
                lineHeight: 1.7,
              }}
            >
              {profile.payment_instructions}
            </div>
          )}
        </Section>
      </InvoiceContainer>
    </>
  );
};

export const ProfessionalTemplate = {
  id: "professional" as const,
  name: "Professional",
  description: "Clean and minimal business design",
  Component: ProfessionalTemplateComponent,
};
