import { useState } from "react";
import { FileText, Users, Plus, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import InvoiceView from "./InvoiceView";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import ClientDetailView from "./ClientDetailView";
import { Invoice, Client } from "../types";

interface DashboardProps {
  onNavigateToProfile: () => void;
}

export default function Dashboard({ onNavigateToProfile }: DashboardProps) {
  const { user, signOut } = useAuth();
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
