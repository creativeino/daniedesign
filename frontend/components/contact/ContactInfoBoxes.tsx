"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import TiltCard from "@/components/animations/TiltCard";
import { contact } from "@/data/contact";

export default function ContactInfoBoxes() {
  return (
    <div className="flex flex-col gap-3">
      <TiltCard
        className="rounded-2xl"
        maxTilt={10}
        glowColor="rgba(255, 77, 31, 0.2)"
      >
        <a
          href={`mailto:${contact.email}`}
          className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-ink/10 bg-panel p-7 transition-colors duration-300 hover:border-accent/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-[#0e0e0e] text-accent shadow-[0_0_20px_rgba(255,77,31,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-[#0e0e0e] group-hover:shadow-[0_0_28px_rgba(255,77,31,0.5)]">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
              Email us
            </p>
            <p className="mt-1.5 text-base font-semibold text-ink transition-colors group-hover:text-accent">
              {contact.email}
            </p>
          </div>
          <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-ink/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
          <span
            className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
            aria-hidden="true"
          />
        </a>
      </TiltCard>

      <TiltCard
        className="rounded-2xl"
        maxTilt={10}
        glowColor="rgba(255, 77, 31, 0.2)"
      >
        <a
          href={`tel:${contact.phoneTel}`}
          className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-ink/10 bg-panel p-7 transition-colors duration-300 hover:border-accent/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-[#0e0e0e] text-accent shadow-[0_0_20px_rgba(255,77,31,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-[#0e0e0e] group-hover:shadow-[0_0_28px_rgba(255,77,31,0.5)]">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
              Call us
            </p>
            <p className="mt-1.5 text-base font-semibold text-ink transition-colors group-hover:text-accent">
              {contact.phone}
            </p>
          </div>
          <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-ink/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
          <span
            className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
            aria-hidden="true"
          />
        </a>
      </TiltCard>

      <TiltCard
        className="rounded-2xl"
        maxTilt={10}
        glowColor="rgba(255, 77, 31, 0.2)"
      >
        <div className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-ink/10 bg-panel p-7 transition-colors duration-300 hover:border-accent/40">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-[#0e0e0e] text-accent shadow-[0_0_20px_rgba(255,77,31,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:border-accent/40 group-hover:bg-accent group-hover:text-[#0e0e0e] group-hover:shadow-[0_0_28px_rgba(255,77,31,0.5)]">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
              The studio
            </p>
            <p className="mt-1.5 text-base font-semibold text-ink">
              {contact.address}
            </p>
            <p className="mt-1 text-xs text-muted">
              {contact.locationNote}
            </p>
          </div>
          <span
            className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
      </TiltCard>
    </div>
  );
}