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
  TotalsSection,
  Section,
} from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const ModernTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("modern-template", {
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
      {getCompanyInfo(profile, "phone")}
      <br />
      {getCompanyInfo(profile, "email")}
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
      {client.email || ""}
      <br />
      {client.phone || ""}
      <br />
      {formatClientAddress(client)
        .split("\n")
        .map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
    </>
  );

  return (
    <>
      <style>{templateCSS}</style>
      <InvoiceContainer
        className="modern-template"
        maxWidth={794}
        padding={{ desktop: 40, tablet: 20, mobile: 15 }}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Colored Header Bar */}
        <div
          style={{
            height: "8px",
            background:
              "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            marginBottom: spacing["2xl"],
            borderRadius: spacing.xs,
          }}
        />

        {/* Header */}
        <InvoiceHeader
          className="modern-header"
          logo={
            profile?.logo_url
              ? {
                  url: profile.logo_url,
                  alt: "Company Logo",
                  maxWidth: 150,
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
            marginBottom: spacing["3xl"],
            width: "100%",
          }}
          titleStyle={{
            margin: 0,
            fontSize: "36px",
            color: "#3b82f6",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
          invoiceNumberStyle={{
            color: "#6b7280",
            fontSize: spacing.base,
            marginTop: "5px",
          }}
          companyInfoStyle={{
            textAlign: "right",
            padding: spacing.lg,
            background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
            borderRadius: spacing.sm,
          }}
        />

        {/* Invoice Info Cards */}
        <div
          className="modern-info-cards"
          style={{
            ...flexContainer("row", "flex-start", "stretch", spacing.lg),
            marginBottom: spacing["3xl"],
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: spacing.lg,
              background: "#f9fafb",
              borderLeft: "4px solid #3b82f6",
              borderRadius: spacing.xs,
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                color: "#3b82f6",
                fontSize: spacing.md,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Bill To
            </h3>
            <div
              style={{
                color: "#1f2937",
                lineHeight: 1.7,
                fontSize: spacing.lg,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <strong
                style={{
                  fontSize: spacing.base,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  display: "block",
                }}
              >
                {client.name}
              </strong>
              <br />
              {clientAddress}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: spacing.lg,
              background: "#f9fafb",
              borderLeft: "4px solid #8b5cf6",
              borderRadius: spacing.xs,
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                color: "#8b5cf6",
                fontSize: spacing.md,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Invoice Details
            </h3>
            <div
              style={{
                color: "#1f2937",
                lineHeight: 1.7,
                fontSize: spacing.lg,
              }}
            >
              <div>
                <strong>Issue Date: </strong> {formatDate(invoice.issue_date)}
              </div>
              <div>
                <strong>Due Date: </strong> {formatDate(invoice.due_date)}
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <strong>Sent Date: </strong> {formatDate(invoice.sent_date)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="modern-table" style={{ marginBottom: spacing["2xl"] }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: "13px",
              bodyFontSize: `${spacing.lg}px`,
              headerPadding: `${spacing.base}px`,
              bodyPadding: `${spacing.base}px`,
              headerTextColor: "white",
              headerBgColor: "#3b82f6",
              bodyTextColor: "#374151",
              borderColor: "#e5e7eb",
              headerBorderBottom: "none",
              rowBorderBottom: "none",
              headerFontWeight: 600,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "0.5px",
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              amountColor: "#1f2937",
              alternatingRowColor: "#f9fafb",
              columnWidths: {
                quantity: "100px",
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
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: spacing.sm,
                overflow: "hidden",
              },
              headerStyle: {
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              },
            }}
          />
        </div>

        {/* Totals */}
        <TotalsSection
          subtotal={{
            label: "Subtotal:",
            amount: formatCurrencyWithCode(invoice.subtotal, invoice.currency),
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
            label: "Total Due:",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          className="modern-totals-box"
          style={{
            width: "350px",
            maxWidth: "100%",
            padding: spacing.xl,
            background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
            borderRadius: spacing.sm,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: spacing["3xl"],
          }}
          rowStyle={{
            padding: "8px 0",
            color: "#6b7280",
            fontWeight: 600,
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            padding: "8px 0",
            color: "#1f2937",
            fontSize: `${spacing.base}px`,
          }}
          totalRowStyle={{
            borderTop: "2px solid #d1d5db",
          }}
          totalLabelStyle={{
            padding: `${spacing.base}px 0 0 0`,
            color: "#1f2937",
            fontWeight: 700,
            fontSize: `${spacing["3xl"]}px`,
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            padding: `${spacing.base}px 0 0 0`,
            color: "#3b82f6",
            fontWeight: 700,
            fontSize: `${spacing["4xl"]}px`,
          }}
        />

        {/* Notes */}
        {invoice.notes && (
          <Section
            title="Notes"
            style={{
              marginBottom: spacing["3xl"],
              padding: spacing.lg,
              background: "#fffbeb",
              borderLeft: "4px solid #f59e0b",
              borderRadius: spacing.xs,
            }}
            titleStyle={{
              margin: "0 0 10px 0",
              color: "#92400e",
              fontSize: spacing.md,
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
            contentStyle={{
              color: "#78350f",
              lineHeight: 1.6,
              margin: 0,
              fontSize: spacing.lg,
            }}
          >
            {invoice.notes}
          </Section>
        )}

        {/* Payment Information */}
        <div
          style={{
            padding: spacing.xl,
            background: "white",
            border: "2px solid #e5e7eb",
            borderRadius: spacing.sm,
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#1f2937",
              fontSize: spacing.base,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: spacing.lg,
                background: "linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)",
                marginRight: spacing.md,
                borderRadius: "2px",
              }}
            />
            Payment Information
          </h3>
          <div
            style={{
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
          </div>
          {profile?.payment_instructions && (
            <div
              style={{
                marginTop: spacing.md,
                paddingTop: spacing.md,
                borderTop: "1px solid #e5e7eb",
                color: "#6b7280",
                fontSize: spacing.lg,
                lineHeight: 1.6,
              }}
            >
              {profile.payment_instructions}
            </div>
          )}
        </div>

        {/* Colored Footer Bar */}
        <div
          style={{
            height: "6px",
            background:
              "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            marginTop: spacing["2xl"],
            borderRadius: spacing.xs,
          }}
        />
      </InvoiceContainer>
    </>
  );
};

export const ModernTemplate = {
  id: "modern" as const,
  name: "Modern",
  description: "Contemporary design with colored accents",
  Component: ModernTemplateComponent,
};
