import { useState, useEffect, useActionState, useRef } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Client, Invoice } from "../types";
import ClientForm from "./ClientForm";
import TemplateSelector from "./TemplateSelector";
import { useClients } from "../hooks/useClients";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useInvoiceItems } from "../hooks/useInvoiceItems";
import {
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
} from "../hooks/useInvoices";
import { getCurrencySymbol } from "../lib/utils";

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
  const queryClient = useQueryClient();
  const { data: clients = [] } = useClients();
  const { data: companyProfile = null } = useCompanyProfile();
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
    notes: invoice?.notes || "",
    template: invoice?.template || "classic",
    show_account_number: invoice?.show_account_number ?? true,
    show_iban: invoice?.show_iban ?? false,
    show_swift_bic: invoice?.show_swift_bic ?? false,
    kid_number: invoice?.kid_number || "",
  });

  const [items, setItems] = useState<LineItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit_price: 0,
      amount: 0,
    },
  ]);

  // Set default currency from company profile for new invoices
  useEffect(() => {
    if (!invoice && companyProfile?.currency) {
      setFormData((prev) => ({ ...prev, currency: companyProfile.currency }));
    }
  }, [companyProfile, invoice]);

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

  // When client is selected, pre-fill KID number from client if invoice doesn't have one
  useEffect(() => {
    if (formData.client_id && !invoice?.kid_number && clients.length > 0) {
      const selectedClient = clients.find((c) => c.id === formData.client_id);
      if (selectedClient?.kid_number && !formData.kid_number) {
        setFormData((prev) => ({
          ...prev,
          kid_number: selectedClient.kid_number || "",
        }));
      } else if (!selectedClient?.kid_number && !formData.kid_number) {
        // Clear KID if client doesn't have one and form doesn't have one
        setFormData((prev) => ({ ...prev, kid_number: "" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.client_id, clients]);

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

      try {
        const currentFormData = formDataRef.current;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {invoice ? "Edit Invoice" : "New Invoice"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form action={submitAction} className="space-y-6">
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
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
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
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
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition font-medium"
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
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                  />
                  </div>
                  <div>
                    <label className="invoice-line-item-label block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 sm:hidden">
                      Amount
                    </label>
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-right text-slate-700 dark:text-slate-300 flex items-center justify-end min-h-[42px]">
                    {getCurrencySymbol(formData.currency)}{" "}
                    {item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getCurrencySymbol(formData.currency)} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tax ({formData.tax_rate}%):
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getCurrencySymbol(formData.currency)}{" "}
                    {tax_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="text-slate-900 dark:text-white">Total:</span>
                  <span className="text-slate-900 dark:text-white">
                    {getCurrencySymbol(formData.currency)} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Banking Details to Display
            </label>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
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
                  className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 dark:bg-slate-600"
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
                  className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 dark:bg-slate-600"
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
                  className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 dark:bg-slate-600"
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
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent resize-none"
              placeholder="Payment terms, thank you message, etc."
            />
          </div>

          {(state?.error || deleteError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {state?.error || deleteError}
            </div>
          )}

          {invoice && invoice.status === "draft" && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteInvoiceMutation.isPending}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-xl">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Delete Invoice?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete this invoice and all associated
              items. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteInvoiceMutation.isPending}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteInvoiceMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
