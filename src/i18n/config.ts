import en from "./locales/en.json";
import nb from "./locales/nb.json";
import es from "./locales/es.json";

export type SupportedLanguage = "en" | "nb" | "es";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "nb", "es"];

export const LANGUAGE_TO_LOCALE: Record<SupportedLanguage, string> = {
  en: "en-US",
  nb: "nb-NO",
  es: "es-ES",
};

export const I18N_NAMESPACES = [
  "common",
  "dashboard",
  "invoices",
  "clients",
  "settings",
  "templates",
  "emails",
  "validation",
] as const;

export const LANGUAGE_FALLBACK_CHAIN: Record<
  SupportedLanguage,
  SupportedLanguage[]
> = {
  en: ["en"],
  nb: ["nb", "en"],
  es: ["es", "en"],
};

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, unknown>> = {
  en,
  nb,
  es,
};

function resolveNestedTranslation(
  data: Record<string, unknown>,
  key: string
): string | null {
  const parts = key.split(".");
  let current: unknown = data;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : null;
}

export function resolveTranslation(
  language: SupportedLanguage,
  key: string
): string | null {
  const fallbackChain = LANGUAGE_FALLBACK_CHAIN[language] || ["en"];

  for (const candidateLanguage of fallbackChain) {
    const translation = resolveNestedTranslation(
      TRANSLATIONS[candidateLanguage],
      key
    );
    if (translation) {
      return translation;
    }
  }

  return null;
}

export function getDefaultLocaleForLanguage(language: string): string {
  if (language in LANGUAGE_TO_LOCALE) {
    return LANGUAGE_TO_LOCALE[language as SupportedLanguage];
  }
  return "en-US";
}
