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

const MinimalJapaneseTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .minimaljapanese-template {
            padding: 40px 30px !important;
          }
          .minimaljapanese-header {
            flex-direction: column !important;
            gap: 30px !important;
          }
          .minimaljapanese-table {
            font-size: 12px !important;
          }
          .minimaljapanese-table th,
          .minimaljapanese-table td {
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 480px) {
          .minimaljapanese-template {
            padding: 30px 20px !important;
          }
          .minimaljapanese-table {
            font-size: 10px !important;
          }
          .minimaljapanese-table th,
          .minimaljapanese-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
        }
      `}</style>
      <div
        className="minimaljapanese-template"
        style={{
          fontFamily: "'Hiragino Mincho Pro', 'Yu Mincho', Georgia, serif",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "80px 60px",
          background: "#FDFCFA",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Vertical Line Accent */}
        <div
          style={{
            position: "absolute",
            left: "40px",
            top: "80px",
            bottom: "80px",
            width: "1px",
            background:
              "linear-gradient(180deg, transparent 0%, #C9B99A 20%, #C9B99A 80%, transparent 100%)",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#C9B99A",
              letterSpacing: "8px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            請求書
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 300,
              color: "#2D2A26",
              letterSpacing: "4px",
            }}
          >
            INVOICE
          </div>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "#2D2A26",
              margin: "25px auto",
            }}
          />
          <div
            style={{ fontSize: "13px", color: "#8A847B", letterSpacing: "2px" }}
          >
            No. {invoice.invoice_number}
          </div>
        </div>

        {/* Company Info */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
            paddingBottom: "40px",
            borderBottom: "1px solid #E8E4DF",
          }}
        >
          {profile?.logo_url && (
            <img
              src={profile.logo_url}
              alt="Logo"
              style={{
                maxWidth: "100px",
                maxHeight: "50px",
                marginBottom: "20px",
                opacity: 0.8,
              }}
            />
          )}
          <div
            style={{
              fontSize: "18px",
              fontWeight: 500,
              color: "#2D2A26",
              marginBottom: "15px",
              letterSpacing: "2px",
            }}
          >
            {getCompanyInfo(profile, "company_name")}
          </div>
          <div style={{ fontSize: "12px", color: "#8A847B", lineHeight: 2 }}>
            {formatCompanyAddress(profile).replace(/\n/g, " · ")} ·{" "}
            {getCompanyInfo(profile, "email")}
          </div>
        </div>

        {/* Client & Dates */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "60px",
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: "10px",
                color: "#C9B99A",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "15px",
              }}
            >
              御中
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#2D2A26",
                marginBottom: "12px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div
              style={{ fontSize: "13px", color: "#8A847B", lineHeight: 1.9 }}
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
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "25px" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "#C9B99A",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                発行日
              </div>
              <div style={{ fontSize: "14px", color: "#2D2A26" }}>
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#C9B99A",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                支払期限
              </div>
              <div style={{ fontSize: "14px", color: "#B85C38" }}>
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#8B7355",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "4px",
                  }}
                >
                  送信日
                </div>
                <div style={{ fontSize: "14px", color: "#B85C38" }}>
                  {formatDate(invoice.sent_date)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table
          className="minimaljapanese-table"
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
                  padding: "15px 0",
                  borderBottom: "2px solid #2D2A26",
                  textAlign: "left",
                  fontSize: "10px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  color: "#8A847B",
                }}
              >
                品目
              </th>
              <th
                style={{
                  padding: "15px 0",
                  borderBottom: "2px solid #2D2A26",
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  color: "#8A847B",
                }}
              >
                数量
              </th>
              <th
                style={{
                  padding: "15px 0",
                  borderBottom: "2px solid #2D2A26",
                  textAlign: "right",
                  fontSize: "10px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  color: "#8A847B",
                }}
              >
                単価
              </th>
              <th
                style={{
                  padding: "15px 0",
                  borderBottom: "2px solid #2D2A26",
                  textAlign: "right",
                  fontSize: "10px",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "4px",
                  color: "#8A847B",
                }}
              >
                金額
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid #E8E4DF",
                    fontSize: "14px",
                    color: "#2D2A26",
                  }}
                >
                  {item.description}
                </td>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid #E8E4DF",
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#8A847B",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid #E8E4DF",
                    textAlign: "right",
                    fontSize: "14px",
                    color: "#8A847B",
                  }}
                >
                  {formatCurrencyWithCode(item.unit_price, invoice.currency)}
                </td>
                <td
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid #E8E4DF",
                    textAlign: "right",
                    fontSize: "14px",
                    color: "#2D2A26",
                    fontWeight: 500,
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
          <div style={{ width: "260px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #E8E4DF",
              }}
            >
              <span style={{ fontSize: "12px", color: "#8A847B" }}>小計</span>
              <span style={{ fontSize: "14px", color: "#2D2A26" }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #E8E4DF",
              }}
            >
              <span style={{ fontSize: "12px", color: "#8A847B" }}>消費税</span>
              <span style={{ fontSize: "14px", color: "#2D2A26" }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "25px 0",
                borderTop: "2px solid #2D2A26",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#2D2A26",
                  letterSpacing: "3px",
                }}
              >
                合計
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 300,
                  color: "#2D2A26",
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
            padding: "30px 0",
            borderTop: "1px solid #E8E4DF",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#C9B99A",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "15px",
            }}
          >
            振込先
          </div>
          <div style={{ fontSize: "13px", color: "#2D2A26", lineHeight: 2 }}>
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
              padding: "30px 0",
              borderTop: "1px solid #E8E4DF",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#C9B99A",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "15px",
              }}
            >
              備考
            </div>
            <div style={{ fontSize: "13px", color: "#8A847B", lineHeight: 2 }}>
              {invoice.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{ textAlign: "center", marginTop: "60px", paddingTop: "40px" }}
        >
          <div
            style={{
              width: "20px",
              height: "1px",
              background: "#C9B99A",
              margin: "0 auto",
            }}
          />
        </div>
      </div>
    </>
  );
};

export const MinimalJapaneseTemplate = {
  id: "minimal-japanese" as const,
  name: "Minimal Japanese",
  description: "Zen-inspired minimalism with generous whitespace",
  Component: MinimalJapaneseTemplateComponent,
};
