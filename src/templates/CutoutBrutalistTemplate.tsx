import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import { getCompanyInfo, formatClientAddress } from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";

const CutoutBrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .cutout-brutalist-template {
            padding: 30px !important;
          }
          .cutout-header {
            flex-direction: column !important;
          }
          .cutout-info-cards {
            flex-direction: column !important;
          }
          .cutout-date-cards {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            width: 100% !important;
          }
          .cutout-date-cards > div {
            flex: 1 1 auto !important;
            min-width: 150px !important;
          }
          .cutout-items-table {
            font-size: 10px !important;
          }
          .cutout-items-table th,
          .cutout-items-table td {
            padding: 10px !important;
            font-size: 9px !important;
          }
          .cutout-items-table th {
            letter-spacing: 1px !important;
          }
        }
        @media (max-width: 480px) {
          .cutout-brutalist-template {
            padding: 20px !important;
          }
          .cutout-date-cards {
            flex-direction: column !important;
          }
          .cutout-date-cards > div {
            width: 100% !important;
            min-width: unset !important;
          }
          .cutout-items-table {
            font-size: 9px !important;
          }
          .cutout-items-table th,
          .cutout-items-table td {
            padding: 8px 6px !important;
            font-size: 8px !important;
          }
          .cutout-items-table th {
            letter-spacing: 0.5px !important;
            padding: 8px 4px !important;
          }
        }
      `}</style>
      <div
        className="cutout-brutalist-template"
        style={{
          fontFamily: "'Georgia', serif",
          maxWidth: "794px",
          margin: "0 auto",
          padding: "60px",
          background: "linear-gradient(135deg, #FAF8F5 0%, #F0EDE8 100%)",
          position: "relative",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            width: "120px",
            height: "120px",
            background: "#FF6B35",
            transform: "rotate(15deg)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "100px",
            width: "80px",
            height: "80px",
            background: "#004E89",
            transform: "rotate(-10deg)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "40px",
            width: "60px",
            height: "60px",
            border: "4px solid #1A535C",
            transform: "rotate(25deg)",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: "50px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              border: "3px solid #000",
              padding: "30px 50px",
              boxShadow: "8px 8px 0 rgba(0,0,0,0.1)",
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                fontSize: "64px",
                fontWeight: 900,
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              INV
              <span
                style={{
                  background: "#FF6B35",
                  color: "#fff",
                  padding: "0 10px",
                }}
              >
                OI
              </span>
              CE
            </div>
          </div>
          <div
            style={{
              display: "inline-block",
              marginLeft: "-20px",
              background: "#1A535C",
              color: "#fff",
              padding: "15px 30px",
              transform: "rotate(3deg)",
              boxShadow: "5px 5px 0 rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "11px",
                letterSpacing: "3px",
              }}
            >
              NUMBER
            </div>
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: "22px",
                marginTop: "5px",
              }}
            >
              {invoice.invoice_number}
            </div>
          </div>
        </div>

        {/* Company strip */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "#000",
            color: "#fff",
            padding: "15px 25px",
            marginBottom: "40px",
            marginLeft: "-30px",
            marginRight: "-30px",
            transform: "rotate(-0.5deg)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {profile?.logo_url && (
                <img
                  src={profile.logo_url}
                  alt="Company Logo"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "50px",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: "16px",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                {getCompanyInfo(profile, "company_name")}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "12px",
                color: "#fff",
              }}
            >
              {getCompanyInfo(profile, "email")} |{" "}
              {getCompanyInfo(profile, "phone")}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div
          className="cutout-info-cards"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: "30px",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "2px solid #000",
              padding: "25px",
              boxShadow: "6px 6px 0 #FFE4B5",
              transform: "rotate(-1deg)",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#666",
                marginBottom: "12px",
                borderBottom: "2px solid #000",
                paddingBottom: "8px",
              }}
            >
              BILLED TO
            </div>
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: "18px",
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
                fontFamily: "'Georgia', serif",
                fontSize: "13px",
                lineHeight: 1.8,
                color: "#333",
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
            className="cutout-date-cards"
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: "15px",
              width: "180px",
            }}
          >
            <div
              style={{
                background: "#004E89",
                color: "#fff",
                padding: "20px",
                marginBottom: "0",
                transform: "rotate(2deg)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  opacity: 0.7,
                }}
              >
                ISSUED
              </div>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: "16px",
                  marginTop: "8px",
                }}
              >
                {formatDate(invoice.issue_date, { locale: invoice.locale, language: invoice.language })}
              </div>
            </div>
            <div
              style={{
                background: "#FF6B35",
                color: "#fff",
                padding: "20px",
                transform: "rotate(-1deg)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "9px",
                  letterSpacing: "2px",
                  opacity: 0.7,
                }}
              >
                DUE DATE
              </div>
              <div
                style={{
                  fontFamily: "'Arial Black', sans-serif",
                  fontSize: "16px",
                  marginTop: "8px",
                }}
              >
                {formatDate(invoice.due_date, { locale: invoice.locale, language: invoice.language })}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div
          className="cutout-items-table"
          style={{
            position: "relative",
            zIndex: 1,
            background: "#fff",
            border: "2px solid #000",
            marginBottom: "40px",
            boxShadow: "8px 8px 0 #1A535C",
            transform: "rotate(0.5deg)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <InvoiceItemList
            items={items}
            currency={invoice.currency}
            headerLabels={{
              description: "DESCRIPTION",
              quantity: "QTY",
              unitPrice: "RATE",
              amount: "AMOUNT",
            }}
            styles={{
              headerFontSize: "11px",
              bodyFontSize: "14px",
              headerPadding: "18px",
              bodyPadding: "16px",
              headerTextColor: "#fff",
              headerBgColor: "transparent",
              bodyTextColor: "#000",
              borderColor: "#ddd",
              headerBorderBottom: "none",
              rowBorderBottom: "1px solid #ddd",
              headerFontWeight: "normal",
              headerLetterSpacing: "2px",
              bodyFontWeight: "normal",
              amountFontWeight: 900,
              headerStyle: {
                background: "linear-gradient(90deg, #1A535C, #004E89)",
              },
              descriptionCellStyle: {
                fontFamily: "'Times New Roman', serif",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                maxWidth: 0,
              },
              quantityCellStyle: {
                fontFamily: "'Courier New', monospace",
                fontWeight: 900,
              },
              unitPriceCellStyle: {
                fontFamily: "'Courier New', monospace",
              },
              amountCellStyle: {
                fontFamily: "'Courier New', monospace",
                background: "#FFE4B5",
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
            zIndex: 1,
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "40px",
          }}
        >
          <div style={{ minWidth: "300px" }}>
            <div
              style={{
                background: "#fff",
                border: "2px solid #000",
                padding: "5px 0",
                boxShadow: "4px 4px 0 #FFE4B5",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  borderBottom: "1px dashed #ccc",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "12px",
                    letterSpacing: "2px",
                  }}
                >
                  SUBTOTAL
                </span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                  }}
                >
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency, invoice.locale)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "12px",
                    letterSpacing: "2px",
                  }}
                >
                  TAX
                </span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                  }}
                >
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency, invoice.locale)}
                </span>
              </div>
            </div>
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: "20px",
                marginTop: "-5px",
                transform: "rotate(-1deg)",
                boxShadow: "6px 6px 0 #FF6B35",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "13px",
                    letterSpacing: "3px",
                    color: "#fff",
                  }}
                >
                  TOTAL DUE
                </span>
                <span
                  style={{
                    fontFamily: "'Arial Black', sans-serif",
                    fontSize: "28px",
                    color: "#fff",
                  }}
                >
                  {formatCurrencyWithCode(invoice.total, invoice.currency, invoice.locale)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "#FFE4B5",
            border: "2px solid #000",
            padding: "25px",
            transform: "rotate(0.3deg)",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "11px",
              letterSpacing: "3px",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "2px solid #000",
            }}
          >
            PAYMENT DETAILS
          </div>
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              lineHeight: 1.9,
            }}
          >
            <PaymentInformation profile={profile} invoice={invoice} />
          </div>
        </div>

        {invoice.notes && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: "25px",
              background: "#fff",
              borderLeft: "6px solid #FF6B35",
              padding: "20px 25px",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#666",
                marginBottom: "10px",
              }}
            >
              NOTES
            </div>
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
                lineHeight: 1.8,
                fontStyle: "italic",
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

export const CutoutBrutalistTemplate = {
  id: "cutout-brutalist" as const,
  name: "Cutout Brutalist",
  description:
    "Paper cutout collage style with overlapping shapes and newsprint textures",
  Component: CutoutBrutalistTemplateComponent,
};
