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
  AddressSection,
  InvoiceDetails,
  TotalsSection,
  Section,
} from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing } from "./design-system/tokens";

const ClassicTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("classic-template", {
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
        className="classic-template"
        maxWidth={794}
        padding={{ desktop: 40, tablet: 20, mobile: 15 }}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <InvoiceHeader
          className="classic-header"
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
            marginBottom: spacing['3xl'],
            borderBottom: "3px solid #1f2937",
            paddingBottom: spacing.lg,
          }}
          titleStyle={{
            margin: 0,
            fontSize: "32px",
            color: "#1f2937",
          }}
          invoiceNumberStyle={{ display: "none" }}
          companyInfoStyle={{
            textAlign: "right",
            flex: "1 1 auto",
            minWidth: "200px",
          }}
        />

        {/* Invoice Details Section */}
        <div
          className="classic-info-section"
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: spacing.lg,
            marginBottom: spacing['3xl'],
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <h3
              style={{
                margin: "0 0 10px 0",
                color: "#1f2937",
                fontSize: spacing.lg,
                textTransform: "uppercase",
              }}
            >
              Bill To:
            </h3>
            <div
              style={{
                color: "#374151",
                lineHeight: 1.6,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <strong
                style={{
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
          <div style={{ textAlign: "right", minWidth: 0, flexShrink: 1 }}>
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
                padding: "4px 12px 4px 0",
                color: "#6b7280",
                fontWeight: 600,
              }}
              valueStyle={{
                padding: "4px 0",
                color: "#1f2937",
              }}
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="classic-table" style={{ marginBottom: spacing['2xl'] }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: "14px",
              bodyFontSize: "14px",
              headerPadding: "12px",
              bodyPadding: "12px",
              headerTextColor: "#1f2937",
              headerBgColor: "#f3f4f6",
              bodyTextColor: "#374151",
              borderColor: "#e5e7eb",
              headerBorderBottom: "2px solid #d1d5db",
              rowBorderBottom: "1px solid #e5e7eb",
              headerFontWeight: 600,
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              tableLayout: "fixed",
              columnWidths: {
                description: "40%",
                quantity: "10%",
                unitPrice: "25%",
                amount: "25%",
              },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              },
              bodyStyle: {
                marginBottom: 0,
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
            amount: formatCurrencyWithCode(invoice.tax_amount, invoice.currency),
            rate: invoice.tax_rate,
          }}
          total={{
            label: "Total:",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          style={{
            width: "300px",
            marginBottom: spacing['3xl'],
          }}
          rowStyle={{
            padding: "8px 12px 8px 0",
            color: "#6b7280",
            fontWeight: 600,
          }}
          amountStyle={{
            padding: "8px 0",
            color: "#1f2937",
          }}
          totalRowStyle={{
            borderTop: "2px solid #d1d5db",
          }}
          totalLabelStyle={{
            padding: "12px 12px 12px 0",
            color: "#1f2937",
            fontWeight: 700,
            fontSize: spacing['3xl'],
          }}
          totalAmountStyle={{
            padding: "12px 0",
            color: "#1f2937",
            fontWeight: 700,
            fontSize: spacing['3xl'],
          }}
        />

        {/* Notes */}
        {invoice.notes && (
          <Section
            title="Notes:"
            style={{
              marginBottom: spacing['3xl'],
            }}
            titleStyle={{
              margin: "0 0 10px 0",
              color: "#1f2937",
              fontSize: spacing.lg,
              textTransform: "uppercase",
            }}
            contentStyle={{
              color: "#6b7280",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {invoice.notes}
          </Section>
        )}

        {/* Yellow Footer with Payment Information */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: spacing.xl,
            borderRadius: spacing.sm,
            marginTop: spacing['3xl'],
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#92400e",
              fontSize: spacing.base,
              fontWeight: 700,
            }}
          >
            Payment Information
          </h3>
          <div
            style={{
              color: "#78350f",
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
                color: "#78350f",
                fontSize: spacing.lg,
                lineHeight: 1.6,
              }}
            >
              {profile.payment_instructions}
            </div>
          )}
        </div>
      </InvoiceContainer>
    </>
  );
};

export const ClassicTemplate = {
  id: "classic" as const,
  name: "Classic",
  description: "Traditional invoice design with yellow footer",
  Component: ClassicTemplateComponent,
};
