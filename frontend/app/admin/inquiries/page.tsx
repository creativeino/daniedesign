// Inquiries/leads inbox — contact-form submissions from the public site,
// with status workflow (new -> contacted -> resolved), search/filter and delete.
"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Search,
  Trash2,
  Building,
  Loader2,
} from "lucide-react";
import { getContactInquiries, updateInquiryStatus, deleteInquiry } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type ContactInquiry = {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  service: string;
  message: string;
  status: string;
  created_at?: string | null;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  const fetchInquiries = () => {
    getContactInquiries()
      .then((data) => setInquiries(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // PATCH the status on the backend, then sync both the list row and the
  // selected detail card so the UI reflects it without a refetch.
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  // Delete flow: confirm() prompt, then remove from list and close the
  // detail view if the deleted inquiry was the selected one.
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete message from ${name}?`)) return;
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete inquiry");
    }
  };

  // Combine the status-tab filter with the free-text search (name, email,
  // company, message body).
  const filtered = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    const matchesSearch =
      search.trim() === "" ||
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(search.toLowerCase())) ||
      inq.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Inquiries &amp; Leads ({inquiries.length})
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Prospective client submissions captured from the public contact form.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {["all", "new", "contacted", "resolved"].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className="h-8 text-xs font-mono uppercase"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent mb-2.5" />
          <p className="text-xs text-white/60 font-mono">Loading inquiries from Neon DB...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-16 text-center">
          <Mail className="mx-auto h-8 w-8 text-white/20 mb-2" />
          <p className="text-sm font-semibold text-white">No inquiries found</p>
          <p className="text-xs text-white/40 mt-0.5">Inquiries submitted on the contact page will appear here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filtered.map((inq) => (
            <Card
              key={inq.id}
              onClick={() => setSelectedInquiry(inq)}
              className={`transition-all cursor-pointer ${
                selectedInquiry?.id === inq.id
                  ? "border-accent bg-[#161619]"
                  : "hover:border-white/20"
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">{inq.name}</span>
                      {inq.company && (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-white/50">
                          <Building className="h-3 w-3" />
                          {inq.company}
                        </span>
                      )}
                      <Badge
                        variant={
                          inq.status === "new"
                            ? "accent"
                            : inq.status === "contacted"
                            ? "warning"
                            : "success"
                        }
                        className="uppercase font-mono text-[10px]"
                      >
                        {inq.status}
                      </Badge>
                    </div>

                    <p className="font-mono text-xs text-accent mt-0.5">Service: {inq.service}</p>
                    <p className="font-mono text-[11px] text-white/40 mt-0.5">{inq.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-white/40">
                      {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : "Recent"}
                    </span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        // stopPropagation: keep the card's click-to-select from
                        // firing when its inner action buttons are clicked.
                        e.stopPropagation();
                        handleDelete(inq.id, inq.name);
                      }}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Message preview */}
                <p className="mt-3 text-xs text-white/70 leading-relaxed bg-[#161619] p-3 rounded-lg border border-white/5 font-sans">
                  {inq.message}
                </p>

                {/* Status Switcher Buttons */}
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/5">
                  <span className="font-mono text-[10px] text-white/40 uppercase">Mark Status:</span>
                  {["new", "contacted", "resolved"].map((st) => (
                    <Button
                      key={st}
                      variant={inq.status === st ? "secondary" : "ghost"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(inq.id, st);
                      }}
                      className="h-6 text-[10px] uppercase font-mono px-2"
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
