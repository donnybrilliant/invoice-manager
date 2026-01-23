import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatCompanyAddress,
  formatClientAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";

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
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .color-pop-stacked-template {
            padding: 20px !important;
          }
          /* Make payment info full width when wrapped on its own line */
          .color-pop-stacked-template .totals-section > div > div:last-child {
            max-width: 100% !important;
            width: 100% !important;
            flex: 1 1 100% !important;
          }
        }
      `}</style>
      <div
        className="color-pop-stacked-template"
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          maxWidth: "794px",
          margin: "0 auto",
          padding: "40px",
          background: colors.black,
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
              padding: "40px",
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
                  marginTop: "15px",
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    padding: "10px 20px",
                    fontWeight: 900,
                    fontSize: "14px",
                  }}
                >
                  #{invoice.invoice_number}
                </div>
                <div
                  style={{
                    background: colors.quad,
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
                <div
                  style={{
                    background: colors.secondary,
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: "14px",
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
                padding: "30px",
                background: colors.tertiary + "30",
                borderBottom: "4px solid " + colors.black,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: colors.black,
                    color: colors.white,
                    padding: "8px 16px",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  From
                </div>
                <div>
                  {profile?.logo_url && (
                    <img
                      src={profile.logo_url}
                      alt="Company Logo"
                      style={{
                        maxWidth: "120px",
                        maxHeight: "60px",
                        marginBottom: "12px",
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      marginBottom: "8px",
                    }}
                  >
                    {getCompanyInfo(profile, "company_name")}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
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
                padding: "30px",
                background: colors.quad + "30",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    padding: "8px 16px",
                    fontSize: "11px",
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
                      fontSize: "20px",
                      fontWeight: 900,
                      marginBottom: "8px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {client.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
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
          <div style={{ padding: "30px", background: colors.white }}>
            <div
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "4px",
                fontWeight: 900,
                marginBottom: "20px",
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
                    padding: "20px",
                    marginBottom: index < items.length - 1 ? "-4px" : "0",
                    position: "relative",
                    boxShadow: "6px 6px 0 " + colors.black,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 2 }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 900,
                          color: textColor,
                          marginBottom: "4px",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {item.description}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
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
                        fontSize: "24px",
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
              padding: "30px",
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
                gap: "20px",
              }}
            >
              <div
                style={{
                  textAlign: "right",
                  flex: "0 0 auto",
                  minWidth: "200px",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", marginRight: "20px" }}>
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "16px",
                    }}
                  >
                    {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ fontSize: "13px", marginRight: "20px" }}>
                    Tax
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "16px",
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
                    padding: "20px 30px",
                    display: "inline-block",
                    boxShadow: "6px 6px 0 " + colors.black,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: "5px",
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
                <div
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 900,
                    marginBottom: "12px",
                  }}
                >
                  Payment Info
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.7,
                    color: colors.black + "99",
                  }}
                >
                  <PaymentInformation profile={profile} invoice={invoice} />
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div
              style={{
                padding: "25px 30px",
                borderTop: "4px dashed " + colors.black,
                background: colors.white,
              }}
            >
              <div style={{ display: "flex", gap: "15px" }}>
                <div
                  style={{
                    background: colors.tertiary,
                    padding: "6px 12px",
                    fontSize: "10px",
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
                    fontSize: "13px",
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
      </div>
    </>
  );
};

export const ColorPopStackedTemplate = {
  id: "color-pop-stacked" as const,
  name: "Color Pop Stacked",
  description: "Vertical stacked cards layout",
  Component: ColorPopStackedTemplateComponent,
};
