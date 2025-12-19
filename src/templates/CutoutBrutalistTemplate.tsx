import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import { getCompanyInfo, formatClientAddress } from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";
import { InvoiceContainer, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";

const CutoutBrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("cutout-brutalist-template", {
    padding: true,
    table: true,
    layout: "flex",
  });

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
        className="cutout-brutalist-template"
        maxWidth={794}
        padding={{ desktop: 60, tablet: 30, mobile: 20 }}
        background="linear-gradient(135deg, #FAF8F5 0%, #F0EDE8 100%)"
        style={{
          fontFamily: "'Georgia', serif",
          position: "relative",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            width: "120px",
            height: "120px",
            background: "#FF6B35",
            transform: "rotate(15deg)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "100px",
            width: "80px",
            height: "80px",
            background: "#004E89",
            transform: "rotate(-10deg)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "40px",
            width: "60px",
            height: "60px",
            border: "4px solid #1A535C",
            transform: "rotate(25deg)",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginBottom: spacing["4xl"],
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              border: "3px solid #000",
              padding: `${spacing["2xl"]}px ${spacing["4xl"]}px`,
              boxShadow: "8px 8px 0 rgba(0,0,0,0.1)",
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: "64px",
                fontWeight: 900,
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              INV
              <span
                style={{
                  background: "#FF6B35",
                  color: "#fff",
                  padding: "0 10px",
                }}
              >
                OI
              </span>
              CE
            </div>
          </div>
          <div
            style={{
              display: "inline-block",
              marginLeft: "-20px",
              background: "#1A535C",
              color: "#fff",
              padding: `${spacing.xl}px ${spacing["2xl"]}px`,
              transform: "rotate(3deg)",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: spacing.base,
                letterSpacing: "3px",
              }}
            >
              NUMBER
            </div>
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: spacing.lg,
                marginTop: spacing.xs,
              }}
            >
              {invoice.invoice_number}
            </div>
          </div>
        </div>

        {/* Company strip */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "#000",
            color: "#fff",
            padding: `${spacing.xl}px ${spacing["2xl"]}px`,
            marginBottom: spacing["3xl"],
            marginLeft: `-${spacing["2xl"]}px`,
            marginRight: `-${spacing["2xl"]}px`,
            transform: "rotate(-0.5deg)",
          }}
        >
          <div
            style={{
              ...flexContainer("row", "space-between", "center"),
            }}
          >
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: spacing.base,
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: spacing.md,
                color: "#fff",
              }}
            >
              {getCompanyInfo(profile, "email")} |{" "}
              {getCompanyInfo(profile, "phone")}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div
          className="cutout-info-cards"
          style={{
            position: "relative",
            zIndex: 1,
            ...flexContainer("row", "flex-start", "stretch", spacing["2xl"]),
            marginBottom: spacing["4xl"],
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "2px solid #000",
              padding: spacing["2xl"],
              boxShadow: "6px 6px 0 #FFE4B5",
              transform: "rotate(-1deg)",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: spacing.sm,
                letterSpacing: "3px",
                color: "#666",
                marginBottom: spacing.md,
                borderBottom: "2px solid #000",
                paddingBottom: spacing.sm,
              }}
            >
              BILLED TO
            </div>
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: spacing["3xl"],
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
                fontFamily: "'Georgia', serif",
                fontSize: spacing.md,
                lineHeight: 1.8,
                color: "#333",
              }}
            >
              {clientAddress}
            </div>
          </div>
          <div
            className="cutout-date-cards"
            style={{
              ...flexContainer("column", "flex-start", "stretch", spacing.lg),
              width: "180px",
            }}
          >
            <div
              style={{
                background: "#004E89",
                color: "#fff",
                padding: spacing.lg,
                marginBottom: 0,
                transform: "rotate(2deg)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: spacing.sm,
                  letterSpacing: "2px",
                  opacity: 0.7,
                }}
              >
                ISSUED
              </div>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: spacing.base,
                  marginTop: spacing.sm,
                }}
              >
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div
              style={{
                background: "#FF6B35",
                color: "#fff",
                padding: spacing.lg,
                transform: "rotate(-1deg)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: spacing.sm,
                  letterSpacing: "2px",
                  opacity: 0.7,
                }}
              >
                DUE DATE
              </div>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: spacing.base,
                  marginTop: spacing.sm,
                }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div
          className="cutout-items-table"
          style={{
            position: "relative",
            zIndex: 1,
            background: "#fff",
            border: "2px solid #000",
            marginBottom: spacing["3xl"],
            boxShadow: "8px 8px 0 #1A535C",
            transform: "rotate(0.5deg)",
            width: "100%",
            boxSizing: "border-box",
          }}
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
              headerFontSize: spacing.base,
              bodyFontSize: spacing.lg,
              headerPadding: `${spacing["3xl"]}px`,
              bodyPadding: `${spacing.base}px`,
              headerTextColor: "#fff",
              headerBgColor: "transparent",
              bodyTextColor: "#000",
              borderColor: "#ddd",
              headerBorderBottom: "none",
              rowBorderBottom: "1px solid #ddd",
              headerFontWeight: "normal",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 900,
              headerStyle: {
                background: "linear-gradient(90deg, #1A535C, #004E89)",
              },
              descriptionCellStyle: {
                fontFamily: "'Times New Roman', serif",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              quantityCellStyle: {
                fontFamily: "'Courier New', monospace",
                fontWeight: 900,
              },
              unitPriceCellStyle: {
                fontFamily: "'Courier New', monospace",
              },
              amountCellStyle: {
                fontFamily: "'Courier New', monospace",
                background: "#FFE4B5",
              },
              bodyStyle: {
                marginBottom: 0,
              },
            }}
          />
        </div>

        {/* Totals */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            ...flexContainer("row", "flex-end", "flex-start"),
            marginBottom: spacing["3xl"],
          }}
        >
          <div style={{ minWidth: "300px" }}>
            <div
              style={{
                background: "#fff",
                border: "2px solid #000",
                padding: "5px 0",
                boxShadow: "4px 4px 0 #FFE4B5",
              }}
            >
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.md}px ${spacing.lg}px`,
                  borderBottom: "1px dashed #ccc",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: spacing.md,
                    letterSpacing: "2px",
                  }}
                >
                  SUBTOTAL
                </span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                  }}
                >
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                  padding: `${spacing.md}px ${spacing.lg}px`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: spacing.md,
                    letterSpacing: "2px",
                  }}
                >
                  TAX
                </span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                  }}
                >
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
            </div>
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: spacing.lg,
                marginTop: "-5px",
                transform: "rotate(-1deg)",
                boxShadow: "6px 6px 0 #FF6B35",
              }}
            >
              <div
                style={{
                  ...flexContainer("row", "space-between", "center"),
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: spacing.md,
                    letterSpacing: "3px",
                    color: "#fff",
                  }}
                >
                  TOTAL DUE
                </span>
                <span
                  style={{
                    fontFamily: "'Arial Black', sans-serif",
                    fontSize: "28px",
                    color: "#fff",
                  }}
                >
                  {formatCurrencyWithCode(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <Section
          title="PAYMENT DETAILS"
          style={{
            position: "relative",
            zIndex: 1,
            background: "#FFE4B5",
            border: "2px solid #000",
            padding: spacing["2xl"],
            transform: "rotate(0.3deg)",
          }}
          titleStyle={{
            fontFamily: "'Courier New', monospace",
            fontSize: spacing.base,
            letterSpacing: "3px",
            marginBottom: spacing.md,
            paddingBottom: spacing.sm,
            borderBottom: "2px solid #000",
          }}
          contentStyle={{
            fontFamily: "'Georgia', serif",
            fontSize: spacing.lg,
            lineHeight: 1.9,
          }}
        >
          <PaymentInformation profile={profile} invoice={invoice} />
        </Section>

        {invoice.notes && (
          <Section
            title="NOTES"
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: spacing["2xl"],
              background: "#fff",
              borderLeft: "6px solid #FF6B35",
              padding: `${spacing.lg}px ${spacing["2xl"]}px`,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",
            }}
            titleStyle={{
              fontFamily: "'Courier New', monospace",
              fontSize: spacing.sm,
              letterSpacing: "3px",
              color: "#666",
              marginBottom: spacing.md,
            }}
            contentStyle={{
              fontFamily: "'Georgia', serif",
              fontSize: spacing.lg,
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            {invoice.notes}
          </Section>
        )}
      </InvoiceContainer>
    </>
  );
};

export const CutoutBrutalistTemplate = {
  id: "cutout-brutalist" as const,
  name: "Cutout Brutalist",
  description:
    "Paper cutout collage style with overlapping shapes and newsprint textures",
  Component: CutoutBrutalistTemplateComponent,
};
