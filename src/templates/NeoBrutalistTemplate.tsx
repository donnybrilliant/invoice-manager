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
import { spacing, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const NeoBrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("neobrutalist-template", {
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
      <InvoiceContainer
        className="neobrutalist-template"
        maxWidth={794}
        padding={{ desktop: 50, tablet: 25, mobile: 15 }}
        background="#E8F5E9"
        style={{
          fontFamily: "'Arial Black', Helvetica, sans-serif",
          border: "5px solid #000",
          boxShadow: "12px 12px 0px #000",
        }}
      >
        {/* Header */}
        <div
          className="neobrutalist-header"
          style={{
            ...flexContainer("row", "space-between", "flex-start"),
            marginBottom: spacing["3xl"],
          }}
        >
          <div
            style={{
              background: "#FF5722",
              border: "4px solid #000",
              padding: spacing["2xl"],
              boxShadow: "8px 8px 0px #000",
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
                textShadow: "3px 3px 0px #000",
              }}
            >
              INVOICE
            </div>
            <div
              style={{
                fontSize: spacing.lg,
                fontWeight: 900,
                color: "#FFEB3B",
                marginTop: spacing.sm,
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            className="neobrutalist-company-profile"
            style={{
              background: "#fff",
              border: "4px solid #000",
              padding: spacing.lg,
              boxShadow: "6px 6px 0px #000",
              maxWidth: "260px",
            }}
          >
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Logo"
                style={{
                  maxWidth: "100px",
                  maxHeight: "50px",
                  marginBottom: spacing.md,
                }}
              />
            )}
            <div
              style={{
                fontWeight: 900,
                fontSize: spacing.base,
                marginBottom: spacing.sm,
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: spacing.base,
                lineHeight: 1.7,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {companyDetails}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div
          style={{
            ...flexContainer("row", "flex-start", "stretch", spacing.lg),
            marginBottom: spacing["3xl"],
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: "#2196F3",
              border: "4px solid #000",
              padding: spacing.lg,
              boxShadow: "6px 6px 0px #000",
            }}
          >
            <div
              style={{
                fontSize: spacing.md,
                fontWeight: 900,
                color: "#fff",
                marginBottom: spacing.md,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              → BILL TO
            </div>
            <div
              style={{
                fontSize: spacing["3xl"],
                fontWeight: 900,
                color: "#FFEB3B",
                marginBottom: spacing.sm,
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
                color: "#fff",
                lineHeight: 1.7,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {clientAddress}
            </div>
          </div>
          <div
            style={{
              background: "#FFEB3B",
              border: "4px solid #000",
              padding: spacing.lg,
              boxShadow: "6px 6px 0px #000",
            }}
          >
            <div style={{ marginBottom: spacing.lg }}>
              <div
                style={{
                  fontSize: spacing.sm,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                ISSUED
              </div>
              <div
                style={{
                  fontSize: spacing.base,
                  fontWeight: 900,
                  marginTop: spacing.xs,
                }}
              >
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: spacing.sm,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                DUE DATE
              </div>
              <div
                style={{
                  fontSize: spacing.base,
                  fontWeight: 900,
                  marginTop: spacing.xs,
                  color: "#D32F2F",
                }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: spacing.lg }}>
                <div
                  style={{
                    fontSize: spacing.sm,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  SENT
                </div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 900,
                    marginTop: spacing.xs,
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
          style={{
            background: "#fff",
            border: "4px solid #000",
            boxShadow: "8px 8px 0px #000",
            marginBottom: spacing["3xl"],
            overflow: "hidden",
          }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            className="neobrutalist-table"
            headerLabels={{
              description: "Item",
              amount: "Total",
            }}
            styles={{
              headerFontSize: `${spacing.md}px`,
              bodyFontSize: `${spacing.md}px`,
              headerPadding: `${spacing.base}px`,
              bodyPadding: "14px 16px",
              headerTextColor: "#fff",
              headerBgColor: "#9C27B0",
              bodyTextColor: "#000",
              borderColor: "#000",
              headerBorderBottom: "none",
              rowBorderBottom: "none",
              headerFontWeight: "normal",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 900,
              amountColor: "#fff",
              fontFamily: "'Arial Black', sans-serif",
              descriptionCellStyle: {
                border: "3px solid #000",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              quantityCellStyle: {
                border: "3px solid #000",
                fontWeight: 900,
              },
              unitPriceCellStyle: {
                border: "3px solid #000",
              },
              amountCellStyle: {
                border: "3px solid #000",
                background: "#FF5722",
              },
              columnWidths: {
                description: "32%",
                quantity: "14%",
                unitPrice: "27%",
                amount: "27%",
              },
              headerStyle: {
                border: "3px solid #000",
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
            background: "#000",
            border: "4px solid #000",
            boxShadow: "8px 8px 0px #FF5722",
            padding: 0,
            minWidth: "300px",
            marginBottom: spacing["3xl"],
          }}
          rowStyle={{
            ...flexContainer("row", "space-between", "center"),
            padding: "14px 20px",
            borderBottom: "3px solid #333",
            color: "#fff",
          }}
          labelStyle={{
            fontSize: spacing.md,
            textTransform: "uppercase",
            color: "#fff",
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            fontWeight: 900,
            color: "#fff",
          }}
          totalRowStyle={{
            padding: spacing.lg,
            background: "#FFEB3B",
            color: "#000",
          }}
          totalLabelStyle={{
            fontSize: spacing.base,
            textTransform: "uppercase",
            fontWeight: 900,
            color: "#000",
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            fontSize: "28px",
            fontWeight: 900,
            color: "#000",
          }}
        />

        {/* Payment */}
        <Section
          title="💰 Payment Details"
          style={{
            background: "#fff",
            border: "4px solid #000",
            padding: spacing.lg,
            boxShadow: "6px 6px 0px #2196F3",
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
            title="📝 Notes"
            style={{
              marginTop: spacing.lg,
              background: "#FFEB3B",
              border: "4px dashed #000",
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
      </InvoiceContainer>
    </>
  );
};

export const NeoBrutalistTemplate = {
  id: "neo-brutalist" as const,
  name: "Neo Brutalist",
  description: "Bold colors with raw brutalist structure and thick shadows",
  Component: NeoBrutalistTemplateComponent,
};
