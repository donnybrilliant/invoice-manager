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
import { InvoiceContainer, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";

const ConstructivistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("constructivist-template", {
    padding: true,
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
        className="constructivist-template"
        maxWidth={794}
        padding={{ desktop: 80, tablet: 40, mobile: 40 }}
        background="#F5F0E1"
        style={{
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          position: "relative",
          overflow: "hidden",
          paddingTop: "80px",
          paddingLeft: "50px",
          paddingRight: "50px",
          paddingBottom: "50px",
        }}
      >
        {/* Diagonal stripe decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "150%",
            height: "60px",
            background:
              "repeating-linear-gradient(45deg, #CC0000, #CC0000 20px, #000 20px, #000 40px)",
            transform: "rotate(-3deg) translateX(-50px) translateY(-10px)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* Header */}
          <div
            className="constructivist-header"
            style={{
              ...flexContainer("row", "space-between", "flex-start"),
              marginBottom: spacing["4xl"],
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "#CC0000",
                  lineHeight: 0.85,
                  letterSpacing: "-4px",
                  textTransform: "uppercase",
                }}
              >
                INV<span style={{ color: "#000" }}>OICE</span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "flex-start", "center", spacing.lg),
                  marginTop: spacing.lg,
                }}
              >
                <div
                  style={{
                    background: "#000",
                    color: "#F5F0E1",
                    padding: "10px 20px",
                    transform: "skewX(-5deg)",
                  }}
                >
                  <span
                    style={{
                      fontSize: spacing.md,
                      letterSpacing: "3px",
                      color: "#F5F0E1",
                    }}
                  >
                    NO. {invoice.invoice_number}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", maxWidth: "250px" }}>
              <div
                style={{
                  fontSize: spacing["3xl"],
                  fontWeight: 900,
                  textTransform: "uppercase",
                  marginBottom: spacing.md,
                  color: "#CC0000",
                }}
              >
                {getCompanyInfo(profile, "company_name")}
              </div>
              <div
                style={{
                  fontSize: spacing.base,
                  lineHeight: 1.8,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {companyDetails}
              </div>
            </div>
          </div>

          {/* Info Section with diagonal cut */}
          <div
            className="constructivist-info-section"
            style={{
              ...flexContainer("row", "flex-start", "stretch"),
              marginBottom: spacing["4xl"],
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#CC0000",
                color: "#fff",
                padding: spacing["2xl"],
                clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
              }}
            >
              <div
                style={{
                  fontSize: spacing.base,
                  letterSpacing: "4px",
                  marginBottom: spacing.lg,
                  opacity: 0.8,
                }}
              >
                → BILL TO
              </div>
              <div
                style={{
                  fontSize: spacing.lg,
                  fontWeight: 900,
                  textTransform: "uppercase",
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
                  fontSize: spacing.base,
                  lineHeight: 1.8,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {clientAddress}
              </div>
            </div>
            <div
              style={{
                width: "200px",
                background: "#000",
                color: "#F5F0E1",
                padding: spacing["2xl"],
                marginLeft: "-20px",
                clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              <div style={{ marginBottom: spacing.lg }}>
                <div
                  style={{
                    fontSize: spacing.sm,
                    letterSpacing: "3px",
                    opacity: 0.6,
                    color: "#F5F0E1",
                  }}
                >
                  ISSUED
                </div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 900,
                    marginTop: spacing.xs,
                    color: "#F5F0E1",
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: spacing.sm,
                    letterSpacing: "3px",
                    opacity: 0.6,
                    color: "#F5F0E1",
                  }}
                >
                  DUE
                </div>
                <div
                  style={{
                    fontSize: spacing.base,
                    fontWeight: 900,
                    marginTop: spacing.xs,
                    color: "#CC0000",
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div
            style={{
              marginBottom: spacing["4xl"],
              marginLeft: `-${spacing["2xl"]}px`,
              marginRight: `-${spacing["2xl"]}px`,
            }}
          >
            <div
              style={{
                ...flexContainer("row", "flex-start", "center", spacing.lg),
                marginBottom: spacing.lg,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "4px",
                  background: "#CC0000",
                }}
              />
              <span
                style={{
                  fontSize: spacing.md,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                Line Items
              </span>
              <div style={{ flex: 1, height: "4px", background: "#000" }} />
            </div>
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
                bodyPadding: `${spacing.lg}px`,
                headerTextColor: "#fff",
                headerBgColor: "transparent",
                bodyTextColor: "#000",
                borderColor: "#000",
                headerBorderBottom: "none",
                rowBorderBottom: "2px solid #000",
                headerFontWeight: "normal",
                headerLetterSpacing: "3px",
                bodyFontWeight: "normal",
                amountFontWeight: 900,
                amountColor: "#fff",
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                descriptionCellStyle: {
                  textTransform: "uppercase",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: 0,
                },
                quantityCellStyle: {
                  fontWeight: 900,
                  fontSize: spacing.base,
                },
                amountCellStyle: {
                  background: "#CC0000",
                },
                headerStyle: {
                  background: "linear-gradient(90deg, #CC0000 0%, #000 100%)",
                },
                bodyStyle: {
                  marginBottom: 0,
                  background: "#fff",
                  border: "3px solid #000",
                },
              }}
            />
          </div>

          {/* Totals */}
          <div
            style={{
              ...flexContainer("row", "flex-end", "flex-start"),
              marginBottom: spacing["4xl"],
            }}
          >
            <div style={{ minWidth: "320px" }}>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.md}px 0`,
                  borderBottom: "2px solid #000",
                }}
              >
                <span
                  style={{
                    fontSize: spacing.md,
                    letterSpacing: "2px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  SUBTOTAL
                </span>
                <span style={{ fontWeight: 900 }}>
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.md}px 0`,
                  borderBottom: "2px solid #000",
                }}
              >
                <span
                  style={{
                    fontSize: spacing.md,
                    letterSpacing: "2px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  TAX
                </span>
                <span style={{ fontWeight: 900 }}>
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  background: "linear-gradient(90deg, #CC0000, #000)",
                  color: "#fff",
                  padding: spacing.lg,
                  marginTop: spacing.lg,
                  transform: "skewX(-3deg)",
                }}
              >
                <div
                  style={{
                    transform: "skewX(3deg)",
                    ...flexContainer("row", "space-between", "center"),
                  }}
                >
                  <span
                    style={{
                      fontSize: spacing.lg,
                      letterSpacing: "3px",
                      color: "#fff",
                    }}
                  >
                    TOTAL
                  </span>
                  <span
                    style={{ fontSize: "30px", fontWeight: 900, color: "#fff" }}
                  >
                    {formatCurrencyWithCode(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <Section
            title="PAYMENT INFORMATION"
            style={{
              border: "3px solid #000",
              borderLeft: "8px solid #CC0000",
              padding: spacing["2xl"],
              background: "#fff",
            }}
            titleStyle={{
              fontSize: spacing.base,
              fontWeight: 900,
              letterSpacing: "4px",
              marginBottom: spacing.lg,
            }}
            contentStyle={{
              fontSize: spacing.md,
              lineHeight: 1.9,
              fontFamily: "'Courier New', monospace",
            }}
          >
            <PaymentInformation profile={profile} invoice={invoice} />
          </Section>

          {invoice.notes && (
            <Section
              title="NOTES"
              style={{
                marginTop: spacing["2xl"],
                padding: spacing.lg,
                background: "#000",
                color: "#F5F0E1",
              }}
              titleStyle={{
                fontSize: spacing.base,
                letterSpacing: "3px",
                marginBottom: spacing.md,
                color: "#CC0000",
              }}
              contentStyle={{
                fontSize: spacing.md,
                lineHeight: 1.8,
                fontFamily: "'Courier New', monospace",
              }}
            >
              {invoice.notes}
            </Section>
          )}
        </div>

        {/* Bottom stripe */}
        <div
          style={{
            height: "30px",
            background:
              "repeating-linear-gradient(45deg, #CC0000, #CC0000 20px, #000 20px, #000 40px)",
            marginTop: spacing["4xl"],
            marginLeft: `-${spacing["4xl"]}px`,
            marginRight: `-${spacing["4xl"]}px`,
          }}
        />
      </InvoiceContainer>
    </>
  );
};

export const ConstructivistTemplate = {
  id: "constructivist" as const,
  name: "Constructivist",
  description:
    "Soviet-era constructivist art style with diagonal elements and red/black palette",
  Component: ConstructivistTemplateComponent,
};
