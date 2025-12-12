import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatCompanyAddress,
  formatClientAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";

const ConstructivistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .constructivist-template {
            padding: 40px 25px !important;
          }
          .constructivist-header {
            flex-direction: column !important;
          }
          .constructivist-info-section {
            flex-direction: column !important;
          }
        }
      `}</style>
      <div
        className="constructivist-template"
        style={{
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          background: "#F5F0E1",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Diagonal stripe decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "150%",
            height: "60px",
            background:
              "repeating-linear-gradient(45deg, #CC0000, #CC0000 20px, #000 20px, #000 40px)",
            transform: "rotate(-3deg) translateX(-50px) translateY(-10px)",
          }}
        />

        <div style={{ position: "relative", padding: "80px 50px 50px" }}>
          {/* Header */}
          <div
            className="constructivist-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: "50px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "#CC0000",
                  lineHeight: 0.85,
                  letterSpacing: "-4px",
                  textTransform: "uppercase",
                }}
              >
                INV<span style={{ color: "#000" }}>OICE</span>
              </div>
              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <div
                  style={{
                    background: "#000",
                    color: "#F5F0E1",
                    padding: "10px 20px",
                    transform: "skewX(-5deg)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      letterSpacing: "3px",
                      color: "#F5F0E1",
                    }}
                  >
                    NO. {invoice.invoice_number}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", maxWidth: "250px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  color: "#CC0000",
                }}
              >
                {getCompanyInfo(profile, "company_name")}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  lineHeight: 1.8,
                  fontFamily: "'Courier New', monospace",
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

          {/* Info Section with diagonal cut */}
          <div
            className="constructivist-info-section"
            style={{ display: "flex", marginBottom: "50px" }}
          >
            <div
              style={{
                flex: 1,
                background: "#CC0000",
                color: "#fff",
                padding: "25px",
                clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "4px",
                  marginBottom: "15px",
                  opacity: 0.8,
                }}
              >
                → BILL TO
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  textTransform: "uppercase",
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
                  fontSize: "11px",
                  lineHeight: 1.8,
                  fontFamily: "'Courier New', monospace",
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
                width: "200px",
                background: "#000",
                color: "#F5F0E1",
                padding: "25px",
                marginLeft: "-20px",
                clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "3px",
                    opacity: 0.6,
                    color: "#F5F0E1",
                  }}
                >
                  ISSUED
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    marginTop: "5px",
                    color: "#F5F0E1",
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "3px",
                    opacity: 0.6,
                    color: "#F5F0E1",
                  }}
                >
                  DUE
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    marginTop: "5px",
                    color: "#CC0000",
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: "50px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ width: "40px", height: "4px", background: "#CC0000" }}
              />
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                Line Items
              </span>
              <div style={{ flex: 1, height: "4px", background: "#000" }} />
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                border: "3px solid #000",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(90deg, #CC0000 0%, #000 100%)",
                    color: "#fff",
                  }}
                >
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontSize: "11px",
                      letterSpacing: "3px",
                    }}
                  >
                    DESCRIPTION
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontSize: "11px",
                      letterSpacing: "3px",
                    }}
                  >
                    QTY
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "right",
                      fontSize: "11px",
                      letterSpacing: "3px",
                    }}
                  >
                    RATE
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "right",
                      fontSize: "11px",
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
                        padding: "14px",
                        borderBottom: "2px solid #000",
                        fontFamily: "'Impact', 'Arial Black', sans-serif",
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
                        padding: "14px",
                        borderBottom: "2px solid #000",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "16px",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        borderBottom: "2px solid #000",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrencyWithCode(
                        item.unit_price,
                        invoice.currency
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        borderBottom: "2px solid #000",
                        textAlign: "right",
                        fontWeight: 900,
                        background: index % 2 === 0 ? "#CC0000" : "#000",
                        color: "#fff",
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
            <div style={{ minWidth: "320px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "2px solid #000",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    letterSpacing: "2px",
                    fontFamily: "'Courier New', monospace",
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
                  padding: "12px 0",
                  borderBottom: "2px solid #000",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    letterSpacing: "2px",
                    fontFamily: "'Courier New', monospace",
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
                  background: "linear-gradient(90deg, #CC0000, #000)",
                  color: "#fff",
                  padding: "20px",
                  marginTop: "15px",
                  transform: "skewX(-3deg)",
                }}
              >
                <div
                  style={{
                    transform: "skewX(3deg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      letterSpacing: "3px",
                      color: "#fff",
                    }}
                  >
                    TOTAL
                  </span>
                  <span
                    style={{ fontSize: "30px", fontWeight: 900, color: "#fff" }}
                  >
                    {formatCurrencyWithCode(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div
            style={{
              border: "3px solid #000",
              borderLeft: "8px solid #CC0000",
              padding: "25px",
              background: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "4px",
                marginBottom: "15px",
              }}
            >
              PAYMENT INFORMATION
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.9,
                fontFamily: "'Courier New', monospace",
              }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </div>
          </div>

          {invoice.notes && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "#000",
                color: "#F5F0E1",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "3px",
                  marginBottom: "10px",
                  color: "#CC0000",
                }}
              >
                NOTES
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.8,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {invoice.notes}
              </div>
            </div>
          )}
        </div>

        {/* Bottom stripe */}
        <div
          style={{
            height: "30px",
            background:
              "repeating-linear-gradient(45deg, #CC0000, #CC0000 20px, #000 20px, #000 40px)",
          }}
        />
      </div>
    </>
  );
};

export const ConstructivistTemplate = {
  id: "constructivist" as const,
  name: "Constructivist",
  description:
    "Soviet-era constructivist art style with diagonal elements and red/black palette",
  Component: ConstructivistTemplateComponent,
};
