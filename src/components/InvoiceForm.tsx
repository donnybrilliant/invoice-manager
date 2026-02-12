import { useState, useEffect, useActionState, useRef } from "react";
import { X, Plus, Trash2, AlertCircle, Lock, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";
import { Client, Invoice } from "../types";
import ClientForm from "./ClientForm";
import TemplateSelector from "./TemplateSelector";
import { useClients } from "../hooks/useClients";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useInvoiceItems } from "../hooks/useInvoiceItems";
import { useBankAccounts } from "../hooks/useBankAccounts";
import {
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
} from "../hooks/useInvoices";
import { formatCurrencyWithCode } from "../lib/formatting";
import { getDefaultLocaleForLanguage } from "../i18n/config";

interface InvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
  invoice?: Invoice;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export default function InvoiceForm({
  onClose,
  onSuccess,
  invoice,
}: InvoiceFormProps) {
  const { user } = useAuth();
  const { language: appLanguage, locale: appLocale } = useLocale();
  const { isBrutalist } = useTheme();
  const queryClient = useQueryClient();
  const { data: clients = [] } = useClients();
  const { data: companyProfile = null } = useCompanyProfile();
  const { data: bankAccounts = [] } = useBankAccounts();
  const { data: invoiceItemsData = [] } = useInvoiceItems(invoice?.id);
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();
  const [showClientForm, setShowClientForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (!invoice) return;

    setDeleteError("");

    try {
      await deleteInvoiceMutation.mutateAsync(invoice.id);
      onSuccess();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete invoice"
      );
      setShowDeleteConfirm(false);
    }
  };

  const [formData, setFormData] = useState({
    client_id: invoice?.client_id || "",
    issue_date: invoice?.issue_date || new Date().toISOString().split("T")[0],
    due_date:
      invoice?.due_date ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    tax_rate: invoice?.tax_rate || 0,
    currency: invoice?.currency || "EUR",
    language:
      invoice?.language ||
      companyProfile?.default_invoice_language ||
      appLanguage ||
      "en",
    locale:
      invoice?.locale ||
      companyProfile?.default_invoice_locale ||
      appLocale ||
      "en-US",
    bank_account_id: invoice?.bank_account_id || "",
    payment_account_label: invoice?.payment_account_label || null,
    payment_account_number: invoice?.payment_account_number || null,
    payment_iban: invoice?.payment_iban || null,
    payment_swift_bic: invoice?.payment_swift_bic || null,
    payment_currency: invoice?.payment_currency || null,
    notes: invoice?.notes || "",
    template: invoice?.template || "classic",
    show_account_number: invoice?.show_account_number ?? true,
    show_iban: invoice?.show_iban ?? false,
    show_swift_bic: invoice?.show_swift_bic ?? false,
    kid_number: invoice?.kid_number || "",
  });

  const currencyBankAccounts = bankAccounts.filter(
    (account) => account.is_active && account.currency === formData.currency
  );

  const getDefaultBankAccountForCurrency = (currency: string) =>
    bankAccounts.find(
      (account) =>
        account.is_active &&
        account.currency === currency &&
        account.is_default_for_currency
    ) ||
    bankAccounts.find(
      (account) => account.is_active && account.currency === currency
    ) ||
    null;

  const applyBankAccount = (bankAccountId: string) => {
    const selectedAccount =
      bankAccounts.find((account) => account.id === bankAccountId) || null;

    setFormData((prev) => ({
      ...prev,
      bank_account_id: bankAccountId,
      payment_account_label: selectedAccount?.display_name || null,
      payment_account_number: selectedAccount?.account_number || null,
      payment_iban: selectedAccount?.iban || null,
      payment_swift_bic: selectedAccount?.swift_bic || null,
      payment_currency: selectedAccount?.currency || null,
    }));
  };

  const [items, setItems] = useState<LineItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit_price: 0,
      amount: 0,
    },
  ]);

  // Initialize defaults for new invoices from company preferences
  useEffect(() => {
    if (invoice || !companyProfile) return;

    const defaultLanguage =
      companyProfile.default_invoice_language ||
      companyProfile.ui_language ||
      appLanguage ||
      "en";
    const defaultLocale =
      companyProfile.default_invoice_locale ||
      companyProfile.ui_locale ||
      getDefaultLocaleForLanguage(defaultLanguage);
    const defaultCurrency = companyProfile.currency || "EUR";
    const defaultBankAccount = getDefaultBankAccountForCurrency(defaultCurrency);

    setFormData((prev) => ({
      ...prev,
      currency: defaultCurrency,
      language: defaultLanguage,
      locale: defaultLocale,
      bank_account_id: defaultBankAccount?.id || "",
      payment_account_label: defaultBankAccount?.display_name || null,
      payment_account_number: defaultBankAccount?.account_number || null,
      payment_iban: defaultBankAccount?.iban || null,
      payment_swift_bic: defaultBankAccount?.swift_bic || null,
      payment_currency: defaultBankAccount?.currency || null,
    }));
  }, [invoice, companyProfile, appLanguage, bankAccounts]);

  // Load invoice items when editing
  useEffect(() => {
    if (invoice && invoiceItemsData.length > 0) {
      setItems(
        invoiceItemsData.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }))
      );
    }
  }, [invoice, invoiceItemsData]);

  // When client is selected, pre-fill KID and localization/currency defaults
  useEffect(() => {
    if (!formData.client_id || clients.length === 0) return;

    const selectedClient = clients.find((c) => c.id === formData.client_id);
    if (!selectedClient) return;

    setFormData((prev) => {
      const nextCurrency =
        !invoice && selectedClient.preferred_currency
          ? selectedClient.preferred_currency
          : prev.currency;
      const bankAccount = getDefaultBankAccountForCurrency(nextCurrency);

      return {
        ...prev,
        kid_number: !invoice
          ? selectedClient.kid_number || prev.kid_number || ""
          : prev.kid_number,
        language:
          !invoice && selectedClient.preferred_language
            ? selectedClient.preferred_language
            : prev.language,
        locale:
          !invoice && selectedClient.preferred_locale
            ? selectedClient.preferred_locale
            : !invoice && selectedClient.preferred_language
            ? getDefaultLocaleForLanguage(selectedClient.preferred_language)
            : prev.locale,
        currency: nextCurrency,
        bank_account_id: bankAccount?.id || prev.bank_account_id || "",
        payment_account_label:
          bankAccount?.display_name || prev.payment_account_label,
        payment_account_number:
          bankAccount?.account_number || prev.payment_account_number,
        payment_iban: bankAccount?.iban || prev.payment_iban,
        payment_swift_bic:
          bankAccount?.swift_bic || prev.payment_swift_bic,
        payment_currency: bankAccount?.currency || prev.payment_currency,
      };
    });
  }, [formData.client_id, clients, invoice, bankAccounts]);

  // When currency changes, keep selected bank account aligned by currency.
  useEffect(() => {
    const selectedAccount = bankAccounts.find(
      (account) => account.id === formData.bank_account_id
    );
    if (selectedAccount && selectedAccount.currency === formData.currency) return;

    const defaultAccount = getDefaultBankAccountForCurrency(formData.currency);
    if (defaultAccount) {
      applyBankAccount(defaultAccount.id);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      bank_account_id: "",
      payment_account_label: null,
      payment_account_number: null,
      payment_iban: null,
      payment_swift_bic: null,
      payment_currency: null,
    }));
  }, [formData.currency, bankAccounts]);

  // Refs to access current state in action
  const formDataRef = useRef(formData);
  const itemsRef = useRef(items);

  // Keep refs in sync with state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const handleClientFormSuccess = async (createdClientId?: string) => {
    // If we have the newly created client ID, use it directly
    if (createdClientId) {
      setFormData((prev) => ({ ...prev, client_id: createdClientId }));
      // Invalidate to refresh the list, but we don't need to wait
      queryClient.invalidateQueries({ queryKey: ["clients", user?.id] });
    } else {
      // Fallback: Fetch fresh data and wait for it before using
      // This ensures we have the newly created client in the data
      try {
        const clientsData = await queryClient.fetchQuery<Client[]>({
          queryKey: ["clients", user?.id],
          queryFn: async () => {
            if (!user) throw new Error("No user");
            const { data, error } = await supabase
              .from("clients")
              .select("*")
              .eq("user_id", user.id)
              .order("name");
            if (error) throw error;
            return (data || []) as Client[];
          },
        });
        if (clientsData && clientsData.length > 0) {
          // Find the most recently created client by created_at
          const newestClient = clientsData.reduce(
            (latest: Client, current: Client) => {
              const latestDate = new Date(latest.created_at || 0).getTime();
              const currentDate = new Date(current.created_at || 0).getTime();
              return currentDate > latestDate ? current : latest;
            }
          );
          setFormData((prev) => ({ ...prev, client_id: newestClient.id }));
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        // If fetch fails, just invalidate and let the component refetch naturally
        queryClient.invalidateQueries({ queryKey: ["clients", user?.id] });
      }
    }

    setShowClientForm(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit_price: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updated.amount = updated.quantity * updated.unit_price;
        }
        return updated;
      })
    );
  };

  const calculateTotals = (
    currentItems: LineItem[],
    currentFormData: typeof formData
  ) => {
    const subtotal = currentItems.reduce((sum, item) => sum + item.amount, 0);
    const tax_amount = subtotal * (currentFormData.tax_rate / 100);
    const total = subtotal + tax_amount;
    return { subtotal, tax_amount, total };
  };

  interface InvoiceFormState {
    error?: string;
  }

  const [state, submitAction, isPending] = useActionState(
    async (
      _prevState: InvoiceFormState | null,
      _formData: FormData
    ): Promise<InvoiceFormState> => {
      if (!user || !formDataRef.current.client_id) {
        return { error: "Please select a client" };
      }

      if (!formDataRef.current.bank_account_id) {
        return { error: "Please select a bank account for this invoice" };
      }

      try {
        const currentFormData = formDataRef.current;
        const selectedBankAccount = bankAccounts.find(
          (account) => account.id === currentFormData.bank_account_id
        );
        if (!selectedBankAccount) {
          return { error: "Selected bank account no longer exists" };
        }
        if (selectedBankAccount.currency !== currentFormData.currency) {
          return {
            error:
              "Invoice currency must match the selected bank account currency",
          };
        }

        const currentItems = itemsRef.current;
        const { subtotal, tax_amount, total } = calculateTotals(
          currentItems,
          currentFormData
        );

        const invoiceData = {
          client_id: currentFormData.client_id,
          issue_date: currentFormData.issue_date,
          due_date: currentFormData.due_date,
          subtotal,
          tax_rate: currentFormData.tax_rate,
          tax_amount,
          total,
          currency: currentFormData.currency,
          language: currentFormData.language,
          locale: currentFormData.locale,
          bank_account_id: currentFormData.bank_account_id,
          notes: currentFormData.notes || null,
          template: currentFormData.template,
          show_account_number: currentFormData.show_account_number ?? true,
          show_iban: currentFormData.show_iban ?? false,
          show_swift_bic: currentFormData.show_swift_bic ?? false,
          kid_number: currentFormData.kid_number || null,
          items: currentItems
            .filter((item) => item.description.trim())
            .map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
            })),
        };

        if (invoice) {
          await updateInvoiceMutation.mutateAsync({
            id: invoice.id,
            data: invoiceData,
          });
        } else {
          await createInvoiceMutation.mutateAsync(invoiceData);
        }

        onSuccess();
        return { error: undefined };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : invoice
              ? "Failed to update invoice"
              : "Failed to create invoice",
        };
      }
    },
    null
  );

  const { subtotal, tax_amount, total } = calculateTotals(items, formData);
  const isPaid = invoice?.status === "paid";
  const isSent = invoice?.status === "sent";

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${isBrutalist ? "bg-black/70" : "bg-black bg-opacity-50"}`}>
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 my-8 ${isBrutalist ? "brutalist-border brutalist-shadow-lg bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-xl shadow-2xl"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-2xl font-bold flex items-center gap-2 ${
              isBrutalist
                ? "brutalist-heading text-[var(--brutalist-fg)]"
                : "text-slate-900 dark:text-white"
            }`}
          >
            <FileText className="w-6 h-6" />
            {invoice ? "Edit Invoice" : "New Invoice"}
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

        {/* Warning banner for sent invoices */}
        {isSent && !isPaid && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3 brutalist-form-warning">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                This invoice has already been sent. Changes will require
                re-sending.
              </p>
            </div>
          </div>
        )}

        {/* Lock message for paid invoices */}
        {isPaid && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                This invoice has been marked as paid and cannot be edited. To
                make changes, create a credit note or a new invoice.
              </p>
            </div>
          </div>
        )}

        <form action={submitAction} className="space-y-6 brutalist-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Client *
              </label>
              <div className="relative">
                <select
                  value={formData.client_id}
                  onChange={(e) =>
                    setFormData({ ...formData, client_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowClientForm(true)}
                  disabled={isPaid}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="New Client"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Currency *
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                required
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="EUR">EUR (€)</option>
                <option value="NOK">NOK (kr)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SEK">SEK (kr)</option>
                <option value="DKK">DKK (kr)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Invoice Language *
              </label>
              <select
                value={formData.language}
                onChange={(e) => {
                  const language = e.target.value;
                  setFormData({
                    ...formData,
                    language,
                    locale: getDefaultLocaleForLanguage(language),
                  });
                }}
                required
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="en">English</option>
                <option value="nb">Norwegian (Bokmal)</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Invoice Locale *
              </label>
              <select
                value={formData.locale}
                onChange={(e) =>
                  setFormData({ ...formData, locale: e.target.value })
                }
                required
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="en-US">English (United States)</option>
                <option value="nb-NO">Norwegian (Norway)</option>
                <option value="es-ES">Spanish (Spain)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bank Account *
              </label>
              <select
                value={formData.bank_account_id}
                onChange={(e) => applyBankAccount(e.target.value)}
                required
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {currencyBankAccounts.length > 0
                    ? "Select bank account"
                    : "No bank accounts for selected currency"}
                </option>
                {currencyBankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.display_name}
                    {account.is_default_for_currency ? " (Default)" : ""}
                  </option>
                ))}
              </select>
              {currencyBankAccounts.length === 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Add a {formData.currency} bank account in Settings before
                  creating this invoice.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.tax_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax_rate: parseFloat(e.target.value) || 0,
                  })
                }
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) =>
                  setFormData({ ...formData, issue_date: e.target.value })
                }
                required
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                required
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                KID Number (Optional)
              </label>
              <input
                type="text"
                value={formData.kid_number}
                onChange={(e) =>
                  setFormData({ ...formData, kid_number: e.target.value })
                }
                placeholder="Leave empty if not needed"
                disabled={isPaid}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customer identification number for Norwegian banking
              </p>
            </div>
          </div>

          <TemplateSelector
            selected={formData.template}
            onChange={(templateId) =>
              setFormData({ ...formData, template: templateId })
            }
            disabled={isPaid}
            previewData={{
              formData,
              items,
              clients,
              profile: companyProfile,
            }}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Line Items
              </label>
              <button
                type="button"
                onClick={addItem}
                disabled={isPaid}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  isBrutalist
                    ? "brutalist-border bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
                }`}
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>

            <style>{`
              .invoice-line-items-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
              }
              .invoice-line-item {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                padding: 12px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                background: white;
              }
              @media (prefers-color-scheme: dark) {
                .invoice-line-item {
                  border-color: #475569;
                  background: #334155;
                }
              }
              @media (min-width: 640px) {
                .invoice-line-items-header {
                  display: grid;
                  grid-template-columns: 2fr 100px 140px 160px auto;
                  gap: 12px;
                  padding: 8px 12px;
                  font-size: 12px;
                  font-weight: 600;
                  color: #6b7280;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e5e7eb;
                }
                .dark .invoice-line-items-header {
                  color: #94a3b8;
                  border-bottom-color: #475569;
                }
                .invoice-line-item {
                  grid-template-columns: 2fr 100px 140px 160px auto;
                  gap: 12px;
                  padding: 0;
                  border: none;
                  background: transparent;
                }
                .dark .invoice-line-item {
                  background: transparent;
                }
                .invoice-line-item-label {
                  display: none;
                }
              }
              @media (min-width: 768px) {
                .invoice-line-items-header {
                  grid-template-columns: 2fr 100px 150px 180px auto;
                }
                .invoice-line-item {
                  grid-template-columns: 2fr 100px 150px 180px auto;
                }
              }
            `}</style>

            <div className="invoice-line-items-container">
              {/* Desktop Header */}
              <div className="invoice-line-items-header hidden sm:grid">
                <div>Description</div>
                <div>Quantity</div>
                <div>Unit Price</div>
                <div>Amount</div>
                <div></div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="invoice-line-item">
                  <div>
                    <label className="invoice-line-item-label block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 sm:hidden">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="Description"
                      disabled={isPaid}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="invoice-line-item-label block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 sm:hidden">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.quantity === 0 ? "" : item.quantity}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0;
                        updateItem(item.id, "quantity", value);
                      }}
                      onFocus={(e) => {
                        if (e.target.value === "0" || e.target.value === "") {
                          e.target.select();
                        }
                      }}
                      placeholder="Qty"
                      disabled={isPaid}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="invoice-line-item-label block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 sm:hidden">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unit_price === 0 ? "" : item.unit_price}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0;
                        updateItem(item.id, "unit_price", value);
                      }}
                      onFocus={(e) => {
                        if (e.target.value === "0" || e.target.value === "") {
                          e.target.select();
                        }
                      }}
                      placeholder="Price"
                      disabled={isPaid}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="invoice-line-item-label block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 sm:hidden">
                      Amount
                    </label>
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-right text-slate-700 dark:text-slate-300 flex items-center justify-end min-h-[42px]">
                      {formatCurrencyWithCode(item.amount, formData.currency)}
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1 || isPaid}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 brutalist-form-section">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrencyWithCode(subtotal, formData.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tax ({formData.tax_rate}%):
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrencyWithCode(tax_amount, formData.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="text-slate-900 dark:text-white">Total:</span>
                  <span className="text-slate-900 dark:text-white">
                    {formatCurrencyWithCode(total, formData.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Banking Details to Display
            </label>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600 brutalist-form-panel">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_account_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      show_account_number: e.target.checked,
                    })
                  }
                  disabled={isPaid}
                  className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 dark:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Show Account Number
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_iban}
                  onChange={(e) =>
                    setFormData({ ...formData, show_iban: e.target.checked })
                  }
                  disabled={isPaid}
                  className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 dark:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Show IBAN
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_swift_bic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      show_swift_bic: e.target.checked,
                    })
                  }
                  disabled={isPaid}
                  className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 dark:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Show SWIFT/BIC
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              disabled={isPaid}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Payment terms, thank you message, etc."
            />
          </div>

          {(state?.error || deleteError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm brutalist-form-error">
              {state?.error || deleteError}
            </div>
          )}

          {invoice && invoice.status === "draft" && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 brutalist-form-section">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteInvoiceMutation.isPending}
                className={`w-full px-4 py-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  isBrutalist
                    ? "brutalist-border bg-[hsl(var(--brutalist-red))] text-white hover:bg-[hsl(var(--brutalist-yellow))] hover:text-[var(--brutalist-fg)] brutalist-text"
                    : "bg-red-600 text-white rounded-lg hover:bg-red-700"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Delete Invoice
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 transition font-medium ${
                isBrutalist
                  ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))] brutalist-text"
                  : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isPaid}
              className={`flex-1 px-4 py-3 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow-sm bg-[var(--brutalist-fg)] text-[var(--brutalist-bg)] hover:bg-[hsl(var(--brutalist-green))] hover:text-[var(--brutalist-fg)] brutalist-text"
                  : "bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              }`}
            >
              {isPending
                ? invoice
                  ? "Updating..."
                  : "Creating..."
                : invoice
                ? "Update Invoice"
                : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>

      {showClientForm && (
        <ClientForm
          onClose={() => setShowClientForm(false)}
          onSuccess={handleClientFormSuccess}
        />
      )}

      {showDeleteConfirm && (
        <div className={`absolute inset-0 flex items-center justify-center p-4 ${isBrutalist ? "bg-black/70" : "bg-black bg-opacity-50"} rounded-xl`}>
          <div className={`max-w-sm w-full p-6 ${isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-lg shadow-xl"}`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
              <AlertCircle className="w-5 h-5" />
              Delete Invoice?
            </h3>
            <p className={`${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-400"} mb-6`}>
              This will permanently delete this invoice and all associated
              items. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteInvoiceMutation.isPending}
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
                disabled={deleteInvoiceMutation.isPending}
                className={`flex-1 px-4 py-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  isBrutalist
                    ? "brutalist-border bg-[hsl(var(--brutalist-red))] text-white hover:bg-[hsl(var(--brutalist-yellow))] hover:text-[var(--brutalist-fg)] brutalist-text"
                    : "bg-red-600 text-white rounded-lg hover:bg-red-700"
                }`}
              >
                {deleteInvoiceMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
