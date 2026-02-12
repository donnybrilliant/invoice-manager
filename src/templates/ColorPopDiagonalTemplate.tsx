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

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopDiagonalTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .color-pop-diagonal-template {
            border-width: 4px !important;
          }
        }
        /* When container is narrow enough that items would overlap, make payment info full width and left-aligned */
        @container (max-width: 600px) {
          .totals-container .payment-info-wrapper {
            flex: 1 1 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            width: 100% !important;
            text-align: left !important;
            border-right: none !important;
            border-top: 4px solid hsl(0, 0%, 0%) !important;
          }
          .totals-container .totals-wrapper {
            width: 100% !important;
            flex: 1 1 100% !important;
          }
        }
      `}</style>
      <div
        className="color-pop-diagonal-template"
        style={{
          fontFamily: "'Arial Black', sans-serif",
          maxWidth: "794px",
          margin: "0 auto",
          background: colors.white,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Diagonal stripe background */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-100px",
            width: "300px",
            height: "200px",
            background: colors.secondary,
            transform: "rotate(15deg)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "-150px",
            width: "400px",
            height: "80px",
            background: colors.tertiary,
            transform: "rotate(15deg)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            border: "6px solid " + colors.black,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "40px",
              background: colors.primary,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${colors.black}10 10px, ${colors.black}10 20px)`,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: colors.white,
                    textTransform: "uppercase",
                    letterSpacing: "5px",
                    marginBottom: "8px",
                  }}
                >
                  Invoice
                </div>
                <div
                  style={{
                    fontSize: "64px",
                    color: colors.white,
                    fontWeight: 900,
                    lineHeight: 1,
                    textShadow: "5px 5px 0 " + colors.black,
                  }}
                >
                  #{invoice.invoice_number}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    background: colors.black,
                    color: colors.white,
                    padding: "20px 30px",
                    transform: "rotate(3deg)",
                    boxShadow: "6px 6px 0 " + colors.secondary,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: "5px",
                      color: colors.white,
                    }}
                  >
                    Amount Due
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 900,
                      color: colors.white,
                    }}
                  >
                    {formatCurrencyWithCode(invoice.total, invoice.currency, invoice.locale)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Strip */}
          <div
            style={{
              display: "flex",
              borderBottom: "6px solid " + colors.black,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "15px 25px",
                background: colors.tertiary,
                borderRight: "4px solid " + colors.black,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginRight: "10px",
                }}
              >
                Issued:
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatDate(invoice.issue_date, { locale: invoice.locale, language: invoice.language })}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                padding: "15px 25px",
                background: colors.quad,
                borderRight: "4px solid " + colors.black,
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginRight: "10px",
                }}
              >
                Due:
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatDate(invoice.due_date, { locale: invoice.locale, language: invoice.language })}
              </span>
            </div>
            <div
              style={{
                flex: 1.5,
                padding: "15px 25px",
                background: colors.secondary,
              }}
            >
              <span style={{ fontWeight: 900 }}>
                {getCompanyInfo(profile, "company_name")}
              </span>
            </div>
          </div>

          {/* Addresses */}
          <div
            style={{
              display: "flex",
              borderBottom: "6px solid " + colors.black,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "30px",
                borderRight: "4px solid " + colors.black,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: colors.tertiary,
                  padding: "6px 12px",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: 900,
                  marginBottom: "15px",
                  transform: "rotate(-2deg)",
                }}
              >
                From
              </div>
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
                  fontSize: "16px",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                {getCompanyInfo(profile, "company_name")}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.8,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {formatCompanyAddress(profile)
                  .split("\n")
                  .map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                {getCompanyInfo(profile, "email")}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "30px",
                background: `linear-gradient(135deg, ${colors.quad}20 0%, ${colors.white} 100%)`,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: colors.primary,
                  color: colors.white,
                  padding: "6px 12px",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: 900,
                  marginBottom: "15px",
                  transform: "rotate(-2deg)",
                }}
              >
                Bill To
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                {client.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.8,
                  fontFamily: "Arial, sans-serif",
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
                {client.email}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: "11px",
              bodyFontSize: "14px",
              headerPadding: "16px 20px",
              bodyPadding: "18px 20px",
              headerTextColor: colors.white,
              headerBgColor: colors.black,
              bodyTextColor: colors.black,
              borderColor: colors.black,
              headerBorderBottom: "none",
              rowBorderBottom: "2px solid " + colors.black,
              headerFontWeight: "normal",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: 600,
              amountFontWeight: 900,
              // Note: Component applies alternatingRowColor to even rows (0, 2, 4...)
              // ColorPopDiagonal needs odd rows (1, 3, 5...) colored, so pattern is inverted
              alternatingRowColor: colors.quad + "20",
              quantityCellStyle: { fontWeight: 800 },
              bodyStyle: { marginBottom: 0 },
            }}
          />

          {/* Totals */}
          <div
            className="totals-container"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "0",
              borderTop: "4px solid " + colors.black,
              containerType: "inline-size",
            }}
          >
            <div
              className="totals-wrapper"
              style={{ flex: "1 1 280px", minWidth: "280px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px 25px",
                  borderBottom: "2px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Subtotal
                </span>
                <span style={{ fontWeight: 800 }}>
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency, invoice.locale)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px 25px",
                  borderBottom: "4px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Tax
                </span>
                <span style={{ fontWeight: 800 }}>
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency, invoice.locale)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "25px",
                  background: colors.primary,
                  color: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 900,
                  }}
                >
                  Total
                </span>
                <span style={{ fontSize: "26px", fontWeight: 900 }}>
                  {formatCurrencyWithCode(invoice.total, invoice.currency, invoice.locale)}
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "25px",
                background: colors.secondary + "30",
                borderRight: "4px solid " + colors.black,
                flex: "0 1 320px",
                minWidth: "200px",
              }}
              className="payment-info-wrapper"
            >
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 900,
                  marginBottom: "12px",
                }}
              >
                Payment Details
              </div>
              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.7,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <PaymentInformation profile={profile} invoice={invoice} />
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div
              style={{
                padding: "25px",
                borderTop: "4px solid " + colors.black,
                background: colors.tertiary + "20",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  fontSize: "60px",
                  color: colors.tertiary + "40",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                "
              </div>
              <div
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                Notes
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.7,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {invoice.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const ColorPopDiagonalTemplate = {
  id: "color-pop-diagonal" as const,
  name: "Color Pop Diagonal",
  description: "Dynamic diagonal stripes with color accents",
  Component: ColorPopDiagonalTemplateComponent,
};
