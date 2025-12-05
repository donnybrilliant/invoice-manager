import { useState, useEffect, useActionState, useRef } from "react";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  useCompanyProfile,
  useUpdateCompanyProfile,
} from "../hooks/useCompanyProfile";

interface CompanyProfileProps {
  onBack: () => void;
}

export default function CompanyProfile({ onBack }: CompanyProfileProps) {
  const { user } = useAuth();
  const { data: profile } = useCompanyProfile();
  const updateProfileMutation = useUpdateCompanyProfile();
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState("");
  const [formData, setFormData] = useState({
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
    account_number: "",
    iban: "",
    swift_bic: "",
    currency: "EUR",
    payment_instructions: "",
    logo_url: "",
  });

  useEffect(() => {
    if (profile) {
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
        account_number: profile.account_number || "",
        iban: profile.iban || "",
        swift_bic: profile.swift_bic || "",
        currency: profile.currency || "EUR",
        payment_instructions: profile.payment_instructions || "",
        logo_url: profile.logo_url || "",
      });
      if (profile.logo_url) {
        setLogoPreview(profile.logo_url);
      }
    }
  }, [profile]);

  // Ref to access current formData and logoFile in action
  const formDataRef = useRef(formData);
  const logoFileRef = useRef(logoFile);
  
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  
  useEffect(() => {
    logoFileRef.current = logoFile;
  }, [logoFile]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLogoError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoError("Image size must be less than 5MB");
      return;
    }

    setLogoFile(file);
    setLogoError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null;

    setUploading(true);
    try {
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(fileName, logoFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("company-logos").getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to upload logo"
      );
    } finally {
      setUploading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  interface CompanyProfileState {
    error?: string;
    success?: boolean;
  }

  const [state, submitAction, isPending] = useActionState(
    async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _prevState: CompanyProfileState | null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _formData: FormData
    ): Promise<CompanyProfileState> => {
      if (!user) {
        return { error: "User not authenticated" };
      }

      const currentFormData = formDataRef.current;
      const currentLogoFile = logoFileRef.current;

      if (currentFormData.email && !validateEmail(currentFormData.email)) {
        return { error: "Please enter a valid email address" };
      }

      try {
        let logoUrl = currentFormData.logo_url;

        if (currentLogoFile) {
          const uploadedUrl = await uploadLogo();
          if (uploadedUrl) {
            logoUrl = uploadedUrl;
          }
        }

        await updateProfileMutation.mutateAsync({
          company_name: currentFormData.company_name || null,
          phone: currentFormData.phone || null,
          email: currentFormData.email || null,
          website: currentFormData.website || null,
          organization_number: currentFormData.organization_number || null,
          tax_number: currentFormData.tax_number || null,
          street_address: currentFormData.street_address || null,
          postal_code: currentFormData.postal_code || null,
          city: currentFormData.city || null,
          state: currentFormData.state || null,
          country: currentFormData.country || null,
          account_number: currentFormData.account_number || null,
          iban: currentFormData.iban || null,
          swift_bic: currentFormData.swift_bic || null,
          currency: currentFormData.currency || "EUR",
          payment_instructions: currentFormData.payment_instructions || null,
          logo_url: logoUrl || null,
        });

        setSuccessMessage("Company profile saved successfully!");
        setLogoFile(null);
        
        setTimeout(() => {
          onBack();
        }, 1500);
        
        return { success: true, error: undefined };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Failed to save company profile",
        };
      }
    },
    null
  );

  // Update success message when state changes
  useEffect(() => {
    if (state?.success) {
      setSuccessMessage("Company profile saved successfully!");
    }
  }, [state?.success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Company Profile
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your company information and branding
            </p>
          </div>

          <form action={submitAction} className="space-y-6">
            {/* Logo Upload */}
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
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">
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

            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Company Name
                  </label>
                  <input
                    id="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="+47 123 45 678"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>
            </div>

            {/* Company Registration */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Company Registration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="organization_number"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Organization Number
                  </label>
                  <input
                    id="organization_number"
                    type="text"
                    value={formData.organization_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organization_number: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tax_number"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Tax/VAT/MVA Number
                  </label>
                  <input
                    id="tax_number"
                    type="text"
                    value={formData.tax_number}
                    onChange={(e) =>
                      setFormData({ ...formData, tax_number: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="NO123456789MVA"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="street_address"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Street Address
                  </label>
                  <input
                    id="street_address"
                    type="text"
                    value={formData.street_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        street_address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="Storgata 1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="postal_code"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Postal Code
                    </label>
                    <input
                      id="postal_code"
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          postal_code: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                      placeholder="0001"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                      placeholder="Oslo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      State/Region
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                      placeholder="Norway"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Banking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="account_number"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Account Number
                  </label>
                  <input
                    id="account_number"
                    type="text"
                    value={formData.account_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        account_number: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="1234 56 78901"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="NOK">NOK (kr)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="SEK">SEK (kr)</option>
                    <option value="DKK">DKK (kr)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="iban"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    IBAN
                  </label>
                  <input
                    id="iban"
                    type="text"
                    value={formData.iban}
                    onChange={(e) =>
                      setFormData({ ...formData, iban: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="NO93 8601 1117 947"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    International Bank Account Number
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="swift_bic"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    SWIFT/BIC
                  </label>
                  <input
                    id="swift_bic"
                    type="text"
                    value={formData.swift_bic}
                    onChange={(e) =>
                      setFormData({ ...formData, swift_bic: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                    placeholder="DNBANOKK"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Bank Identifier Code for international transfers
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="payment_instructions"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Payment Instructions
                  </label>
                  <textarea
                    id="payment_instructions"
                    value={formData.payment_instructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_instructions: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent resize-none"
                    placeholder="Please make payment within 30 days..."
                  />
                </div>
              </div>
            </div>

            {(state?.error || logoError) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {state?.error || logoError}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || uploading}
                className="flex-1 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(isPending || uploading) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {uploading
                  ? "Uploading..."
                  : isPending
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
