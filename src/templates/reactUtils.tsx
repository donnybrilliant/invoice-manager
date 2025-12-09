import React from "react";
import { CompanyProfile } from "../types";
import { formatDate, formatAmountWithComma } from "./utils";

interface PaymentInfoProps {
  profile: CompanyProfile | null;
  invoice: {
    kid_number?: string | null;
    due_date: string;
    total: number;
    currency: string;
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

export function PaymentInformation({
  profile,
  invoice,
  style = {},
}: PaymentInfoProps) {
  const details: React.ReactNode[] = [];

  // Banking details
  if (profile) {
    if (invoice.show_account_number && profile.account_number) {
      details.push(
        <div key="account" style={style.item}>
          <strong>Account Number:</strong> {profile.account_number}
        </div>
      );
    }

    if (invoice.show_iban && profile.iban) {
      details.push(
        <div key="iban" style={style.item}>
          <strong>IBAN:</strong> {profile.iban}
        </div>
      );
    }

    if (invoice.show_swift_bic && profile.swift_bic) {
      details.push(
        <div key="swift" style={style.item}>
          <strong>SWIFT/BIC:</strong> {profile.swift_bic}
        </div>
      );
    }
  }

  // KID number
  if (invoice.kid_number) {
    details.push(
      <div key="kid" style={style.item}>
        <strong>KID:</strong> {invoice.kid_number}
      </div>
    );
  }

  // Due date
  details.push(
    <div key="due-date" style={style.item}>
      <strong>Due Date:</strong> {formatDate(invoice.due_date)}
    </div>
  );

  // Amount Due
  const currencySymbol =
    invoice.currency === "EUR"
      ? "€"
      : invoice.currency === "NOK"
      ? "kr"
      : invoice.currency === "USD"
      ? "$"
      : invoice.currency === "GBP"
      ? "£"
      : invoice.currency;
  const amountWithComma = formatAmountWithComma(invoice.total);
  details.push(
    <div key="amount" style={style.item}>
      <strong>Amount Due:</strong> {currencySymbol} {amountWithComma}
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
