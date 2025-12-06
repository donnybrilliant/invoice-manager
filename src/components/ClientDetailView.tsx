import {
  X,
  Edit2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Percent,
} from "lucide-react";
import { Client, Invoice } from "../types";
import { useClientInvoices } from "../hooks/useClientInvoices";

interface ClientDetailViewProps {
  client: Client;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export default function ClientDetailView({
  client,
  onClose,
  onEdit,
  onViewInvoice,
}: ClientDetailViewProps) {
  const { data: invoices = [], isLoading: loading } = useClientInvoices(
    client.id
  );

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {client.name}
            </h2>
            {client.client_number && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Client #{client.client_number}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(client)}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Client Information */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Email
                  </p>
                  <p className="text-slate-900 dark:text-white">
                    {client.email}
                  </p>
                </div>
              </div>
            )}
            {client.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Phone
                  </p>
                  <p className="text-slate-900 dark:text-white">
                    {client.phone}
                  </p>
                </div>
              </div>
            )}
            {client.organization_number && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Organization Number
                  </p>
                  <p className="text-slate-900 dark:text-white">
                    {client.organization_number}
                  </p>
                </div>
              </div>
            )}
            {client.tax_number && (
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Tax/VAT/MVA Number
                  </p>
                  <p className="text-slate-900 dark:text-white">
                    {client.tax_number}
                  </p>
                </div>
              </div>
            )}
            {client.kid_number && (
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    KID Number
                  </p>
                  <p className="text-slate-900 dark:text-white">
                    {client.kid_number}
                  </p>
                </div>
              </div>
            )}
            {(client.street_address ||
              client.city ||
              client.postal_code ||
              client.country) && (
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Address
                  </p>
                  <div className="text-slate-900 dark:text-white">
                    {client.street_address && (
                      <div>{client.street_address}</div>
                    )}
                    {(client.postal_code || client.city) && (
                      <div>
                        {client.postal_code && (
                          <span>{client.postal_code} </span>
                        )}
                        {client.city && <span>{client.city}</span>}
                      </div>
                    )}
                    {client.state && <div>{client.state}</div>}
                    {client.country && <div>{client.country}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoices List */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Invoices ({invoices.length})
          </h3>

          {loading ? (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
              <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
              <p className="text-slate-600 dark:text-slate-400">
                No invoices found for this client
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => onViewInvoice(invoice)}
                  className="bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg p-4 cursor-pointer transition border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {invoice.invoice_number}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.status
                      )} dark:opacity-90`}
                    >
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-600 dark:text-slate-400">
                      <span>Issue: </span>
                      <span className="text-slate-900 dark:text-white">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span>Due: </span>
                      <span className="text-slate-900 dark:text-white">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {invoice.currency} {invoice.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
