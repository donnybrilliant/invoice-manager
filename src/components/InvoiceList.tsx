import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Search,
  Edit,
  Download,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createRoot } from "react-dom/client";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Invoice, InvoiceItem, CompanyProfile } from "../types";
import { getTemplate } from "../templates";
import { generatePDFFromElement } from "../lib/pdfUtils";
import { generateInvoiceFilenameForDownload } from "../lib/utils";
import { useInvoices, useUpdateInvoiceStatus } from "../hooks/useInvoices";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { getCurrencySymbol } from "../lib/utils";
import { formatDate } from "../templates/utils";

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
  const { showToast } = useToast();
  const { data: invoices = [], isLoading: loading } = useInvoices();
  const updateStatusMutation = useUpdateInvoiceStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoice_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortColumn) {
          case "invoice":
            aValue = a.invoice_number.toLowerCase();
            bValue = b.invoice_number.toLowerCase();
            break;
          case "client":
            aValue = (a.client?.name || "").toLowerCase();
            bValue = (b.client?.name || "").toLowerCase();
            break;
          case "amount":
            aValue = a.total;
            bValue = b.total;
            break;
          case "due_date":
            aValue = new Date(a.due_date).getTime();
            bValue = new Date(b.due_date).getTime();
            break;
          case "status":
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [invoices, searchTerm, statusFilter, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
  const showPagination = filteredInvoices.length > itemsPerPage;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortColumn, sortDirection]);

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    const isActive = sortColumn === column;
    return (
      <span className="inline-flex items-center justify-center w-4 h-4">
        {isActive && sortDirection === "asc" && <ArrowUp className="w-4 h-4" />}
        {isActive && sortDirection === "desc" && (
          <ArrowDown className="w-4 h-4" />
        )}
      </span>
    );
  };

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
    let tempDiv: HTMLDivElement | null = null;
    let root: ReturnType<typeof createRoot> | null = null;

    try {
      // Try to get cached data first, otherwise fetch
      let items: InvoiceItem[] = [];
      let profile: CompanyProfile | null = null;

      // Get invoice items from cache or fetch
      const cachedItems = queryClient.getQueryData<InvoiceItem[]>([
        "invoiceItems",
        invoice.id,
      ]);
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
      const cachedProfile = queryClient.getQueryData<CompanyProfile | null>([
        "companyProfile",
        user?.id,
      ]);
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
      tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      tempDiv.style.display = "block";
      tempDiv.style.visibility = "visible";
      tempDiv.style.opacity = "1";
      // Centralized styles in invoice.css handle dark mode isolation
      tempDiv.className = "pdf-generation-temp invoice-light-mode";
      document.body.appendChild(tempDiv);

      // Render invoice React component
      const template = getTemplate(invoice.template);
      const TemplateComponent = template.Component;
      root = createRoot(tempDiv);
      root.render(
        <div style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
          <TemplateComponent
            invoice={invoice}
            items={items}
            client={invoice.client!}
            profile={profile}
          />
        </div>
      );

      // Wait for React to render and images to load
      // Use requestAnimationFrame to ensure DOM is fully rendered
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 200);
          });
        });
      });

      // Generate filename for download: invoiceid-client-name-date-of-creation
      const filename = generateInvoiceFilenameForDownload(
        invoice.invoice_number,
        invoice.client?.name || "",
        invoice.issue_date
      );

      // Generate PDF
      await generatePDFFromElement(tempDiv, { filename });

      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showToast("Failed to download PDF. Please try again.", "error");
    } finally {
      // Cleanup: always execute to prevent memory leaks
      if (root) {
        root.unmount();
      }
      if (tempDiv && tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
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
            <table className="w-full table-fixed border-collapse border-spacing-0">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition w-48"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("invoice");
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Invoice {getSortIcon("invoice")}
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition w-48"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("client");
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Client {getSortIcon("client")}
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition w-32"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("amount");
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Amount {getSortIcon("amount")}
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition w-28"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("due_date");
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Due Date {getSortIcon("due_date")}
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition w-28"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("status");
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Status {getSortIcon("status")}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="border-t border-b border-slate-200 dark:border-slate-700">
                {paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer border-b last:border-b-0 border-slate-200 dark:border-slate-700"
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap w-48">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(invoice.issue_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div
                        className="text-sm text-slate-900 dark:text-white truncate"
                        title={invoice.client?.name}
                      >
                        {invoice.client?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-32">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {getCurrencySymbol(invoice.currency)}{" "}
                        {invoice.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-28">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {formatDate(invoice.due_date)}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap w-28"
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
                      className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium w-24"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
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
                            handleDownload(invoice);
                          }}
                          disabled={downloadingId === invoice.id}
                          className="text-green-600 hover:text-green-800 transition p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download PDF"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {showPagination ? (
                  <>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredInvoices.length)} of{" "}
                    {filteredInvoices.length} invoices
                  </>
                ) : (
                  <>
                    {filteredInvoices.length} invoice
                    {filteredInvoices.length !== 1 ? "s" : ""}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Show:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            {showPagination && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          currentPage === pageNum
                            ? "bg-slate-900 dark:bg-slate-700 text-white"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
