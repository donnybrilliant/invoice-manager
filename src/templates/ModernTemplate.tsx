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

const ModernTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px",
    background: "white",
  };

  const headerBarStyle: React.CSSProperties = {
    height: "8px",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
    marginBottom: "30px",
    borderRadius: "4px",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "40px",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "36px",
    color: "#3b82f6",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  };

  const invoiceNumberStyle: React.CSSProperties = {
    color: "#6b7280",
    fontSize: "16px",
    marginTop: "5px",
  };

  const companyInfoBoxStyle: React.CSSProperties = {
    textAlign: "right",
    padding: "20px",
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "8px",
  };

  const companyNameStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: "18px",
    color: "#1f2937",
    marginBottom: "8px",
  };

  const companyDetailsStyle: React.CSSProperties = {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.6,
  };

  const infoCardsStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
  };

  const infoCardStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "20px",
    background: "#f9fafb",
    borderLeft: "4px solid #3b82f6",
    borderRadius: "4px",
  };

  const infoCardPurpleStyle: React.CSSProperties = {
    ...infoCardStyle,
    borderLeftColor: "#8b5cf6",
  };

  const cardTitleStyle: React.CSSProperties = {
    margin: "0 0 12px 0",
    color: "#3b82f6",
    fontSize: "12px",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.5px",
  };

  const cardTitlePurpleStyle: React.CSSProperties = {
    ...cardTitleStyle,
    color: "#8b5cf6",
  };

  const cardContentStyle: React.CSSProperties = {
    color: "#1f2937",
    lineHeight: 1.7,
    fontSize: "14px",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const tableHeaderStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  };

  const thStyle: React.CSSProperties = {
    padding: "16px",
    textAlign: "left",
    fontWeight: 600,
    color: "white",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const tdStyle: React.CSSProperties = {
    padding: "16px",
    borderLeft: "4px solid #3b82f6",
  };

  const totalsContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "40px",
  };

  const totalsBoxStyle: React.CSSProperties = {
    width: "350px",
    padding: "24px",
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const totalsTableStyle: React.CSSProperties = {
    width: "100%",
  };

  const totalsRowStyle: React.CSSProperties = {
    padding: "8px 0",
    color: "#6b7280",
    fontWeight: 600,
  };

  const totalsValueStyle: React.CSSProperties = {
    padding: "8px 0",
    textAlign: "right",
    color: "#1f2937",
    fontSize: "16px",
  };

  const totalRowStyle: React.CSSProperties = {
    borderTop: "2px solid #d1d5db",
  };

  const totalLabelStyle: React.CSSProperties = {
    padding: "16px 0 0 0",
    color: "#1f2937",
    fontWeight: 700,
    fontSize: "18px",
  };

  const totalValueStyle: React.CSSProperties = {
    padding: "16px 0 0 0",
    textAlign: "right",
    color: "#3b82f6",
    fontWeight: 700,
    fontSize: "24px",
  };

  const notesBoxStyle: React.CSSProperties = {
    marginBottom: "40px",
    padding: "20px",
    background: "#fffbeb",
    borderLeft: "4px solid #f59e0b",
    borderRadius: "4px",
  };

  const notesTitleStyle: React.CSSProperties = {
    margin: "0 0 10px 0",
    color: "#92400e",
    fontSize: "13px",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.5px",
  };

  const notesContentStyle: React.CSSProperties = {
    color: "#78350f",
    lineHeight: 1.6,
    margin: 0,
    fontSize: "14px",
  };

  const paymentBoxStyle: React.CSSProperties = {
    padding: "24px",
    background: "white",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
  };

  const paymentTitleStyle: React.CSSProperties = {
    margin: "0 0 16px 0",
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
  };

  const paymentTitleAccentStyle: React.CSSProperties = {
    display: "inline-block",
    width: "4px",
    height: "20px",
    background: "linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)",
    marginRight: "10px",
    borderRadius: "2px",
  };

  const paymentContentStyle: React.CSSProperties = {
    color: "#374151",
    lineHeight: 1.8,
    fontSize: "14px",
  };

  const paymentInstructionsStyle: React.CSSProperties = {
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
  };

  const footerBarStyle: React.CSSProperties = {
    height: "6px",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
    marginTop: "30px",
    borderRadius: "4px",
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .modern-template {
            padding: 20px !important;
          }
          .modern-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .modern-title {
            font-size: 28px !important;
          }
          .modern-info-cards {
            flex-direction: column !important;
          }
          .modern-table {
            font-size: 12px !important;
          }
          .modern-table th,
          .modern-table td {
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 480px) {
          .modern-template {
            padding: 15px !important;
          }
          .modern-title {
            font-size: 24px !important;
          }
          .modern-table {
            font-size: 10px !important;
          }
          .modern-table th,
          .modern-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
      <div
        className="modern-template"
        style={{ ...containerStyle, width: "100%", boxSizing: "border-box" }}
      >
        {/* Colored Header Bar */}
        <div style={headerBarStyle}></div>

        {/* Header */}
        <div className="modern-header" style={headerStyle}>
          <div>
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Company Logo"
                style={{
                  maxWidth: "150px",
                  maxHeight: "80px",
                  marginBottom: "15px",
                }}
              />
            )}
            <h1 className="modern-title" style={titleStyle}>
              INVOICE
            </h1>
            <div style={invoiceNumberStyle}>#{invoice.invoice_number}</div>
          </div>
          <div style={companyInfoBoxStyle}>
            <div style={companyNameStyle}>
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div style={companyDetailsStyle}>
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
        </div>

        {/* Invoice Info Cards */}
        <div className="modern-info-cards" style={infoCardsStyle}>
          <div style={infoCardStyle}>
            <h3 style={cardTitleStyle}>Bill To</h3>
            <div style={cardContentStyle}>
              <strong
                style={{
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  display: "block",
                }}
              >
                {client.name}
              </strong>
              <br />
              {client.email || ""}
              <br />
              {client.phone || ""}
              <br />
              {formatClientAddress(client)
                .split("\n")
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </div>
          </div>
          <div style={infoCardPurpleStyle}>
            <h3 style={cardTitlePurpleStyle}>Invoice Details</h3>
            <div style={cardContentStyle}>
              <div>
                <strong>Issue Date:</strong> {formatDate(invoice.issue_date)}
              </div>
              <div>
                <strong>Due Date:</strong> {formatDate(invoice.due_date)}
              </div>
              {invoice.status === "sent" && invoice.sent_date && (
                <div>
                  <strong>Sent Date:</strong> {formatDate(invoice.sent_date)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="modern-table" style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Description</th>
              <th style={{ ...thStyle, textAlign: "center", width: "100px" }}>
                Qty
              </th>
              <th style={{ ...thStyle, textAlign: "right", width: "120px" }}>
                Unit Price
              </th>
              <th style={{ ...thStyle, textAlign: "right", width: "120px" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                }}
              >
                <td
                  style={{
                    ...tdStyle,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    maxWidth: 0,
                  }}
                >
                  {item.description}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {item.quantity}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "right",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  {formatCurrencyWithCode(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={totalsContainerStyle}>
          <div style={totalsBoxStyle}>
            <table style={totalsTableStyle}>
              <tbody>
                <tr>
                  <td style={totalsRowStyle}>Subtotal:</td>
                  <td style={totalsValueStyle}>
                    {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                  </td>
                </tr>
                <tr>
                  <td style={totalsRowStyle}>Tax ({invoice.tax_rate}%):</td>
                  <td style={totalsValueStyle}>
                    {formatCurrencyWithCode(
                      invoice.tax_amount,
                      invoice.currency
                    )}
                  </td>
                </tr>
                <tr style={totalRowStyle}>
                  <td style={totalLabelStyle}>Total Due:</td>
                  <td style={totalValueStyle}>
                    {formatCurrencyWithCode(invoice.total, invoice.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div style={notesBoxStyle}>
            <h3 style={notesTitleStyle}>Notes</h3>
            <p style={notesContentStyle}>{invoice.notes}</p>
          </div>
        )}

        {/* Payment Information */}
        <div style={paymentBoxStyle}>
          <h3 style={paymentTitleStyle}>
            <span style={paymentTitleAccentStyle}></span>
            Payment Information
          </h3>
          <div style={paymentContentStyle}>
            <PaymentInformation
              profile={profile}
              invoice={invoice}
              style={{
                item: { marginBottom: "4px" },
              }}
            />
          </div>
          {profile?.payment_instructions && (
            <div style={paymentInstructionsStyle}>
              {profile.payment_instructions}
            </div>
          )}
        </div>

        {/* Colored Footer Bar */}
        <div style={footerBarStyle}></div>
      </div>
    </>
  );
};

export const ModernTemplate = {
  id: "modern" as const,
  name: "Modern",
  description: "Contemporary design with colored accents",
  Component: ModernTemplateComponent,
};
