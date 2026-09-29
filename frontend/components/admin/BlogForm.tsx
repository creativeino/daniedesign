// Create/edit blog article form shared by /admin/blogs/new and
// /admin/blogs/edit/[slug]. Builds a BlogPost (metadata + sectioned body)
// and POSTs or PUTs it to the backend /blogs API; a cover image can be
// uploaded (via the media endpoint) or pasted as a direct URL.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaImage from "@/components/shared/MediaImage";
import Link from "next/link";
import {
  UploadCloud,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Trash2,
  Star,
  Layers,
} from "lucide-react";
import { createBlogPost, updateBlogPost, uploadImage } from "@/lib/api";
import { BlogPost } from "@/data/blog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  initialData?: BlogPost;
  isEdit?: boolean;
};

export default function BlogForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();

  // Edit mode seeds every field from the existing post; create mode starts
  // from sensible sample defaults.
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Digital Agency",
    date: initialData?.date || "May 2025",
    readTime: initialData?.readTime || "4 min read",
    excerpt: initialData?.excerpt || "",
    image: initialData?.image || "",
    featured: initialData?.featured ?? false,
    content: initialData?.content || [
      {
        heading: "Full-Spectrum Creative & Engineering Alignment",
        paragraphs: [
          "Write your opening strategic insights here. Focus on actionable frameworks, business ROI, and engineering precision.",
        ],
      },
    ],
  });

  const [uploadingCover, setUploadingCover] = useState(false);
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

  // Upload the picked cover file and store the returned URL on the form;
  // failures surface via the shared `error` banner instead of an alert().
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAddBlock = () => {
    setForm((prev) => ({
      ...prev,
      content: [
        ...(prev.content || []),
        { heading: "New Strategic Section", paragraphs: ["Enter section paragraphs here..."] },
      ],
    }));
  };

  const handleBlockHeadingChange = (index: number, val: string) => {
    setForm((prev) => {
      const nextContent = [...(prev.content || [])];
      nextContent[index] = { ...nextContent[index], heading: val };
      return { ...prev, content: nextContent };
    });
  };

  // Each non-empty line of the textarea becomes one paragraph in the block's
  // paragraphs[] array (the textarea renders them joined by blank lines).
  const handleBlockParagraphsChange = (index: number, val: string) => {
    const paragraphs = val.split("\n").filter((p) => p.trim() !== "");
    setForm((prev) => {
      const nextContent = [...(prev.content || [])];
      nextContent[index] = { ...nextContent[index], paragraphs: paragraphs.length ? paragraphs : [val] };
      return { ...prev, content: nextContent };
    });
  };

  const handleRemoveBlock = (index: number) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.slug || !form.excerpt || !form.image) {
      setError("Please fill in Title, Slug, Excerpt, and Featured Image.");
      return;
    }

    setSubmitting(true);
    try {
      // Edit mode PUTs by the original slug; create mode POSTs a new record.
      if (isEdit && initialData?.slug) {
        await updateBlogPost(initialData.slug, form);
      } else {
        await createBlogPost(form);
      }
      // Back to the article list after a successful save.
      router.push("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Digital Agency",
    "Creative Strategy",
    "Startup Growth",
    "Engineering",
    "Branding",
    "UI/UX Insights",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-white/50 hover:text-accent transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Articles List
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isEdit ? `Edit: ${initialData?.title}` : "Write Strategic Article"}
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
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEdit ? "Update Article" : "Publish Article"}</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Section 1: Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Article Overview</CardTitle>
          <CardDescription>Headline, category, and metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Article Headline *
            </label>
            <Input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. What a Full-Service Marketing Agency Can Do for Your Brand"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
                URL Slug *
              </label>
              <Input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. full-service-agency-guide"
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
                Read Time
              </label>
              <Input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="4 min read"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-white/60 mb-1.5 uppercase">
              Excerpt / Summary Lead *
            </label>
            <textarea
              rows={3}
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Discover the comprehensive capabilities..."
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
              Set as Featured Article on homepage and blog header
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Section 2: Header Image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Header Image</CardTitle>
          <CardDescription>Main visual asset displayed at the top</CardDescription>
        </CardHeader>
        <CardContent>
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
                {uploadingCover ? "Uploading Image..." : "Click or Drag Article Image"}
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
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-white/10 bg-black/40">
                  <MediaImage src={form.image} alt="Header Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Body Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">3. Article Body Sections</CardTitle>
            <CardDescription>Structured chapters with headings and paragraphs</CardDescription>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddBlock}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Section</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.content?.map((block, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-[#161619] p-4 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-accent flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Section {String(idx + 1).padStart(2, "0")}
                </span>
                {form.content && form.content.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBlock(idx)}
                    className="h-6 w-6 text-red-400 hover:bg-red-500/10"
                    title="Remove Section"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/50 mb-1 uppercase">
                  Section Heading
                </label>
                <Input
                  type="text"
                  value={block.heading}
                  onChange={(e) => handleBlockHeadingChange(idx, e.target.value)}
                  placeholder="e.g. Full-Spectrum Creative & Engineering Alignment"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/50 mb-1 uppercase">
                  Paragraphs (separate paragraphs with Enter)
                </label>
                <textarea
                  rows={4}
                  value={block.paragraphs.join("\n\n")}
                  onChange={(e) => handleBlockParagraphsChange(idx, e.target.value)}
                  placeholder="Write the paragraphs for this section..."
                  className="w-full rounded-lg border border-white/10 bg-[#121215] py-2 px-3 text-xs text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
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
              <span>Publishing to Neon DB...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEdit ? "Update Article" : "Publish Article"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
