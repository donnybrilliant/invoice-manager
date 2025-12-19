import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatCompanyAddress,
  formatClientAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceContainer, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopStackedTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("color-pop-stacked-template", {
    padding: true,
    layout: "flex",
  });

  return (
    <>
      <style>{templateCSS}</style>
      <style>{`
        /* Make payment info full width when wrapped on its own line */
        .color-pop-stacked-template .totals-section > div > div:last-child {
          max-width: 100% !important;
          width: 100% !important;
          flex: 1 1 100% !important;
        }
      `}</style>
      <InvoiceContainer
        className="color-pop-stacked-template"
        maxWidth={794}
        padding={{ desktop: 40, tablet: 20, mobile: 20 }}
        background={colors.black}
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Main Card */}
        <div
          style={{
            background: colors.white,
            border: "6px solid " + colors.black,
            boxShadow: "12px 12px 0 " + colors.primary,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: spacing["3xl"],
              borderBottom: "6px solid " + colors.black,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "200px",
                height: "200px",
                background: colors.secondary,
                borderRadius: "50%",
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: "50px",
                width: "100px",
                height: "100px",
                background: colors.tertiary,
                borderRadius: "50%",
                opacity: 0.5,
              }}
            />

            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: "80px",
                  fontWeight: 900,
                  color: colors.black,
                  lineHeight: 0.9,
                  letterSpacing: "-4px",
                }}
              >
                INVOICE
              </div>
              <div
                style={{
                  marginTop: spacing.lg,
                  ...flexContainer("row", "flex-start", "center", spacing.lg),
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    padding: "10px 20px",
                    fontWeight: 900,
                    fontSize: spacing.lg,
                  }}
                >
                  #{invoice.invoice_number}
                </div>
                <div
                  style={{
                    background: colors.quad,
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: spacing.lg,
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
                <div
                  style={{
                    background: colors.secondary,
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: spacing.lg,
                  }}
                >
                  Due: {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>

          {/* From/To Stack */}
          <div style={{ borderBottom: "6px solid " + colors.black }}>
            <div
              style={{
                padding: spacing["2xl"],
                background: colors.tertiary + "30",
                borderBottom: "4px solid " + colors.black,
              }}
            >
              <div
                style={{
                  ...flexContainer(
                    "row",
                    "flex-start",
                    "flex-start",
                    spacing.lg
                  ),
                }}
              >
                <div
                  style={{
                    background: colors.black,
                    color: colors.white,
                    padding: "8px 16px",
                    fontSize: spacing.base,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  From
                </div>
                <div>
                  <div
                    style={{
                      fontSize: spacing.lg,
                      fontWeight: 900,
                      marginBottom: spacing.sm,
                    }}
                  >
                    {getCompanyInfo(profile, "company_name")}
                  </div>
                  <div
                    style={{
                      fontSize: spacing.md,
                      lineHeight: 1.6,
                      color: colors.black + "99",
                    }}
                  >
                    {formatCompanyAddress(profile).replace(/\n/g, " • ")} •{" "}
                    {getCompanyInfo(profile, "email")} •{" "}
                    {getCompanyInfo(profile, "phone")}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: spacing["2xl"],
                background: colors.quad + "30",
              }}
            >
              <div
                style={{
                  ...flexContainer(
                    "row",
                    "flex-start",
                    "flex-start",
                    spacing.lg
                  ),
                }}
              >
                <div
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    padding: "8px 16px",
                    fontSize: spacing.base,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  Bill To
                </div>
                <div>
                  <div
                    style={{
                      fontSize: spacing.lg,
                      fontWeight: 900,
                      marginBottom: spacing.sm,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {client.name}
                  </div>
                  <div
                    style={{
                      fontSize: spacing.md,
                      lineHeight: 1.6,
                      color: colors.black + "99",
                    }}
                  >
                    {formatClientAddress(client).replace(/\n/g, " • ")} •{" "}
                    {client.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Stack */}
          <div style={{ padding: spacing["2xl"], background: colors.white }}>
            <div
              style={{
                fontSize: spacing.md,
                textTransform: "uppercase",
                letterSpacing: "4px",
                fontWeight: 900,
                marginBottom: spacing.lg,
                color: colors.black + "60",
              }}
            >
              Line Items
            </div>
            {items.map((item, index) => {
              const bgColors = [
                colors.secondary,
                colors.tertiary,
                colors.quad,
                colors.primary,
              ];
              const bg = bgColors[index % bgColors.length];
              const textColor = index % 4 === 3 ? colors.white : colors.black;
              return (
                <div
                  key={item.id || index}
                  style={{
                    background: bg,
                    border: "4px solid " + colors.black,
                    padding: spacing.lg,
                    marginBottom: index < items.length - 1 ? "-4px" : "0",
                    position: "relative",
                    boxShadow: "6px 6px 0 " + colors.black,
                  }}
                >
                  <div
                    style={{
                      ...flexContainer("row", "space-between", "center"),
                    }}
                  >
                    <div style={{ flex: 2 }}>
                      <div
                        style={{
                          fontSize: spacing["3xl"],
                          fontWeight: 900,
                          color: textColor,
                          marginBottom: spacing.xs,
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {item.description}
                      </div>
                      <div
                        style={{
                          fontSize: spacing.md,
                          color: textColor + "80",
                        }}
                      >
                        {item.quantity} ×{" "}
                        {formatCurrencyWithCode(
                          item.unit_price,
                          invoice.currency
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: spacing["4xl"],
                        fontWeight: 900,
                        color: textColor,
                      }}
                    >
                      {formatCurrencyWithCode(item.amount, invoice.currency)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div
            className="totals-section"
            style={{
              padding: spacing["2xl"],
              background: colors.secondary + "40",
              borderTop: "6px solid " + colors.black,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: `${spacing.lg}px`,
              }}
            >
              <div
                style={{
                  textAlign: "right",
                  flex: "0 0 auto",
                  minWidth: "200px",
                }}
              >
                <div style={{ marginBottom: spacing.md }}>
                  <span
                    style={{ fontSize: spacing.md, marginRight: spacing.lg }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: spacing.base,
                    }}
                  >
                    {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                <div style={{ marginBottom: spacing.lg }}>
                  <span
                    style={{ fontSize: spacing.md, marginRight: spacing.lg }}
                  >
                    Tax
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: spacing.base,
                    }}
                  >
                    {formatCurrencyWithCode(
                      invoice.tax_amount,
                      invoice.currency
                    )}
                  </span>
                </div>
                <div
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    padding: `${spacing.lg}px ${spacing["2xl"]}px`,
                    display: "inline-block",
                    boxShadow: "6px 6px 0 " + colors.black,
                  }}
                >
                  <div
                    style={{
                      fontSize: spacing.sm,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: spacing.xs,
                    }}
                  >
                    Total
                  </div>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: 900,
                    }}
                  >
                    {formatCurrencyWithCode(invoice.total, invoice.currency)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  maxWidth: "300px",
                  minWidth: "200px",
                  flex: "1 1 200px",
                }}
              >
                <Section
                  title="Payment Info"
                  titleStyle={{
                    fontSize: spacing.base,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 900,
                    marginBottom: spacing.md,
                  }}
                  contentStyle={{
                    fontSize: spacing.md,
                    lineHeight: 1.7,
                    color: colors.black + "99",
                  }}
                >
                  <PaymentInformation profile={profile} invoice={invoice} />
                </Section>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div
              style={{
                padding: `${spacing["2xl"]}px ${spacing["2xl"]}px`,
                borderTop: "4px dashed " + colors.black,
                background: colors.white,
              }}
            >
              <div
                style={{
                  ...flexContainer(
                    "row",
                    "flex-start",
                    "flex-start",
                    spacing.lg
                  ),
                }}
              >
                <div
                  style={{
                    background: colors.tertiary,
                    padding: "6px 12px",
                    fontSize: spacing.sm,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 900,
                    height: "fit-content",
                  }}
                >
                  Notes
                </div>
                <div
                  style={{
                    fontSize: spacing.md,
                    lineHeight: 1.7,
                    color: colors.black + "99",
                  }}
                >
                  {invoice.notes}
                </div>
              </div>
            </div>
          )}
        </div>
      </InvoiceContainer>
    </>
  );
};

export const ColorPopStackedTemplate = {
  id: "color-pop-stacked" as const,
  name: "Color Pop Stacked",
  description: "Vertical stacked cards layout",
  Component: ColorPopStackedTemplateComponent,
};
