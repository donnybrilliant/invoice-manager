import { useState } from "react";
import { Users, Edit2, Search } from "lucide-react";
import { Client } from "../types";
import { useClients } from "../hooks/useClients";
import { useTheme } from "../contexts/ThemeContext";

interface ClientListProps {
  onEditClient: (client: Client) => void;
  onViewClient: (client: Client) => void;
}

export default function ClientList({
  onEditClient,
  onViewClient,
}: ClientListProps) {
  const { data: clients = [], isLoading: loading } = useClients();
  const { isBrutalist } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">
          Loading clients...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-400 dark:text-slate-500"}`} />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent ${
            isBrutalist
              ? "brutalist-border bg-[var(--brutalist-card)] text-[var(--brutalist-fg)] focus:ring-[hsl(var(--brutalist-yellow))]"
              : "border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-slate-900 dark:focus:ring-slate-500"
          }`}
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className={`text-center py-12 ${isBrutalist ? "brutalist-border bg-[var(--brutalist-card)]" : "bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"}`}>
          <Users className={`w-12 h-12 mx-auto mb-4 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-400 dark:text-slate-500"}`} />
          <p className={`mb-2 ${isBrutalist ? "brutalist-text text-[var(--brutalist-fg)]" : "text-slate-600 dark:text-slate-300"}`}>
            No clients found
          </p>
          <p className={`text-sm ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-500 dark:text-slate-400"}`}>
            Add your first client to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={`p-6 transition cursor-pointer ${
                isBrutalist
                  ? "brutalist-border brutalist-shadow bg-[var(--brutalist-card)] brutalist-hover-lift"
                  : "bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md"
              }`}
              onClick={() => onViewClient(client)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-semibold mb-1 truncate ${isBrutalist ? "brutalist-heading text-[var(--brutalist-fg)]" : "text-slate-900 dark:text-white"}`}
                    title={client.name}
                  >
                    {client.name}
                  </h3>
                  {client.email && (
                    <p className={`text-sm mb-1 ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-400"}`}>
                      {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className={`text-sm ${isBrutalist ? "text-[var(--brutalist-muted-fg)]" : "text-slate-600 dark:text-slate-400"}`}>
                      {client.phone}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClient(client);
                  }}
                  className={`transition p-1 ${isBrutalist ? "text-[var(--brutalist-fg)] hover:text-[hsl(var(--brutalist-cyan))]" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              {(client.street_address || client.city) && (
                <p className={`text-sm border-t pt-4 ${isBrutalist ? "text-[var(--brutalist-muted-fg)] border-[var(--brutalist-border-color)]" : "text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700"}`}>
                  {client.street_address && (
                    <>
                      {client.street_address}
                      <br />
                    </>
                  )}
                  {client.postal_code && client.city && (
                    <>
                      {client.postal_code} {client.city}
                      <br />
                    </>
                  )}
                  {client.country && <>{client.country}</>}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
