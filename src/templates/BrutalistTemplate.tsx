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

const BrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("brutalist-template", {
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
        className="brutalist-template"
        maxWidth={794}
        padding={{ desktop: 40, tablet: 20, mobile: 15 }}
        background="#fff"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          border: "6px solid #000",
        }}
      >
        {/* Header */}
        <div
          className="brutalist-header"
          style={{
            ...flexContainer("row", "space-between", "flex-start", spacing.lg),
            marginBottom: spacing["3xl"],
            paddingBottom: spacing["2xl"],
            borderBottom: "6px solid #000",
          }}
        >
          <div>
            <div
              className="brutalist-title"
              style={{
                fontSize: "72px",
                fontWeight: 900,
                color: "#000",
                lineHeight: 0.9,
                letterSpacing: "-4px",
              }}
            >
              INV
              <br />
              OICE
            </div>
            <div
              className="brutalist-invoice-number"
              style={{
                fontSize: `${spacing["4xl"]}px`,
                fontWeight: 900,
                marginTop: spacing.md,
                background: "#000",
                color: "#fff",
                padding: "8px 16px",
                display: "inline-block",
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            className="brutalist-company-box"
            style={{
              textAlign: "right",
              border: "3px solid #000",
              padding: `${spacing.lg}px`,
              maxWidth: "280px",
              boxSizing: "border-box",
            }}
          >
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Logo"
                style={{
                  maxWidth: "120px",
                  maxHeight: "60px",
                  marginBottom: spacing.lg,
                  filter: "grayscale(100%)",
                }}
              />
            )}
            <div
              style={{
                fontWeight: 900,
                fontSize: `${spacing.base}px`,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: spacing.md,
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: `${spacing.base}px`,
                lineHeight: 1.8,
                textTransform: "uppercase",
              }}
            >
              {companyDetails}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div
          className="brutalist-info-grid"
          style={{
            ...gridContainer("1fr 1fr", 0),
            marginBottom: spacing["3xl"],
            border: "3px solid #000",
          }}
        >
          <div
            style={{
              padding: `${spacing.lg}px`,
              borderRight: "3px solid #000",
              maxWidth: "300px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: `${spacing.base}px`,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: spacing.md,
                background: "#000",
                color: "#fff",
                padding: "6px 10px",
                display: "inline-block",
              }}
            >
              BILL TO
            </div>
            <div
              style={{
                fontSize: `${spacing["3xl"]}px`,
                fontWeight: 900,
                textTransform: "uppercase",
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
                fontSize: `${spacing.md}px`,
                lineHeight: 1.8,
                textTransform: "uppercase",
              }}
            >
              {clientAddress}
            </div>
          </div>
          <div style={{ padding: `${spacing.lg}px` }}>
            <div
              style={{
                ...gridContainer("1fr 1fr", spacing.lg),
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: `${spacing.sm}px`,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#666",
                  }}
                >
                  ISSUED
                </div>
                <div
                  style={{
                    fontSize: `${spacing.lg}px`,
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
                    fontSize: `${spacing.sm}px`,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#666",
                  }}
                >
                  DUE
                </div>
                <div
                  style={{
                    fontSize: `${spacing.lg}px`,
                    fontWeight: 900,
                    marginTop: spacing.xs,
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <div
                    style={{
                      fontSize: `${spacing.sm}px`,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "#666",
                    }}
                  >
                    SENT
                  </div>
                  <div
                    style={{
                      fontSize: `${spacing.lg}px`,
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
        </div>

        {/* Items Table */}
        <div
          className="brutalist-table"
          style={{ marginBottom: spacing["3xl"] }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            headerLabels={{
              description: "DESCRIPTION",
              quantity: "QTY",
              unitPrice: "RATE",
              amount: "AMOUNT",
            }}
            styles={{
              headerFontSize: `${spacing.base}px`,
              bodyFontSize: `${spacing.md}px`,
              headerPadding: `${spacing.base}px`,
              bodyPadding: "12px 16px",
              headerTextColor: "#fff",
              headerBgColor: "#000",
              bodyTextColor: "#000",
              borderColor: "#000",
              headerBorderBottom: "none",
              rowBorderBottom: "none",
              headerFontWeight: "normal",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "3px",
              bodyFontWeight: "normal",
              amountFontWeight: 900,
              amountColor: "#fff",
              fontFamily: "'Courier New', monospace",
              descriptionCellStyle: {
                border: "3px solid #000",
                textTransform: "uppercase",
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
                background: "#000",
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
            label: "SUBTOTAL",
            amount: formatCurrencyWithCode(invoice.subtotal, invoice.currency),
          }}
          tax={{
            label: "TAX",
            amount: formatCurrencyWithCode(
              invoice.tax_amount,
              invoice.currency
            ),
          }}
          total={{
            label: "TOTAL",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          className="brutalist-totals"
          style={{
            width: "320px",
            border: "6px solid #000",
            maxWidth: "100%",
            marginBottom: spacing["3xl"],
          }}
          rowStyle={{
            ...flexContainer("row", "space-between", "center"),
            padding: `${spacing.md}px ${spacing.base}px`,
            borderBottom: "3px solid #000",
          }}
          labelStyle={{
            fontSize: `${spacing.md}px`,
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            fontWeight: 900,
          }}
          totalRowStyle={{
            padding: `${spacing.lg}px ${spacing.base}px`,
            background: "#000",
            color: "#fff",
          }}
          totalLabelStyle={{
            fontSize: `${spacing.lg}px`,
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontWeight: 900,
            color: "#fff",
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            fontSize: `${spacing["4xl"]}px`,
            fontWeight: 900,
            color: "#fff",
          }}
        />

        {/* Payment Info */}
        <Section
          title="PAYMENT INFORMATION"
          style={{
            border: "3px solid #000",
            padding: `${spacing.lg}px`,
            marginBottom: spacing["2xl"],
          }}
          titleStyle={{
            fontSize: `${spacing.base}px`,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "3px",
            marginBottom: spacing.md,
          }}
          contentStyle={{
            fontSize: `${spacing.md}px`,
            lineHeight: 1.8,
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
            title="NOTES"
            style={{
              border: "3px dashed #000",
              padding: `${spacing.lg}px`,
            }}
            titleStyle={{
              fontSize: `${spacing.base}px`,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: spacing.md,
            }}
            contentStyle={{
              fontSize: `${spacing.md}px`,
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

export const BrutalistTemplate = {
  id: "brutalist" as const,
  name: "Brutalist",
  description: "Raw, industrial design with heavy borders and monospace type",
  Component: BrutalistTemplateComponent,
};
