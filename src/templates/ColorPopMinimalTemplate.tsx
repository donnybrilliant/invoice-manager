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

const ColorPopMinimalTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .color-pop-minimal-template {
            padding: 30px !important;
          }
          /* Make address section wrap on small screens */
          .color-pop-minimal-template .address-section {
            flex-direction: column !important;
            gap: 30px !important;
          }
          /* Fix totals overflow on tiny screens */
          .color-pop-minimal-template .totals-section {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
        /* When container is narrow enough that items would overlap, make payment info full width and left-aligned */
        /* Totals: 260px + Payment: 320px + Gap: 20px = 600px minimum needed */
        /* Set breakpoint at 600px to trigger exactly when wrapping occurs */
        @container (max-width: 600px) {
          .totals-container .payment-info-wrapper {
            flex: 1 1 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            width: 100% !important;
            text-align: left !important;
          }
          .totals-container .totals-section {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
      <div
        className="color-pop-minimal-template"
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          maxWidth: "794px",
          margin: "0 auto",
          padding: "50px",
          background: colors.white,
        }}
      >
        {/* Minimal Header with Color Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              width: "8px",
              background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 33%, ${colors.tertiary} 66%, ${colors.quad} 100%)`,
              marginRight: "30px",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 900,
                    color: colors.black,
                    letterSpacing: "-2px",
                    lineHeight: 1,
                  }}
                >
                  Invoice
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 300,
                    color: colors.black + "50",
                    marginTop: "5px",
                  }}
                >
                  #{invoice.invoice_number}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: colors.black + "60",
                    marginBottom: "4px",
                  }}
                >
                  Issue Date
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "15px",
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: colors.black + "60",
                    marginBottom: "4px",
                  }}
                >
                  Due Date
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: colors.primary,
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Address Section */}
        <div
          className="address-section"
          style={{
            display: "flex",
            gap: "60px",
            marginBottom: "50px",
            paddingBottom: "50px",
            borderBottom: "3px solid " + colors.black,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: colors.tertiary,
                fontWeight: 700,
                marginBottom: "15px",
              }}
            >
              From
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: colors.black + "80",
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
              <br />
              {getCompanyInfo(profile, "phone")}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: colors.primary,
                fontWeight: 700,
                marginBottom: "15px",
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                marginBottom: "10px",
              }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: colors.black + "80",
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
        <div style={{ marginBottom: "40px" }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: "11px",
              bodyFontSize: "15px",
              headerPadding: "15px 0",
              bodyPadding: "20px 0",
              headerTextColor: colors.black + "60",
              bodyTextColor: colors.black,
              borderColor: colors.black + "20",
              headerBorderBottom: "3px solid " + colors.black,
              rowBorderBottom: "1px solid " + colors.black + "20",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 800,
              quantityCellStyle: { fontWeight: 700 },
              bodyStyle: { marginBottom: 0 },
            }}
          />
        </div>

        {/* Totals */}
        <div
          className="totals-container"
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
            containerType: "inline-size",
          }}
        >
          <div
            className="totals-section"
            style={{ width: "260px", flex: "0 0 auto", minWidth: 0 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid " + colors.black + "15",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{ color: colors.black + "60", whiteSpace: "nowrap" }}
              >
                Subtotal
              </span>
              <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid " + colors.black + "15",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{ color: colors.black + "60", whiteSpace: "nowrap" }}
              >
                Tax
              </span>
              <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
                marginTop: "10px",
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                marginLeft: "-20px",
                marginRight: "-20px",
                paddingLeft: "20px",
                paddingRight: "20px",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: colors.white,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: colors.white,
                  whiteSpace: "nowrap",
                }}
              >
                {formatCurrencyWithCode(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "25px",
              background: colors.quad + "20",
              borderLeft: "4px solid " + colors.quad,
              flex: "0 1 320px",
              minWidth: "200px",
            }}
            className="payment-info-wrapper"
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: colors.black + "60",
                marginBottom: "12px",
              }}
            >
              Payment Information
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                color: colors.black + "80",
              }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div
            style={{
              marginTop: "40px",
              paddingTop: "30px",
              borderTop: "1px dashed " + colors.black + "30",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: colors.tertiary,
                color: colors.black,
                padding: "4px 10px",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Notes
            </div>
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: colors.black + "70",
              }}
            >
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const ColorPopMinimalTemplate = {
  id: "color-pop-minimal" as const,
  name: "Color Pop Minimal",
  description: "Clean minimal layout with bold color accents",
  Component: ColorPopMinimalTemplateComponent,
};
