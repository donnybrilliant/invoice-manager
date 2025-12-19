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
import { InvoiceContainer, TotalsSection, Section } from "./design-system";
import { createTemplateStyles } from "./design-system/template-helpers";
import { spacing, flexContainer } from "./design-system";
import { getCurrencyStyle } from "./design-system/text";

const MinimalJapaneseTemplateComponent: React.FC<InvoiceTemplateData> = ({
  invoice,
  items,
  client,
  profile,
}) => {
  const templateCSS = createTemplateStyles("minimaljapanese-template", {
    padding: true,
    table: true,
  });

  // Format client address
  const clientAddress = (
    <>
      {formatClientAddress(client)
        .split("\n")
        .map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      {client.email}
    </>
  );

  return (
    <>
      <style>{templateCSS}</style>
      <InvoiceContainer
        className="minimaljapanese-template"
        maxWidth={794}
        padding={{ desktop: 50, tablet: 40, mobile: 30 }}
        background="#FDFCFA"
        style={{
          fontFamily: "'Hiragino Mincho Pro', 'Yu Mincho', Georgia, serif",
          position: "relative",
          paddingLeft: "40px",
          paddingRight: "40px",
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
        <div style={{ textAlign: "center", marginBottom: spacing["4xl"] }}>
          <div
            style={{
              fontSize: spacing.md,
              color: "#C9B99A",
              letterSpacing: "8px",
              textTransform: "uppercase",
              marginBottom: spacing.lg,
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
              margin: `${spacing.lg}px auto`,
            }}
          />
          <div
            style={{
              fontSize: spacing.md,
              color: "#8A847B",
              letterSpacing: "2px",
            }}
          >
            No. {invoice.invoice_number}
          </div>
        </div>

        {/* Company Info */}
        <div
          style={{
            textAlign: "center",
            marginBottom: spacing["3xl"],
            paddingBottom: spacing["2xl"],
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
                marginBottom: spacing.lg,
                opacity: 0.8,
              }}
            />
          )}
          <div
            style={{
              fontSize: spacing["3xl"],
              fontWeight: 500,
              color: "#2D2A26",
              marginBottom: spacing.md,
              letterSpacing: "2px",
            }}
          >
            {getCompanyInfo(profile, "company_name")}
          </div>
          <div
            style={{ fontSize: spacing.md, color: "#8A847B", lineHeight: 2 }}
          >
            {formatCompanyAddress(profile).replace(/\n/g, " · ")} ·{" "}
            {getCompanyInfo(profile, "email")}
          </div>
        </div>

        {/* Client & Dates */}
        <div
          style={{
            ...flexContainer("row", "space-between", "flex-start"),
            marginBottom: spacing["3xl"],
          }}
        >
          <div style={{ maxWidth: "300px", minWidth: 0 }}>
            <div
              style={{
                fontSize: spacing.sm,
                color: "#C9B99A",
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: spacing.md,
              }}
            >
              御中
            </div>
            <div
              style={{
                fontSize: spacing.lg,
                fontWeight: 500,
                color: "#2D2A26",
                marginBottom: spacing.md,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                display: "block",
              }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontSize: spacing.md,
                color: "#8A847B",
                lineHeight: 1.9,
              }}
            >
              {clientAddress}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: spacing.lg }}>
              <div
                style={{
                  fontSize: spacing.sm,
                  color: "#C9B99A",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: spacing.sm,
                }}
              >
                発行日
              </div>
              <div style={{ fontSize: spacing.lg, color: "#2D2A26" }}>
                {formatDate(invoice.issue_date)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: spacing.sm,
                  color: "#C9B99A",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: spacing.sm,
                }}
              >
                支払期限
              </div>
              <div style={{ fontSize: spacing.lg, color: "#B85C38" }}>
                {formatDate(invoice.due_date)}
              </div>
            </div>
            {invoice.status === "sent" && invoice.sent_date && (
              <div style={{ marginTop: spacing.lg }}>
                <div
                  style={{
                    fontSize: spacing.sm,
                    color: "#8B7355",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: spacing.xs,
                  }}
                >
                  送信日
                </div>
                <div style={{ fontSize: spacing.lg, color: "#B85C38" }}>
                  {formatDate(invoice.sent_date)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div
          className="minimaljapanese-table"
          style={{ marginBottom: spacing["2xl"] }}
        >
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
              headerFontSize: spacing.sm,
              bodyFontSize: spacing.lg,
              headerPadding: `${spacing.md}px 0`,
              bodyPadding: `${spacing.lg}px 0`,
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
        <TotalsSection
          subtotal={{
            label: "小計",
            amount: formatCurrencyWithCode(invoice.subtotal, invoice.currency),
          }}
          tax={{
            label: "消費税",
            amount: formatCurrencyWithCode(
              invoice.tax_amount,
              invoice.currency
            ),
          }}
          total={{
            label: "合計",
            amount: formatCurrencyWithCode(invoice.total, invoice.currency),
          }}
          layout="right-aligned"
          style={{
            width: "260px",
            marginBottom: spacing["3xl"],
          }}
          rowStyle={{
            ...flexContainer("row", "space-between", "center"),
            padding: `${spacing.xl}px 0`,
            borderBottom: "1px solid #E8E4DF",
          }}
          labelStyle={{
            fontSize: spacing.md,
            color: "#8A847B",
          }}
          amountStyle={{
            ...getCurrencyStyle(),
            fontSize: spacing.lg,
            color: "#2D2A26",
          }}
          totalRowStyle={{
            padding: `${spacing["3xl"]}px 0`,
            borderTop: "2px solid #2D2A26",
            marginTop: spacing.md,
          }}
          totalLabelStyle={{
            fontSize: spacing.md,
            color: "#2D2A26",
            letterSpacing: "3px",
          }}
          totalAmountStyle={{
            ...getCurrencyStyle(),
            fontSize: "28px",
            fontWeight: 300,
            color: "#2D2A26",
          }}
        />

        {/* Payment Info */}
        <Section
          title="振込先"
          style={{
            padding: `${spacing["2xl"]}px 0`,
            borderTop: "1px solid #E8E4DF",
            marginBottom: spacing["2xl"],
          }}
          titleStyle={{
            fontSize: spacing.sm,
            color: "#C9B99A",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: spacing.md,
          }}
          contentStyle={{
            fontSize: spacing.md,
            color: "#2D2A26",
            lineHeight: 2,
          }}
        >
          <PaymentInformation
            profile={profile}
            invoice={invoice}
            style={{
              item: { marginBottom: "4px" },
            }}
          />
        </Section>

        {/* Notes */}
        {invoice.notes && (
          <Section
            title="備考"
            style={{
              padding: `${spacing["2xl"]}px 0`,
              borderTop: "1px solid #E8E4DF",
            }}
            titleStyle={{
              fontSize: spacing.sm,
              color: "#C9B99A",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: spacing.md,
            }}
            contentStyle={{
              fontSize: spacing.md,
              color: "#8A847B",
              lineHeight: 2,
            }}
          >
            {invoice.notes}
          </Section>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: spacing["3xl"],
            paddingTop: spacing["2xl"],
          }}
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
      </InvoiceContainer>
    </>
  );
};

export const MinimalJapaneseTemplate = {
  id: "minimal-japanese" as const,
  name: "Minimal Japanese",
  description: "Zen-inspired minimalism with generous whitespace",
  Component: MinimalJapaneseTemplateComponent,
};
