import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  Upload,
  Loader2,
  Palette,
  Plus,
  Pencil,
  Trash2,
  Star,
  Check,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  useCompanyProfile,
  useUpdateCompanyProfile,
} from "../hooks/useCompanyProfile";
import {
  useBankAccounts,
  useDeleteBankAccount,
  useSetDefaultBankAccountForCurrency,
  useUpsertBankAccount,
} from "../hooks/useBankAccounts";
import EmailTemplateSection from "./EmailTemplateSection";
import { BankAccount } from "../types";
import { getDefaultLocaleForLanguage } from "../i18n/config";

interface CompanyProfileProps {
  onBack: () => void;
}

const CURRENCY_OPTIONS = ["EUR", "NOK", "USD", "GBP", "SEK", "DKK"];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "nb", label: "Norwegian (Bokmal)" },
  { value: "es", label: "Spanish" },
];

const LOCALE_OPTIONS = [
  { value: "en-US", label: "English (United States)" },
  { value: "nb-NO", label: "Norwegian (Norway)" },
  { value: "es-ES", label: "Spanish (Spain)" },
];

interface ProfileFormData {
  company_name: string;
  phone: string;
  email: string;
  website: string;
  organization_number: string;
  tax_number: string;
  street_address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  ui_language: string;
  ui_locale: string;
  default_invoice_language: string;
  default_invoice_locale: string;
  currency: string;
  payment_instructions: string;
  logo_url: string;
  use_custom_email_template: boolean;
  email_template: string;
  use_brutalist_theme: boolean;
}

interface BankAccountFormData {
  id?: string;
  display_name: string;
  currency: string;
  account_number: string;
  iban: string;
  swift_bic: string;
  is_default_for_currency: boolean;
  is_active: boolean;
}

const emptyBankAccountForm: BankAccountFormData = {
  display_name: "",
  currency: "EUR",
  account_number: "",
  iban: "",
  swift_bic: "",
  is_default_for_currency: false,
  is_active: true,
};

function mapBankAccountToForm(account: BankAccount): BankAccountFormData {
  return {
    id: account.id,
    display_name: account.display_name,
    currency: account.currency,
    account_number: account.account_number || "",
    iban: account.iban || "",
    swift_bic: account.swift_bic || "",
    is_default_for_currency: account.is_default_for_currency,
    is_active: account.is_active,
  };
}

export default function CompanyProfile({ onBack }: CompanyProfileProps) {
  const { user } = useAuth();
  const { isBrutalist } = useTheme();
  const { data: profile } = useCompanyProfile();
  const { data: bankAccounts = [] } = useBankAccounts();
  const updateProfileMutation = useUpdateCompanyProfile();
  const upsertBankAccountMutation = useUpsertBankAccount();
  const deleteBankAccountMutation = useDeleteBankAccount();
  const setDefaultBankAccountMutation = useSetDefaultBankAccountForCurrency();

  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBankAccount, setSavingBankAccount] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bankAccountError, setBankAccountError] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    company_name: "",
    phone: "",
    email: "",
    website: "",
    organization_number: "",
    tax_number: "",
    street_address: "",
    postal_code: "",
    city: "",
    state: "",
    country: "Norway",
    ui_language: "en",
    ui_locale: "en-US",
    default_invoice_language: "en",
    default_invoice_locale: "en-US",
    currency: "EUR",
    payment_instructions: "",
    logo_url: "",
    use_custom_email_template: false,
    email_template: "",
    use_brutalist_theme: false,
  });

  const [bankAccountForm, setBankAccountForm] =
    useState<BankAccountFormData>(emptyBankAccountForm);

  const sortedBankAccounts = useMemo(
    () =>
      [...bankAccounts].sort((a, b) => {
        if (a.currency !== b.currency) return a.currency.localeCompare(b.currency);
        if (a.is_default_for_currency !== b.is_default_for_currency) {
          return a.is_default_for_currency ? -1 : 1;
        }
        if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
        return a.display_name.localeCompare(b.display_name);
      }),
    [bankAccounts]
  );

  useEffect(() => {
    if (!profile) return;

    setFormData({
      company_name: profile.company_name || "",
      phone: profile.phone || "",
      email: profile.email || "",
      website: profile.website || "",
      organization_number: profile.organization_number || "",
      tax_number: profile.tax_number || "",
      street_address: profile.street_address || "",
      postal_code: profile.postal_code || "",
      city: profile.city || "",
      state: profile.state || "",
      country: profile.country || "Norway",
      ui_language: profile.ui_language || "en",
      ui_locale: profile.ui_locale || "en-US",
      default_invoice_language: profile.default_invoice_language || "en",
      default_invoice_locale: profile.default_invoice_locale || "en-US",
      currency: profile.currency || "EUR",
      payment_instructions: profile.payment_instructions || "",
      logo_url: profile.logo_url || "",
      use_custom_email_template: profile.use_custom_email_template || false,
      email_template: profile.email_template || "",
      use_brutalist_theme: profile.use_brutalist_theme || false,
    });

    if (profile.logo_url) {
      setLogoPreview(profile.logo_url);
    }
  }, [profile]);

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!user) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("company-logos").getPublicUrl(fileName);

      return publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB");
      return;
    }

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.email && !validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setSavingProfile(true);
    try {
      let logoUrl = formData.logo_url;
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (uploadedUrl) logoUrl = uploadedUrl;
      }

      await updateProfileMutation.mutateAsync({
        company_name: formData.company_name || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        organization_number: formData.organization_number || null,
        tax_number: formData.tax_number || null,
        street_address: formData.street_address || null,
        postal_code: formData.postal_code || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        ui_language: formData.ui_language,
        ui_locale: formData.ui_locale,
        default_invoice_language: formData.default_invoice_language,
        default_invoice_locale: formData.default_invoice_locale,
        currency: formData.currency,
        payment_instructions: formData.payment_instructions || null,
        logo_url: logoUrl || null,
        use_custom_email_template: formData.use_custom_email_template,
        email_template: formData.use_custom_email_template
          ? formData.email_template || null
          : null,
        use_brutalist_theme: formData.use_brutalist_theme,
      });

      setFormData((prev) => ({ ...prev, logo_url: logoUrl || "" }));
      setLogoFile(null);
      setSuccessMessage("Company profile saved successfully");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save company profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEditBankAccount = (account: BankAccount) => {
    setBankAccountError("");
    setBankAccountForm(mapBankAccountToForm(account));
  };

  const handleResetBankAccountForm = () => {
    setBankAccountError("");
    setBankAccountForm(emptyBankAccountForm);
  };

  const handleBankAccountSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBankAccountError("");

    if (!bankAccountForm.display_name.trim()) {
      setBankAccountError("Display name is required");
      return;
    }

    if (!bankAccountForm.account_number.trim() && !bankAccountForm.iban.trim()) {
      setBankAccountError("Either account number or IBAN is required");
      return;
    }

    setSavingBankAccount(true);
    try {
      const saved = await upsertBankAccountMutation.mutateAsync({
        id: bankAccountForm.id,
        display_name: bankAccountForm.display_name.trim(),
        currency: bankAccountForm.currency,
        account_number: bankAccountForm.account_number.trim() || null,
        iban: bankAccountForm.iban.trim() || null,
        swift_bic: bankAccountForm.swift_bic.trim() || null,
        is_default_for_currency: false,
        is_active: bankAccountForm.is_active,
      });

      if (bankAccountForm.is_default_for_currency) {
        await setDefaultBankAccountMutation.mutateAsync({
          id: saved.id,
          currency: saved.currency,
        });
      }

      handleResetBankAccountForm();
    } catch (err) {
      setBankAccountError(
        err instanceof Error ? err.message : "Failed to save bank account"
      );
    } finally {
      setSavingBankAccount(false);
    }
  };

  const handleSetDefault = async (account: BankAccount) => {
    try {
      await setDefaultBankAccountMutation.mutateAsync({
        id: account.id,
        currency: account.currency,
      });
    } catch (err) {
      setBankAccountError(
        err instanceof Error ? err.message : "Failed to set default account"
      );
    }
  };

  const handleDeleteBankAccount = async (accountId: string) => {
    if (!window.confirm("Delete this bank account?")) return;

    try {
      await deleteBankAccountMutation.mutateAsync(accountId);
      if (bankAccountForm.id === accountId) {
        handleResetBankAccountForm();
      }
    } catch (err) {
      setBankAccountError(
        err instanceof Error ? err.message : "Failed to delete bank account"
      );
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isBrutalist
          ? "bg-[var(--brutalist-bg)]"
          : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      }`}
    >
      <nav
        className={
          isBrutalist
            ? "brutalist-border border-x-0 border-t-0 bg-[hsl(var(--brutalist-red))]"
            : "bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700"
        }
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 transition cursor-pointer ${
                isBrutalist
                  ? "text-white hover:text-[hsl(var(--brutalist-yellow))] brutalist-text"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`p-6 md:p-8 ${
            isBrutalist
              ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]"
              : "bg-white dark:bg-slate-800 rounded-xl shadow-sm"
          }`}
        >
          <div className="mb-6">
            <h2
              className={`text-2xl font-bold ${
                isBrutalist
                  ? "brutalist-heading text-[var(--brutalist-fg)]"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              Company Profile
            </h2>
            <p
              className={`mt-1 ${
                isBrutalist
                  ? "text-[var(--brutalist-muted-fg)]"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Manage your company profile, localization defaults, and bank
              accounts.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6 brutalist-form">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company Logo
              </label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="w-24 h-24 border-2 border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-700">
                    <img
                      src={logoPreview}
                      alt="Company logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 transition ${
                      isBrutalist
                        ? "brutalist-border bg-[hsl(var(--brutalist-cyan))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    PNG, JPG or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="+47 123 45 678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, website: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Address
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.street_address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, street_address: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  placeholder="Street Address"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, postal_code: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="Postal Code"
                  />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="City"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="State/Region"
                  />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, country: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Localization & Currency Defaults
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    UI Language
                  </label>
                  <select
                    value={formData.ui_language}
                    onChange={(e) => {
                      const language = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        ui_language: language,
                        ui_locale: getDefaultLocaleForLanguage(language),
                      }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    UI Locale
                  </label>
                  <select
                    value={formData.ui_locale}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ui_locale: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  >
                    {LOCALE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Default Invoice Language
                  </label>
                  <select
                    value={formData.default_invoice_language}
                    onChange={(e) => {
                      const language = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        default_invoice_language: language,
                        default_invoice_locale: getDefaultLocaleForLanguage(language),
                      }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Default Invoice Locale
                  </label>
                  <select
                    value={formData.default_invoice_locale}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        default_invoice_locale: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  >
                    {LOCALE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Default Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, currency: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  >
                    {CURRENCY_OPTIONS.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Payment Instructions
                  </label>
                  <textarea
                    value={formData.payment_instructions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payment_instructions: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                    placeholder="Please make payment within 30 days..."
                  />
                </div>
              </div>
            </div>

            <EmailTemplateSection
              useCustomTemplate={formData.use_custom_email_template}
              customTemplate={formData.email_template}
              onUseCustomChange={(useCustom) =>
                setFormData((prev) => ({
                  ...prev,
                  use_custom_email_template: useCustom,
                }))
              }
              onCustomTemplateChange={(template) =>
                setFormData((prev) => ({ ...prev, email_template: template }))
              }
              companyName={formData.company_name}
              companyEmail={formData.email}
            />

            <div className="border-t pt-6 border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold mb-3 text-slate-900 dark:text-white">
                UI Theme
              </h3>
              <div
                className={`p-4 ${
                  isBrutalist
                    ? "brutalist-border bg-[var(--brutalist-card)]"
                    : "bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 ${
                        isBrutalist
                          ? "brutalist-border bg-[hsl(var(--brutalist-yellow))]"
                          : "bg-slate-200 dark:bg-slate-600 rounded-lg"
                      }`}
                    >
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Brutalist Theme
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Persist brutalist UI theme for this account.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        use_brutalist_theme: !prev.use_brutalist_theme,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      formData.use_brutalist_theme
                        ? "bg-slate-900"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.use_brutalist_theme
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="px-4 py-3 text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className={`flex-1 px-4 py-2 transition font-medium cursor-pointer ${
                  isBrutalist
                    ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))]"
                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile || uploading}
                className={`flex-1 px-4 py-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
                  isBrutalist
                    ? "brutalist-border brutalist-shadow-sm bg-[var(--brutalist-fg)] text-[var(--brutalist-bg)] hover:bg-[hsl(var(--brutalist-green))]"
                    : "bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600"
                }`}
              >
                {(savingProfile || uploading) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {uploading
                  ? "Uploading..."
                  : savingProfile
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            </div>
          </form>

          <div className="border-t mt-8 pt-8 border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Bank Accounts
              </h3>
              <button
                type="button"
                onClick={handleResetBankAccountForm}
                className={`px-3 py-2 text-sm font-medium inline-flex items-center gap-2 transition cursor-pointer ${
                  isBrutalist
                    ? "brutalist-border bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)]"
                    : "bg-slate-900 text-white rounded-lg"
                }`}
              >
                <Plus className="w-4 h-4" />
                New Account
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                {sortedBankAccounts.length === 0 && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    No bank accounts yet. Add at least one account to create
                    invoices.
                  </div>
                )}

                {sortedBankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {account.display_name}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {account.currency}
                          </span>
                          {account.is_default_for_currency && (
                            <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Default
                            </span>
                          )}
                          {!account.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {account.account_number
                            ? `Account: ${account.account_number}`
                            : "No account number"}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {account.iban ? `IBAN: ${account.iban}` : "No IBAN"}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {account.swift_bic
                            ? `SWIFT/BIC: ${account.swift_bic}`
                            : "No SWIFT/BIC"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSetDefault(account)}
                          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                          title="Set default for currency"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditBankAccount(account)}
                          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBankAccount(account.id)}
                          className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleBankAccountSubmit}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 space-y-3"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {bankAccountForm.id ? "Edit Bank Account" : "Add Bank Account"}
                </p>

                <input
                  type="text"
                  value={bankAccountForm.display_name}
                  onChange={(e) =>
                    setBankAccountForm((prev) => ({
                      ...prev,
                      display_name: e.target.value,
                    }))
                  }
                  placeholder="Display name"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                  required
                />

                <select
                  value={bankAccountForm.currency}
                  onChange={(e) =>
                    setBankAccountForm((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                >
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={bankAccountForm.account_number}
                  onChange={(e) =>
                    setBankAccountForm((prev) => ({
                      ...prev,
                      account_number: e.target.value,
                    }))
                  }
                  placeholder="Account number"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                />

                <input
                  type="text"
                  value={bankAccountForm.iban}
                  onChange={(e) =>
                    setBankAccountForm((prev) => ({ ...prev, iban: e.target.value }))
                  }
                  placeholder="IBAN"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                />

                <input
                  type="text"
                  value={bankAccountForm.swift_bic}
                  onChange={(e) =>
                    setBankAccountForm((prev) => ({
                      ...prev,
                      swift_bic: e.target.value,
                    }))
                  }
                  placeholder="SWIFT/BIC"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg"
                />

                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bankAccountForm.is_default_for_currency}
                    onChange={(e) =>
                      setBankAccountForm((prev) => ({
                        ...prev,
                        is_default_for_currency: e.target.checked,
                      }))
                    }
                  />
                  Set as default for this currency
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bankAccountForm.is_active}
                    onChange={(e) =>
                      setBankAccountForm((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                  />
                  Active
                </label>

                {bankAccountError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {bankAccountError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={savingBankAccount}
                    className="flex-1 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {savingBankAccount
                      ? "Saving..."
                      : bankAccountForm.id
                      ? "Update Account"
                      : "Create Account"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetBankAccountForm}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
