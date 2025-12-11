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

const NeoBrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 663px) {
          .neobrutalist-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .neobrutalist-company-profile {
            margin-top: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .neobrutalist-template {
            padding: 25px !important;
            border-width: 4px !important;
            box-shadow: 8px 8px 0px #000 !important;
          }
          .neobrutalist-table {
            font-size: 12px !important;
          }
          .neobrutalist-table th,
          .neobrutalist-table td {
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 480px) {
          .neobrutalist-template {
            padding: 15px !important;
            border-width: 3px !important;
            box-shadow: 6px 6px 0px #000 !important;
          }
          .neobrutalist-table {
            font-size: 10px !important;
          }
          .neobrutalist-table th,
          .neobrutalist-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
      <div
        className="neobrutalist-template"
        style={{
          fontFamily: "'Arial Black', Helvetica, sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "50px",
          background: "#E8F5E9",
          border: "5px solid #000",
          boxShadow: "12px 12px 0px #000",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          className="neobrutalist-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "#FF5722",
              border: "4px solid #000",
              padding: "25px",
              boxShadow: "8px 8px 0px #000",
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
                textShadow: "3px 3px 0px #000",
              }}
            >
              INVOICE
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "#FFEB3B",
                marginTop: "8px",
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            className="neobrutalist-company-profile"
            style={{
              background: "#fff",
              border: "4px solid #000",
              padding: "20px",
              boxShadow: "6px 6px 0px #000",
              maxWidth: "260px",
            }}
          >
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Logo"
                style={{
                  maxWidth: "100px",
                  maxHeight: "50px",
                  marginBottom: "12px",
                }}
              />
            )}
            <div
              style={{ fontWeight: 900, fontSize: "16px", marginBottom: "8px" }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: "11px",
                lineHeight: 1.7,
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
        </div>

        {/* Info Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: "#2196F3",
              border: "4px solid #000",
              padding: "20px",
              boxShadow: "6px 6px 0px #000",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              → BILL TO
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "#FFEB3B",
                marginBottom: "8px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#fff",
                lineHeight: 1.7,
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
          <div
            style={{
              background: "#FFEB3B",
              border: "4px solid #000",
              padding: "20px",
              boxShadow: "6px 6px 0px #000",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                ISSUED
              </div>
              <div
                style={{ fontSize: "16px", fontWeight: 900, marginTop: "4px" }}
              >
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                DUE DATE
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  marginTop: "4px",
                  color: "#D32F2F",
                }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: "15px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  SENT
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    marginTop: "4px",
                  }}
                >
                  {formatDate(invoice.sent_date)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            boxShadow: "8px 8px 0px #000",
            marginBottom: "40px",
            overflow: "hidden",
          }}
        >
          <table
            className="neobrutalist-table"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "16px",
                    border: "3px solid #000",
                    background: "#9C27B0",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    padding: "16px",
                    border: "3px solid #000",
                    background: "#9C27B0",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    padding: "16px",
                    border: "3px solid #000",
                    background: "#9C27B0",
                    color: "#fff",
                    textAlign: "right",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    padding: "16px",
                    border: "3px solid #000",
                    background: "#9C27B0",
                    color: "#fff",
                    textAlign: "right",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index}>
                  <td
                    style={{
                      padding: "14px 16px",
                      border: "3px solid #000",
                      background: index % 2 === 0 ? "#fff" : "#FFEB3B",
                      fontFamily: "'Arial Black', sans-serif",
                      fontSize: "13px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                      maxWidth: 0,
                    }}
                  >
                    {item.description}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      border: "3px solid #000",
                      background: index % 2 === 0 ? "#fff" : "#FFEB3B",
                      textAlign: "center",
                      fontWeight: 900,
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      border: "3px solid #000",
                      background: index % 2 === 0 ? "#fff" : "#FFEB3B",
                      textAlign: "right",
                    }}
                  >
                    {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      border: "3px solid #000",
                      background: "#FF5722",
                      color: "#fff",
                      textAlign: "right",
                      fontWeight: 900,
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
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "#000",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #FF5722",
              padding: 0,
              minWidth: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "3px solid #333",
                color: "#fff",
              }}
            >
              <span style={{ fontSize: "13px", textTransform: "uppercase" }}>
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
                padding: "14px 20px",
                borderBottom: "3px solid #333",
                color: "#fff",
              }}
            >
              <span style={{ fontSize: "13px", textTransform: "uppercase" }}>
                Tax
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
                background: "#FFEB3B",
                color: "#000",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  textTransform: "uppercase",
                  fontWeight: 900,
                }}
              >
                TOTAL DUE
              </span>
              <span style={{ fontSize: "28px", fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            padding: "20px",
            boxShadow: "6px 6px 0px #2196F3",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            💰 Payment Details
          </div>
          <div
            style={{
              fontSize: "13px",
              lineHeight: 1.8,
              fontFamily: "Arial, sans-serif",
            }}
          >
            <PaymentInformation
              profile={profile}
              invoice={invoice}
              style={{
                item: { marginBottom: "4px" },
              }}
            />
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div
            style={{
              marginTop: "20px",
              background: "#FFEB3B",
              border: "4px dashed #000",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              📝 Notes
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                fontFamily: "Arial, sans-serif",
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

export const NeoBrutalistTemplate = {
  id: "neo-brutalist" as const,
  name: "Neo Brutalist",
  description: "Bold colors with raw brutalist structure and thick shadows",
  Component: NeoBrutalistTemplateComponent,
};
