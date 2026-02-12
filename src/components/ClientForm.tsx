import { useState, useEffect, useActionState, useRef, useMemo } from "react";
import { X, Trash2, Users, AlertCircle } from "lucide-react";
import { Client } from "../types";
import {
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "../hooks/useClients";
import { useClientInvoices } from "../hooks/useClientInvoices";
import { useTheme } from "../contexts/ThemeContext";

interface ClientFormProps {
  onClose: () => void;
  onSuccess: (createdClientId?: string) => void;
  client?: Client;
}

export default function ClientForm({
  onClose,
  onSuccess,
  client,
}: ClientFormProps) {
  const { isBrutalist } = useTheme();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if client has non-draft invoices
  const { data: clientInvoices = [] } = useClientInvoices(client?.id);
  const hasNonDraftInvoices = clientInvoices.some(
    (invoice) => invoice.status !== "draft"
  );
  const canDelete = !hasNonDraftInvoices;

  // Compute initial form data based on client prop
  const initialFormData = useMemo(() => {
    if (client) {
      return {
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        organization_number: client.organization_number || "",
        tax_number: client.tax_number || "",
        kid_number: client.kid_number || "",
        street_address: client.street_address || "",
        postal_code: client.postal_code || "",
        city: client.city || "",
        state: client.state || "",
        country: client.country || "Norway",
        preferred_language: client.preferred_language || "",
        preferred_locale: client.preferred_locale || "",
        preferred_currency: client.preferred_currency || "",
      };
    }
    return {
      name: "",
      email: "",
      phone: "",
      organization_number: "",
      tax_number: "",
      kid_number: "",
      street_address: "",
      postal_code: "",
      city: "",
      state: "",
      country: "Norway",
      preferred_language: "",
      preferred_locale: "",
      preferred_currency: "",
    };
  }, [client]); // Recompute when client changes

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when initial data changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Ref to access current formData in action
  const formDataRef = useRef(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  interface ClientFormState {
    error?: string;
  }

  const [state, submitAction, isPending] = useActionState(
    async (
      _prevState: ClientFormState | null,
      _formData: FormData
    ): Promise<ClientFormState> => {
      const currentFormData = formDataRef.current;

      try {
        const clientData = {
          name: currentFormData.name,
          email: currentFormData.email || null,
          phone: currentFormData.phone || null,
          organization_number: currentFormData.organization_number || null,
          tax_number: currentFormData.tax_number || null,
          kid_number: currentFormData.kid_number || null,
          street_address: currentFormData.street_address || null,
          postal_code: currentFormData.postal_code || null,
          city: currentFormData.city || null,
          state: currentFormData.state || null,
          country: currentFormData.country || null,
          preferred_language: currentFormData.preferred_language || null,
          preferred_locale: currentFormData.preferred_locale || null,
          preferred_currency: currentFormData.preferred_currency || null,
        };

        if (client) {
          await updateClientMutation.mutateAsync({
            id: client.id,
            data: clientData,
          });
          onSuccess();
        } else {
          const newClient = await createClientMutation.mutateAsync(clientData);
          onSuccess(newClient.id);
        }
        return { error: undefined };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : `Failed to ${client ? "update" : "create"} client`,
        };
      }
    },
    null
  );

  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (!client) return;

    // Double-check: prevent deletion if client has non-draft invoices
    if (hasNonDraftInvoices) {
      setDeleteError(
        "Cannot delete client with invoices that are not in draft status. Please delete or update all non-draft invoices first."
      );
      setShowDeleteConfirm(false);
      return;
    }

    setDeleteError("");

    try {
      await deleteClientMutation.mutateAsync(client.id);
      onSuccess();
    } catch (err) {
      // Extract error message from Supabase error or generic error
      let errorMessage = "Failed to delete client";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      setDeleteError(errorMessage);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${isBrutalist ? "bg-black/70" : "bg-black bg-opacity-50"}`}>
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 ${isBrutalist ? "brutalist-border brutalist-shadow-lg bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-xl shadow-2xl"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-2xl font-bold flex items-center gap-2 ${
              isBrutalist
                ? "brutalist-heading text-[var(--brutalist-fg)]"
                : "text-slate-900 dark:text-white"
            }`}
          >
            <Users className="w-6 h-6" />
            {client ? "Edit Client" : "New Client"}
          </h2>
          <button
            onClick={onClose}
            className={`transition p-2 ${
              isBrutalist
                ? "brutalist-border bg-[hsl(var(--brutalist-red))] text-white hover:bg-[hsl(var(--brutalist-yellow))] hover:text-[var(--brutalist-fg)]"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={submitAction} className="space-y-6 brutalist-form">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                  placeholder="Client or company name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    placeholder="client@example.com"
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
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 brutalist-form-section">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Company Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label
                  htmlFor="kid_number"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  KID Number (Optional)
                </label>
                <input
                  id="kid_number"
                  type="text"
                  value={formData.kid_number}
                  onChange={(e) =>
                    setFormData({ ...formData, kid_number: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                  placeholder="Leave empty to use client ID"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Customer identification number for Norwegian banking
                </p>
              </div>
            </div>
          </div>

          {/* Localization Preferences */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 brutalist-form-section">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Localization Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="preferred_language"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Preferred Language
                </label>
                <select
                  id="preferred_language"
                  value={formData.preferred_language}
                  onChange={(e) => {
                    const language = e.target.value;
                    setFormData({
                      ...formData,
                      preferred_language: language,
                      preferred_locale:
                        language === "en"
                          ? "en-US"
                          : language === "nb"
                          ? "nb-NO"
                          : language === "es"
                          ? "es-ES"
                          : formData.preferred_locale,
                    });
                  }}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Use Company Default</option>
                  <option value="en">English</option>
                  <option value="nb">Norwegian (Bokmal)</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="preferred_locale"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Preferred Locale
                </label>
                <select
                  id="preferred_locale"
                  value={formData.preferred_locale}
                  onChange={(e) =>
                    setFormData({ ...formData, preferred_locale: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Use Company Default</option>
                  <option value="en-US">English (United States)</option>
                  <option value="nb-NO">Norwegian (Norway)</option>
                  <option value="es-ES">Spanish (Spain)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="preferred_currency"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Preferred Currency
                </label>
                <select
                  id="preferred_currency"
                  value={formData.preferred_currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Use Company Default</option>
                  <option value="EUR">EUR</option>
                  <option value="NOK">NOK</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="SEK">SEK</option>
                  <option value="DKK">DKK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 brutalist-form-section">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Address Information
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
                    setFormData({ ...formData, street_address: e.target.value })
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
                      setFormData({ ...formData, postal_code: e.target.value })
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

          {(state?.error || deleteError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm brutalist-form-error">
              {state?.error || deleteError}
            </div>
          )}

          {client && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 brutalist-form-section">
              {!canDelete && (
                <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg brutalist-form-warning">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    This client cannot be deleted because they have invoices
                    that are not in draft status. Please delete or update all
                    non-draft invoices first.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteClientMutation.isPending || !canDelete}
                className={`w-full px-4 py-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  isBrutalist
                    ? "brutalist-border bg-[hsl(var(--brutalist-red))] text-white hover:bg-[hsl(var(--brutalist-yellow))] hover:text-[var(--brutalist-fg)] brutalist-text"
                    : "bg-red-600 text-white rounded-lg hover:bg-red-700"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Delete Client
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 transition font-medium ${
                isBrutalist
                  ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))] brutalist-text"
                  : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`flex-1 px-4 py-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow-sm bg-[var(--brutalist-fg)] text-[var(--brutalist-bg)] hover:bg-[hsl(var(--brutalist-green))] hover:text-[var(--brutalist-fg)] brutalist-text"
                  : "bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              }`}
            >
              {isPending
                ? client
                  ? "Updating..."
                  : "Creating..."
                : client
                ? "Update Client"
                : "Create Client"}
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className={`absolute inset-0 flex items-center justify-center p-4 rounded-xl ${isBrutalist ? "bg-black/70" : "bg-black bg-opacity-50"}`}>
            <div className={`max-w-sm w-full p-6 ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-lg shadow-xl"}`}>
              <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
                <AlertCircle className="w-5 h-5" />
                Delete Client?
              </h3>
              <p className={`${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-400"} mb-6`}>
                {hasNonDraftInvoices
                  ? "This client has invoices that are not in draft status and cannot be deleted. Please delete or update all non-draft invoices first."
                  : "This will permanently delete this client and all associated draft invoices. This action cannot be undone."}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteClientMutation.isPending}
                  className={`flex-1 px-4 py-2 transition font-medium disabled:opacity-50 ${
                    isBrutalist
                      ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))] brutalist-text"
                      : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteClientMutation.isPending}
                  className={`flex-1 px-4 py-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBrutalist
                      ? "brutalist-border bg-[hsl(var(--brutalist-red))] text-white hover:bg-[hsl(var(--brutalist-yellow))] hover:text-[var(--brutalist-fg)] brutalist-text"
                      : "bg-red-600 text-white rounded-lg hover:bg-red-700"
                  }`}
                >
                  {deleteClientMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
