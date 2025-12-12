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

const ColorPopGridTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .color-pop-grid-template {
            border-width: 3px !important;
          }
          .color-pop-grid-header {
            grid-template-columns: 1fr !important;
          }
          .color-pop-grid-info {
            grid-template-columns: 1fr !important;
          }
          .color-pop-grid-totals {
            grid-template-columns: 1fr !important;
          }
          .color-pop-grid-totals > div {
            border-right: none !important;
            border-bottom: 5px solid hsl(0, 0%, 0%) !important;
          }
          .color-pop-grid-totals > div:last-child {
            border-bottom: none !important;
          }
          .color-pop-grid-totals .payment-info-section {
            order: 3 !important;
          }
          .color-pop-grid-totals .subtotal-section {
            order: 1 !important;
          }
          .color-pop-grid-totals .total-section {
            order: 2 !important;
          }
        }
      `}</style>
      <div
        className="color-pop-grid-template"
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          background: colors.white,
          border: "5px solid " + colors.black,
        }}
      >
        {/* Top Grid Header */}
        <div
          className="color-pop-grid-header"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            borderBottom: "5px solid " + colors.black,
          }}
        >
          <div
            style={{
              background: colors.primary,
              padding: "40px 25px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: colors.white,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
              }}
            >
              Invoice
            </div>
            <div
              style={{
                fontSize: "36px",
                color: colors.white,
                fontWeight: 900,
                marginTop: "8px",
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            style={{
              background: colors.secondary,
              padding: "40px 25px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Issue Date
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>
              {formatDate(invoice.issue_date)}
            </div>
          </div>
          <div
            style={{
              background: colors.tertiary,
              padding: "40px 25px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Due Date
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>
              {formatDate(invoice.due_date)}
            </div>
          </div>
          <div
            style={{
              background: colors.quad,
              padding: "40px 25px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Total Due
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>
              {formatCurrencyWithCode(invoice.total, invoice.currency)}
            </div>
          </div>
        </div>

        {/* Two Column Info */}
        <div
          className="color-pop-grid-info"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "5px solid " + colors.black,
          }}
        >
          <div
            style={{
              padding: "30px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                background: colors.black,
                color: colors.white,
                padding: "8px 14px",
                display: "inline-block",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
                marginBottom: "15px",
              }}
            >
              From
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                marginBottom: "10px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                color: colors.black,
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
          <div
            style={{
              padding: "30px",
              background: colors.secondary + "15",
            }}
          >
            <div
              style={{
                background: colors.primary,
                color: colors.white,
                padding: "8px 14px",
                display: "inline-block",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
                marginBottom: "15px",
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                marginBottom: "10px",
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
                lineHeight: 1.8,
                color: colors.black,
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

        {/* Items Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            background: colors.black,
            color: colors.white,
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              borderRight: "3px solid " + colors.white + "30",
            }}
          >
            Description
          </div>
          <div
            style={{
              padding: "14px 20px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "center",
              borderRight: "3px solid " + colors.white + "30",
            }}
          >
            Qty
          </div>
          <div
            style={{
              padding: "14px 20px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "right",
              borderRight: "3px solid " + colors.white + "30",
            }}
          >
            Rate
          </div>
          <div
            style={{
              padding: "14px 20px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "right",
            }}
          >
            Amount
          </div>
        </div>

        {/* Items */}
        {items.map((item, index) => (
          <div
            key={item.id || index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              borderBottom: "3px solid " + colors.black,
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                background: colors.white,
                fontWeight: 700,
                borderRight: "3px solid " + colors.black,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {item.description}
            </div>
            <div
              style={{
                padding: "16px 20px",
                background: [colors.secondary, colors.tertiary, colors.quad][
                  index % 3
                ],
                textAlign: "center",
                fontWeight: 900,
                borderRight: "3px solid " + colors.black,
              }}
            >
              {item.quantity}
            </div>
            <div
              style={{
                padding: "16px 20px",
                background: colors.white,
                textAlign: "right",
                fontWeight: 700,
                borderRight: "3px solid " + colors.black,
              }}
            >
              {formatCurrencyWithCode(item.unit_price, invoice.currency)}
            </div>
            <div
              style={{
                padding: "16px 20px",
                background: colors.primary,
                color: colors.white,
                textAlign: "right",
                fontWeight: 900,
              }}
            >
              {formatCurrencyWithCode(item.amount, invoice.currency)}
            </div>
          </div>
        ))}

        {/* Totals Grid */}
        <div
          className="color-pop-grid-totals"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr",
            borderTop: "5px solid " + colors.black,
          }}
        >
          <div
            className="payment-info-section"
            style={{
              padding: "25px",
              borderRight: "5px solid " + colors.black,
              background: colors.secondary,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "10px",
                color: colors.black,
              }}
            >
              Payment Info
            </div>
            <div
              style={{ fontSize: "12px", lineHeight: 1.7, color: colors.black }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </div>
          </div>
          <div
            className="subtotal-section"
            style={{ borderRight: "5px solid " + colors.black }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 20px",
                borderBottom: "2px solid " + colors.black,
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
              <span style={{ fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 20px",
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
              <span style={{ fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
          </div>
          <div
            className="total-section"
            style={{
              background: colors.primary,
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: colors.white,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: colors.white,
              }}
            >
              {formatCurrencyWithCode(invoice.total, invoice.currency)}
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div
            style={{
              padding: "20px",
              borderTop: "5px solid " + colors.black,
              background: colors.tertiary + "30",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Notes
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const ColorPopGridTemplate = {
  id: "color-pop-grid" as const,
  name: "Color Pop Grid",
  description: "Grid-based brutalist layout with color blocks",
  Component: ColorPopGridTemplateComponent,
};
