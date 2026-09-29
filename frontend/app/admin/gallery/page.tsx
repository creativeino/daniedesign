// Studio Gallery manager — upload/add photos (src + alt) and delete them;
// these images appear on the public About page.
"use client";

import { useEffect, useState } from "react";
import MediaImage from "@/components/shared/MediaImage";
import { Trash2, UploadCloud, Loader2 } from "lucide-react";
import { getGalleryImages, createGalleryImage, deleteGalleryImage, uploadImage } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryImage = { id: number; src: string; alt: string };

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [alt, setAlt] = useState("");
  const [src, setSrc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchGallery = () => {
    getGalleryImages()
      .then((data) => setImages(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Upload the chosen file via the media endpoint and populate the URL field
  // from the response (upload alone doesn't create a gallery entry).
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // clear the input so picking the same file again re-fires onChange
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setSrc(res.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!src || !alt) {
      alert("Please provide image URL and description");
      return;
    }
    setAdding(true);
    try {
      await createGalleryImage({ src, alt });
      setSrc("");
      setAlt("");
      setLoading(true);
      await fetchGallery();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add image");
    } finally {
      setAdding(false);
    }
  };

  // Delete flow: native confirm(), then remove the entry from local state on success.
  const handleDelete = async (id: number) => {
    if (!confirm("Delete studio photo?")) return;
    try {
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Studio Gallery ({images.length})
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Photos showing the design studio workspace on the About Us page.
        </p>
      </div>

      {/* Add Image Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add Studio Photo</CardTitle>
          <CardDescription>Description and image asset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Alt Description *
              </label>
              <Input
                type="text"
                required
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g. Designer reviewing layouts"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Image URL / Upload *
              </label>
              <div className="flex gap-1.5">
                <Input
                  type="text"
                  required
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                  placeholder={uploading ? "Uploading…" : "Image URL"}
                  className="flex-1"
                />
                <label className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-accent cursor-pointer hover:border-accent">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {/* live preview so it's obvious the upload worked before submitting */}
              {src && (
                <div className="relative mt-2 h-16 w-24 overflow-hidden rounded-md border border-white/10 bg-black/40">
                  <MediaImage src={src} alt="Selected photo preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={adding || uploading}
                size="sm"
                className="w-full font-semibold"
              >
                {uploading ? "Uploading..." : adding ? "Adding..." : "+ Add Photo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent" />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <Card
              key={img.id}
              className="p-2.5 flex flex-col justify-between hover:border-accent/40 transition-all"
            >
              <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-black/40 border border-white/5 mb-2">
                <MediaImage src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
              <p className="font-mono text-[10px] text-white/60 truncate">{img.alt}</p>
              <div className="border-t border-white/5 pt-1.5 mt-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(img.id)}
                  className="h-6 w-6 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
