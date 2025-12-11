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

const DarkModeTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .darkmode-template {
            padding: 25px !important;
          }
          .darkmode-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .darkmode-info-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .darkmode-table {
            font-size: 12px !important;
          }
          .darkmode-table th,
          .darkmode-table td {
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 480px) {
          .darkmode-template {
            padding: 15px !important;
          }
          .darkmode-table {
            font-size: 10px !important;
          }
          .darkmode-table th,
          .darkmode-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
      <div
        className="darkmode-template"
        style={{
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "50px",
          background: "linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)",
          color: "#fff",
          borderRadius: "12px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          className="darkmode-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "50px",
            paddingBottom: "30px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
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
                  marginBottom: "20px",
                  filter: "brightness(0) invert(1)",
                }}
              />
            )}
            <div
              style={{
                fontSize: "48px",
                fontWeight: 200,
                color: "#fff",
                letterSpacing: "-1px",
                marginBottom: "8px",
              }}
            >
              Invoice
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#00FFB2",
                fontFamily: "'SF Mono', monospace",
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            style={{
              textAlign: "right",
              padding: "25px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "16px",
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{ fontSize: "13px", color: "#808080", lineHeight: 1.8 }}
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
        </div>

        {/* Info Grid */}
        <div
          className="darkmode-info-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              padding: "25px",
              background: "rgba(0,255,178,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(0,255,178,0.2)",
              maxWidth: "300px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#00FFB2",
                marginBottom: "15px",
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "10px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div
              style={{ fontSize: "13px", color: "#808080", lineHeight: 1.8 }}
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
          <div
            style={{
              padding: "25px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#606060",
                    marginBottom: "8px",
                  }}
                >
                  Issued
                </div>
                <div style={{ fontSize: "15px", color: "#E0E0E0" }}>
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#606060",
                    marginBottom: "8px",
                  }}
                >
                  Due
                </div>
                <div style={{ fontSize: "15px", color: "#FF6B6B" }}>
                  {formatDate(invoice.due_date)}
                </div>
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "4px",
                    }}
                  >
                    Sent Date
                  </div>
                  <div style={{ fontSize: "15px", color: "#60A5FA" }}>
                    {formatDate(invoice.sent_date)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: "40px",
          }}
        >
          <table
            className="darkmode-table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "18px 20px",
                    background: "rgba(255,255,255,0.05)",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#606060",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    background: "rgba(255,255,255,0.05)",
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#606060",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    background: "rgba(255,255,255,0.05)",
                    textAlign: "right",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#606060",
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    background: "rgba(255,255,255,0.05)",
                    textAlign: "right",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#606060",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id || index}
                  style={{
                    background:
                      index % 2 === 0
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#E0E0E0",
                      fontSize: "14px",
                    }}
                  >
                    {item.description}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      textAlign: "center",
                      color: "#A0A0A0",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      textAlign: "right",
                      color: "#A0A0A0",
                    }}
                  >
                    {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      textAlign: "right",
                      color: "#00FFB2",
                      fontWeight: 600,
                    }}
                  >
                    {formatCurrencyWithCode(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              width: "320px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: "13px", color: "#808080" }}>
                Subtotal
              </span>
              <span style={{ fontSize: "14px", color: "#E0E0E0" }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: "13px", color: "#808080" }}>Tax</span>
              <span style={{ fontSize: "14px", color: "#E0E0E0" }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
                background:
                  "linear-gradient(135deg, rgba(0,255,178,0.15) 0%, rgba(0,255,178,0.05) 100%)",
              }}
            >
              <span
                style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}
              >
                Total Due
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 300,
                  color: "#00FFB2",
                }}
              >
                {formatCurrencyWithCode(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div
          style={{
            padding: "25px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#606060",
              marginBottom: "15px",
            }}
          >
            Payment Information
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#A0A0A0",
              lineHeight: 1.9,
              fontFamily: "'SF Mono', monospace",
            }}
          >
            <PaymentInformation
              profile={profile}
              invoice={invoice}
              style={{
                item: { marginBottom: "4px", color: "#A0A0A0" },
                empty: { color: "#606060" },
              }}
            />
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div
            style={{
              padding: "25px",
              background: "rgba(255,107,107,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,107,107,0.2)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#FF6B6B",
                marginBottom: "15px",
              }}
            >
              Notes
            </div>
            <div
              style={{ fontSize: "13px", color: "#A0A0A0", lineHeight: 1.8 }}
            >
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const DarkModeTemplate = {
  id: "dark-mode" as const,
  name: "Dark Mode",
  description: "Sleek dark theme with neon accents",
  Component: DarkModeTemplateComponent,
};
