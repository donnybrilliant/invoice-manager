/**
 * Locale-aware formatting utility functions for dates, currencies, and numbers.
 */

const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  nb: "nb-NO",
  es: "es-ES",
};

const CURRENCY_FALLBACK_LOCALE_MAP: Record<string, string> = {
  EUR: "nb-NO",
  NOK: "nb-NO",
  SEK: "sv-SE",
  DKK: "da-DK",
  USD: "en-US",
  GBP: "en-GB",
};

interface ResolveLocaleOptions {
  locale?: string | null;
  language?: string | null;
  currency?: string | null;
}

export function resolveLocale(options: ResolveLocaleOptions = {}): string {
  const { locale, language, currency } = options;
  if (locale) return locale;
  if (language && LANGUAGE_LOCALE_MAP[language]) {
    return LANGUAGE_LOCALE_MAP[language];
  }
  if (currency && CURRENCY_FALLBACK_LOCALE_MAP[currency]) {
    return CURRENCY_FALLBACK_LOCALE_MAP[currency];
  }
  return "en-US";
}

interface FormatNumberOptions {
  locale?: string | null;
  language?: string | null;
  currency?: string | null;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatNumber(
  value: number,
  {
    locale,
    language,
    currency,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: FormatNumberOptions = {}
): string {
  return new Intl.NumberFormat(resolveLocale({ locale, language, currency }), {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

interface FormatMoneyOptions {
  currency?: string;
  locale?: string | null;
  language?: string | null;
  currencyDisplay?: "code" | "symbol" | "name";
}

export function formatMoney(
  amount: number,
  {
    currency = "EUR",
    locale,
    language,
    currencyDisplay = "code",
  }: FormatMoneyOptions = {}
): string {
  const resolvedLocale = resolveLocale({ locale, language, currency });

  if (currencyDisplay === "code") {
    const numberPart = formatNumber(amount, {
      locale: resolvedLocale,
      currency,
    });
    return `${currency} ${numberPart}`;
  }

  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
    currencyDisplay,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface FormatDateOptions {
  locale?: string | null;
  language?: string | null;
  dateStyle?: "short" | "medium" | "long";
}

export function formatDate(
  value: string | Date,
  { locale, language, dateStyle = "short" }: FormatDateOptions = {}
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(resolveLocale({ locale, language }), {
    dateStyle,
  }).format(date);
}

export function formatCurrencyWithCode(
  amount: number,
  currency: string = "EUR",
  locale?: string | null
): string {
  return formatMoney(amount, { currency, locale, currencyDisplay: "code" });
}

export function formatCurrencyAmountOnly(
  amount: number,
  currency: string = "EUR",
  locale?: string | null
): string {
  return formatNumber(amount, { currency, locale });
}

export function formatCurrencyWithCodeAndSpace(
  amount: number,
  currency: string = "EUR",
  locale?: string | null
): string {
  return formatCurrencyWithCode(amount, currency, locale);
}

export function formatAmountWithComma(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

