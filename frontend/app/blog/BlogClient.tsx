// Client half of the "/blog" page (see ./page.tsx for the server wrapper).
// The post list is passed in as a prop from @/data/blog; category pills, search
// and the empty-state reset are purely client-side state — nothing is fetched.
"use client";

import { useState, useMemo } from "react";
import MediaImage from "@/components/shared/MediaImage";
import Link from "next/link";
import { ArrowUpRight, Clock, Search, BookOpen } from "lucide-react";
import { BlogPost } from "@/data/blog";
import TiltCard from "@/components/animations/TiltCard";
import Button from "@/components/shared/Button";

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Unique categories taken from the posts themselves, with "All" prepended.
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...cats];
  }, [posts]);

  // Posts matching the active category plus a case-insensitive substring search
  // over title, excerpt and category.
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  return (
    <section className="relative bg-[#0e0e0e] text-ink pb-28 md:pb-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">

        {/* Editorial Split Layout: Sticky Left Column + Right Magazine Stream */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left Column: Sticky Editorial Control Panel */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-8">

              <div>
                <p className="eyebrow mb-3 flex items-center gap-2 text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Curated Archives</span>
                </p>
                <h2 className="display text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
                  Filter by discipline &amp; focus.
                </h2>
                <p className="mt-3 text-xs leading-relaxed text-ink/60 md:text-sm">
                  Deep-dive research on digital agency execution, growth frameworks, and engineering standards.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles or topics..."
                  className="w-full rounded-xl border border-white/10 bg-[#121214] py-3 pl-10 pr-4 font-mono text-xs text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              {/* Category Filter Pills */}
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink/40 mb-3">
                  Categories
                </p>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => {
                    const active = cat === activeCategory;
                    const count =
                      cat === "All"
                        ? posts.length
                        : posts.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-left font-mono text-xs transition-all duration-300 ${
                          active
                            ? "bg-accent font-bold text-[#0e0e0e] shadow-[0_4px_16px_rgba(255,77,31,0.25)]"
                            : "border border-white/[0.06] bg-[#121214]/60 text-ink/70 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="font-display font-medium text-sm">{cat}</span>
                        <span
                          className={`font-mono text-[10px] rounded-full px-2 py-0.5 ${
                            active
                              ? "bg-[#0e0e0e]/20 text-[#0e0e0e]"
                              : "bg-white/5 text-ink/50"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Senior Squad Badge */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#121214] p-5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                  Editorial Squad
                </span>
                <p className="mt-1.5 font-display text-sm font-bold text-ink">
                  100% Written by Danie Design
                </p>
                <p className="mt-1 text-xs text-ink/50">
                  Real case studies, proven ROI models, and zero generic fluff.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Editorial Journal Rows */}
          <div className="lg:col-span-8">

            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#121214] py-20 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-ink/30 mb-3" />
                <p className="font-display text-lg font-bold text-ink">No entries found</p>
                <p className="mt-1 text-xs text-ink/50">
                  No articles matched &ldquo;{searchQuery}&rdquo;. Try another term.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs text-accent hover:border-accent"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col border-t border-white/10">
                {filteredPosts.map((post, idx) => {
                  return (
                    <TiltCard
                      key={post.slug}
                      className="w-full"
                      maxTilt={3}
                      glow={false}
                      glare={false}
                      shadow={false}
                      clip={false}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group relative flex flex-col gap-6 border-b border-white/10 py-10 transition-all duration-300 hover:bg-white/[0.02] md:flex-row md:items-start md:gap-8 md:p-8"
                      >
                      {/* Left Number Index */}
                      <span className="font-mono text-lg font-bold text-accent md:text-xl shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>

                      {/* Image Thumbnail with zoom */}
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-card md:w-56 lg:w-60">
                        <MediaImage
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(min-width: 768px) 240px, 100vw"
                        />
                      </div>

                      {/* Content Column */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink/50">
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-bold text-accent">
                              {post.category}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-accent" />
                              {post.readTime}
                            </span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>

                          <h3 className="display mt-3 text-xl font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-2xl">
                            {post.title}
                          </h3>

                          <p className="mt-2.5 text-xs leading-relaxed text-ink/65 md:text-sm">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-accent transition-transform duration-300 group-hover:translate-x-1">
                          <span>Read Full Dispatch</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                    </TiltCard>
                  );
                })}
              </div>
            )}

            {/* Bottom Project Inquiry Card */}
            <div className="mt-16 rounded-3xl border border-accent/30 bg-gradient-to-br from-[#161618] to-[#111113] p-8 md:p-12">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Collaborate
              </span>
              <h3 className="display mt-3 text-2xl font-bold text-ink md:text-3xl">
                Have a project that demands this level of precision?
              </h3>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-ink/65 md:text-sm">
                From brand architecture and bespoke UI/UX to Next.js engineering, we build digital flagships that convert.
              </p>
              <Button href="/contact" variant="primary" size="md" className="mt-6">
                Start A Project
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
