import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import { getCompanyInfo, formatClientAddress } from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";
import { InvoiceItemList } from "../components/InvoiceItemList";

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopBrutalistTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        /* Force card mode at 650px to allow more column shrinking before stacking */
        @container (max-width: 650px) {
          .color-pop-brutalist-template [class^="invoice-item-list-"] table {
            border: none !important;
            font-size: 13px !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] thead {
            display: none !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody {
            display: block !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tr {
            display: block !important;
            width: 100% !important;
            border-left: 4px solid ${colors.black} !important;
            border-right: 4px solid ${colors.black} !important;
            border-top: 4px solid ${colors.black} !important;
            border-bottom: 4px solid ${colors.black} !important;
            margin-bottom: 0 !important;
            padding: 12px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tr:not(:first-child) {
            border-top: 2px solid ${colors.black} !important;
            margin-top: 0 !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 6px 12px !important;
            border-bottom: 2px solid ${colors.black}40 !important;
            text-align: right !important;
            position: relative !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
            white-space: nowrap !important;
            font-size: 13px !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td:last-child {
            border-bottom: 1px solid ${colors.black}40 !important;
            font-weight: 900 !important;
            font-size: 13px !important;
            color: ${colors.black} !important;
            background: transparent !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td:last-child * {
            color: ${colors.black} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td:before {
            content: attr(data-label) ":" !important;
            position: absolute !important;
            left: 12px !important;
            font-weight: 600 !important;
            color: ${colors.black} !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td[data-label]:first-child {
            display: block !important;
            padding: 10px 12px !important;
            text-align: left !important;
            font-size: 14px !important;
            color: ${colors.black} !important;
            visibility: visible !important;
            max-width: 100% !important;
            width: 100% !important;
            min-width: 0 !important;
            border-bottom: 3px solid ${colors.black} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td[data-label]:first-child:before {
            display: none !important;
            content: none !important;
          }
          /* Apply colorful backgrounds when in card mode */
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+1) {
            background: ${colors.secondary} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+2) {
            background: ${colors.white} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+3) {
            background: ${colors.tertiary} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+4) {
            background: ${colors.quad} !important;
          }
        }
        @media (max-width: 650px) {
          .color-pop-brutalist-template [class^="invoice-item-list-"] table {
            border: none !important;
            font-size: 13px !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] thead {
            display: none !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody {
            display: block !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tr {
            display: block !important;
            width: 100% !important;
            border-left: 4px solid ${colors.black} !important;
            border-right: 4px solid ${colors.black} !important;
            border-top: 4px solid ${colors.black} !important;
            border-bottom: 4px solid ${colors.black} !important;
            margin-bottom: 0 !important;
            padding: 12px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tr:not(:first-child) {
            border-top: 2px solid ${colors.black} !important;
            margin-top: 0 !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 6px 12px !important;
            border-bottom: 2px solid ${colors.black}40 !important;
            text-align: right !important;
            position: relative !important;
            box-shadow: none !important;
            box-sizing: border-box !important;
            white-space: nowrap !important;
            font-size: 13px !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td:last-child {
            border-bottom: 1px solid ${colors.black}40 !important;
            font-weight: 900 !important;
            font-size: 13px !important;
            color: ${colors.black} !important;
            background: transparent !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td:last-child * {
            color: ${colors.black} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td:before {
            content: attr(data-label) ":" !important;
            position: absolute !important;
            left: 12px !important;
            font-weight: 600 !important;
            color: ${colors.black} !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td[data-label]:first-child {
            display: block !important;
            padding: 10px 12px !important;
            text-align: left !important;
            font-size: 14px !important;
            color: ${colors.black} !important;
            visibility: visible !important;
            max-width: 100% !important;
            width: 100% !important;
            min-width: 0 !important;
            border-bottom: 3px solid ${colors.black} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] td[data-label]:first-child:before {
            display: none !important;
            content: none !important;
          }
          /* Apply colorful backgrounds when in card mode */
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+1) {
            background: ${colors.secondary} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+2) {
            background: ${colors.white} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+3) {
            background: ${colors.tertiary} !important;
          }
          .color-pop-brutalist-template [class^="invoice-item-list-"] tbody tr:nth-child(4n+4) {
            background: ${colors.quad} !important;
          }
        }
        @media (max-width: 768px) {
          .color-pop-brutalist-template {
            border-width: 4px !important;
          }
          .color-pop-brutalist-content {
            padding: 20px !important;
          }
          .color-pop-brutalist-info-cards {
            flex-direction: column !important;
          }
        }
        @media (max-width: 480px) {
          .color-pop-brutalist-content {
            padding: 15px !important;
          }
        }
        /* Make invoice number wrap to new line at narrow widths */
        @container (max-width: 600px) {
          .color-pop-brutalist-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .color-pop-brutalist-invoice-number {
            width: 100% !important;
          }
        }
        @media (max-width: 600px) {
          .color-pop-brutalist-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
          .color-pop-brutalist-invoice-number {
            width: 100% !important;
          }
        }
        /* Make invoice header, invoice number and total amount responsive */
        .invoice-header-text {
          font-size: clamp(32px, 7vw, 56px) !important;
        }
        .invoice-number-value {
          font-size: clamp(14px, 3vw, 24px) !important;
        }
        .total-amount-value {
          font-size: clamp(18px, 4vw, 32px) !important;
        }
        @container (max-width: 400px) {
          .invoice-header-text {
            font-size: clamp(28px, 6vw, 48px) !important;
          }
          .invoice-number-value {
            font-size: clamp(12px, 2.5vw, 20px) !important;
          }
          .total-amount-value {
            font-size: clamp(16px, 3.5vw, 28px) !important;
          }
        }
        @media (max-width: 480px) {
          .invoice-header-text {
            font-size: clamp(28px, 6vw, 48px) !important;
          }
        }
      `}</style>
      <div
        className="color-pop-brutalist-template"
        style={{
          fontFamily: "'Arial Black', Helvetica, sans-serif",
          maxWidth: "794px",
          margin: "0 auto",
          padding: 0,
          background: colors.white,
          border: "6px solid " + colors.black,
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            background: colors.primary,
            padding: "30px 40px",
            borderBottom: "6px solid " + colors.black,
          }}
        >
          <div
            className="color-pop-brutalist-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              containerType: "inline-size",
            }}
          >
            <div
              className="invoice-header-text"
              style={{
                fontSize: "clamp(32px, 7vw, 56px)",
                fontWeight: 900,
                color: colors.white,
                textShadow: "4px 4px 0 " + colors.black,
                letterSpacing: "-2px",
              }}
            >
              INVOICE
            </div>
            <div
              className="color-pop-brutalist-invoice-number"
              style={{
                background: colors.secondary,
                border: "4px solid " + colors.black,
                padding: "12px 24px",
                boxShadow: "6px 6px 0 " + colors.black,
                whiteSpace: "nowrap",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Invoice No.
              </div>
              <div
                className="invoice-number-value"
                style={{
                  fontSize: "clamp(14px, 3vw, 24px)",
                  fontWeight: 900,
                  wordBreak: "break-all",
                }}
              >
                #{invoice.invoice_number}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Strip */}
        <div
          style={{
            background: colors.tertiary,
            padding: "15px 40px",
            borderBottom: "4px solid " + colors.black,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: "18px" }}>
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {getCompanyInfo(profile, "email")} •{" "}
              {getCompanyInfo(profile, "phone")}
            </div>
          </div>
        </div>

        <div
          style={{ padding: "40px" }}
          className="color-pop-brutalist-content"
        >
          {/* Info Cards Row */}
          <div
            className="color-pop-brutalist-info-cards"
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {/* Bill To */}
            <div
              style={{
                flex: 1,
                background: colors.quad,
                border: "4px solid " + colors.black,
                boxShadow: "8px 8px 0 " + colors.black,
              }}
            >
              <div
                style={{
                  background: colors.black,
                  color: colors.white,
                  padding: "10px 16px",
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                }}
              >
                → Bill To
              </div>
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
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
                    fontSize: "12px",
                    lineHeight: 1.8,
                    fontFamily: "Arial, sans-serif",
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
            </div>

            {/* Dates */}
            <div
              style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  background: colors.secondary,
                  border: "4px solid " + colors.black,
                  padding: "15px",
                  boxShadow: "4px 4px 0 " + colors.black,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Issued
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 900,
                    marginTop: "5px",
                  }}
                >
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div
                style={{
                  background: colors.primary,
                  color: colors.white,
                  border: "4px solid " + colors.black,
                  padding: "15px",
                  boxShadow: "4px 4px 0 " + colors.black,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Due Date
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 900,
                    marginTop: "5px",
                  }}
                >
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div
            style={{
              border: "4px solid " + colors.black,
              boxShadow: "8px 8px 0 " + colors.black,
              marginBottom: "40px",
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <InvoiceItemList
              items={items}
              currency={invoice.currency}
              styles={{
                headerFontSize: "13px",
                bodyFontSize: "14px",
                headerPadding: "18px",
                bodyPadding: "16px",
                headerTextColor: colors.black,
                headerBgColor: colors.tertiary,
                bodyTextColor: colors.black,
                borderColor: colors.black,
                headerBorderBottom: "none",
                rowBorderBottom: "none",
                headerFontWeight: "normal",
                headerTextTransform: "uppercase",
                headerLetterSpacing: "3px",
                bodyFontWeight: 900,
                amountFontWeight: 900,
                amountColor: colors.white,
                fontFamily: "'Arial Black', sans-serif",
                // Note: Component applies alternatingRowColor to even rows (0, 2, 4...)
                // ColorPopBrutalist needs odd rows (1, 3, 5...) colored, so pattern is inverted
                alternatingRowColor: colors.secondary,
                descriptionCellStyle: {
                  border: "4px solid " + colors.black,
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: 0,
                },
                quantityCellStyle: {
                  border: "4px solid " + colors.black,
                  fontSize: "16px",
                },
                unitPriceCellStyle: {
                  border: "4px solid " + colors.black,
                },
                amountCellStyle: {
                  border: "4px solid " + colors.black,
                  background: colors.primary,
                  fontSize: "15px",
                },
                headerStyle: {
                  border: "4px solid " + colors.black,
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
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "340px",
                border: "4px solid " + colors.black,
                boxShadow: "8px 8px 0 " + colors.tertiary,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px 20px",
                  borderBottom: "3px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatCurrencyWithCode(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px 20px",
                  borderBottom: "3px solid " + colors.black,
                  background: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  Tax
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                  background: colors.primary,
                  color: colors.white,
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    textTransform: "uppercase",
                    fontWeight: 900,
                    letterSpacing: "2px",
                    color: colors.white,
                  }}
                >
                  Total
                </span>
                <span
                  className="total-amount-value"
                  style={{
                    fontSize: "clamp(18px, 4vw, 32px)",
                    fontWeight: 900,
                    color: colors.white,
                    whiteSpace: "nowrap",
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
              background: colors.quad,
              border: "4px solid " + colors.black,
              boxShadow: "6px 6px 0 " + colors.black,
            }}
          >
            <div
              style={{
                background: colors.black,
                color: colors.white,
                padding: "10px 16px",
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              Payment Information
            </div>
            <div
              style={{
                padding: "20px",
                fontSize: "13px",
                lineHeight: 1.8,
                fontFamily: "Arial, sans-serif",
              }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </div>
          </div>

          {invoice.notes && (
            <div
              style={{
                marginTop: "20px",
                background: colors.secondary,
                border: "4px dashed " + colors.black,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                Notes
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.8,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {invoice.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const ColorPopBrutalistTemplate = {
  id: "color-pop-brutalist" as const,
  name: "Color Pop Brutalist",
  description: "Vibrant multi-color brutalist with bold primary accents",
  Component: ColorPopBrutalistTemplateComponent,
};
