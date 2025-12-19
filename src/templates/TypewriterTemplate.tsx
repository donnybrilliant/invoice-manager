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
import { InvoiceContainer, TotalsSection, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const TypewriterTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  // Encode SVG for data URL
  const svgTexture = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#FDF6E3" width="100" height="100"/><circle fill="#F5E6C8" cx="50" cy="50" r="1"/></svg>'
  );

  const templateCSS = createTemplateStyles("typewriter-template", {
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
      Tel: {getCompanyInfo(profile, "phone")}
      <br />
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
        /* Override card borders to dashed for typewriter template */
        @container (max-width: 435px) {
          .typewriter-template [class^="invoice-item-list-"] tr {
            border-left: 1px dashed #8B7355 !important;
            border-right: 1px dashed #8B7355 !important;
            border-top: 1px dashed #8B7355 !important;
            border-bottom: 1px dashed #8B7355 !important;
          }
          .typewriter-template [class^="invoice-item-list-"] tr:not(:first-child) {
            border-top: 2px dashed #8B7355 !important;
          }
        }
        @media (max-width: 435px) {
          .typewriter-template [class^="invoice-item-list-"] tr {
            border-left: 1px dashed #8B7355 !important;
            border-right: 1px dashed #8B7355 !important;
            border-top: 1px dashed #8B7355 !important;
            border-bottom: 1px dashed #8B7355 !important;
          }
          .typewriter-template [class^="invoice-item-list-"] tr:not(:first-child) {
            border-top: 2px dashed #8B7355 !important;
          }
        }
      `}</style>
      <InvoiceContainer
        className="typewriter-template"
        maxWidth={794}
        padding={{ desktop: 50, tablet: 20, mobile: 15 }}
        background="#FDF6E3"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          backgroundImage: `url('data:image/svg+xml,${svgTexture}')`,
          position: "relative",
        }}
      >
        {/* Paper texture overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(rgba(253,246,227,0) 0%, rgba(245,230,200,0.3) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Stamp */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            width: "100px",
            height: "100px",
            border: "4px double #8B0000",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-15deg)",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#8B0000",
              fontWeight: "bold",
              fontSize: spacing.base,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            INVOICE
            <br />
            <span style={{ fontSize: spacing.sm }}>ORIGINAL</span>
          </div>
        </div>

        {/* Header */}
        <div
          className="typewriter-header"
          style={{
            position: "relative",
            marginBottom: spacing["4xl"],
            paddingBottom: spacing["2xl"],
            borderBottom: "2px solid #8B7355",
          }}
        >
          <div
            style={{
              ...flexContainer("row", "space-between", "flex-start"),
            }}
          >
            <div>
              {profile?.logo_url && (
                <img
                  src={profile.logo_url}
                  alt="Logo"
                  style={{
                    maxWidth: "120px",
                    maxHeight: "60px",
                    marginBottom: spacing.lg,
                    filter: "sepia(50%)",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#3D2914",
                  letterSpacing: "8px",
                  textTransform: "uppercase",
                }}
              >
                I N V O I C E
              </div>
              <div
                style={{
                  fontSize: spacing.lg,
                  color: "#8B7355",
                  marginTop: spacing.sm,
                  letterSpacing: "4px",
                }}
              >
                No. {invoice.invoice_number}
              </div>
            </div>
            <div style={{ textAlign: "right", maxWidth: "250px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: spacing.lg,
                  color: "#3D2914",
                  marginBottom: spacing.md,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {getCompanyInfo(profile, "company_name")}
              </div>
              <div
                style={{
                  fontSize: spacing.md,
                  color: "#5D4E37",
                  lineHeight: 1.8,
                }}
              >
                {companyDetails}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div
          style={{
            position: "relative",
            ...flexContainer("row", "space-between", "flex-start"),
            marginBottom: spacing["3xl"],
            padding: spacing["2xl"],
            background: "rgba(139,115,85,0.08)",
            border: "1px dashed #8B7355",
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: spacing.base,
                fontWeight: "bold",
                color: "#8B7355",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: spacing.md,
              }}
            >
              BILLED TO:
            </div>
            <div
              style={{
                fontSize: spacing.base,
                fontWeight: "bold",
                color: "#3D2914",
                marginBottom: spacing.sm,
                textTransform: "uppercase",
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
                color: "#5D4E37",
                lineHeight: 1.8,
              }}
            >
              {clientAddress}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: spacing["3xl"] }}>
              <div
                style={{
                  fontSize: spacing.sm,
                  color: "#8B7355",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Date Issued
              </div>
              <div
                style={{
                  fontSize: spacing.lg,
                  color: "#3D2914",
                  marginTop: spacing.xs,
                  textDecoration: "underline",
                }}
              >
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: spacing.sm,
                  color: "#8B7355",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Payment Due
              </div>
              <div
                style={{
                  fontSize: spacing.lg,
                  color: "#8B0000",
                  marginTop: spacing.xs,
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: spacing["3xl"] }}>
                <div
                  style={{
                    fontSize: spacing.sm,
                    color: "#8B7355",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Date Sent
                </div>
                <div
                  style={{
                    fontSize: spacing.lg,
                    color: "#3D2914",
                    marginTop: spacing.xs,
                    textDecoration: "underline",
                  }}
                >
                  {formatDate(invoice.sent_date)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div
          className="typewriter-table"
          style={{ marginBottom: spacing["3xl"], position: "relative" }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: `${spacing.base}px`,
              bodyFontSize: `${spacing.md}px`,
              headerPadding: `${spacing.md}px`,
              bodyPadding: "10px 12px",
              headerTextColor: "#5D4E37",
              bodyTextColor: "#3D2914",
              borderColor: "#8B7355",
              headerBorderBottom: "2px solid #8B7355",
              rowBorderBottom: "1px dashed #8B7355",
              headerFontWeight: "normal",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 700,
              alternatingRowColor: "#FDF6E3",
              headerStyle: {
                borderTop: "2px solid #8B7355",
              },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
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
            label: "TOTAL DUE",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          style={{
            width: "280px",
            border: "2px solid #8B7355",
            background: "rgba(139,115,85,0.05)",
            marginBottom: spacing["3xl"],
          }}
          rowStyle={{
            ...flexContainer("row", "space-between", "center"),
            padding: `${spacing.md}px ${spacing.base}px`,
            borderBottom: "1px dashed #8B7355",
          }}
          labelStyle={{
            fontSize: spacing.md,
            color: "#5D4E37",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            color: "#3D2914",
          }}
          totalRowStyle={{
            padding: spacing.base,
            background: "#3D2914",
            color: "#FDF6E3",
          }}
          totalLabelStyle={{
            fontSize: spacing.md,
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: "bold",
            color: "#FDF6E3",
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            fontSize: spacing["3xl"],
            fontWeight: "bold",
            color: "#FDF6E3",
          }}
        />

        {/* Payment Info */}
        <Section
          title="Payment Instructions:"
          style={{
            position: "relative",
            border: "1px dashed #8B7355",
            padding: spacing.lg,
            marginBottom: spacing["2xl"],
            background: "rgba(139,115,85,0.05)",
          }}
          titleStyle={{
            fontSize: spacing.base,
            fontWeight: "bold",
            color: "#5D4E37",
            textTransform: "uppercase",
            letterSpacing: "3px",
            marginBottom: spacing.md,
          }}
          contentStyle={{
            fontSize: spacing.md,
            color: "#3D2914",
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

        {/* Notes */}
        {invoice.notes && (
          <Section
            title="Memo:"
            style={{
              position: "relative",
              padding: spacing.lg,
              borderLeft: "4px solid #8B7355",
              background: "rgba(139,115,85,0.05)",
            }}
            titleStyle={{
              fontSize: spacing.base,
              fontWeight: "bold",
              color: "#5D4E37",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: spacing.md,
            }}
            contentStyle={{
              fontSize: spacing.md,
              color: "#3D2914",
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            {invoice.notes}
          </Section>
        )}

        {/* Footer */}
        <div
          style={{
            position: "relative",
            marginTop: spacing["4xl"],
            textAlign: "center",
            color: "#8B7355",
            fontSize: spacing.base,
            letterSpacing: "2px",
          }}
        >
          — Thank you for your business —
        </div>
      </InvoiceContainer>
    </>
  );
};

export const TypewriterTemplate = {
  id: "typewriter" as const,
  name: "Typewriter",
  description: "Vintage typewriter aesthetic with stamps and seals",
  Component: TypewriterTemplateComponent,
};
