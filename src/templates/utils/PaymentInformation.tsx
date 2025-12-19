import React from "react";
import { CompanyProfile } from "../../types";
import { formatDate, formatCurrencyWithCode } from "../../lib/formatting";

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

  // Get the color from style.item to apply to strong tags
  const textColor = style.item?.color || "inherit";
  
  // Default item style with responsive font size and wrapping
  const defaultItemStyle: React.CSSProperties = {
    fontSize: "clamp(11px, 2.5vw, 18px)",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    minWidth: 0,
    ...style.item,
  };

  // Banking details
  if (profile) {
    if (invoice.show_account_number && profile.account_number) {
      details.push(
        <div key="account" style={defaultItemStyle}>
          <strong style={{ color: textColor }}>Account Number:</strong>{" "}
          {profile.account_number}
        </div>
      );
    }

    if (invoice.show_iban && profile.iban) {
      details.push(
        <div key="iban" style={defaultItemStyle}>
          <strong style={{ color: textColor }}>IBAN:</strong> {profile.iban}
        </div>
      );
    }

    if (invoice.show_swift_bic && profile.swift_bic) {
      details.push(
        <div key="swift" style={defaultItemStyle}>
          <strong style={{ color: textColor }}>SWIFT/BIC:</strong>{" "}
          {profile.swift_bic}
        </div>
      );
    }
  }

  // KID number
  if (invoice.kid_number) {
    details.push(
      <div key="kid" style={defaultItemStyle}>
        <strong style={{ color: textColor }}>KID:</strong> {invoice.kid_number}
      </div>
    );
  }

  // Due date
  details.push(
    <div key="due-date" style={defaultItemStyle}>
      <strong style={{ color: textColor }}>Due Date:</strong>{" "}
      {formatDate(invoice.due_date)}
    </div>
  );

  // Amount Due - use formatCurrencyWithCode for consistent formatting
  const formattedAmount = formatCurrencyWithCode(
    invoice.total,
    invoice.currency
  );
  details.push(
    <div key="amount" style={defaultItemStyle}>
      <strong style={{ color: textColor }}>Amount Due:</strong>{" "}
      {formattedAmount}
    </div>
  );

  if (details.length === 0) {
    return (
      <div style={style.empty || { color: "#9ca3af", fontSize: "clamp(11px, 2.5vw, 18px)" }}>
        [Payment information not set]
      </div>
    );
  }

  // Default container style with overflow handling
  const defaultContainerStyle: React.CSSProperties = {
    minWidth: 0,
    overflow: "hidden",
    ...style.container,
  };

  return <div style={defaultContainerStyle}>{details}</div>;
}
