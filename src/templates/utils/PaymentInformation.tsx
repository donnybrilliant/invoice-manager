import React from "react";
import { CompanyProfile } from "../../types";
import { formatDate, formatCurrencyWithCode } from "../../lib/formatting";

interface PaymentInfoProps {
  profile?: CompanyProfile | null;
  invoice: {
    kid_number?: string | null;
    due_date: string;
    total: number;
    currency: string;
    language?: string | null;
    locale?: string | null;
    payment_account_label?: string | null;
    payment_account_number?: string | null;
    payment_iban?: string | null;
    payment_swift_bic?: string | null;
    payment_currency?: string | null;
    show_account_number?: boolean;
    show_iban?: boolean;
    show_swift_bic?: boolean;
  };
  style?: {
    container?: React.CSSProperties;
    item?: React.CSSProperties;
    empty?: React.CSSProperties;
  };
}

export function PaymentInformation({ invoice, style = {} }: PaymentInfoProps) {
  const details: React.ReactNode[] = [];
  const textColor = style.item?.color || "inherit";

  if (invoice.payment_account_label) {
    details.push(
      <div key="account-label" style={style.item}>
        <strong style={{ color: textColor }}>Bank Account:</strong>{" "}
        {invoice.payment_account_label}
      </div>
    );
  }

  if (invoice.show_account_number && invoice.payment_account_number) {
    details.push(
      <div key="account-number" style={style.item}>
        <strong style={{ color: textColor }}>Account Number:</strong>{" "}
        {invoice.payment_account_number}
      </div>
    );
  }

  if (invoice.show_iban && invoice.payment_iban) {
    details.push(
      <div key="iban" style={style.item}>
        <strong style={{ color: textColor }}>IBAN:</strong> {invoice.payment_iban}
      </div>
    );
  }

  if (invoice.show_swift_bic && invoice.payment_swift_bic) {
    details.push(
      <div key="swift" style={style.item}>
        <strong style={{ color: textColor }}>SWIFT/BIC:</strong>{" "}
        {invoice.payment_swift_bic}
      </div>
    );
  }

  if (invoice.kid_number) {
    details.push(
      <div key="kid" style={style.item}>
        <strong style={{ color: textColor }}>KID:</strong> {invoice.kid_number}
      </div>
    );
  }

  details.push(
    <div key="due-date" style={style.item}>
      <strong style={{ color: textColor }}>Due Date:</strong>{" "}
      {formatDate(invoice.due_date, {
        locale: invoice.locale || undefined,
        language: invoice.language || undefined,
      })}
    </div>
  );

  const formattedAmount = formatCurrencyWithCode(
    invoice.total,
    invoice.payment_currency || invoice.currency,
    invoice.locale || undefined
  );

  details.push(
    <div key="amount" style={style.item}>
      <strong style={{ color: textColor }}>Amount Due:</strong> {formattedAmount}
    </div>
  );

  if (details.length === 0) {
    return (
      <div style={style.empty || { color: "#9ca3af", fontSize: "14px" }}>
        [Payment information not set]
      </div>
    );
  }

  return <div style={style.container}>{details}</div>;
}
