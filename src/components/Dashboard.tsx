import { useState, useEffect, useRef, useMemo } from "react";
import {
  FileText,
  Users,
  Plus,
  LogOut,
  Menu,
  X,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Palette,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import { useTheme } from "../contexts/ThemeContext";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import InvoiceView from "./InvoiceView";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import ClientDetailView from "./ClientDetailView";
import { Invoice, Client } from "../types";
import { useInvoices } from "../hooks/useInvoices";
import { useClients } from "../hooks/useClients";
import { useBankAccounts } from "../hooks/useBankAccounts";
import { formatCurrencyAmountOnly } from "../lib/formatting";

interface DashboardProps {
  onNavigateToProfile: () => void;
}

export default function Dashboard({ onNavigateToProfile }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { locale: appLocale } = useLocale();
  const { isBrutalist, toggleBrutalist, showToggleButton } = useTheme();
  const { data: invoices = [] } = useInvoices();
  const { data: clients = [] } = useClients();
  const { data: bankAccounts = [] } = useBankAccounts();
  const [activeTab, setActiveTab] = useState<"invoices" | "clients">(
    "invoices"
  );
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [invoiceFilters, setInvoiceFilters] = useState({
    searchTerm: "",
    status: "all",
    currency: "all",
    bankAccountId: "all",
  });
  const hasPushedStateRef = useRef(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoice_number
          .toLowerCase()
          .includes(invoiceFilters.searchTerm.toLowerCase()) ||
        (invoice.client?.name || "")
          .toLowerCase()
          .includes(invoiceFilters.searchTerm.toLowerCase());
      const matchesStatus =
        invoiceFilters.status === "all" || invoice.status === invoiceFilters.status;
      const matchesCurrency =
        invoiceFilters.currency === "all" ||
        invoice.currency === invoiceFilters.currency;
      const matchesBankAccount =
        invoiceFilters.bankAccountId === "all" ||
        invoice.bank_account_id === invoiceFilters.bankAccountId;
      return (
        !!matchesSearch &&
        matchesStatus &&
        matchesCurrency &&
        matchesBankAccount
      );
    });
  }, [invoices, invoiceFilters]);

  // Calculate statistics
  const totalInvoices = filteredInvoices.length;
  const totalClients = clients.length;
  const invoicesByStatus = {
    draft: filteredInvoices.filter((inv) => inv.status === "draft").length,
    sent: filteredInvoices.filter((inv) => inv.status === "sent").length,
    paid: filteredInvoices.filter((inv) => inv.status === "paid").length,
    overdue: filteredInvoices.filter((inv) => inv.status === "overdue").length,
  };

  // Calculate unpaid amount (sent + overdue invoices)
  const unpaidInvoices = filteredInvoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue"
  );

  // Group unpaid amounts by currency for display
  const unpaidByCurrency = unpaidInvoices.reduce((acc, inv) => {
    if (!acc[inv.currency]) {
      acc[inv.currency] = 0;
    }
    acc[inv.currency] += inv.total;
    return acc;
  }, {} as Record<string, number>);

  // Group paid invoices by currency
  const paidInvoices = filteredInvoices.filter((inv) => inv.status === "paid");
  const paidByCurrency = paidInvoices.reduce((acc, inv) => {
    if (!acc[inv.currency]) {
      acc[inv.currency] = 0;
    }
    acc[inv.currency] += inv.total;
    return acc;
  }, {} as Record<string, number>);

  const handleInvoiceSuccess = () => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handleClientSuccess = () => {
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleViewClient = (client: Client) => {
    setViewingClient(client);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // When back button is pressed, close any open views and return to dashboard
      if (viewingInvoice) {
        setViewingInvoice(null);
      }
      if (viewingClient) {
        setViewingClient(null);
      }
      if (showInvoiceForm) {
        setShowInvoiceForm(false);
        setEditingInvoice(null);
      }
      if (showClientForm) {
        setShowClientForm(false);
        setEditingClient(null);
      }
      hasPushedStateRef.current = false;
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [viewingInvoice, viewingClient, showInvoiceForm, showClientForm]);

  // Push history state when opening views (only once per view)
  useEffect(() => {
    const hasOpenView =
      viewingInvoice || viewingClient || showInvoiceForm || showClientForm;
    if (hasOpenView && !hasPushedStateRef.current) {
      window.history.pushState({ view: "detail" }, "", window.location.href);
      hasPushedStateRef.current = true;
    } else if (!hasOpenView) {
      hasPushedStateRef.current = false;
    }
  }, [viewingInvoice, viewingClient, showInvoiceForm, showClientForm]);

  return (
    <div className={`min-h-screen ${isBrutalist ? "bg-[var(--brutalist-bg)]" : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"}`}>
      <nav className={isBrutalist ? "brutalist-border border-x-0 border-t-0 bg-[hsl(var(--brutalist-red))]" : "bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className={isBrutalist ? "brutalist-border bg-[hsl(var(--brutalist-yellow))] p-2" : "bg-slate-900 dark:bg-slate-700 p-2 rounded-lg"}>
                <FileText className={`w-6 h-6 ${isBrutalist ? "text-[var(--brutalist-fg)]" : "text-white"}`} />
              </div>
              <h1 className={`text-xl font-bold ${isBrutalist ? "brutalist-heading text-white" : "text-slate-900 dark:text-white"}`} style={isBrutalist ? { textShadow: "2px 2px 0 black" } : undefined}>
                Invoice Manager
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {/* Brutalist Theme Toggle Button */}
              {showToggleButton && (
                <button
                  onClick={toggleBrutalist}
                  className={`flex items-center gap-2 px-3 py-2 text-sm transition ${
                    isBrutalist
                      ? "brutalist-border bg-[hsl(var(--brutalist-cyan))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  }`}
                  title={isBrutalist ? "Switch to normal theme" : "Try brutalist theme"}
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden lg:inline">{isBrutalist ? "Normal" : "Brutalist"}</span>
                </button>
              )}
              <button
                onClick={onNavigateToProfile}
                className={`text-sm transition cursor-pointer ${isBrutalist ? "text-white hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
              >
                {user?.email}
              </button>
              <button
                onClick={signOut}
                className={`flex items-center gap-2 px-4 py-2 transition ${isBrutalist ? "text-white hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 ${isBrutalist ? "text-white hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className={`md:hidden py-4 border-t ${isBrutalist ? "border-white/30" : "border-slate-200 dark:border-slate-700"}`}>
              <div className="flex flex-col gap-2">
                {/* Mobile Brutalist Theme Toggle */}
                {showToggleButton && (
                  <button
                    onClick={() => {
                      toggleBrutalist();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-left transition ${isBrutalist ? "text-white hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
                  >
                    <Palette className="w-4 h-4" />
                    {isBrutalist ? "Normal Theme" : "Brutalist Theme"}
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigateToProfile();
                    setMobileMenuOpen(false);
                  }}
                  className={`text-sm px-4 py-2 text-left transition ${isBrutalist ? "text-white hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  {user?.email}
                </button>
                <button
                  onClick={signOut}
                  className={`flex items-center gap-2 px-4 py-2 transition ${isBrutalist ? "text-white hover:text-[hsl(var(--brutalist-yellow))]" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}>
            Dashboard Statistics
          </h2>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
              isBrutalist
                ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {showStats ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Stats
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Stats
              </>
            )}
          </button>
        </div>

        {/* Statistics Section */}
        {showStats && (
          <>
            {/* First Row: Paid and Unpaid Invoices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Paid Invoices Card */}
              <div
                className={`p-6 ${
                  isBrutalist
                    ? "brutalist-border brutalist-shadow-sm bg-[var(--brutalist-card)]"
                    : "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                }`}
              >
                <div>
                  <div className="mb-3">
                    <p
                      className={`text-sm flex items-center gap-2 ${
                        isBrutalist
                          ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Paid Invoices
                    </p>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(paidByCurrency).length > 0 ? (
                      Object.entries(paidByCurrency)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([currency, amount]) => {
                          const formattedAmount = formatCurrencyAmountOnly(
                            amount,
                            currency,
                            appLocale
                          );
                          return (
                            <div key={currency} className="flex items-center gap-3">
                              <span
                                className={`text-xl font-bold w-12 text-left ${
                                  isBrutalist
                                    ? "brutalist-heading text-[var(--brutalist-fg)]"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {currency}
                              </span>
                              <span
                                className={`text-xl font-bold tabular-nums flex-1 text-right ${
                                  isBrutalist
                                    ? "brutalist-heading text-[var(--brutalist-fg)]"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {formattedAmount}
                              </span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xl font-bold w-12 text-left ${
                            isBrutalist
                              ? "brutalist-heading text-[var(--brutalist-fg)]"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          EUR
                        </span>
                        <span
                          className={`text-xl font-bold tabular-nums flex-1 text-right ${
                            isBrutalist
                              ? "brutalist-heading text-[var(--brutalist-fg)]"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          0,00
                        </span>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {invoicesByStatus.paid} invoice
                    {invoicesByStatus.paid !== 1 ? "s" : ""}
                    {totalInvoices > 0
                      ? ` (${Math.round(
                          (invoicesByStatus.paid / totalInvoices) * 100
                        )}% of total)`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Unpaid Invoices Card */}
              <div
                className={`p-6 ${
                  isBrutalist
                    ? "brutalist-border brutalist-shadow-sm bg-[hsl(var(--brutalist-red)/0.2)]"
                    : "bg-orange-50 dark:bg-orange-900/10 rounded-xl shadow-sm border border-orange-200 dark:border-orange-800"
                }`}
              >
                <div>
                  <div className="mb-3">
                    <p
                      className={`text-sm flex items-center gap-2 ${
                        isBrutalist
                          ? "brutalist-text text-[var(--brutalist-fg)]"
                          : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Unpaid Invoices
                    </p>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(unpaidByCurrency).length > 0 ? (
                      Object.entries(unpaidByCurrency)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([currency, amount]) => {
                          const formattedAmount = formatCurrencyAmountOnly(
                            amount,
                            currency,
                            appLocale
                          );
                          return (
                            <div key={currency} className="flex items-center gap-3">
                              <span
                                className={`text-xl font-bold w-12 text-left ${
                                  isBrutalist
                                    ? "brutalist-heading text-[var(--brutalist-fg)]"
                                    : "text-orange-900 dark:text-orange-300"
                                }`}
                              >
                                {currency}
                              </span>
                              <span
                                className={`text-xl font-bold tabular-nums flex-1 text-right ${
                                  isBrutalist
                                    ? "brutalist-heading text-[var(--brutalist-fg)]"
                                    : "text-orange-900 dark:text-orange-300"
                                }`}
                              >
                                {formattedAmount}
                              </span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xl font-bold w-12 text-left ${
                            isBrutalist
                              ? "brutalist-heading text-[var(--brutalist-fg)]"
                              : "text-orange-900 dark:text-orange-300"
                          }`}
                        >
                          EUR
                        </span>
                        <span
                          className={`text-xl font-bold tabular-nums flex-1 text-right ${
                            isBrutalist
                              ? "brutalist-heading text-[var(--brutalist-fg)]"
                              : "text-orange-900 dark:text-orange-300"
                          }`}
                        >
                          0,00
                        </span>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                        : "text-orange-500 dark:text-orange-400"
                    }`}
                  >
                    {unpaidInvoices.length} invoice
                    {unpaidInvoices.length !== 1 ? "s" : ""} unpaid
                  </p>
                </div>
              </div>
            </div>

            {/* Second Row: Total Invoices and Total Clients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div
                className={`p-6 ${
                  isBrutalist
                    ? "brutalist-border brutalist-shadow-sm bg-[var(--brutalist-card)]"
                    : "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm mb-1 ${
                        isBrutalist
                          ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Total Invoices
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        isBrutalist
                          ? "brutalist-heading text-[var(--brutalist-fg)]"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {totalInvoices}
                    </p>
                  </div>
                  <div
                    className={`p-3 flex items-center justify-center ${
                      isBrutalist
                        ? "brutalist-border bg-[hsl(var(--brutalist-cyan))]"
                        : "bg-blue-100 dark:bg-blue-900/20 rounded-lg"
                    }`}
                  >
                    <FileText
                      className={`w-6 h-6 ${
                        isBrutalist
                          ? "text-[var(--brutalist-fg)]"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`p-6 ${
                  isBrutalist
                    ? "brutalist-border brutalist-shadow-sm bg-[var(--brutalist-card)]"
                    : "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm mb-1 ${
                        isBrutalist
                          ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Total Clients
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        isBrutalist
                          ? "brutalist-heading text-[var(--brutalist-fg)]"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {totalClients}
                    </p>
                  </div>
                  <div
                    className={`p-3 flex items-center justify-center ${
                      isBrutalist
                        ? "brutalist-border bg-[hsl(var(--brutalist-green))]"
                        : "bg-green-100 dark:bg-green-900/20 rounded-lg"
                    }`}
                  >
                    <Users
                      className={`w-6 h-6 ${
                        isBrutalist
                          ? "text-[var(--brutalist-fg)]"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            {totalInvoices > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div
                  className={`p-4 ${
                    isBrutalist
                      ? "brutalist-border bg-[hsl(var(--brutalist-yellow)/0.35)]"
                      : "bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Draft
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isBrutalist
                        ? "brutalist-heading text-[var(--brutalist-fg)]"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {invoicesByStatus.draft}
                  </p>
                </div>
                <div
                  className={`p-4 ${
                    isBrutalist
                      ? "brutalist-border bg-[hsl(var(--brutalist-cyan)/0.35)]"
                      : "bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    Sent
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isBrutalist
                        ? "brutalist-heading text-[var(--brutalist-fg)]"
                        : "text-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {invoicesByStatus.sent}
                  </p>
                </div>
                <div
                  className={`p-4 ${
                    isBrutalist
                      ? "brutalist-border bg-[hsl(var(--brutalist-green)/0.35)]"
                      : "bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
                  }`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    Paid
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isBrutalist
                        ? "brutalist-heading text-[var(--brutalist-fg)]"
                        : "text-green-900 dark:text-green-300"
                    }`}
                  >
                    {invoicesByStatus.paid}
                  </p>
                </div>
                <div
                  className={`p-4 ${
                    isBrutalist
                      ? "brutalist-border bg-[hsl(var(--brutalist-red)/0.25)]"
                      : "bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800"
                  }`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      isBrutalist
                        ? "brutalist-text text-[var(--brutalist-muted-fg)]"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    Overdue
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isBrutalist
                        ? "brutalist-heading text-[var(--brutalist-fg)]"
                        : "text-red-900 dark:text-red-300"
                    }`}
                  >
                    {invoicesByStatus.overdue}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("invoices")}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                  isBrutalist
                    ? `brutalist-border brutalist-text ${
                        activeTab === "invoices"
                          ? "bg-[var(--brutalist-fg)] text-[var(--brutalist-bg)]"
                          : "bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))]"
                      }`
                    : `rounded-lg ${
                        activeTab === "invoices"
                          ? "bg-slate-900 dark:bg-slate-700 text-white"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`
                }`}
                style={isBrutalist && activeTab === "invoices" ? { boxShadow: "4px 4px 0 hsl(var(--brutalist-red))" } : undefined}
              >
                <FileText className="w-4 h-4" />
                Invoices
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
                  isBrutalist
                    ? `brutalist-border brutalist-text ${
                        activeTab === "clients"
                          ? "bg-[var(--brutalist-fg)] text-[var(--brutalist-bg)]"
                          : "bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))]"
                      }`
                    : `rounded-lg ${
                        activeTab === "clients"
                          ? "bg-slate-900 dark:bg-slate-700 text-white"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`
                }`}
                style={isBrutalist && activeTab === "clients" ? { boxShadow: "4px 4px 0 hsl(var(--brutalist-red))" } : undefined}
              >
                <Users className="w-4 h-4" />
                Clients
              </button>
            </div>

            <button
              onClick={() => {
                if (activeTab === "invoices") {
                  setShowInvoiceForm(true);
                } else {
                  setShowClientForm(true);
                }
              }}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-medium transition ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow bg-[hsl(var(--brutalist-green))] text-[var(--brutalist-fg)] hover:bg-[hsl(var(--brutalist-yellow))] brutalist-text"
                  : "bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 shadow-sm"
              }`}
            >
              <Plus className="w-5 h-5" />
              New {activeTab === "invoices" ? "Invoice" : "Client"}
            </button>
          </div>
        </div>

        <div>
          {activeTab === "invoices" ? (
            <InvoiceList
              invoices={invoices}
              filters={invoiceFilters}
              onFiltersChange={setInvoiceFilters}
              bankAccounts={bankAccounts}
              onViewInvoice={setViewingInvoice}
              onEditInvoice={handleEditInvoice}
            />
          ) : (
            <ClientList
              onEditClient={handleEditClient}
              onViewClient={handleViewClient}
            />
          )}
        </div>
      </div>

      {showInvoiceForm && (
        <InvoiceForm
          onClose={() => {
            setShowInvoiceForm(false);
            setEditingInvoice(null);
          }}
          onSuccess={handleInvoiceSuccess}
          invoice={editingInvoice || undefined}
        />
      )}

      {showClientForm && (
        <ClientForm
          onClose={() => {
            setShowClientForm(false);
            setEditingClient(null);
          }}
          onSuccess={handleClientSuccess}
          client={editingClient || undefined}
        />
      )}

      {viewingInvoice && (
        <InvoiceView
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onInvoiceUpdate={(updatedInvoice) =>
            setViewingInvoice(updatedInvoice)
          }
        />
      )}

      {viewingClient && (
        <ClientDetailView
          client={viewingClient}
          onClose={() => setViewingClient(null)}
          onEdit={(client) => {
            setViewingClient(null);
            handleEditClient(client);
          }}
          onViewInvoice={(invoice) => {
            setViewingInvoice(invoice);
          }}
        />
      )}
    </div>
  );
}
