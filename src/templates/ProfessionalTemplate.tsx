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

const ProfessionalTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .professional-template {
            padding: 25px !important;
          }
          .professional-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .professional-details-grid {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .professional-details-grid > div:last-child {
            text-align: left !important;
          }
          .professional-totals-section {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .professional-totals-section > div:last-child {
            width: 100% !important;
            max-width: 100% !important;
          }
          .professional-table {
            font-size: 12px !important;
          }
          .professional-table th,
          .professional-table td {
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 480px) {
          .professional-template {
            padding: 15px !important;
          }
          .professional-table {
            font-size: 10px !important;
          }
          .professional-table th,
          .professional-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
        }
        .professional-currency-value {
          white-space: nowrap !important;
        }
      `}</style>
      <div
        className="professional-template"
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          maxWidth: "794px",
          margin: "0 auto",
          padding: "50px",
          background: "white",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          className="professional-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "50px",
            paddingBottom: "30px",
            borderBottom: "2px solid #111827",
          }}
        >
          <div>
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Company Logo"
                style={{
                  maxWidth: "160px",
                  maxHeight: "80px",
                  marginBottom: "20px",
                }}
              />
            )}
            <div
              style={{
                fontWeight: 700,
                fontSize: "20px",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.7 }}
            >
              {formatCompanyAddress(profile)
                .split("\n")
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              {getCompanyInfo(profile, "phone")} |{" "}
              {getCompanyInfo(profile, "email")}
              {profile?.website && (
                <>
                  <br />
                  {profile.website}
                </>
              )}
              {profile?.organization_number && (
                <>
                  <br />
                  Org: {profile.organization_number}
                </>
              )}
              {profile?.tax_number && (
                <>
                  <br />
                  Tax: {profile.tax_number}
                </>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <h1
              style={{
                margin: "0 0 10px 0",
                fontSize: "42px",
                color: "#111827",
                fontWeight: 300,
                letterSpacing: "-1px",
              }}
            >
              INVOICE
            </h1>
            <div
              style={{ color: "#6b7280", fontSize: "15px", fontWeight: 500 }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div
          className="professional-details-grid"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "50px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0, maxWidth: "300px" }}>
            <div
              style={{
                marginBottom: "8px",
                color: "#6b7280",
                fontSize: "11px",
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              Billed To
            </div>
            <div
              style={{
                color: "#111827",
                lineHeight: 1.7,
                fontSize: "15px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "4px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  display: "block",
                }}
              >
                {client.name}
              </div>
              {client.email && (
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  {client.phone}
                </div>
              )}
              {formatClientAddress(client) !== "[No Address]" && (
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    marginTop: "4px",
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
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <table style={{ marginLeft: "auto", borderSpacing: 0 }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "6px 16px 6px 0",
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Issue Date
                  </td>
                  <td
                    style={{
                      padding: "6px 0",
                      color: "#111827",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {formatDate(invoice.issue_date)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "6px 16px 6px 0",
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Due Date
                  </td>
                  <td
                    style={{
                      padding: "6px 0",
                      color: "#111827",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {formatDate(invoice.due_date)}
                  </td>
                </tr>
                {invoice.status === "sent" && invoice.sent_date && (
                  <tr>
                    <td
                      style={{
                        padding: "6px 16px 6px 0",
                        color: "#6b7280",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      Sent Date
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        color: "#111827",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(invoice.sent_date)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table */}
        <div
          className="professional-table"
          style={{ marginBottom: "40px", paddingBottom: "12px" }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: "12px",
              bodyFontSize: "14px",
              headerPadding: "14px 16px",
              bodyPadding: "14px 16px",
              headerTextColor: "white",
              headerBgColor: "#111827",
              bodyTextColor: "#374151",
              borderColor: "#e5e7eb",
              headerBorderBottom: "none",
              rowBorderBottom: "1px solid #e5e7eb",
              headerFontWeight: 600,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "0.5px",
              bodyFontWeight: "normal",
              amountFontWeight: 600,
              amountColor: "#111827",
              columnWidths: {
                quantity: "80px",
                unitPrice: "120px",
                amount: "120px",
              },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              bodyStyle: {
                marginBottom: 0,
                border: "1px solid #e5e7eb",
              },
            }}
          />
        </div>

        {/* Totals Section */}
        <div
          className="professional-totals-section"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "50px",
          }}
        >
          {invoice.notes ? (
            <div style={{ flex: 1, maxWidth: "400px" }}>
              <div
                style={{
                  marginBottom: "8px",
                  color: "#6b7280",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "1px",
                }}
              >
                Notes
              </div>
              <p
                style={{
                  color: "#374151",
                  lineHeight: 1.7,
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                {invoice.notes}
              </p>
            </div>
          ) : (
            <div style={{ flex: 1 }}></div>
          )}
          <div
            className="professional-totals-table-container"
            style={{ width: "320px", maxWidth: "100%", minWidth: 0 }}
          >
            <table
              style={{ width: "100%", borderSpacing: 0, minWidth: "200px" }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "10px 16px 10px 0",
                      color: "#6b7280",
                      fontWeight: 600,
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Subtotal
                  </td>
                  <td
                    className="professional-currency-value"
                    style={{
                      padding: "10px 0",
                      textAlign: "right",
                      color: "#111827",
                      fontSize: "15px",
                      whiteSpace: "nowrap",
                      minWidth: "100px",
                    }}
                  >
                    {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "10px 16px 10px 0",
                      color: "#6b7280",
                      fontWeight: 600,
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tax ({invoice.tax_rate}%)
                  </td>
                  <td
                    className="professional-currency-value"
                    style={{
                      padding: "10px 0",
                      textAlign: "right",
                      color: "#111827",
                      fontSize: "15px",
                      whiteSpace: "nowrap",
                      minWidth: "100px",
                    }}
                  >
                    {formatCurrencyWithCode(
                      invoice.tax_amount,
                      invoice.currency
                    )}
                  </td>
                </tr>
                <tr style={{ borderTop: "2px solid #111827" }}>
                  <td
                    style={{
                      padding: "16px 16px 0 0",
                      color: "#111827",
                      fontWeight: 700,
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total
                  </td>
                  <td
                    className="professional-currency-value"
                    style={{
                      padding: "16px 0 0 0",
                      textAlign: "right",
                      color: "#111827",
                      fontWeight: 700,
                      fontSize: "26px",
                      whiteSpace: "nowrap",
                      minWidth: "120px",
                    }}
                  >
                    {formatCurrencyWithCode(invoice.total, invoice.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Information */}
        <div
          style={{
            padding: "30px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              color: "#111827",
              fontSize: "11px",
              textTransform: "uppercase",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            Payment Information
          </div>
          <div style={{ color: "#374151", lineHeight: 1.8, fontSize: "14px" }}>
            <PaymentInformation
              profile={profile}
              invoice={invoice}
              style={{
                item: { marginBottom: "4px" },
              }}
            />
          </div>
          {profile?.payment_instructions && (
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
                color: "#6b7280",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              {profile.payment_instructions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const ProfessionalTemplate = {
  id: "professional" as const,
  name: "Professional",
  description: "Clean and minimal business design",
  Component: ProfessionalTemplateComponent,
};
