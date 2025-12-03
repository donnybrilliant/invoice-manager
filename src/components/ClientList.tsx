import { useState, useEffect } from "react";
import { Users, Edit2, Search } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Client } from "../types";

interface ClientListProps {
  refresh: number;
  onEditClient: (client: Client) => void;
  onViewClient: (client: Client) => void;
}

export default function ClientList({
  refresh,
  onEditClient,
  onViewClient,
}: ClientListProps) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadClients();
  }, [user, refresh]);

  const loadClients = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-300">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">No clients found</p>
          <p className="text-sm text-slate-500">
            Add your first client to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => onViewClient(client)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {client.name}
                  </h3>
                  {client.email && (
                    <p className="text-sm text-slate-600 mb-1">
                      {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="text-sm text-slate-600">{client.phone}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClient(client);
                  }}
                  className="text-slate-600 hover:text-slate-900 transition p-1"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              {client.address && (
                <p className="text-sm text-slate-600 border-t border-slate-100 pt-4 whitespace-pre-line">
                  {client.address}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
