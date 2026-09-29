// Admin dashboard overview — content counts, quick actions, recent
// inquiries, featured projects and latest articles, all pulled from the
// backend dashboard summary endpoint.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MediaImage from "@/components/shared/MediaImage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TiltCard from "@/components/animations/TiltCard";
import {
  FolderKanban,
  BookOpen,
  Mail,
  Sliders,
  Plus,
  ArrowUpRight,
  UploadCloud,
  RefreshCw,
  PenLine,
  Clock,
  ExternalLink,
  CalendarDays,
  Palette,
  Users2,
  ImageIcon,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { getDashboardSummary, clearAdminToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Animated stat number: eases the displayed count from 0 up to `value`
// over ~1s using requestAnimationFrame (cubic ease-out).
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const duration = 950;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}

type DashboardCounts = {
  projects: number;
  blogs: number;
  services: number;
  inquiries: number;
  new_inquiries: number;
  creative: number;
  clients: number;
  team: number;
};

type RecentInquiry = {
  id: number;
  name: string;
  service: string;
  email: string;
  status: "new" | "contacted" | "resolved" | string;
};

type RecentProject = {
  slug: string;
  image: string;
  title: string;
  category: string;
  year: string | number;
};

type RecentBlog = {
  slug: string;
  image: string;
  title: string;
  category: string;
  date: string;
  featured?: boolean;
};

type DashboardSummary = {
  counts: DashboardCounts;
  recent_inquiries: RecentInquiry[];
  recent_projects: RecentProject[];
  recent_blogs: RecentBlog[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch (or refetch via the Refresh button) the dashboard summary from the API.
  const fetchSummary = () => {
    getDashboardSummary()
      .then((summary) => setData(summary))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fall back to hardcoded sample counts until the real summary data arrives.
  const counts = data?.counts || {
    projects: 8, blogs: 4, services: 4, inquiries: 0, new_inquiries: 0,
    creative: 12, clients: 10, team: 10,
  };

  const statCards = [
    {
      label: "Portfolio Projects",
      value: counts.projects,
      sub: "Active case studies",
      icon: FolderKanban,
      href: "/admin/projects",
      tint: "text-[#ff4d1f] bg-[#ff4d1f]/10 border-[#ff4d1f]/25 shadow-[0_0_24px_rgba(255,77,31,0.12)]",
      bar: "from-[#ff4d1f] to-[#ff7a1f]",
    },
    {
      label: "Articles & Insights",
      value: counts.blogs,
      sub: "Published on journal",
      icon: BookOpen,
      href: "/admin/blogs",
      tint: "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/25 shadow-[0_0_24px_rgba(167,139,250,0.1)]",
      bar: "from-[#a78bfa] to-[#c4b5fd]",
    },
    {
      label: "Client Inquiries",
      value: counts.inquiries,
      sub: `${counts.new_inquiries ?? 0} new pending`,
      icon: Mail,
      href: "/admin/inquiries",
      tint: "text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/25 shadow-[0_0_24px_rgba(56,189,248,0.1)]",
      bar: "from-[#38bdf8] to-[#7dd3fc]",
    },
    {
      label: "Core Services",
      value: counts.services,
      sub: "Branding · UI/UX · Web",
      icon: Sliders,
      href: "/admin/services",
      tint: "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/25 shadow-[0_0_24px_rgba(52,211,153,0.1)]",
      bar: "from-[#34d399] to-[#6ee7b7]",
    },
  ];

  const libraryChips = [
    { label: "Creative Wall", value: counts.creative, icon: Palette, href: "/admin/creative" },
    { label: "Clients", value: counts.clients, icon: Users2, href: "/admin/clients" },
    { label: "Team Squad", value: counts.team, icon: ImageIcon, href: "/admin/team" },
  ];

  const quickActions = [
    {
      label: "New Case Study",
      desc: "Add portfolio project",
      icon: Plus,
      href: "/admin/projects/new",
      glow: "group-hover:shadow-[0_8px_32px_rgba(255,77,31,0.35)] group-hover:border-[#ff4d1f]/50",
    },
    {
      label: "Write Article",
      desc: "Publish insight",
      icon: PenLine,
      href: "/admin/blogs/new",
      glow: "group-hover:shadow-[0_8px_32px_rgba(167,139,250,0.3)] group-hover:border-[#a78bfa]/50",
    },
    {
      label: "Upload Media",
      desc: "Assets library",
      icon: UploadCloud,
      href: "/admin/media",
      glow: "group-hover:shadow-[0_8px_32px_rgba(56,189,248,0.3)] group-hover:border-[#38bdf8]/50",
    },
    {
      label: "View Live Site",
      desc: "daniedesign.com",
      icon: ExternalLink,
      href: "/",
      target: "_blank",
      glow: "group-hover:shadow-[0_8px_32px_rgba(52,211,153,0.3)] group-hover:border-[#34d399]/50",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* ── HEADER ── */}
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a968e] mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-[#ff4d1f]" />
            Admin Control Center
          </p>
          <h1
            className="text-3xl font-bold leading-[1.06] tracking-tight text-[#f4f2ee] md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-sora, sans-serif)" }}
          >
            {greeting}
            <span className="block mt-1 bg-gradient-to-r from-[#ff4d1f] via-[#ff7a1f] to-[#ffb27a] bg-clip-text text-transparent">
              Studio Dashboard
            </span>
          </h1>
          <p className="font-mono text-xs text-[#9a968e] mt-3 flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-[#ff4d1f]" />
            {dateStr}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setLoading(true);
              fetchSummary();
            }}
            className="h-9 w-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-[#9a968e] hover:text-[#f4f2ee] hover:border-[#ff4d1f]/40 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/admin/projects/new">
            <Button variant="default" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </Link>
          <Link href="/admin/blogs/new">
            <Button variant="outline" size="sm" className="gap-1.5">
              <PenLine className="h-3.5 w-3.5" />
              New Article
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              Upload Media
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ── TOP BAR: View Site + Sign Out ── */}
      <motion.div
        variants={item}
        className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#111111]/70 px-4 py-2.5"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a968e] flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
          Admin Session Active
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#f4f2ee]/80 hover:border-[#ff4d1f]/50 hover:text-[#ff4d1f] transition-all"
          >
            <ExternalLink className="h-3 w-3" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
            title="Sign out of admin"
          >
            <LogOut className="h-3 w-3" />
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* ── METRIC STATS GRID ── */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.label} variants={item}>
              <TiltCard maxTilt={10} className="h-full rounded-2xl">
                <Link
                  href={c.href}
                  className="group relative flex flex-col justify-between gap-6 h-full rounded-2xl border border-white/[0.07] bg-[#111111] p-6 md:p-7 hover:bg-[#161616] hover:border-white/[0.14] transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9a968e]">
                      {c.label}
                    </p>
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${c.tint}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span
                      className="block text-4xl font-bold tracking-tight text-[#f4f2ee] tabular-nums"
                      style={{ fontFamily: "var(--font-sora, sans-serif)" }}
                    >
                      {loading ? "—" : <CountUp value={c.value} />}
                    </span>
                    <p className="font-mono text-[10px] text-[#9a968e] mt-1.5">{c.sub}</p>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${c.bar} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  />
                </Link>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── LIBRARY CHIPS ── */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a968e] mr-1">
          Content Library
        </span>
        {libraryChips.map((chip) => {
          const Icon = chip.icon;
          return (
            <Link
              key={chip.label}
              href={chip.href}
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 hover:border-[#ff4d1f]/40 hover:bg-[#ff4d1f]/5 transition-all"
            >
              <Icon className="h-3 w-3 text-[#9a968e] group-hover:text-[#ff4d1f] transition-colors" />
              <span className="font-mono text-[11px] text-[#9a968e] group-hover:text-[#f4f2ee] transition-colors">
                {chip.label}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#f4f2ee]">{chip.value}</span>
            </Link>
          );
        })}
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div variants={item}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a968e] mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.label} variants={item}>
                <TiltCard maxTilt={7} className="h-full rounded-2xl">
                  <Link
                    href={a.href}
                    target={a.target}
                    className={`group relative flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-all duration-300 ${a.glow}`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#ff4d1f] group-hover:scale-110 transition-transform shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#f4f2ee] group-hover:text-[#ff4d1f] transition-colors truncate">
                        {a.label}
                      </p>
                      <p className="font-mono text-[10px] text-[#9a968e] truncate">{a.desc}</p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 text-[#9a968e] group-hover:text-[#ff4d1f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── BOTTOM GRID: Inquiries + Projects ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Inquiries */}
        <motion.div
          variants={item}
          className="lg:col-span-5 rounded-2xl border border-white/[0.07] bg-[#111111] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2
                className="text-base font-bold text-[#f4f2ee]"
                style={{ fontFamily: "var(--font-sora, sans-serif)" }}
              >
                Recent Inquiries
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a968e] mt-0.5">
                Client leads inbox
              </p>
            </div>
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm" className="gap-1 text-[#ff4d1f] hover:text-[#ff4d1f]">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="p-4">
            {!data?.recent_inquiries || data.recent_inquiries.length === 0 ? (
              <div className="py-12 text-center">
                <Mail className="mx-auto h-8 w-8 text-white/10 mb-3" />
                <p className="text-sm font-semibold text-[#f4f2ee]/60">No inquiries yet</p>
                <p className="font-mono text-[10px] text-[#9a968e] mt-1 uppercase tracking-widest">
                  Submissions appear here
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.recent_inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#f4f2ee] truncate">{inq.name}</p>
                      <p className="font-mono text-[10px] text-[#ff4d1f] truncate mt-0.5">{inq.service}</p>
                      <p className="font-mono text-[10px] text-[#9a968e] truncate">{inq.email}</p>
                    </div>
                    <Badge
                      variant={
                        inq.status === "new" ? "accent" : inq.status === "contacted" ? "warning" : "success"
                      }
                    >
                      {inq.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          variants={item}
          className="lg:col-span-7 rounded-2xl border border-white/[0.07] bg-[#111111] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2
                className="text-base font-bold text-[#f4f2ee]"
                style={{ fontFamily: "var(--font-sora, sans-serif)" }}
              >
                Featured Work
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a968e] mt-0.5">
                Live on portfolio
              </p>
            </div>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="gap-1 text-[#ff4d1f] hover:text-[#ff4d1f]">
                Manage All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(!data?.recent_projects || data.recent_projects.length === 0)
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse aspect-[16/10] rounded-xl bg-white/[0.04]" />
                ))
              : data.recent_projects.map((proj) => (
                  <Link
                    key={proj.slug}
                    href={`/admin/projects/edit/${proj.slug}`}
                    className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-black/40 block"
                  >
                    <MediaImage
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff4d1f]">
                        {proj.category} · {proj.year}
                      </span>
                      <p className="text-xs font-bold text-[#f4f2ee] leading-tight mt-0.5 truncate group-hover:text-[#ff4d1f] transition-colors">
                        {proj.title}
                      </p>
                    </div>
                    {/* Edit hint */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4d1f] text-[#0e0e0e]">
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </motion.div>
      </div>

      {/* ── RECENT ARTICLES ── */}
      {data?.recent_blogs && data.recent_blogs.length > 0 && (
        <motion.div
          variants={item}
          className="rounded-2xl border border-white/[0.07] bg-[#111111] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2
                className="text-base font-bold text-[#f4f2ee] flex items-center gap-2"
                style={{ fontFamily: "var(--font-sora, sans-serif)" }}
              >
                <Clock className="h-4 w-4 text-[#a78bfa]" />
                Latest Articles
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a968e] mt-0.5">
                Recently published insights
              </p>
            </div>
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm" className="gap-1 text-[#ff4d1f] hover:text-[#ff4d1f]">
                Manage All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {data.recent_blogs.map((post) => (
              <Link
                key={post.slug}
                href={`/admin/blogs/edit/${post.slug}`}
                className="group flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-black/40 border border-white/5 shrink-0">
                  <MediaImage src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#f4f2ee] truncate group-hover:text-[#ff4d1f] transition-colors">
                    {post.title}
                  </p>
                  <p className="font-mono text-[10px] text-[#9a968e] mt-0.5 flex items-center gap-2">
                    <span className="text-[#a78bfa]">{post.category}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    {post.featured && (
                      <span className="text-[#ff4d1f]">· Featured</span>
                    )}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9a968e] group-hover:text-[#ff4d1f] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
