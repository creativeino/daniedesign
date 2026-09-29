// Creative Wall manager — add (with image upload or URL) and delete tiles
// shown on the interactive creative wall / homepage marquee.
"use client";

import { useEffect, useState } from "react";
import MediaImage from "@/components/shared/MediaImage";
import { Trash2, UploadCloud, Loader2 } from "lucide-react";
import { getCreativeItems, createCreativeItem, deleteCreativeItem, uploadImage } from "@/lib/api";
import { CreativeItem } from "@/data/creative";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminCreativePage() {
  const [items, setItems] = useState<CreativeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newCat, setNewCat] = useState("Identity");
  const [newImage, setNewImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchItems = () => {
    getCreativeItems()
      .then((data) => setItems(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Upload the picked file to the backend and use the returned URL as the
  // form's image value (the upload button is just a styled file input).
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      setNewImage(res.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newImage) {
      alert("Please provide label and image URL");
      return;
    }
    setAdding(true);
    try {
      await createCreativeItem({
        label: newLabel,
        image: newImage,
        category: newCat,
      });
      setNewLabel("");
      setNewImage("");
      setLoading(true);
      await fetchItems();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  // Delete flow: confirm(), then DELETE using the row index + 1 as id
  // (creative items are addressed positionally, not by a stored id).
  const handleDelete = async (idx: number, label: string) => {
    if (!confirm(`Delete creative item "${label}"?`)) return;
    try {
      await deleteCreativeItem(idx + 1);
      setItems((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete item");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Creative Wall ({items.length})
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Items rendered on the interactive creative wall and homepage marquee.
        </p>
      </div>

      {/* Add Item Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add Creative Item</CardTitle>
          <CardDescription>Hover preview discipline and media asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Label
              </label>
              <Input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. 3D Motion Graphics"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Category
              </label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-white/10 bg-[#161619] px-3 py-1 text-xs text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <option value="Identity">Identity</option>
                <option value="Digital">Digital</option>
                <option value="Print">Print</option>
                <option value="Motion">Motion</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Preview Image
              </label>
              <div className="flex gap-1.5">
                <Input
                  type="text"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Image URL"
                  className="flex-1"
                />
                <label className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-accent cursor-pointer hover:border-accent">
                  <UploadCloud className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={adding || uploadingImage}
              size="sm"
              className="w-full font-semibold"
            >
              {adding ? "Adding..." : "+ Add to Wall"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Items List */}
      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, idx) => (
            <Card
              key={idx}
              className="p-3 flex items-center justify-between gap-3 hover:border-accent/40 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                  <MediaImage src={item.image} alt={item.label} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                  <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono text-accent mt-0.5">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(idx, item.label)}
                className="h-7 w-7 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
