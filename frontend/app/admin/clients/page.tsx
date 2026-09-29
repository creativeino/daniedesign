// Clients & testimonials manager — add/remove brand partner entries
// (name + optional quote) that feed the client marquee and quote blocks.
"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { getClients, createClient, deleteClient } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ClientEntry = string | { name: string; quote?: string | null };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchClientsList = () => {
    getClients()
      .then((data) => setClients(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClientsList();
  }, []);

  // POST the new client, clear the inputs, then refetch so ordering/ids stay in sync.
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setAdding(true);
    try {
      await createClient({ name, quote, featured: true });
      setName("");
      setQuote("");
      setLoading(true);
      await fetchClientsList();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add client");
    } finally {
      setAdding(false);
    }
  };

  // Delete with confirm() prompt. Note: the backend has no stable client id,
  // so the row's array index + 1 is used as its pseudo-id (see id - 1 below).
  const handleDelete = async (id: number, cName: string) => {
    if (!confirm(`Delete client "${cName}"?`)) return;
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((_, i) => i !== id - 1));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete client");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Clients &amp; Testimonials ({clients.length})
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Manage brand partner names shown in client marquees and agency quote blocks.
        </p>
      </div>

      {/* Add Client Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add Client / Partner</CardTitle>
          <CardDescription>Company name and optional testimonial</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Company Name *
                </label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Northline SaaS"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Review / Quote (Optional)
                </label>
                <Input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. They rebuilt our product experience..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={adding}
                size="sm"
                className="font-semibold"
              >
                {adding ? "Adding..." : "+ Add Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {clients.map((c, idx) => {
            // API may return plain strings or {name, quote} objects — normalize both.
            const clientName = typeof c === "string" ? c : c.name;
            const clientQuote = typeof c === "object" ? c.quote : null;
            return (
              <Card
                key={idx}
                className="p-4 flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{clientName}</h4>
                  {clientQuote && (
                    <p className="text-xs text-white/60 mt-1 italic leading-relaxed">
                      &ldquo;{clientQuote}&rdquo;
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(idx + 1, clientName)}
                  className="h-7 w-7 text-red-400 hover:bg-red-500/10 hover:text-red-300 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
