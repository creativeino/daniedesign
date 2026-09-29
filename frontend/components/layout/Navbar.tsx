"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3.5 md:pt-4"
    >
      <div
        className={`flex w-full max-w-[840px] items-center justify-between gap-2 rounded-full border px-3.5 py-2 transition-all duration-500 md:px-4 ${
          scrolled
            ? "border-ink/10 bg-panel/85 shadow-xl shadow-black/40 backdrop-blur-xl"
            : "border-ink/10 bg-panel/65 backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center pl-1"
          aria-label="Danie Design — home"
        >
          <div className="flex items-center">
            <Image
              src="/images/Logo-01.svg"
              alt="Danie Design logo"
              width={4167}
              height={1468}
              priority
              className="h-5 w-auto object-contain md:h-6 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="Main navigation">
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.children?.length) {
                const open = openMenu === link.href;
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(link.href)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMenu(open ? null : link.href)}
                      aria-expanded={open}
                      aria-haspopup="true"
                      className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors lg:px-3.5 lg:text-sm ${
                        active ? "text-[#0e0e0e]" : "text-ink/75 hover:text-ink"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-1">
                        {link.label}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                        >
                          <div className="w-80 overflow-hidden rounded-2xl border border-ink/10 bg-panel p-2 shadow-2xl shadow-black/50">
                            <Link
                              href={link.href}
                              onClick={() => setOpenMenu(null)}
                              className="group/item flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-card"
                            >
                              <span className="display text-lg font-semibold text-ink transition-colors group-hover/item:text-accent">
                                All Services
                              </span>
                              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 transition-all duration-300 group-hover/item:rotate-45 group-hover/item:border-accent group-hover/item:text-accent">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </span>
                            </Link>
                            <div className="my-1 h-px bg-ink/10" />
                            {link.children.map((child, j) => (
                              <Link
                                key={child.href}
                                onClick={() => setOpenMenu(null)}
                                href={child.href}
                                className="group/item flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-card"
                              >
                                <span className="font-mono text-[10px] font-medium text-accent">
                                  {String(j + 1).padStart(2, "0")}
                                </span>
                                <span className="display text-lg font-semibold text-ink/85 transition-colors group-hover/item:text-accent">
                                  {child.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors lg:px-3.5 lg:text-sm ${
                    active ? "text-[#0e0e0e]" : "text-ink/75 hover:text-ink"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            data-cursor="OPEN"
            className="group relative hidden items-center gap-1.5 overflow-hidden rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-[#0e0e0e] shadow-[0_4px_16px_rgba(255,77,31,0.35)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_6px_24px_rgba(255,77,31,0.55)] sm:inline-flex md:text-sm"
          >
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              aria-hidden="true"
            />
            <span className="relative">Let&apos;s Talk</span>
            <ArrowUpRight className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <motion.button
            type="button"
            onClick={() => setMobileOpen(true)}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-accent hover:text-accent md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 overflow-y-auto bg-paper px-6 pb-10 pt-24 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              type="button"
              className="absolute right-6 top-6 p-2 text-ink transition-colors hover:text-accent"
              onClick={() => setMobileOpen(false)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </motion.button>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`display text-2xl font-semibold tracking-tight ${
                      isActive(link.href) ? "text-accent" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.children?.length ? (
                    <div className="mt-2 flex flex-col gap-2 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm text-ink/70 transition-colors hover:text-accent"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-base font-bold text-[#0e0e0e]"
                >
                  Let&apos;s Talk
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}