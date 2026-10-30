"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUp,
  ArrowUpRight,
  Facebook,
  Twitter,
  Instagram,
  Dribbble,
  Linkedin,
} from "lucide-react";
import { footerCompanyLinks } from "@/data/navigation";
import { services } from "@/data/services";
import { contact } from "@/data/contact";
import NewsletterForm from "./NewsletterForm";
import SplitText from "@/components/animations/SplitText";
import { gsap, prefersReducedMotion, isCoarsePointer } from "@/lib/gsap";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" />
    </svg>
  );
}

const socialIcons: Record<string, React.ElementType> = {
  Facebook,
  X: Twitter,
  Dribbble,
  Instagram,
  LinkedIn: Linkedin,
  Behance: BehanceIcon,
  Pinterest: PinterestIcon,
};

const socialBrandColors: Record<string, string> = {
  Facebook: "#1877F2",
  X: "#14171A",
  Dribbble: "#EA4C89",
  Instagram: "#E1306C",
  LinkedIn: "#0A66C2",
  Behance: "#1769FF",
  Pinterest: "#E60023",
};

function SocialFlipIcon({ href, label }: { href: string; label: string }) {
  const Icon = socialIcons[label] ?? ArrowUpRight;
  const brand = socialBrandColors[label] ?? "#ff4d1f";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group block h-11 w-11 [perspective:600px]"
    >
      <span
        className="relative block h-full w-full [transform-style:preserve-3d] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:animate-[social-bounce_0.7s_ease-in-out_both]"
        aria-hidden="true"
      >
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full border border-ink/15 bg-panel text-muted transition-colors duration-300 [backface-visibility:hidden]"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full text-white [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${brand}, ${brand}cc)`,
            boxShadow: `0 10px 30px -8px ${brand}aa, inset 0 0 20px rgba(255,255,255,0.25)`,
          }}
        >
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Icon className="h-4 w-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
        </span>
      </span>
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0 blur-md transition-all duration-500 group-hover:opacity-100"
        style={{ background: `${brand}55` }}
        aria-hidden="true"
      />
    </a>
  );
}

function MagneticCTA() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href="/contact"
      data-cursor="OPEN"
      className="group relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-accent text-[#0e0e0e] shadow-[0_20px_60px_-20px_rgba(255,77,31,0.6)] transition-shadow duration-300 will-change-transform hover:shadow-[0_25px_80px_-20px_rgba(255,77,31,0.8)] md:h-44 md:w-44"
    >
      <span
        className="absolute inset-0 rounded-full border border-white/25 transition-all duration-500 group-hover:scale-125 group-hover:opacity-0"
        aria-hidden="true"
      />
      <span className="flex flex-col items-center gap-1.5">
        <ArrowUpRight className="h-8 w-8 transition-transform duration-300 group-hover:rotate-45 md:h-10 md:w-10" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
          Let&apos;s Talk
        </span>
      </span>
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-ink"
      >
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 translate-x-[-4px] translate-y-[4px] text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
        <span className="relative">
          {children}
          <span
            className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full"
            aria-hidden="true"
          />
        </span>
      </Link>
    </li>
  );
}

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#0e0e0e]"
    >
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden border-t border-ink/10 bg-panel">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[min(1000px,95vw)] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* ── CTA ── */}
        <div className="flex flex-col gap-12 py-20 md:py-28 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SplitText
              as="h2"
              text="Let's build something unforgettable."
              className="display text-4xl font-bold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-6xl xl:text-7xl"
            />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
              One call is all it takes — tell us about your brand, your goals and
              your timeline. We&apos;ll bring the strategy, craft and code.
            </p>
          </div>
          <MagneticCTA />
        </div>

        {/* ── Link Grid ── */}
        <div className="grid grid-cols-1 gap-12 border-t border-ink/10 pt-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image
              src="/images/Logo-01.svg"
              alt="Danie Design logo"
              width={4167}
              height={1468}
              className="h-9 w-auto object-contain"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              A full-service creative digital agency focused on design,
              development and marketing — with international client relationships.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={`mailto:${contact.email}`}
                className="text-sm font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
              >
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phoneTel}`}
                className="text-sm font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
              >
                {contact.phone}
              </a>
              <address className="not-italic mt-1 text-xs leading-relaxed text-muted">
                {contact.address}
              </address>
            </div>
          </div>

          <nav aria-label="Footer company links" className="lg:col-span-2">
            <h3 className="eyebrow text-accent">Company</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {footerCompanyLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer service links" className="lg:col-span-3">
            <h3 className="eyebrow text-accent">Services</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {services.map((service) => (
                <FooterLink key={service.href} href={service.href}>
                  {service.title}
                </FooterLink>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-10 lg:col-span-3">
            <div>
              <h3 className="eyebrow text-accent">Follow the work</h3>
              <ul className="mt-5 flex flex-wrap items-center gap-3">
                {contact.socials.map((social) => (
                  <li key={social.label}>
                    <SocialFlipIcon href={social.href} label={social.label} />
                  </li>
                ))}
              </ul>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="relative mt-20 border-t border-ink/10">
        <div className="flex flex-col gap-6 border-t border-ink/10 px-5 py-7 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-xs text-muted">
            © {year} Danie Design. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-xs text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
            >
              Privacy Policy
            </Link>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}