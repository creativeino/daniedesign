// Create/edit portfolio case-study form shared by /admin/projects/new and
// /admin/projects/edit/[slug]. Builds a Project record (metadata, service
// tags, cover/gallery media, features, tech stack) and POSTs or PUTs
// it to the backend /projects API; images upload via the media endpoints.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  X,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { createProject, updateProject, uploadImage, uploadMultipleImages } from "@/lib/api";
import { isVideoUrl } from "@/lib/utils";
import MediaImage from "@/components/shared/MediaImage";
import MediaVideo from "@/components/shared/MediaVideo";
import { Project } from "@/data/projects";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Props = {
  initialData?: Project;
  isEdit?: boolean;
};

export default function ProjectForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();

  // Edit mode seeds every field from the existing project; create mode uses
  // blank/sample defaults (featured projects show on the homepage grid).
  const [form, setForm] = useState<Partial<Project>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Branding",
    year: initialData?.year || "2025",
    description: initialData?.description || "",
    image: initialData?.image || "",
    services: initialData?.services || ["Brand Strategy", "Visual Identity"],
    featured: initialData?.featured ?? true,
    order: initialData?.order ?? 0,
    gallery: initialData?.gallery || [],
    features: initialData?.features || [],
    technologies: initialData?.technologies || [],
  });

  const [newTag, setNewTag] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-derive the URL slug from the title, but only when creating.
  // In edit mode the slug is the record key, so it must stay fixed.
  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    }));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (!form.services?.includes(newTag.trim())) {
      setForm((prev) => ({
        ...prev,
        services: [...(prev.services || []), newTag.trim()],
      }));
    }
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services?.filter((t) => t !== tag),
    }));
  };

  // Upload the picked cover file and store the returned URL on the form;
  // errors surface via the shared `error` banner above the fields.
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  // Batch-upload the selected gallery files and append their returned URLs
  // to the existing gallery array (each upload succeeds or the whole batch errors).
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setError(null);
    try {
      const uploaded = await uploadMultipleImages(files);
      const urls = uploaded.map((u) => u.url);
      setForm((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...urls],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload gallery images");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.slug || !form.description || !form.image) {
      setError("Please fill in Title, Slug, Description, and Cover Image.");
      return;
    }

    setSubmitting(true);
    try {
      // Edit mode PUTs by the original slug; create mode POSTs a new record.
      if (isEdit && initialData?.slug) {
        await updateProject(initialData.slug, form);
      } else {
        await createProject(form);
      }
      // Back to the projects list after a successful save.
      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Branding", "UI/UX", "Web", "Mobile", "Marketing"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-white/50 hover:text-accent transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Projects List
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isEdit ? `Edit: ${initialData?.title}` : "Create New Project"}
          </h1>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="gap-2 font-semibold"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEdit ? "Update Project" : "Publish Project"}</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Section 1: Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Project Overview</CardTitle>
          <CardDescription>Primary metadata and category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
                Project Title *
              </label>
              <Input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Ember Coffee"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
                URL Slug *
              </label>
              <Input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. ember-coffee"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex h-9 w-full rounded-lg border border-white/10 bg-[#161619] px-3 py-1 text-xs text-white shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#161619]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
                Year
              </label>
              <Input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2025"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
                Display Order
              </label>
              <Input
                type="number"
                value={form.order ?? 0}
                onChange={(e) =>
                  setForm({ ...form, order: Math.max(0, Math.floor(Number(e.target.value) || 0)) })
                }
                placeholder="0"
              />
              <p className="mt-1 text-[10px] font-mono text-white/35">
                Lower number = higher up (1 is first). 0 = keep default (newest first).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Project Detail *
            </label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Full details about this project — the story, the work, the results..."
              className="w-full rounded-lg border border-white/10 bg-[#161619] py-2 px-3 text-xs text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-[#161619] text-accent focus:ring-accent"
            />
            <span className="text-xs text-white/80 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400" />
              Showcase this project on Homepage Featured Grid
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Section 2: Services Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Services Tags</CardTitle>
          <CardDescription>Deliverables and disciplines for this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {form.services?.map((tag) => (
              <Badge key={tag} variant="accent" className="gap-1 text-xs">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-white ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a service (e.g. Visual Identity)..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddTag}
            >
              + Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Media &amp; Images Upload</CardTitle>
          <CardDescription>Upload high-res project assets or paste image URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Cover Photo */}
          <div>
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Main Cover Image *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="relative border border-dashed border-white/20 rounded-xl p-5 text-center hover:border-accent transition-colors bg-[#161619]/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="mx-auto h-6 w-6 text-accent mb-1.5" />
                <p className="text-xs font-semibold text-white">
                  {uploadingCover ? "Uploading Cover..." : "Click or Drag Cover Image"}
                </p>
                <p className="text-[10px] font-mono text-white/40 mt-0.5">PNG, JPG, WEBP up to 25MB</p>
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Or paste direct image URL"
                />
                {form.image && (
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/10 bg-black/40">
                    <MediaImage src={form.image} alt="Cover Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Multi-Photos */}
          <div className="border-t border-white/5 pt-4">
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Gallery Screenshots &amp; Videos ({form.gallery?.length || 0})
            </label>

            <div className="relative border border-dashed border-white/20 rounded-xl p-5 text-center hover:border-accent transition-colors bg-[#161619]/40 mb-3">
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <ImageIcon className="mx-auto h-6 w-6 text-accent mb-1.5" />
              <p className="text-xs font-semibold text-white">
                {uploadingGallery ? "Uploading Gallery..." : "Upload Multiple Photos or Videos"}
              </p>
              <p className="text-[10px] font-mono text-white/40 mt-0.5">Images (JPG, PNG, WEBP) and MP4 / WEBM videos</p>
            </div>

            {form.gallery && form.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {form.gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-black/40"
                  >
                    {isVideoUrl(url) ? (
                      <MediaVideo
                        src={url}
                        muted
                        playsInline
                        preload="metadata"
                        buttonClassName="bottom-2 right-2"
                        className="object-cover"
                      />
                    ) : (
                      <MediaImage src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    )}
                    <span className="absolute left-1.5 bottom-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/80">
                      {isVideoUrl(url) ? "Video" : "Image"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 rounded-full bg-red-500/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Features & Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">4. Features &amp; Technologies</CardTitle>
          <CardDescription>Key features shown in the project detail section and the tech stack tags</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Key Features (one per line)
            </label>
            <textarea
              rows={5}
              value={(form.features || []).join("\n")}
              onChange={(e) =>
                setForm({
                  ...form,
                  // Textarea model: one feature per non-empty line.
                  features: e.target.value.split("\n").map((f) => f.trim()).filter(Boolean),
                })
              }
              placeholder={"e.g. Supersonic Air Cargo\ne.g. AI Ocean Navigation"}
              className="w-full rounded-lg border border-white/10 bg-[#161619] py-2 px-3 text-xs text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Technologies Used (comma-separated)
            </label>
            <Input
              type="text"
              value={(form.technologies || []).join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="e.g. React, Next.js, PostgreSQL, AWS"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="gap-2 font-semibold"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving to Neon DB...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEdit ? "Update Project" : "Publish Project"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
