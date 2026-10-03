// Admin login screen — posts credentials to the backend via loginAdmin()
// (which stores the returned token/user in localStorage) and redirects to
// the dashboard on success.
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { loginAdmin, getAdminToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  // Start with empty fields — credentials are never prefilled or displayed.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a valid token is already stored, skip the form and go straight to the dashboard.
  useEffect(() => {
    if (getAdminToken()) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // loginAdmin stores the token on success; any failure throws with a message.
      await loginAdmin(email, password);
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f4f2ee] flex items-center justify-center p-5 relative overflow-hidden font-sans selection:bg-[#ff4d1f] selection:text-[#0e0e0e]">
      {/* ── Background Glow ── */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ff4d1f]/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#ff4d1f]/5 blur-[160px]" />

      {/* ── Grain texture overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/art/noise.png')", backgroundRepeat: "repeat" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 transition-transform hover:scale-105 duration-300">
            <Image
              src="/images/Logo-01.svg"
              alt="Danie Design"
              width={240}
              height={82}
              priority
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight text-[#f4f2ee]"
            style={{ fontFamily: "var(--font-sora, sans-serif)" }}
          >
            Control Center
          </h1>
          <p className="font-mono text-xs text-[#9a968e] mt-1.5 uppercase tracking-[0.15em]">
            Sign in to manage portfolio &amp; content
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#141414]/90 p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-3.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a968e] mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/[0.09] bg-[#0e0e0e] py-3 pl-11 pr-4 font-mono text-xs text-[#f4f2ee] placeholder:text-white/20 focus:border-[#ff4d1f] focus:outline-none focus:ring-1 focus:ring-[#ff4d1f] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a968e] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/[0.09] bg-[#0e0e0e] py-3 pl-11 pr-4 font-mono text-xs text-[#f4f2ee] placeholder:text-white/20 focus:border-[#ff4d1f] focus:outline-none focus:ring-1 focus:ring-[#ff4d1f] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative mt-5 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#ff4d1f] py-3.5 text-xs font-bold uppercase tracking-widest text-[#0e0e0e] shadow-[0_8px_28px_rgba(255,77,31,0.35)] transition-all duration-300 hover:shadow-[0_14px_45px_rgba(255,77,31,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-mono text-xs text-[#9a968e] hover:text-[#ff4d1f] transition-colors"
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
