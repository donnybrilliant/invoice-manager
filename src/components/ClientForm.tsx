import { useState, useEffect, useActionState, useRef, useMemo } from "react";
import { X, Trash2 } from "lucide-react";
import { Client } from "../types";
import {
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "../hooks/useClients";

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
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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

    setDeleteError("");

    try {
      await deleteClientMutation.mutateAsync(client.id);
      onSuccess();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete client");
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {client ? "Edit Client" : "New Client"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form action={submitAction} className="space-y-6">
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
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
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

          {/* Address Information */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {state?.error || deleteError}
            </div>
          )}

          {client && (
            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteClientMutation.isPending}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-xl">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Delete Client?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                This will permanently delete this client and all associated
                invoices. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteClientMutation.isPending}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteClientMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
