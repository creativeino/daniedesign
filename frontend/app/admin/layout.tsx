// Admin area shell — persistent sidebar/topbar navigation shared by every
// /admin page. Enforces auth: any admin route without a stored token is
// redirected to /admin/login.
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Sliders,
  Palette,
  Users2,
  ImageIcon,
  Mail,
  UploadCloud,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { getAdminToken, getAdminUser, clearAdminToken } from "@/lib/api";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Blog & Insights", href: "/admin/blogs", icon: BookOpen },
  { label: "Services", href: "/admin/services", icon: Sliders },
  { label: "Creative Wall", href: "/admin/creative", icon: Palette },
  { label: "Clients & Reviews", href: "/admin/clients", icon: Users2 },
  { label: "Team Squad", href: "/admin/team", icon: Users2 },
  { label: "Studio Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Inquiries", href: "/admin/inquiries", icon: Mail },
  { label: "Media Library", href: "/admin/media", icon: UploadCloud },
];

const subscribeNoop = () => () => {};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // Client-only flag: false during SSR/hydration, true on the client.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const isLoginPage = pathname === "/admin/login";

  // Auth guard: runs after mount (localStorage is unavailable during SSR),
  // redirecting to the login page unless an admin token is present.
  useEffect(() => {
    if (isLoginPage) return;
    const id = window.setTimeout(() => {
      if (!getAdminToken()) {
        router.push("/admin/login");
      } else {
        setUser(getAdminUser());
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname, isLoginPage, router]);

  // Wipe the stored token/user, then send the admin back to the login screen.
  const handleLogout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  if (isLoginPage) return <>{children}</>;
  if (!mounted) return <div className="min-h-screen bg-[#0e0e0e]" />;

  return (
    <div
      className="min-h-screen bg-[#0e0e0e] text-[#f4f2ee] flex"
      style={{ fontFamily: "var(--font-roboto, sans-serif)" }}
    >
      {/* ── GRAIN OVERLAY ── */}
      <div
        className="pointer-events-none fixed inset-0 z-[999] opacity-[0.18] mix-blend-overlay"
        style={{ backgroundImage: "url('/art/noise.png')", backgroundRepeat: "repeat" }}
        aria-hidden="true"
      />

      {/* ── MOBILE TOPBAR ── */}
      <div className="lg:hidden fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-white/10 px-5 py-3.5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/images/Logo-01.svg"
            alt="Danie Design"
            width={140}
            height={48}
            priority
            className="h-6 w-auto object-contain"
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff4d1f] border border-[#ff4d1f]/30 bg-[#ff4d1f]/10 px-1.5 py-0.5 rounded">
            CRM
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-8 w-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all"
        >
          {sidebarOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* ── SIDEBAR OVERLAY (mobile) ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-[#111111] border-r border-white/[0.07] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.07]">
          <Link href="/admin" className="group flex flex-col gap-1.5" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/images/Logo-01.svg"
              alt="Danie Design"
              width={160}
              height={56}
              priority
              className="h-7 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d1f] animate-pulse shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9a968e]">
                CRM Studio
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-6 w-6 flex items-center justify-center text-white/40 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9a968e] px-3 pb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#ff4d1f] text-[#0e0e0e] shadow-[0_4px_20px_rgba(255,77,31,0.35)]"
                    : "text-[#f4f2ee]/60 hover:bg-white/[0.05] hover:text-[#f4f2ee]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    active ? "text-[#0e0e0e]" : "text-[#9a968e] group-hover:text-[#f4f2ee] group-hover:scale-105"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight className="h-3.5 w-3.5 text-[#0e0e0e]/60 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: User + Actions */}
        <div className="border-t border-white/[0.07] p-4 space-y-3">
          {/* User pill */}
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.07] px-3.5 py-2.5">
            <div className="h-7 w-7 rounded-full bg-[#ff4d1f]/15 border border-[#ff4d1f]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-[#ff4d1f]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#f4f2ee] truncate leading-tight">
                {user?.name || "Danie Admin"}
              </p>
              <p className="font-mono text-[10px] text-[#9a968e] truncate">
                {user?.email || "admin@daniedesign.com"}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="group flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#f4f2ee]/70 hover:border-[#ff4d1f]/50 hover:text-[#ff4d1f] transition-all duration-300"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#f4f2ee]/70 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <main className="flex-1 p-5 md:p-8 lg:p-10 pt-20 lg:pt-8 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
