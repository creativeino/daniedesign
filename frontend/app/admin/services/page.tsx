// Services manager — read-only grid of core services with an inline edit
// modal; edits PATCH the service via the backend API (no create/delete here).
"use client";

import { useEffect, useState } from "react";
import MediaImage from "@/components/shared/MediaImage";
import { CheckCircle2, Loader2, UploadCloud, Edit3 } from "lucide-react";
import { getServices, updateService, uploadImage } from "@/lib/api";
import { Service } from "@/data/services";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchServices = () => {
    getServices()
      .then((data) => setServices(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Open the edit modal seeded with a copy of the service row. editingId uses
  // array index + 1 because the backend addresses services positionally.
  const handleEditClick = (s: Service, idx: number) => {
    setEditingId(idx + 1);
    setEditForm(s);
  };

  // Upload the picked file and write the returned URL into the form's image field.
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      setEditForm((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save flow: PUT the edited fields, refetch the list, then close the modal.
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSaving(true);
    try {
      await updateService(editingId, editForm);
      setLoading(true);
      await fetchServices();
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Core Services ({services.length})
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Manage service taglines, capabilities lists, accent colors, and background media.
        </p>
      </div>

      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent mb-2.5" />
          <p className="text-xs text-white/60 font-mono">Loading services...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s, idx) => (
            <Card key={s.number} className="flex flex-col justify-between shadow-md">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="accent" className="font-mono text-[10px]">
                    Service {s.number}
                  </Badge>
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: s.accent || "#ff4d1f" }}
                    title={`Accent Color: ${s.accent}`}
                  />
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/40 mb-3.5">
                  <MediaImage src={s.image} alt={s.title} fill className="object-cover" />
                </div>

                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="font-mono text-xs text-accent mt-0.5">{s.tagline}</p>
                <p className="text-xs text-white/60 mt-2 leading-relaxed">{s.description}</p>

                <div className="mt-3.5 flex flex-wrap gap-1">
                  {s.capabilities?.map((cap) => (
                    <Badge
                      key={cap}
                      variant="secondary"
                      className="text-[9px] py-0 px-1.5 font-mono text-white/50"
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>

              <CardFooter className="border-t border-white/5 pt-3 p-5 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(s, idx)}
                  className="h-8 gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Service</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#121215] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Edit Service {editForm.number}: {editForm.title}
              </h3>
              <button
                onClick={() => setEditingId(null)}
                className="text-white/40 hover:text-white p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Title
                </label>
                <Input
                  type="text"
                  required
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Tagline
                </label>
                <Input
                  type="text"
                  required
                  value={editForm.tagline || ""}
                  onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#161619] py-2 px-3 text-xs text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Capabilities (comma-separated)
                </label>
                <Input
                  type="text"
                  value={editForm.capabilities?.join(", ") || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      // Comma-separated text field <-> string[] model value.
                      capabilities: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                    Accent Color Hex
                  </label>
                  <Input
                    type="text"
                    value={editForm.accent || "#ff4d1f"}
                    onChange={(e) => setEditForm({ ...editForm, accent: e.target.value })}
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                  Cover Image URL / Upload
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={editForm.image || ""}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className="flex-1"
                  />
                  <label className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-accent cursor-pointer hover:border-accent">
                    <UploadCloud className="h-4 w-4" />
                    <span>{uploadingImage ? "..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  size="sm"
                  className="gap-1.5"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
