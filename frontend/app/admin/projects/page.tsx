// Portfolio case-study list — fetches all projects from the backend, with
// category/search filtering, public preview links, edit and delete actions.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MediaImage from "@/components/shared/MediaImage";
import { Plus, Search, Trash2, Edit3, Star, Loader2, ArrowUpRight, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { getProjects, deleteProject, updateProject } from "@/lib/api";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  // Drag & drop state: `dragReady` = handle pressed (arms `draggable`),
  // `draggingSlug` = card currently being dragged, `overSlug` = drop target.
  const [dragReady, setDragReady] = useState<string | null>(null);
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);
  const [overSlug, setOverSlug] = useState<string | null>(null);

  // Load the project list from the backend /projects API.
  const fetchProjects = () => {
    getProjects()
      .then((data) => setProjects(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete flow: native confirm(), DELETE by slug, then drop it from local
  // state; deletingSlug shows a spinner on the in-flight card.
  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;
    setDeletingSlug(slug);
    try {
      await deleteProject(slug);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeletingSlug(null);
    }
  };

  // Persist a new ordering of the visible cards: the reordered items are
  // written back into the slots they occupy in the full list (hidden/filter-
  // excluded projects keep their relative position), every project is then
  // renumbered 1..n and only the changed numbers are sent to the API.
  // Optimistic — the previous order is restored if any request fails.
  const persistOrder = async (newVisible: Project[]) => {
    if (reordering) return;
    const before = projects;
    const visibleSlugs = new Set(filtered.map((p) => p.slug));
    const reordered = new Map(newVisible.map((p) => [p.slug, p]));

    const merged = before.map((p) => (visibleSlugs.has(p.slug) ? reordered.get(p.slug)! : p));
    const previousOrder = new Map(before.map((p) => [p.slug, p.order ?? 0]));
    const renumbered = merged.map((p, idx) => ({ ...p, order: idx + 1 }));
    const changed = renumbered.filter((p) => (p.order ?? 0) !== previousOrder.get(p.slug));

    setReordering(true);
    setProjects(renumbered);
    try {
      await Promise.all(changed.map((p) => updateProject(p.slug, { order: p.order ?? 0 })));
    } catch (err) {
      setProjects(before);
      alert(err instanceof Error ? err.message : "Failed to reorder projects");
    } finally {
      setReordering(false);
      setDraggingSlug(null);
      setDragReady(null);
      setOverSlug(null);
    }
  };

  // ↑/↓ buttons: swap the card with its visible neighbour.
  const handleMove = async (slug: string, dir: -1 | 1) => {
    if (reordering) return;
    const visible = filtered;
    const vi = visible.findIndex((p) => p.slug === slug);
    const neighbor = visible[vi + dir];
    if (vi < 0 || !neighbor) return;

    const newVisible = [...visible];
    [newVisible[vi], newVisible[vi + dir]] = [newVisible[vi + dir], newVisible[vi]];
    await persistOrder(newVisible);
  };

  // ── Drag & drop (native HTML5) ──────────────────────────────────────────
  // Dragging is only armed from the grip handle so links/buttons on the card
  // keep working; the drop lands the card before/after the hovered half of
  // the target. ↑/↓ buttons stay as the touch fallback.
  const handleDragStart = (e: React.DragEvent, slug: string) => {
    e.dataTransfer.effectAllowed = "move";
    // Firefox requires data to be set for the drag to start
    e.dataTransfer.setData("text/plain", slug);
    setDraggingSlug(slug);
  };

  const handleDragOver = (e: React.DragEvent, slug: string) => {
    if (!draggingSlug) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overSlug !== slug) setOverSlug(slug);
  };

  const handleDrop = (e: React.DragEvent, targetSlug: string) => {
    e.preventDefault();
    const src = draggingSlug;
    setOverSlug(null);
    if (!src || src === targetSlug || reordering) return;

    // Drop in the lower half of the target card = land after it.
    const rect = e.currentTarget.getBoundingClientRect();
    const after = e.clientY > rect.top + rect.height / 2;

    const list = filtered.filter((p) => p.slug !== src);
    const targetIndex = list.findIndex((p) => p.slug === targetSlug);
    if (targetIndex < 0) return;
    const moved = filtered.find((p) => p.slug === src);
    if (!moved) return;
    list.splice(after ? targetIndex + 1 : targetIndex, 0, moved);
    void persistOrder(list);
  };

  const handleDragEnd = () => {
    setDraggingSlug(null);
    setDragReady(null);
    setOverSlug(null);
  };

  const categories = ["All", "Branding", "UI/UX", "Web", "Mobile", "Marketing"];

  // Combine the active category chip with the free-text search (client-side).
  const filtered = projects.filter((p) => {
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a968e] mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-[#ff4d1f]" />
            Portfolio Management
          </p>
          <h1
            className="text-3xl font-bold leading-[1.06] tracking-tight text-[#f4f2ee] md:text-4xl"
            style={{ fontFamily: "var(--font-sora, sans-serif)" }}
          >
            Case Studies <span className="text-[#ff4d1f]">({projects.length})</span>
          </h1>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="default" size="default" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Case Study</span>
          </Button>
        </Link>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-10 h-10 rounded-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#ff4d1f] text-[#0e0e0e] font-bold shadow-[0_4px_16px_rgba(255,77,31,0.35)]"
                  : "bg-white/[0.04] text-[#9a968e] hover:text-[#f4f2ee] border border-white/[0.07]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROJECTS GRID ── */}
      {loading ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-20 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#ff4d1f] mb-3" />
          <p className="font-mono text-xs text-[#9a968e] uppercase tracking-widest">
            Loading case studies...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-16 text-center">
          <p className="text-base font-semibold text-[#f4f2ee]">No projects found</p>
          <p className="font-mono text-xs text-[#9a968e] mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.slug}
              draggable={dragReady === proj.slug && !reordering}
              onDragStart={(e) => handleDragStart(e, proj.slug)}
              onDragOver={(e) => handleDragOver(e, proj.slug)}
              onDrop={(e) => handleDrop(e, proj.slug)}
              onDragEnd={handleDragEnd}
              className={`group relative flex flex-col justify-between rounded-2xl border bg-[#111111] overflow-hidden transition-all duration-300 shadow-sm ${
                overSlug === proj.slug && draggingSlug && draggingSlug !== proj.slug
                  ? "border-[#ff4d1f] scale-[1.015] shadow-[0_8px_30px_rgba(255,77,31,0.18)]"
                  : draggingSlug === proj.slug
                    ? "border-[#ff4d1f]/60 opacity-45 rotate-1"
                    : "border-white/[0.07] hover:border-[#ff4d1f]/40"
              }`}
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                  <MediaImage
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Drag handle — only arming the card from here keeps the
                      links/buttons below clickable. */}
                  <button
                    type="button"
                    onMouseDown={() => setDragReady(proj.slug)}
                    onMouseUp={() => setDragReady(null)}
                    className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/60 backdrop-blur-md transition-colors hover:border-[#ff4d1f] hover:text-[#ff4d1f] cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                    aria-label={`Drag ${proj.title} to reorder`}
                  >
                    <GripVertical className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest bg-black/80 backdrop-blur-md text-[#ff4d1f] px-2.5 py-1 rounded-full border border-white/10">
                      {proj.category}
                    </span>
                    {proj.featured && (
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-amber-500/20 backdrop-blur-md text-amber-300 px-2 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                    {(proj.order ?? 0) > 0 && (
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-black/80 backdrop-blur-md text-[#ff4d1f] px-2 py-1 rounded-full border border-[#ff4d1f]/40">
                        #{proj.order}
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 font-mono text-[10px] bg-black/80 px-2 py-0.5 rounded text-white/70">
                    {proj.year}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3
                    className="text-base font-bold text-[#f4f2ee] group-hover:text-[#ff4d1f] transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-sora, sans-serif)" }}
                  >
                    {proj.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-[#9a968e] mt-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.services && proj.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {proj.services.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[9px] uppercase tracking-wider text-white/50 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] p-4 bg-[#141414]/50">
                <Link
                  href={`/work/${proj.slug}`}
                  target="_blank"
                  className="font-mono text-[10px] uppercase tracking-wider text-[#9a968e] hover:text-[#ff4d1f] flex items-center gap-1 transition-colors"
                >
                  <span>Preview</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                  {/* Manual ordering — move the card one step up/down in the list */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(proj.slug, -1)}
                      disabled={reordering || filtered[0]?.slug === proj.slug}
                      className="h-7 w-7 rounded-full border border-white/[0.08] bg-white/[0.04] text-[#9a968e] hover:border-[#ff4d1f]/50 hover:text-[#ff4d1f] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#9a968e] disabled:hover:border-white/[0.08] flex items-center justify-center transition-all cursor-pointer"
                      title="Move up"
                    >
                      {reordering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronUp className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(proj.slug, 1)}
                      disabled={reordering || filtered[filtered.length - 1]?.slug === proj.slug}
                      className="h-7 w-7 rounded-full border border-white/[0.08] bg-white/[0.04] text-[#9a968e] hover:border-[#ff4d1f]/50 hover:text-[#ff4d1f] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-[#9a968e] disabled:hover:border-white/[0.08] flex items-center justify-center transition-all cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Link href={`/admin/projects/edit/${proj.slug}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-3 gap-1">
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(proj.slug, proj.title)}
                    disabled={deletingSlug === proj.slug}
                    className="h-7 w-7 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete project"
                  >
                    {deletingSlug === proj.slug ? (
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
