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

const DarkModeTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        /* Ensure all text in dark mode template maintains proper contrast */
        .darkmode-template * {
          color: inherit;
        }
        .darkmode-template strong {
          color: inherit;
          font-weight: 600;
        }
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
          maxWidth: "794px",
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
              style={{ fontSize: "13px", color: "#D0D0D0", lineHeight: 1.8 }}
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
              style={{ fontSize: "13px", color: "#D0D0D0", lineHeight: 1.8 }}
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
                    color: "#D0D0D0",
                    marginBottom: "8px",
                  }}
                >
                  Issued
                </div>
                <div style={{ fontSize: "15px", color: "#E0E0E0" }}>
                  {formatDate(invoice.issue_date, { locale: invoice.locale, language: invoice.language })}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#D0D0D0",
                    marginBottom: "8px",
                  }}
                >
                  Due
                </div>
                <div style={{ fontSize: "15px", color: "#FF6B6B" }}>
                  {formatDate(invoice.due_date, { locale: invoice.locale, language: invoice.language })}
                </div>
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#D0D0D0",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "4px",
                    }}
                  >
                    Sent Date
                  </div>
                  <div style={{ fontSize: "15px", color: "#60A5FA" }}>
                    {formatDate(invoice.sent_date, { locale: invoice.locale, language: invoice.language })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: "40px" }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            className="darkmode-table"
            styles={{
              headerFontSize: "11px",
              bodyFontSize: "14px",
              headerPadding: "18px 20px",
              bodyPadding: "16px 20px",
              headerTextColor: "#D0D0D0",
              headerBgColor: "rgba(255,255,255,0.05)",
              bodyTextColor: "#E0E0E0",
              borderColor: "rgba(255,255,255,0.1)",
              headerBorderBottom: "none",
              rowBorderBottom: "1px solid rgba(255,255,255,0.1)",
              headerFontWeight: 600,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              amountColor: "#00FFB2",
              alternatingRowColor: "rgba(255,255,255,0.02)",
              quantityCellStyle: { color: "#D0D0D0" },
              unitPriceCellStyle: { color: "#D0D0D0" },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              bodyStyle: { marginBottom: 0 },
            }}
          />
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
              <span style={{ fontSize: "13px", color: "#D0D0D0" }}>
                Subtotal
              </span>
              <span style={{ fontSize: "14px", color: "#E0E0E0" }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency, invoice.locale)}
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
              <span style={{ fontSize: "13px", color: "#D0D0D0" }}>Tax</span>
              <span style={{ fontSize: "14px", color: "#E0E0E0" }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency, invoice.locale)}
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
                {formatCurrencyWithCode(invoice.total, invoice.currency, invoice.locale)}
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
              color: "#D0D0D0",
              marginBottom: "15px",
            }}
          >
            Payment Information
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#D0D0D0",
              lineHeight: 1.9,
              fontFamily: "'SF Mono', monospace",
            }}
          >
            <PaymentInformation
              profile={profile}
              invoice={invoice}
              style={{
                item: { marginBottom: "4px", color: "#D0D0D0" },
                empty: { color: "#D0D0D0" },
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
              style={{ fontSize: "13px", color: "#D0D0D0", lineHeight: 1.8 }}
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
