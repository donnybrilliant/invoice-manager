import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  getDefaultLocaleForLanguage,
  resolveTranslation,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "../i18n/config";
import { useCompanyProfile } from "../hooks/useCompanyProfile";

interface LocaleContextValue {
  language: SupportedLanguage;
  locale: string;
  t: (key: string, fallback?: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const fallbackLanguage = (): SupportedLanguage => {
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browser as SupportedLanguage)) {
    return browser as SupportedLanguage;
  }
  return "en";
};

export function LocaleProvider({ children }: PropsWithChildren) {
  const { data: profile } = useCompanyProfile();
  const [language, setLanguage] = useState<SupportedLanguage>(fallbackLanguage);
  const [locale, setLocale] = useState<string>(
    getDefaultLocaleForLanguage(fallbackLanguage())
  );

  useEffect(() => {
    if (!profile) return;

    const profileLanguage = profile.ui_language as SupportedLanguage | undefined;
    if (profileLanguage && SUPPORTED_LANGUAGES.includes(profileLanguage)) {
      setLanguage(profileLanguage);
      setLocale(
        profile.ui_locale || getDefaultLocaleForLanguage(profileLanguage)
      );
      return;
    }

    const detected = fallbackLanguage();
    setLanguage(detected);
    setLocale(getDefaultLocaleForLanguage(detected));
  }, [profile]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      language,
      locale,
      t: (key: string, fallback?: string) => {
        const translation = resolveTranslation(language, key);
        if (!translation) {
          if (import.meta.env.DEV) {
            console.warn(
              `[i18n] Missing translation key "${key}" for language "${language}"`
            );
          }
          return fallback || key;
        }
        return translation;
      },
    }),
    [language, locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
