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
          .minimaljapanese-vertical-line {
            display: none !important;
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
          maxWidth: "794px",
          margin: "0 auto",
          padding: "50px 40px",
          background: "#FDFCFA",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Vertical Line Accent */}
        <div
          className="minimaljapanese-vertical-line"
          style={{
            position: "absolute",
            left: "40px",
            top: "50px",
            bottom: "50px",
            width: "1px",
            background:
              "linear-gradient(180deg, transparent 0%, #C9B99A 20%, #C9B99A 80%, transparent 100%)",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#C9B99A",
              letterSpacing: "8px",
              textTransform: "uppercase",
              marginBottom: "15px",
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
              margin: "20px auto",
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
            marginBottom: "40px",
            paddingBottom: "25px",
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
                marginBottom: "15px",
                opacity: 0.8,
              }}
            />
          )}
          <div
            style={{
              fontSize: "18px",
              fontWeight: 500,
              color: "#2D2A26",
              marginBottom: "12px",
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
            marginBottom: "40px",
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: "10px",
                color: "#C9B99A",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "12px",
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
            <div style={{ marginBottom: "20px" }}>
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
                {formatDate(invoice.issue_date, { locale: invoice.locale, language: invoice.language })}
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
                {formatDate(invoice.due_date, { locale: invoice.locale, language: invoice.language })}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: "15px" }}>
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
                  {formatDate(invoice.sent_date, { locale: invoice.locale, language: invoice.language })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="minimaljapanese-table" style={{ marginBottom: "35px" }}>
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            headerLabels={{
              description: "品目",
              quantity: "数量",
              unitPrice: "単価",
              amount: "金額",
                }}
            styles={{
              headerFontSize: "10px",
              bodyFontSize: "14px",
              headerPadding: "12px 0",
              bodyPadding: "20px 0",
              headerTextColor: "#8A847B",
              bodyTextColor: "#2D2A26",
              borderColor: "#E8E4DF",
              headerBorderBottom: "2px solid #2D2A26",
              rowBorderBottom: "1px solid #E8E4DF",
              headerFontWeight: 400,
              headerTextTransform: "uppercase",
              headerLetterSpacing: "4px",
              bodyFontWeight: "normal",
              amountFontWeight: 500,
              quantityCellStyle: { color: "#8A847B" },
              unitPriceCellStyle: { color: "#8A847B" },
              bodyStyle: { marginBottom: 0 },
                  }}
          />
        </div>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "40px",
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
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency, invoice.locale)}
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
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency, invoice.locale)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "18px 0",
                borderTop: "2px solid #2D2A26",
                marginTop: "12px",
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
                {formatCurrencyWithCode(invoice.total, invoice.currency, invoice.locale)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div
          style={{
            padding: "25px 0",
            borderTop: "1px solid #E8E4DF",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#C9B99A",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "12px",
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
              padding: "25px 0",
              borderTop: "1px solid #E8E4DF",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#C9B99A",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "12px",
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
          style={{ textAlign: "center", marginTop: "40px", paddingTop: "30px" }}
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
