import { useState } from "react";
import { Users, Edit2, Search } from "lucide-react";
import { Client } from "../types";
import { useClients } from "../hooks/useClients";

interface ClientListProps {
  onEditClient: (client: Client) => void;
  onViewClient: (client: Client) => void;
}

export default function ClientList({
  onEditClient,
  onViewClient,
}: ClientListProps) {
  const { data: clients = [], isLoading: loading } = useClients();
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
          <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            No clients found
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add your first client to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => onViewClient(client)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {client.name}
                  </h3>
                  {client.email && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {client.phone}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClient(client);
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition p-1"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              {(client.street_address || client.city) && (
                <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
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
