// Blog management list — shows all articles from the backend /blogs API
// with search, edit links, and delete (with confirmation) actions.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MediaImage from "@/components/shared/MediaImage";
import { Plus, Search, Trash2, Edit3, ArrowUpRight, Star, Loader2, Clock } from "lucide-react";
import { getBlogPosts, deleteBlogPost } from "@/lib/api";
import { BlogPost } from "@/data/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  // Load the full list of blog posts from the backend.
  const fetchBlogs = () => {
    getBlogPosts()
      .then((data) => setBlogs(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete flow: native confirm() dialog, then DELETE via API and drop the
  // post from local state on success (deletingSlug tracks the in-flight row).
  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete article "${title}"?`)) return;
    setDeletingSlug(slug);
    try {
      await deleteBlogPost(slug);
      setBlogs((prev) => prev.filter((b) => b.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setDeletingSlug(null);
    }
  };

  // Client-side search filter over title, excerpt and category.
  const filtered = blogs.filter((b) => {
    return (
      search.trim() === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a968e] mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-[#ff4d1f]" />
            Editorial Management
          </p>
          <h1
            className="text-3xl font-bold leading-[1.06] tracking-tight text-[#f4f2ee] md:text-4xl"
            style={{ fontFamily: "var(--font-sora, sans-serif)" }}
          >
            Articles &amp; Insights <span className="text-[#ff4d1f]">({blogs.length})</span>
          </h1>
        </div>

        <Link href="/admin/blogs/new">
          <Button variant="default" size="default" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Write New Article</span>
          </Button>
        </Link>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative w-full md:w-80">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="pl-10 h-10 rounded-full"
        />
      </div>

      {/* ── BLOG CARDS ── */}
      {loading ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-20 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#ff4d1f] mb-3" />
          <p className="font-mono text-xs text-[#9a968e] uppercase tracking-widest">
            Loading articles...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-16 text-center">
          <p className="text-base font-semibold text-[#f4f2ee]">No articles found</p>
          <p className="font-mono text-xs text-[#9a968e] mt-1">Click &quot;Write New Article&quot; to publish your first post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#111111] overflow-hidden hover:border-[#ff4d1f]/40 transition-all duration-300 shadow-sm"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                  <MediaImage
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest bg-black/80 backdrop-blur-md text-[#ff4d1f] px-2.5 py-1 rounded-full border border-white/10">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-amber-500/20 backdrop-blur-md text-amber-300 px-2 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#9a968e] uppercase tracking-wider mb-2.5">
                    <Clock className="h-3 w-3 text-[#ff4d1f]" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3
                    className="text-base font-bold text-[#f4f2ee] group-hover:text-[#ff4d1f] transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-sora, sans-serif)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-[#9a968e] mt-2.5 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-white/[0.06] p-4 bg-[#141414]/50">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="font-mono text-[10px] uppercase tracking-wider text-[#9a968e] hover:text-[#ff4d1f] flex items-center gap-1 transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/blogs/edit/${post.slug}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-3 gap-1">
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug, post.title)}
                    disabled={deletingSlug === post.slug}
                    className="h-7 w-7 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete article"
                  >
                    {deletingSlug === post.slug ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
