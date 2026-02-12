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
import { Invoice, InvoiceItem, CompanyProfile, BankAccount } from "../types";
import { getTemplate } from "../templates";
import { generatePDFFromElement } from "../lib/pdfUtils";
import { generateInvoiceFilenameForDownload } from "../lib/utils";
import { useInvoices, useUpdateInvoiceStatus } from "../hooks/useInvoices";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useTheme } from "../contexts/ThemeContext";
import { formatDate, formatCurrencyWithCode } from "../lib/formatting";
import { InvoiceContainer } from "./InvoiceContainer";

interface InvoiceListProps {
  invoices?: Invoice[];
  filters?: {
    searchTerm: string;
    status: string;
    currency: string;
    bankAccountId: string;
  };
  onFiltersChange?: (filters: {
    searchTerm: string;
    status: string;
    currency: string;
    bankAccountId: string;
  }) => void;
  bankAccounts?: BankAccount[];
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceList({
  invoices: providedInvoices,
  filters,
  onFiltersChange,
  bankAccounts = [],
  onViewInvoice,
  onEditInvoice,
}: InvoiceListProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { isBrutalist } = useTheme();
  const { data: queriedInvoices = [], isLoading: loading } = useInvoices({
    enabled: !providedInvoices,
  });
  const updateStatusMutation = useUpdateInvoiceStatus();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localStatusFilter, setLocalStatusFilter] = useState<string>("all");
  const [localCurrencyFilter, setLocalCurrencyFilter] = useState<string>("all");
  const [localBankAccountFilter, setLocalBankAccountFilter] =
    useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const sourceInvoices = providedInvoices ?? queriedInvoices;
  const isControlled = !!filters && !!onFiltersChange;
  const searchTerm = isControlled ? filters.searchTerm : localSearchTerm;
  const statusFilter = isControlled ? filters.status : localStatusFilter;
  const currencyFilter = isControlled ? filters.currency : localCurrencyFilter;
  const bankAccountFilter = isControlled
    ? filters.bankAccountId
    : localBankAccountFilter;

  const setSearchTerm = (value: string) => {
    if (isControlled && filters && onFiltersChange) {
      onFiltersChange({
        ...filters,
        searchTerm: value,
      });
      return;
    }
    setLocalSearchTerm(value);
  };

  const setStatusFilter = (value: string) => {
    if (isControlled && filters && onFiltersChange) {
      onFiltersChange({
        ...filters,
        status: value,
      });
      return;
    }
    setLocalStatusFilter(value);
  };

  const setCurrencyFilter = (value: string) => {
    if (isControlled && filters && onFiltersChange) {
      const nextBankAccountId =
        value === "all"
          ? filters.bankAccountId
          : filters.bankAccountId !== "all" &&
            bankAccounts.find(
              (account) =>
                account.id === filters.bankAccountId && account.currency === value
            )
          ? filters.bankAccountId
          : "all";

      onFiltersChange({
        ...filters,
        currency: value,
        bankAccountId: nextBankAccountId,
      });
      return;
    }

    setLocalCurrencyFilter(value);
    if (
      value !== "all" &&
      localBankAccountFilter !== "all" &&
      !bankAccounts.find(
        (account) =>
          account.id === localBankAccountFilter && account.currency === value
      )
    ) {
      setLocalBankAccountFilter("all");
    }
  };

  const setBankAccountFilter = (value: string) => {
    if (isControlled && filters && onFiltersChange) {
      onFiltersChange({
        ...filters,
        bankAccountId: value,
      });
      return;
    }
    setLocalBankAccountFilter(value);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Check current invoice status
      const currentInvoice = sourceInvoices.find((inv) => inv.id === id);

      // Prevent any status changes for paid invoices
      if (currentInvoice?.status === "paid") {
        showToast(
          "Cannot change status of a paid invoice. Paid invoices are locked.",
          "error"
        );
        return;
      }

      // Warn if changing from sent to draft (but allow it)
      if (currentInvoice?.status === "sent" && status === "draft") {
        // Just show a toast warning, no blocking
        showToast(
          "Invoice status changed to draft. You can now edit this invoice.",
          "warning"
        );
      }

      // Prevent manually setting overdue if invoice is not actually overdue
      if (status === "overdue") {
        if (!currentInvoice) {
          showToast("Invoice not found", "error");
          return;
        }
        const dueDate = new Date(currentInvoice.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDate >= today) {
          showToast(
            "Cannot manually set invoice as overdue. Overdue status is automatically applied when the due date has passed.",
            "error"
          );
          return;
        }
      }

      // Warn if changing from overdue to sent/draft (due date will be updated)
      if (
        currentInvoice?.status === "overdue" &&
        (status === "sent" || status === "draft")
      ) {
        if (!currentInvoice) {
          showToast("Invoice not found", "error");
          return;
        }
        const dueDate = new Date(currentInvoice.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          showToast(
            "Due date will be updated to today to prevent immediate overdue marking.",
            "info"
          );
        }
      }

      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error("Error updating status:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to update invoice status",
        "error"
      );
    }
  };

  const filteredInvoices = useMemo(() => {
    let filtered = sourceInvoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoice_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (invoice.client?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      const matchesCurrency =
        currencyFilter === "all" || invoice.currency === currencyFilter;
      const matchesBankAccount =
        bankAccountFilter === "all" ||
        invoice.bank_account_id === bankAccountFilter;
      return matchesSearch && matchesStatus && matchesCurrency && matchesBankAccount;
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
  }, [
    sourceInvoices,
    searchTerm,
    statusFilter,
    currencyFilter,
    bankAccountFilter,
    sortColumn,
    sortDirection,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
  const showPagination = filteredInvoices.length > itemsPerPage;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    currencyFilter,
    bankAccountFilter,
    sortColumn,
    sortDirection,
  ]);

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
    if (isBrutalist) {
      switch (status) {
        case "paid":
          return "bg-[hsl(137,79%,54%)] text-[var(--brutalist-fg)] brutalist-border";
        case "sent":
          return "bg-[hsl(201,100%,70%)] text-[var(--brutalist-fg)] brutalist-border";
        case "overdue":
          return "bg-[hsl(358,100%,67%)] text-white brutalist-border";
        default:
          return "bg-[hsl(44,100%,68%)] text-[var(--brutalist-fg)] brutalist-border";
      }
    }
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
      tempDiv.style.width = "794px";
      tempDiv.style.background = "white";
      tempDiv.style.display = "block";
      tempDiv.style.visibility = "visible";
      tempDiv.style.opacity = "1";
      // Centralized styles in invoice.css handle dark mode isolation
      tempDiv.className = "pdf-generation-temp";
      document.body.appendChild(tempDiv);

      // Render invoice React component
      const template = getTemplate(invoice.template);
      const TemplateComponent = template.Component;
      root = createRoot(tempDiv);
      root.render(
        <InvoiceContainer>
          <TemplateComponent
            invoice={invoice}
            items={items}
            client={invoice.client!}
            profile={profile}
          />
        </InvoiceContainer>
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

  if (!providedInvoices && loading) {
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
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-400 dark:text-slate-500"}`} />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
              isBrutalist
                ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
                : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
            }`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
            isBrutalist
              ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
              : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
          }`}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
          className={`px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
            isBrutalist
              ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
              : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
          }`}
        >
          <option value="all">All Currencies</option>
          {Array.from(new Set(sourceInvoices.map((invoice) => invoice.currency)))
            .sort((a, b) => a.localeCompare(b))
            .map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
        <select
          value={bankAccountFilter}
          onChange={(e) => setBankAccountFilter(e.target.value)}
          className={`px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
            isBrutalist
              ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
              : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
          }`}
        >
          <option value="all">All Bank Accounts</option>
          {bankAccounts
            .filter(
              (account) =>
                currencyFilter === "all" || account.currency === currencyFilter
            )
            .map((account) => (
              <option key={account.id} value={account.id}>
                {account.display_name} ({account.currency})
              </option>
            ))}
        </select>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className={`text-center py-12 ${isBrutalist ? "brutalist-border bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"}`}>
          <FileText className={`w-12 h-12 mx-auto mb-4 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-400 dark:text-slate-500"}`} />
          <p className={`mb-2 ${isBrutalist ? "brutalist-text text-[var(--brutalist-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
            No invoices found
          </p>
          <p className={`text-sm ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-500 dark:text-slate-400"}`}>
            Create your first invoice to get started
          </p>
        </div>
      ) : (
        <div className={isBrutalist ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)] overflow-hidden" : "bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"}>
          <div className="overflow-x-auto">
            <table
              key={isBrutalist ? "invoice-table-brutalist" : "invoice-table-default"}
              className="w-full table-fixed border-collapse border-spacing-0"
            >
              <thead
                className={
                  isBrutalist
                    ? "bg-[hsl(var(--brutalist-yellow))] border-b border-[var(--brutalist-border-color)]"
                    : "bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
                }
              >
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition w-36 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-fg)] bg-[hsl(var(--brutalist-yellow))] border-b-[3px] border-[var(--brutalist-border-color)] hover:bg-[hsl(var(--brutalist-cyan))]"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
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
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition w-48 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-fg)] bg-[hsl(var(--brutalist-yellow))] border-b-[3px] border-[var(--brutalist-border-color)] hover:bg-[hsl(var(--brutalist-cyan))]"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
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
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition w-32 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-fg)] bg-[hsl(var(--brutalist-yellow))] border-b-[3px] border-[var(--brutalist-border-color)] hover:bg-[hsl(var(--brutalist-cyan))]"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
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
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition w-28 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-fg)] bg-[hsl(var(--brutalist-yellow))] border-b-[3px] border-[var(--brutalist-border-color)] hover:bg-[hsl(var(--brutalist-cyan))]"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
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
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition w-28 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-fg)] bg-[hsl(var(--brutalist-yellow))] border-b-[3px] border-[var(--brutalist-border-color)] hover:bg-[hsl(var(--brutalist-cyan))]"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("status");
                    }}
                  >
                    <span className="flex items-center gap-1">
                      Status {getSortIcon("status")}
                    </span>
                  </th>
                  <th
                    className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider w-24 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-fg)] bg-[hsl(var(--brutalist-yellow))] border-b-[3px] border-[var(--brutalist-border-color)]"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  isBrutalist
                    ? "border-t border-b border-[var(--brutalist-border-color)]"
                    : "border-t border-b border-slate-200 dark:border-slate-700"
                }
              >
                {paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className={`transition cursor-pointer border-b last:border-b-0 ${
                      isBrutalist
                        ? "hover:bg-[hsl(var(--brutalist-cyan)/0.2)] border-[var(--brutalist-border-color)]"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
                    }`}
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap w-36">
                      <div
                        className={`text-sm font-medium ${
                          isBrutalist
                            ? "brutalist-text text-[var(--brutalist-fg)]"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {invoice.invoice_number}
                      </div>
                      <div
                        className={`text-sm ${
                          isBrutalist
                            ? "text-[var(--brutalist-muted-fg)]"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {formatDate(invoice.issue_date, {
                          locale: invoice.locale,
                          language: invoice.language,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div
                        className={`text-sm truncate ${
                          isBrutalist
                            ? "text-[var(--brutalist-fg)]"
                            : "text-slate-900 dark:text-white"
                        }`}
                        title={invoice.client?.name}
                      >
                        {invoice.client?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-32">
                      <div
                        className={`text-sm font-medium ${
                          isBrutalist
                            ? "brutalist-text text-[var(--brutalist-fg)]"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {formatCurrencyWithCode(
                          invoice.total,
                          invoice.currency,
                          invoice.locale
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-28">
                      <div
                        className={`text-sm ${
                          isBrutalist
                            ? "text-[var(--brutalist-fg)]"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {formatDate(invoice.due_date, {
                          locale: invoice.locale,
                          language: invoice.language,
                        })}
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
                        disabled={invoice.status === "paid"}
                        className={`text-xs font-medium px-3 py-1 border-0 ${
                          isBrutalist ? "rounded-none brutalist-text" : "rounded-full"
                        } ${getStatusColor(invoice.status)} disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={
                          invoice.status === "paid"
                            ? "Paid invoices cannot be changed"
                            : undefined
                        }
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
                        {(invoice.status === "draft" ||
                          invoice.status === "sent") &&
                          onEditInvoice && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditInvoice(invoice);
                              }}
                              className={`transition p-2 ${
                                isBrutalist
                                  ? "brutalist-border bg-[hsl(var(--brutalist-cyan))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))]"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
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
                          className={`transition p-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isBrutalist
                              ? "brutalist-border bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))]"
                              : "text-green-600 hover:text-green-800"
                          }`}
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
          <div
            className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isBrutalist
                ? "border-[var(--brutalist-border-color)] bg-[hsl(var(--brutalist-yellow)/0.3)]"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`text-sm ${
                  isBrutalist
                    ? "brutalist-text text-[var(--brutalist-fg)]"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
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
                <label
                  className={`text-sm ${
                    isBrutalist
                      ? "brutalist-text text-[var(--brutalist-fg)]"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Show:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className={`px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                    isBrutalist
                      ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))] brutalist-text"
                      : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
                  }`}
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
                  className={`p-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBrutalist
                      ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))]"
                      : "border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
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
                        className={`px-3 py-1 text-sm font-medium transition ${
                          currentPage === pageNum
                            ? isBrutalist
                              ? "brutalist-border brutalist-text bg-[var(--brutalist-fg)] text-[var(--brutalist-bg)]"
                              : "rounded-lg bg-slate-900 dark:bg-slate-700 text-white"
                            : isBrutalist
                            ? "brutalist-border brutalist-text bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))]"
                            : "rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  className={`p-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBrutalist
                      ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-cyan))]"
                      : "border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
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
