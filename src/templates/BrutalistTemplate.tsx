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

const BrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .brutalist-template {
            padding: 20px !important;
            border-width: 4px !important;
          }
          .brutalist-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .brutalist-title {
            font-size: 48px !important;
            line-height: 0.9 !important;
          }
          .brutalist-company-box {
            max-width: 100% !important;
            text-align: left !important;
          }
          .brutalist-info-grid {
            grid-template-columns: 1fr !important;
          }
          .brutalist-info-grid > div:first-child {
            border-right: none !important;
            border-bottom: 3px solid #000 !important;
          }
          .brutalist-table {
            font-size: 10px !important;
          }
          .brutalist-table th,
          .brutalist-table td {
            padding: 8px !important;
            font-size: 9px !important;
          }
          .brutalist-totals {
            width: 100% !important;
          }
        }
        @media (max-width: 480px) {
          .brutalist-template {
            padding: 15px !important;
            border-width: 3px !important;
          }
          .brutalist-title {
            font-size: 36px !important;
          }
          .brutalist-invoice-number {
            font-size: 18px !important;
            padding: 6px 12px !important;
          }
          .brutalist-table {
            font-size: 9px !important;
          }
          .brutalist-table th,
          .brutalist-table td {
            padding: 6px 4px !important;
            font-size: 8px !important;
          }
        }
      `}</style>
      <div
        className="brutalist-template"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px",
          background: "#fff",
          border: "6px solid #000",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          className="brutalist-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "40px",
            paddingBottom: "30px",
            borderBottom: "6px solid #000",
            gap: "20px",
          }}
        >
          <div>
            <div
              className="brutalist-title"
              style={{
                fontSize: "72px",
                fontWeight: 900,
                color: "#000",
                lineHeight: 0.9,
                letterSpacing: "-4px",
              }}
            >
              INV
              <br />
              OICE
            </div>
            <div
              className="brutalist-invoice-number"
              style={{
                fontSize: "24px",
                fontWeight: 900,
                marginTop: "10px",
                background: "#000",
                color: "#fff",
                padding: "8px 16px",
                display: "inline-block",
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            className="brutalist-company-box"
            style={{
              textAlign: "right",
              border: "3px solid #000",
              padding: "20px",
              maxWidth: "280px",
              boxSizing: "border-box",
            }}
          >
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Logo"
                style={{
                  maxWidth: "120px",
                  maxHeight: "60px",
                  marginBottom: "15px",
                  filter: "grayscale(100%)",
                }}
              />
            )}
            <div
              style={{
                fontWeight: 900,
                fontSize: "16px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "12px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: "11px",
                lineHeight: 1.8,
                textTransform: "uppercase",
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
              {getCompanyInfo(profile, "phone")}
              <br />
              {getCompanyInfo(profile, "email")}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div
          className="brutalist-info-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            marginBottom: "40px",
            border: "3px solid #000",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderRight: "3px solid #000",
              maxWidth: "300px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "12px",
                background: "#000",
                color: "#fff",
                padding: "6px 10px",
                display: "inline-block",
              }}
            >
              BILL TO
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                textTransform: "uppercase",
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
                lineHeight: 1.8,
                textTransform: "uppercase",
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
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#666",
                  }}
                >
                  ISSUED
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    marginTop: "4px",
                  }}
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
                    color: "#666",
                  }}
                >
                  DUE
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 900,
                    marginTop: "4px",
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "#666",
                    }}
                  >
                    SENT
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
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
        </div>

        {/* Items Table */}
        <table
          className="brutalist-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "40px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "16px",
                  border: "3px solid #000",
                  background: "#000",
                  color: "#fff",
                  textAlign: "left",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                DESCRIPTION
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "3px solid #000",
                  background: "#000",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                QTY
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "3px solid #000",
                  background: "#000",
                  color: "#fff",
                  textAlign: "right",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                RATE
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "3px solid #000",
                  background: "#000",
                  color: "#fff",
                  textAlign: "right",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td
                  style={{
                    padding: "12px 16px",
                    border: "3px solid #000",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "13px",
                    textTransform: "uppercase",
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
                    padding: "12px 16px",
                    border: "3px solid #000",
                    textAlign: "center",
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    border: "3px solid #000",
                    textAlign: "right",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    border: "3px solid #000",
                    textAlign: "right",
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                    background: "#000",
                    color: "#fff",
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
            marginBottom: "40px",
          }}
        >
          <div
            className="brutalist-totals"
            style={{
              width: "320px",
              border: "6px solid #000",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "3px solid #000",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                SUBTOTAL
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "3px solid #000",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                TAX
              </span>
              <span style={{ fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 16px",
                background: "#000",
                color: "#fff",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: 900,
                }}
              >
                TOTAL
              </span>
              <span style={{ fontSize: "24px", fontWeight: 900 }}>
                {formatCurrencyWithCode(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div
          style={{
            border: "3px solid #000",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "12px",
            }}
          >
            PAYMENT INFORMATION
          </div>
          <div style={{ fontSize: "13px", lineHeight: 1.8 }}>
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
              border: "3px dashed #000",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "12px",
              }}
            >
              NOTES
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.8 }}>
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const BrutalistTemplate = {
  id: "brutalist" as const,
  name: "Brutalist",
  description: "Raw, industrial design with heavy borders and monospace type",
  Component: BrutalistTemplateComponent,
};
