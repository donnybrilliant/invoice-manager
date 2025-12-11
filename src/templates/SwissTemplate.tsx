import React from "react";
import { InvoiceTemplateData } from "./types";
import {
  formatCurrencyWithCode,
  formatDate,
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
} from "./utils";
import { PaymentInformation } from "./reactUtils";

const SwissTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .swiss-template {
            padding: 30px !important;
          }
          .swiss-header {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .swiss-client-dates {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .swiss-table {
            font-size: 12px !important;
          }
          .swiss-table th,
          .swiss-table td {
            padding: 12px 0 !important;
            font-size: 11px !important;
          }
          .swiss-payment-notes {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 480px) {
          .swiss-template {
            padding: 20px !important;
          }
          .swiss-title {
            font-size: 48px !important;
          }
          .swiss-table {
            font-size: 10px !important;
          }
          .swiss-table th,
          .swiss-table td {
            padding: 10px 0 !important;
            font-size: 9px !important;
          }
        }
      `}</style>
      <div
        className="swiss-template"
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "60px",
          background: "#fff",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Red Accent Bar */}
        <div
          style={{
            width: "60px",
            height: "8px",
            background: "#FF0000",
            marginBottom: "60px",
          }}
        />

        {/* Header */}
        <div
          className="swiss-header"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            marginBottom: "80px",
          }}
        >
          <div>
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Logo"
                style={{
                  maxWidth: "140px",
                  maxHeight: "70px",
                  marginBottom: "30px",
                }}
              />
            )}
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#999",
                marginBottom: "8px",
              }}
            >
              From
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "18px",
                color: "#000",
                marginBottom: "12px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.8 }}>
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
          <div style={{ textAlign: "right" }}>
            <div
              className="swiss-title"
              style={{
                fontSize: "64px",
                fontWeight: 300,
                color: "#000",
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              Invoice
            </div>
            <div style={{ fontSize: "14px", color: "#999", marginTop: "15px" }}>
              No. {invoice.invoice_number}
            </div>
          </div>
        </div>

        {/* Client & Dates */}
        <div
          className="swiss-client-dates"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "80px",
            marginBottom: "60px",
            paddingBottom: "40px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#999",
                marginBottom: "8px",
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "18px",
                color: "#000",
                marginBottom: "12px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.8 }}>
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
          <div>
            <div style={{ marginBottom: "25px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                  marginBottom: "6px",
                }}
              >
                Issue Date
              </div>
              <div style={{ fontSize: "15px", color: "#000" }}>
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                  marginBottom: "6px",
                }}
              >
                Due Date
              </div>
              <div
                style={{ fontSize: "15px", color: "#FF0000", fontWeight: 600 }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: "25px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    color: "#999",
                    marginBottom: "6px",
                  }}
                >
                  Sent Date
                </div>
                <div style={{ fontSize: "15px", color: "#000" }}>
                  {formatDate(invoice.sent_date)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table
          className="swiss-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "50px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "16px 0",
                  borderBottom: "2px solid #000",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "16px 0",
                  borderBottom: "2px solid #000",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  padding: "16px 0",
                  borderBottom: "2px solid #000",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  padding: "16px 0",
                  borderBottom: "2px solid #000",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
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
                    padding: "16px 0",
                    borderBottom: "1px solid #e0e0e0",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {item.description}
                </td>
                <td
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "right",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                </td>
                <td
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "right",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#000",
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
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "60px",
          }}
        >
          <div style={{ width: "280px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>Subtotal</span>
              <span style={{ fontSize: "14px", color: "#333" }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>Tax</span>
              <span style={{ fontSize: "14px", color: "#333" }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 0",
                borderTop: "2px solid #000",
                marginTop: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#000",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 300,
                  color: "#000",
                }}
              >
                {formatCurrencyWithCode(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Notes */}
        <div
          className="swiss-payment-notes"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            paddingTop: "40px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#999",
                marginBottom: "15px",
              }}
            >
              Payment Information
            </div>
            <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.9 }}>
              <PaymentInformation
                profile={profile}
                invoice={invoice}
                style={{
                  item: { marginBottom: "4px" },
                }}
              />
            </div>
          </div>
          {invoice.notes && (
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: "#999",
                  marginBottom: "15px",
                }}
              >
                Notes
              </div>
              <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.9 }}>
                {invoice.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "80px", textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "4px",
              background: "#FF0000",
              margin: "0 auto",
            }}
          />
        </div>
      </div>
    </>
  );
};

export const SwissTemplate = {
  id: "swiss" as const,
  name: "Swiss",
  description: "Grid-based International Typographic Style",
  Component: SwissTemplateComponent,
};
