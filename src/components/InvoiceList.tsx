import { useState, useRef } from "react";
import { FileText, Trash2, Search, Edit, Download } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Invoice, InvoiceItem, CompanyProfile } from "../types";
import { getTemplate } from "../templates";
import {
  generatePDFFromElement,
  generateInvoiceFilename,
} from "../lib/pdfUtils";
import { useInvoices, useDeleteInvoice, useUpdateInvoiceStatus } from "../hooks/useInvoices";
import { useAuth } from "../contexts/AuthContext";

interface InvoiceListProps {
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceList({
  onViewInvoice,
  onEditInvoice,
}: InvoiceListProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: invoices = [], isLoading: loading, error } = useInvoices();
  const deleteInvoiceMutation = useDeleteInvoice();
  const updateStatusMutation = useUpdateInvoiceStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const downloadContainerRef = useRef<HTMLDivElement | null>(null);

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await deleteInvoiceMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
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

  const handleDownload = async (invoice: Invoice) => {
    if (downloadingId) return;
    
    setDownloadingId(invoice.id);
    try {
      // Try to get cached data first, otherwise fetch
      let items: InvoiceItem[] = [];
      let profile: CompanyProfile | null = null;

      // Get invoice items from cache or fetch
      const cachedItems = queryClient.getQueryData<InvoiceItem[]>(['invoiceItems', invoice.id]);
      if (cachedItems) {
        items = cachedItems;
      } else {
        const { data: itemsData, error: itemsError } = await supabase
          .from("invoice_items")
          .select("*")
          .eq("invoice_id", invoice.id)
          .order("created_at");
        if (itemsError) throw itemsError;
        items = itemsData || [];
      }

      // Get company profile from cache or fetch
      const cachedProfile = queryClient.getQueryData<CompanyProfile | null>(['companyProfile', user?.id]);
      if (cachedProfile !== undefined) {
        profile = cachedProfile;
      } else {
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("company_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
          if (!profileError || profileError.code === "PGRST116") {
            profile = profileData;
          }
        }
      }

      // Create a temporary container for rendering
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "800px";
      document.body.appendChild(tempDiv);

      // Render invoice HTML
      const template = getTemplate(invoice.template);
      const html = template.render({
        invoice,
        items,
        client: invoice.client!,
        profile,
      });
      tempDiv.innerHTML = html;

      // Generate filename
      const customerName = invoice.client?.name || "";
      const filename = generateInvoiceFilename(
        invoice.invoice_number,
        customerName,
        invoice.issue_date
      );

      // Generate PDF
      await generatePDFFromElement(tempDiv, { filename });

      // Cleanup
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">
          Loading invoices...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            No invoices found
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create your first invoice to get started
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {invoice.client?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        ${invoice.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleUpdateStatus(invoice.id, e.target.value)
                        }
                        className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(invoice);
                          }}
                          disabled={downloadingId === invoice.id}
                          className="text-green-600 hover:text-green-800 transition p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download PDF"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        {invoice.status === "draft" && onEditInvoice && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditInvoice(invoice);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition p-2"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(invoice.id);
                          }}
                          className="text-red-600 hover:text-red-800 transition p-2"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
