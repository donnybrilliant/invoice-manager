import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatClientAddress,
  formatCompanyAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";

const TypewriterTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  // Encode SVG for data URL
  const svgTexture = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#FDF6E3" width="100" height="100"/><circle fill="#F5E6C8" cx="50" cy="50" r="1"/></svg>'
  );

  return (
    <>
      <style>{`
        @media (max-width: 634px) {
          .typewriter-template {
            padding: 20px !important;
            overflow-x: visible !important;
          }
          .typewriter-header {
            flex-direction: column !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .typewriter-template {
            padding: 15px !important;
          }
        }
        /* Override card borders to dashed for typewriter template */
        @container (max-width: 435px) {
          .typewriter-template [class^="invoice-item-list-"] tr {
            border-left: 1px dashed #8B7355 !important;
            border-right: 1px dashed #8B7355 !important;
            border-top: 1px dashed #8B7355 !important;
            border-bottom: 1px dashed #8B7355 !important;
          }
          .typewriter-template [class^="invoice-item-list-"] tr:not(:first-child) {
            border-top: 2px dashed #8B7355 !important;
          }
        }
        @media (max-width: 435px) {
          .typewriter-template [class^="invoice-item-list-"] tr {
            border-left: 1px dashed #8B7355 !important;
            border-right: 1px dashed #8B7355 !important;
            border-top: 1px dashed #8B7355 !important;
            border-bottom: 1px dashed #8B7355 !important;
          }
          .typewriter-template [class^="invoice-item-list-"] tr:not(:first-child) {
            border-top: 2px dashed #8B7355 !important;
          }
        }
      `}</style>
      <div
        className="typewriter-template"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          maxWidth: "794px",
          margin: "0 auto",
          padding: "50px",
          background: "#FDF6E3",
          backgroundImage: `url('data:image/svg+xml,${svgTexture}')`,
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Paper texture overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(rgba(253,246,227,0) 0%, rgba(245,230,200,0.3) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Stamp */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            width: "100px",
            height: "100px",
            border: "4px double #8B0000",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-15deg)",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#8B0000",
              fontWeight: "bold",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            INVOICE
            <br />
            <span style={{ fontSize: "9px" }}>ORIGINAL</span>
          </div>
        </div>

        {/* Header */}
        <div
          className="typewriter-header"
          style={{
            position: "relative",
            marginBottom: "50px",
            paddingBottom: "25px",
            borderBottom: "2px solid #8B7355",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div>
              {profile?.logo_url && (
                <img
                  src={profile.logo_url}
                  alt="Logo"
                  style={{
                    maxWidth: "120px",
                    maxHeight: "60px",
                    marginBottom: "15px",
                    filter: "sepia(50%)",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#3D2914",
                  letterSpacing: "8px",
                  textTransform: "uppercase",
                }}
              >
                I N V O I C E
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8B7355",
                  marginTop: "8px",
                  letterSpacing: "4px",
                }}
              >
                No. {invoice.invoice_number}
              </div>
            </div>
            <div style={{ textAlign: "right", maxWidth: "250px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#3D2914",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {getCompanyInfo(profile, "company_name")}
              </div>
              <div
                style={{ fontSize: "12px", color: "#5D4E37", lineHeight: 1.8 }}
              >
                {formatCompanyAddress(profile)
                  .split("\n")
                  .map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                Tel: {getCompanyInfo(profile, "phone")}
                <br />
                {getCompanyInfo(profile, "email")}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
            padding: "25px",
            background: "rgba(139,115,85,0.08)",
            border: "1px dashed #8B7355",
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#8B7355",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "10px",
              }}
            >
              BILLED TO:
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#3D2914",
                marginBottom: "8px",
                textTransform: "uppercase",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div
              style={{ fontSize: "12px", color: "#5D4E37", lineHeight: 1.8 }}
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
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "10px",
                  color: "#8B7355",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Date Issued
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#3D2914",
                  marginTop: "4px",
                  textDecoration: "underline",
                }}
              >
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#8B7355",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Payment Due
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#8B0000",
                  marginTop: "4px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: "18px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#8B7355",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Date Sent
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#3D2914",
                    marginTop: "4px",
                    textDecoration: "underline",
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
          className="typewriter-table"
          style={{ marginBottom: "40px", position: "relative" }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            styles={{
              headerFontSize: "11px",
              bodyFontSize: "13px",
              headerPadding: "12px",
              bodyPadding: "10px 12px",
              headerTextColor: "#5D4E37",
              bodyTextColor: "#3D2914",
              borderColor: "#8B7355",
              headerBorderBottom: "2px solid #8B7355",
              rowBorderBottom: "1px dashed #8B7355",
              headerFontWeight: "normal",
              headerTextTransform: "uppercase",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 700,
              alternatingRowColor: "#FDF6E3",
              headerStyle: {
                borderTop: "2px solid #8B7355",
              },
              descriptionCellStyle: {
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              bodyStyle: {
                marginBottom: 0,
              },
            }}
          />
        </div>

        {/* Totals */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "280px",
              border: "2px solid #8B7355",
              background: "rgba(139,115,85,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px dashed #8B7355",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#5D4E37",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Subtotal
              </span>
              <span style={{ color: "#3D2914" }}>
                {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px dashed #8B7355",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#5D4E37",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Tax
              </span>
              <span style={{ color: "#3D2914" }}>
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                background: "#3D2914",
                color: "#FDF6E3",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                  color: "#FDF6E3",
                }}
              >
                TOTAL DUE
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#FDF6E3",
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
            position: "relative",
            border: "1px dashed #8B7355",
            padding: "20px",
            marginBottom: "25px",
            background: "rgba(139,115,85,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: "#5D4E37",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "12px",
            }}
          >
            Payment Instructions:
          </div>
          <div style={{ fontSize: "12px", color: "#3D2914", lineHeight: 1.9 }}>
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
              position: "relative",
              padding: "20px",
              borderLeft: "4px solid #8B7355",
              background: "rgba(139,115,85,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "#5D4E37",
                textTransform: "uppercase",
                letterSpacing: "3px",
                marginBottom: "10px",
              }}
            >
              Memo:
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#3D2914",
                lineHeight: 1.8,
                fontStyle: "italic",
              }}
            >
              {invoice.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: "relative",
            marginTop: "50px",
            textAlign: "center",
            color: "#8B7355",
            fontSize: "11px",
            letterSpacing: "2px",
          }}
        >
          — Thank you for your business —
        </div>
      </div>
    </>
  );
};

export const TypewriterTemplate = {
  id: "typewriter" as const,
  name: "Typewriter",
  description: "Vintage typewriter aesthetic with stamps and seals",
  Component: TypewriterTemplateComponent,
};
