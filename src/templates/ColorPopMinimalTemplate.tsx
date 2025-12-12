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
        }
      `}</style>
      <div
        className="color-pop-minimal-template"
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          maxWidth: "800px",
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
          style={{
            display: "flex",
            gap: "60px",
            marginBottom: "50px",
            paddingBottom: "50px",
            borderBottom: "3px solid " + colors.black,
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
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "40px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "3px solid " + colors.black }}>
              <th
                style={{
                  padding: "15px 0",
                  textAlign: "left",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: colors.black + "60",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "15px 0",
                  textAlign: "center",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: colors.black + "60",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  padding: "15px 0",
                  textAlign: "right",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: colors.black + "60",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  padding: "15px 0",
                  textAlign: "right",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: colors.black + "60",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid " + colors.black + "20",
                    fontSize: "15px",
                  }}
                >
                  {item.description}
                </td>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid " + colors.black + "20",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid " + colors.black + "20",
                    textAlign: "right",
                  }}
                >
                  {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                </td>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid " + colors.black + "20",
                    textAlign: "right",
                    fontWeight: 800,
                  }}
                >
                  {formatCurrencyWithCode(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
          <div style={{ width: "260px", flex: "0 0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid " + colors.black + "15",
              }}
            >
              <span style={{ color: colors.black + "60" }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid " + colors.black + "15",
              }}
            >
              <span style={{ color: colors.black + "60" }}>Tax</span>
              <span style={{ fontWeight: 600 }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 0",
                marginTop: "10px",
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                marginLeft: "-20px",
                marginRight: "-20px",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: colors.white,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: colors.white,
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
