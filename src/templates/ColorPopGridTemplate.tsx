import React from "react";
import { InvoiceTemplateData } from "./types";
import { formatCurrencyWithCode, formatDate } from "../lib/formatting";
import {
  getCompanyInfo,
  formatCompanyAddress,
  formatClientAddress,
} from "./utils";
import { PaymentInformation } from "./utils/PaymentInformation";

const colors = {
  primary: "hsl(358, 100%, 67%)",
  secondary: "hsl(44, 100%, 68%)",
  tertiary: "hsl(137, 79%, 54%)",
  quad: "hsl(201, 100%, 70%)",
  white: "hsl(0, 0%, 100%)",
  black: "hsl(0, 0%, 0%)",
};

const ColorPopGridTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  return (
    <>
      <style>{`
        /* Prevent currency values from breaking across lines, but allow text to shrink */
        .color-pop-grid-template .rate-cell,
        .color-pop-grid-template .amount-cell {
          white-space: nowrap !important;
        }
        
        @media (max-width: 768px) {
          .color-pop-grid-template {
            border-width: 3px !important;
            overflow-x: hidden !important;
          }
          /* Fix header overflow - add borders and prevent overflow */
          .color-pop-grid-header {
            grid-template-columns: 1fr !important;
            overflow-x: hidden !important;
          }
          .color-pop-grid-header > div {
            border-right: none !important;
            border-bottom: 5px solid hsl(0, 0%, 0%) !important;
            min-width: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .color-pop-grid-header > div:last-child {
            border-bottom: none !important;
          }
          /* Fix info section overflow */
          .color-pop-grid-info {
            grid-template-columns: 1fr !important;
            overflow-x: hidden !important;
          }
          .color-pop-grid-info > div {
            border-right: none !important;
            border-bottom: 5px solid hsl(0, 0%, 0%) !important;
            min-width: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .color-pop-grid-info > div:last-child {
            border-bottom: none !important;
          }
          /* Fix totals section */
          .color-pop-grid-totals {
            grid-template-columns: 1fr !important;
            overflow-x: hidden !important;
          }
          .color-pop-grid-totals > div {
            border-right: none !important;
            border-bottom: 5px solid hsl(0, 0%, 0%) !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }
          .color-pop-grid-totals > div:last-child {
            border-bottom: none !important;
          }
          .color-pop-grid-totals .payment-info-section {
            order: 3 !important;
          }
          .color-pop-grid-totals .subtotal-section {
            order: 1 !important;
          }
          .color-pop-grid-totals .total-section {
            order: 2 !important;
          }
          /* Fix subtotal/tax overflow */
          .color-pop-grid-totals .subtotal-section {
            overflow-x: hidden !important;
            min-width: 0 !important;
          }
          .color-pop-grid-totals .subtotal-section > div {
            min-width: 0 !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }
          .color-pop-grid-totals .subtotal-section span {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
        }
        
        @media (max-width: 435px) {
          /* Hide table header on mobile */
          .color-pop-grid-template .items-header {
            display: none !important;
          }
          
          /* Convert item rows to cards like InvoiceItemList - stack them directly */
          .color-pop-grid-template .item-row {
            display: block !important;
            border-left: 3px solid hsl(0, 0%, 0%) !important;
            border-right: 3px solid hsl(0, 0%, 0%) !important;
            border-top: 3px solid hsl(0, 0%, 0%) !important;
            border-bottom: 3px solid hsl(0, 0%, 0%) !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
            background: hsl(0, 0%, 100%) !important;
          }
          .color-pop-grid-template .item-row:not(:last-of-type) {
            border-bottom: 2px solid hsl(0, 0%, 0%) !important;
            margin-bottom: 0 !important;
          }
          
          /* Make all cells in a row appear inside the card */
          .color-pop-grid-template .item-row > div {
            display: flex !important;
            width: 100% !important;
            border-right: none !important;
            border-bottom: 2px solid hsl(0, 0%, 0%) !important;
            padding: 12px 16px !important;
            box-sizing: border-box !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .color-pop-grid-template .item-row > div:last-child {
            border-bottom: none !important;
          }
          
          /* Description cell - full width, bold, no label */
          .color-pop-grid-template .item-row > .description-cell {
            font-weight: 900 !important;
            font-size: 16px !important;
            border-bottom: 3px solid hsl(0, 0%, 0%) !important;
            padding: 16px !important;
            display: block !important;
          }
          
          /* Quantity cell - label on left, value on right */
          .color-pop-grid-template .item-row > .quantity-cell::before {
            content: "Qty: " !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            margin-right: auto !important;
          }
          
          /* Rate cell - label on left, value on right */
          .color-pop-grid-template .item-row > .rate-cell::before {
            content: "Rate: " !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            margin-right: auto !important;
          }
          
          /* Amount cell - label on left (white), value on right */
          .color-pop-grid-template .item-row > .amount-cell::before {
            content: "Amount: " !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            color: hsl(0, 0%, 100%) !important;
            margin-right: auto !important;
          }
        }
      `}</style>
      <div
        className="color-pop-grid-template"
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          maxWidth: "794px",
          margin: "0 auto",
          background: colors.white,
          border: "5px solid " + colors.black,
        }}
      >
        {/* Top Grid Header */}
        <div
          className="color-pop-grid-header"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            borderBottom: "5px solid " + colors.black,
          }}
        >
          <div
            style={{
              background: colors.primary,
              padding: "40px 25px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: colors.white,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
              }}
            >
              Invoice
            </div>
            <div
              style={{
                fontSize: "36px",
                color: colors.white,
                fontWeight: 900,
                marginTop: "8px",
              }}
            >
              #{invoice.invoice_number}
            </div>
          </div>
          <div
            style={{
              background: colors.secondary,
              padding: "40px 25px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Issue Date
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>
              {formatDate(invoice.issue_date)}
            </div>
          </div>
          <div
            style={{
              background: colors.tertiary,
              padding: "40px 25px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Due Date
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>
              {formatDate(invoice.due_date)}
            </div>
          </div>
          <div
            style={{
              background: colors.quad,
              padding: "40px 25px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Total Due
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>
              {formatCurrencyWithCode(invoice.total, invoice.currency)}
            </div>
          </div>
        </div>

        {/* Two Column Info */}
        <div
          className="color-pop-grid-info"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "5px solid " + colors.black,
          }}
        >
          <div
            style={{
              padding: "30px",
              borderRight: "5px solid " + colors.black,
            }}
          >
            <div
              style={{
                background: colors.black,
                color: colors.white,
                padding: "8px 14px",
                display: "inline-block",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
                marginBottom: "15px",
              }}
            >
              From
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                marginBottom: "10px",
              }}
            >
              {getCompanyInfo(profile, "company_name")}
            </div>
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.8,
                color: colors.black,
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
              <br />
              {getCompanyInfo(profile, "phone")}
            </div>
          </div>
          <div
            style={{
              padding: "30px",
              background: colors.secondary + "15",
            }}
          >
            <div
              style={{
                background: colors.primary,
                color: colors.white,
                padding: "8px 14px",
                display: "inline-block",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontWeight: 900,
                marginBottom: "15px",
              }}
            >
              Bill To
            </div>
            <div
              style={{
                fontSize: "18px",
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
                fontSize: "13px",
                lineHeight: 1.8,
                color: colors.black,
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

        {/* Items Header */}
        <div
          className="items-header"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 0.5fr 1fr 1fr",
            background: colors.black,
            color: colors.white,
          }}
        >
          <div
            className="header-description"
            style={{
              padding: "14px 20px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              borderRight: "3px solid " + colors.white + "30",
              color: colors.white,
            }}
          >
            Description
          </div>
          <div
            className="header-qty"
            style={{
              padding: "14px 8px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "center",
              borderRight: "3px solid " + colors.white + "30",
              color: colors.white,
            }}
          >
            Qty
          </div>
          <div
            className="header-rate"
            style={{
              padding: "14px 8px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "right",
              borderRight: "3px solid " + colors.white + "30",
              color: colors.white,
            }}
          >
            Rate
          </div>
          <div
            className="header-amount"
            style={{
              padding: "14px 8px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 900,
              textAlign: "right",
              color: colors.white,
            }}
          >
            Amount
          </div>
        </div>

        {/* Items */}
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="item-row"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 0.5fr 1fr 1fr",
              borderBottom: "3px solid " + colors.black,
            }}
          >
            <div
              className="description-cell"
              style={{
                padding: "16px 20px",
                background: colors.white,
                fontWeight: 700,
                borderRight: "3px solid " + colors.black,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {item.description}
            </div>
            <div
              className="quantity-cell"
              style={{
                padding: "16px 8px",
                background: [colors.secondary, colors.tertiary, colors.quad][
                  index % 3
                ],
                textAlign: "center",
                fontWeight: 900,
                borderRight: "3px solid " + colors.black,
                minWidth: 0,
              }}
            >
              {item.quantity}
            </div>
            <div
              className="rate-cell"
              style={{
                padding: "16px 8px",
                background: colors.white,
                textAlign: "right",
                fontWeight: 700,
                borderRight: "3px solid " + colors.black,
                whiteSpace: "nowrap",
                fontSize: "12px",
                minWidth: 0,
              }}
            >
              {formatCurrencyWithCode(item.unit_price, invoice.currency)}
            </div>
            <div
              className="amount-cell"
              style={{
                padding: "16px 8px",
                background: colors.primary,
                color: colors.white,
                textAlign: "right",
                fontWeight: 900,
                whiteSpace: "nowrap",
                fontSize: "12px",
                minWidth: 0,
              }}
            >
              {formatCurrencyWithCode(item.amount, invoice.currency)}
            </div>
          </div>
        ))}

        {/* Totals Grid */}
        <div
          className="color-pop-grid-totals"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr",
            borderTop: "5px solid " + colors.black,
          }}
        >
          <div
            className="payment-info-section"
            style={{
              padding: "25px",
              borderRight: "5px solid " + colors.black,
              background: colors.secondary,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "10px",
                color: colors.black,
              }}
            >
              Payment Info
            </div>
            <div
              style={{ fontSize: "12px", lineHeight: 1.7, color: colors.black }}
            >
              <PaymentInformation profile={profile} invoice={invoice} />
            </div>
          </div>
          <div
            className="subtotal-section"
            style={{
              borderRight: "5px solid " + colors.black,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 20px",
                borderBottom: "2px solid " + colors.black,
                gap: "10px",
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
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
                gap: "10px",
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Tax
              </span>
              <span
                style={{
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {formatCurrencyWithCode(invoice.tax_amount, invoice.currency)}
              </span>
            </div>
          </div>
          <div
            className="total-section"
            style={{
              background: colors.primary,
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: colors.white,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: colors.white,
              }}
            >
              {formatCurrencyWithCode(invoice.total, invoice.currency)}
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div
            style={{
              padding: "20px",
              borderTop: "5px solid " + colors.black,
              background: colors.tertiary + "30",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: 900,
                marginBottom: "8px",
              }}
            >
              Notes
            </div>
            <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const ColorPopGridTemplate = {
  id: "color-pop-grid" as const,
  name: "Color Pop Grid",
  description: "Grid-based brutalist layout with color blocks",
  Component: ColorPopGridTemplateComponent,
};
