import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import InvoiceView from "./InvoiceView";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import ClientDetailView from "./ClientDetailView";
import { Invoice, Client } from "../types";
import { useInvoices } from "../hooks/useInvoices";
import { useClients } from "../hooks/useClients";
import { getCurrencySymbol } from "../lib/utils";

interface DashboardProps {
  onNavigateToProfile: () => void;
}

export default function Dashboard({ onNavigateToProfile }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { data: invoices = [] } = useInvoices();
  const { data: clients = [] } = useClients();
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

  // Calculate statistics
  const totalInvoices = invoices.length;
  const totalClients = clients.length;
  const invoicesByStatus = {
    draft: invoices.filter((inv) => inv.status === "draft").length,
    sent: invoices.filter((inv) => inv.status === "sent").length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    overdue: invoices.filter((inv) => inv.status === "overdue").length,
  };

  // Calculate unpaid amount (sent + overdue invoices)
  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue"
  );
  const unpaidAmount = unpaidInvoices.reduce(
    (sum, invoice) => sum + invoice.total,
    0
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
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 dark:bg-slate-700 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Invoice Manager
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onNavigateToProfile}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                {user?.email}
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onNavigateToProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition px-4 py-2 text-left"
                >
                  {user?.email}
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
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
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Dashboard Statistics
          </h2>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
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
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Paid Invoices
                    </p>
                    <div className="space-y-1">
                      {Object.entries(paidByCurrency).length > 0 ? (
                        Object.entries(paidByCurrency).map(
                          ([currency, amount]) => (
                            <p
                              key={currency}
                              className="text-xl font-bold text-slate-900 dark:text-white"
                            >
                              {getCurrencySymbol(currency)}{" "}
                              {amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          )
                        )
                      ) : (
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          € 0.00
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {invoicesByStatus.paid} invoice
                      {invoicesByStatus.paid !== 1 ? "s" : ""}
                      {totalInvoices > 0
                        ? ` (${Math.round(
                            (invoicesByStatus.paid / totalInvoices) * 100
                          )}% of total)`
                        : ""}
                    </p>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-900/20 p-3 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Unpaid Invoices Card */}
              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl shadow-sm p-6 border border-orange-200 dark:border-orange-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Unpaid Invoices
                    </p>
                    <div className="space-y-1">
                      {Object.entries(unpaidByCurrency).length > 0 ? (
                        Object.entries(unpaidByCurrency).map(
                          ([currency, amount]) => (
                            <p
                              key={currency}
                              className="text-xl font-bold text-orange-900 dark:text-orange-300"
                            >
                              {getCurrencySymbol(currency)}{" "}
                              {amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          )
                        )
                      ) : (
                        <p className="text-xl font-bold text-orange-900 dark:text-orange-300">
                          € 0.00
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-orange-500 dark:text-orange-400 mt-2">
                      {unpaidInvoices.length} invoice
                      {unpaidInvoices.length !== 1 ? "s" : ""} unpaid
                    </p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row: Total Invoices and Total Clients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Total Invoices
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {totalInvoices}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Total Clients
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {totalClients}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            {totalInvoices > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Draft
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {invoicesByStatus.draft}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                    Sent
                  </p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                    {invoicesByStatus.sent}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                    Paid
                  </p>
                  <p className="text-lg font-semibold text-green-900 dark:text-green-300">
                    {invoicesByStatus.paid}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                    Overdue
                  </p>
                  <p className="text-lg font-semibold text-red-900 dark:text-red-300">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "invoices"
                    ? "bg-slate-900 dark:bg-slate-700 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Invoices
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "clients"
                    ? "bg-slate-900 dark:bg-slate-700 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New {activeTab === "invoices" ? "Invoice" : "Client"}
            </button>
          </div>
        </div>

        <div>
          {activeTab === "invoices" ? (
            <InvoiceList
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
