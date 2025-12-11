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

const ClassicTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px",
    background: "white",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "40px",
    borderBottom: "3px solid #1f2937",
    paddingBottom: "20px",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "32px",
    color: "#1f2937",
  };

  const companyNameStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#1f2937",
    marginBottom: "8px",
  };

  const companyDetailsStyle: React.CSSProperties = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
  };

  const detailsSectionStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px",
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: "0 0 10px 0",
    color: "#1f2937",
    fontSize: "14px",
    textTransform: "uppercase",
  };

  const clientInfoStyle: React.CSSProperties = {
    color: "#374151",
    lineHeight: 1.6,
    maxWidth: "300px",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "30px",
    tableLayout: "fixed", // Ensures consistent column widths
  };

  const thStyle: React.CSSProperties = {
    padding: "12px",
    textAlign: "left",
    fontWeight: 600,
    color: "#1f2937",
    borderBottom: "2px solid #d1d5db",
    backgroundColor: "#f3f4f6",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  };

  const descriptionCellStyle: React.CSSProperties = {
    ...tdStyle,
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    width: "auto", // Will take remaining space
  };

  const totalsContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "40px",
  };

  const totalsTableStyle: React.CSSProperties = {
    width: "300px",
  };

  const totalsRowStyle: React.CSSProperties = {
    padding: "8px 12px 8px 0",
    color: "#6b7280",
    fontWeight: 600,
  };

  const totalsValueStyle: React.CSSProperties = {
    padding: "8px 0",
    textAlign: "right",
    color: "#1f2937",
  };

  const totalRowStyle: React.CSSProperties = {
    borderTop: "2px solid #d1d5db",
  };

  const totalLabelStyle: React.CSSProperties = {
    padding: "12px 12px 12px 0",
    color: "#1f2937",
    fontWeight: 700,
    fontSize: "18px",
  };

  const totalValueStyle: React.CSSProperties = {
    padding: "12px 0",
    textAlign: "right",
    color: "#1f2937",
    fontWeight: 700,
    fontSize: "18px",
  };

  const notesStyle: React.CSSProperties = {
    marginBottom: "40px",
  };

  const notesTitleStyle: React.CSSProperties = {
    margin: "0 0 10px 0",
    color: "#1f2937",
    fontSize: "14px",
    textTransform: "uppercase",
  };

  const notesContentStyle: React.CSSProperties = {
    color: "#6b7280",
    lineHeight: 1.6,
    margin: 0,
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: "#fef3c7",
    padding: "24px",
    borderRadius: "8px",
    marginTop: "40px",
  };

  const footerTitleStyle: React.CSSProperties = {
    margin: "0 0 12px 0",
    color: "#92400e",
    fontSize: "16px",
    fontWeight: 700,
  };

  const footerContentStyle: React.CSSProperties = {
    color: "#78350f",
    lineHeight: 1.8,
    fontSize: "14px",
  };

  const paymentInstructionsStyle: React.CSSProperties = {
    marginTop: "12px",
    color: "#78350f",
    fontSize: "14px",
    lineHeight: 1.6,
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .classic-template {
            padding: 20px !important;
          }
          .classic-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .classic-title {
            font-size: 24px !important;
          }
          .classic-info-section {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .classic-table {
            font-size: 12px !important;
          }
          .classic-table th,
          .classic-table td {
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 480px) {
          .classic-template {
            padding: 15px !important;
          }
          .classic-title {
            font-size: 20px !important;
          }
          .classic-table {
            font-size: 10px !important;
          }
          .classic-table th,
          .classic-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
      <div
        className="classic-template"
        style={{ ...containerStyle, width: "100%", boxSizing: "border-box" }}
      >
        {/* Header */}
        <div className="classic-header" style={headerStyle}>
          <div>
            {profile?.logo_url && (
              <img
                src={profile.logo_url}
                alt="Company Logo"
                style={{
                  maxWidth: "150px",
                  maxHeight: "80px",
                  marginBottom: "10px",
                }}
              />
            )}
            <h1 className="classic-title" style={titleStyle}>
              INVOICE
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
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

        {/* Invoice Details */}
        <div className="classic-info-section" style={detailsSectionStyle}>
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <h3 style={sectionTitleStyle}>Bill To:</h3>
            <div style={clientInfoStyle}>
              <strong
                style={{
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
          <div style={{ textAlign: "right" }}>
            <table style={{ marginLeft: "auto" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "4px 12px 4px 0",
                      color: "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    Invoice #:
                  </td>
                  <td style={{ padding: "4px 0", color: "#1f2937" }}>
                    {invoice.invoice_number}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "4px 12px 4px 0",
                      color: "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    Issue Date:
                  </td>
                  <td style={{ padding: "4px 0", color: "#1f2937" }}>
                    {formatDate(invoice.issue_date)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "4px 12px 4px 0",
                      color: "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    Due Date:
                  </td>
                  <td style={{ padding: "4px 0", color: "#1f2937" }}>
                    {formatDate(invoice.due_date)}
                  </td>
                </tr>
                {invoice.status === "sent" && invoice.sent_date && (
                  <tr>
                    <td
                      style={{
                        padding: "4px 12px 4px 0",
                        color: "#6b7280",
                        fontWeight: 600,
                      }}
                    >
                      Sent Date:
                    </td>
                    <td style={{ padding: "4px 0", color: "#1f2937" }}>
                      {formatDate(invoice.sent_date)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table */}
        <table className="classic-table" style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "50%" }}>Description</th>
              <th style={{ ...thStyle, textAlign: "center", width: "15%" }}>
                Qty
              </th>
              <th style={{ ...thStyle, textAlign: "right", width: "20%" }}>
                Unit Price
              </th>
              <th style={{ ...thStyle, textAlign: "right", width: "15%" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td style={descriptionCellStyle}>{item.description}</td>
                <td style={{ ...tdStyle, textAlign: "center", width: "15%" }}>
                  {item.quantity}
                </td>
                <td style={{ ...tdStyle, textAlign: "right", width: "20%" }}>
                  {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                </td>
                <td style={{ ...tdStyle, textAlign: "right", width: "15%" }}>
                  {formatCurrencyWithCode(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={totalsContainerStyle}>
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
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
                </td>
              </tr>
              <tr style={totalRowStyle}>
                <td style={totalLabelStyle}>Total:</td>
                <td style={totalValueStyle}>
                  {formatCurrencyWithCode(invoice.total, invoice.currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div style={notesStyle}>
            <h3 style={notesTitleStyle}>Notes:</h3>
            <p style={notesContentStyle}>{invoice.notes}</p>
          </div>
        )}

        {/* Yellow Footer with Payment Information */}
        <div style={footerStyle}>
          <h3 style={footerTitleStyle}>Payment Information</h3>
          <div style={footerContentStyle}>
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
      </div>
    </>
  );
};

export const ClassicTemplate = {
  id: "classic" as const,
  name: "Classic",
  description: "Traditional invoice design with yellow footer",
  Component: ClassicTemplateComponent,
};
