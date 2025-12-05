import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Client, Invoice } from "../types";
import ClientForm from "./ClientForm";
import TemplateSelector from "./TemplateSelector";

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

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    EUR: "€",
    NOK: "kr",
    USD: "$",
    GBP: "£",
    SEK: "kr",
    DKK: "kr",
  };
  return symbols[currency] || currency;
};

export default function InvoiceForm({
  onClose,
  onSuccess,
  invoice,
}: InvoiceFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);

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

  useEffect(() => {
    loadClients();
    if (invoice) {
      loadInvoiceItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, invoice]);

  // When client is selected, pre-fill KID number from client if invoice doesn't have one
  useEffect(() => {
    if (formData.client_id && !invoice?.kid_number && clients.length > 0) {
      const selectedClient = clients.find((c) => c.id === formData.client_id);
      if (selectedClient?.kid_number && !formData.kid_number) {
        setFormData((prev) => ({ ...prev, kid_number: selectedClient.kid_number }));
      } else if (!selectedClient?.kid_number && !formData.kid_number) {
        // Clear KID if client doesn't have one and form doesn't have one
        setFormData((prev) => ({ ...prev, kid_number: "" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.client_id, clients]);

  const loadClients = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    if (error) {
      console.error("Error loading clients:", error);
    } else {
      setClients(data || []);
    }
  };

  const loadInvoiceItems = async () => {
    if (!invoice) return;

    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoice.id)
      .order("created_at");

    if (error) {
      console.error("Error loading invoice items:", error);
    } else if (data && data.length > 0) {
      setItems(
        data.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }))
      );
    }
  };

  const handleClientFormSuccess = async () => {
    // Reload clients
    await loadClients();

    // Get the most recently created client (by created_at)
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      // Auto-select the newly created client
      setFormData({ ...formData, client_id: data.id });
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

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax_amount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + tax_amount;
    return { subtotal, tax_amount, total };
  };

  const generateInvoiceNumber = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `INV-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.client_id) return;

    setLoading(true);
    setError("");

    try {
      const { subtotal, tax_amount, total } = calculateTotals();

      if (invoice) {
        // Update existing invoice
        const { error: invoiceError } = await supabase
          .from("invoices")
          .update({
            client_id: formData.client_id,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            subtotal,
            tax_rate: formData.tax_rate,
            tax_amount,
            total,
            currency: formData.currency,
            notes: formData.notes || null,
            template: formData.template,
            show_account_number: formData.show_account_number,
            show_iban: formData.show_iban,
            show_swift_bic: formData.show_swift_bic,
            kid_number: formData.kid_number || null,
          })
          .eq("id", invoice.id);

        if (invoiceError) throw invoiceError;

        // Delete all existing items
        const { error: deleteError } = await supabase
          .from("invoice_items")
          .delete()
          .eq("invoice_id", invoice.id);

        if (deleteError) throw deleteError;

        // Insert updated items
        const itemsToInsert = items
          .filter((item) => item.description.trim())
          .map((item) => ({
            invoice_id: invoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
          }));

        if (itemsToInsert.length > 0) {
          const { error: itemsError } = await supabase
            .from("invoice_items")
            .insert(itemsToInsert);
          if (itemsError) throw itemsError;
        }
      } else {
        // Create new invoice
        const invoice_number = await generateInvoiceNumber();

        const { data: newInvoice, error: invoiceError } = await supabase
          .from("invoices")
          .insert({
            user_id: user.id,
            invoice_number,
            client_id: formData.client_id,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            status: "draft",
            subtotal,
            tax_rate: formData.tax_rate,
            tax_amount,
            total,
            currency: formData.currency,
            notes: formData.notes || null,
            template: formData.template,
            show_account_number: formData.show_account_number,
            show_iban: formData.show_iban,
            show_swift_bic: formData.show_swift_bic,
            kid_number: formData.kid_number || null,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        const itemsToInsert = items
          .filter((item) => item.description.trim())
          .map((item) => ({
            invoice_id: newInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.amount,
          }));

        if (itemsToInsert.length > 0) {
          const { error: itemsError } = await supabase
            .from("invoice_items")
            .insert(itemsToInsert);
          if (itemsError) throw itemsError;
        }
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : invoice
          ? "Failed to update invoice"
          : "Failed to create invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax_amount, total } = calculateTotals();

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Client *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.client_id}
                  onChange={(e) =>
                    setFormData({ ...formData, client_id: e.target.value })
                  }
                  required
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center justify-center"
                  title="New Client"
                >
                  <Plus className="w-5 h-5" />
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity === 0 ? "" : item.quantity}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
                      updateItem(item.id, "quantity", value);
                    }}
                    onFocus={(e) => {
                      if (e.target.value === "0" || e.target.value === "") {
                        e.target.select();
                      }
                    }}
                    placeholder="Qty"
                    className="w-24 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unit_price === 0 ? "" : item.unit_price}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
                      updateItem(item.id, "unit_price", value);
                    }}
                    onFocus={(e) => {
                      if (e.target.value === "0" || e.target.value === "") {
                        e.target.select();
                      }
                    }}
                    placeholder="Price"
                    className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <div className="w-32 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-right text-slate-700">
                    {getCurrencySymbol(formData.currency)} {item.amount.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
                    {getCurrencySymbol(formData.currency)} {tax_amount.toFixed(2)}
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
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
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
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-2 focus:ring-slate-900"
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
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-2 focus:ring-slate-900"
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
                  className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-2 focus:ring-slate-900"
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              placeholder="Payment terms, thank you message, etc."
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
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
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
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
    </div>
  );
}
