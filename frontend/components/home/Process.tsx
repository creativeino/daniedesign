"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Palette, Code2, Layout, TrendingUp } from "lucide-react";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type ProcessStep = {
  number: string;
  timeframe: string;
  title: string;
  description: string;
  deliverables: string[];
};

type ServiceProcess = {
  id: string;
  label: string;
  icon: React.ElementType;
  tagline: string;
  steps: {
    left: [ProcessStep, ProcessStep];
    right: [ProcessStep, ProcessStep];
  };
};

const processes: ServiceProcess[] = [
  {
    id: "branding",
    label: "Branding",
    icon: Palette,
    tagline: "From identity discovery to a timeless brand system.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "Discovery & Archetype",
          description:
            "Deep-dive brand strategy, market positioning, target audience mapping, and competitive visual benchmarking.",
          deliverables: ["Strategy Brief", "Moodboard Direction", "Positioning Deck"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Visual Identity System",
          description:
            "Exploration and crafting of the primary logo mark, color palettes, custom typography hierarchy, and visual rules.",
          deliverables: ["Primary & Secondary Marks", "Color System", "Typography Hierarchy"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Brand Guidelines & Kit",
          description:
            "Comprehensive multi-page brand guidelines with iconography, motion principles, and cross-channel marketing assets.",
          deliverables: ["Brand Style Guide", "Social Media Templates", "3D Brand Elements"],
        },
        {
          number: "04",
          timeframe: "2–3 Days",
          title: "Asset Delivery & Rollout",
          description:
            "Exporting production-ready vector assets across all formats with full commercial documentation and rollout support.",
          deliverables: ["Vector Master Files", "Print & Digital Pack", "Launch Support"],
        },
      ],
    },
  },
  {
    id: "web-dev",
    label: "Web Development",
    icon: Code2,
    tagline: "Engineering high-speed web platforms with Next.js 16.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "Architecture & Stack",
          description:
            "Detailed tech specification, database schema, API routing, and component hierarchy planning.",
          deliverables: ["Technical Scope", "Repository Setup", "Performance Targets"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Frontend & Animation",
          description:
            "Pixel-perfect React component engineering with Tailwind CSS and silky-smooth 60fps GSAP micro-interactions.",
          deliverables: ["Responsive Layouts", "GSAP Interactions", "Design Token Sync"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Backend & CMS Flow",
          description:
            "Integration with headless CMS, server actions, webhooks, forms, dynamic metadata, and database models.",
          deliverables: ["CMS Dashboard", "API Endpoints", "Form Handling"],
        },
        {
          number: "04",
          timeframe: "2–3 Days",
          title: "QA & Cloud Deploy",
          description:
            "Stress testing, 99+ Core Web Vitals validation, cross-browser audits, domain DNS link, and continuous CI/CD.",
          deliverables: ["99+ Core Vitals", "Cross-Browser Audit", "Vercel / Cloud Launch"],
        },
      ],
    },
  },
  {
    id: "ui-ux",
    label: "UI / UX Design",
    icon: Layout,
    tagline: "Human-centered interfaces engineered to convert.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "User Research & Flow",
          description:
            "Analyzing user personas, competitive heuristic audits, information architecture, and core journey wireframes.",
          deliverables: ["User Journey Maps", "Heuristic Audit", "Lo-Fi Wireframes"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Figma Component System",
          description:
            "Creating scalable auto-layout design systems with accessible contrast, dark mode variants, and responsive states.",
          deliverables: ["Figma UI Kit", "Component Tokens", "Design Architecture"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Interactive Prototype",
          description:
            "High-fidelity clickable Figma prototypes with realistic motion choreography, micro-states, and usability testing.",
          deliverables: ["Clickable Prototype", "User Testing Report", "Motion Specs"],
        },
        {
          number: "04",
          timeframe: "2–3 Days",
          title: "Developer Handoff",
          description:
            "Clean export of asset specs, CSS variables, responsive breakpoints, and organized engineering notes.",
          deliverables: ["Dev-Ready Specs", "Asset Export", "Handoff Walkthrough"],
        },
      ],
    },
  },
  {
    id: "digital-marketing",
    label: "Digital Marketing",
    icon: TrendingUp,
    tagline: "Data-driven campaigns and conversion optimization.",
    steps: {
      left: [
        {
          number: "01",
          timeframe: "2–4 Days",
          title: "Funnel & Market Audit",
          description:
            "Comprehensive conversion funnel audit, customer acquisition channel analysis, and competitor ad intelligence.",
          deliverables: ["Funnel Audit", "Keyword Strategy", "Targeting Blueprint"],
        },
        {
          number: "02",
          timeframe: "1–2 Weeks",
          title: "Creatives & Copywriting",
          description:
            "High-impact visual ad creatives, compelling sales copy, lead magnets, and conversion landing pages.",
          deliverables: ["Ad Creative Suite", "High-Converting Copy", "Landing Page Layout"],
        },
      ],
      right: [
        {
          number: "03",
          timeframe: "1–2 Weeks",
          title: "Multi-Channel Launch",
          description:
            "Setting up tracking pixels, conversion API, audience segmentation, and A/B split testing across Meta & Google.",
          deliverables: ["Conversion Tracking", "Live Campaigns", "A/B Testing Matrix"],
        },
        {
          number: "04",
          timeframe: "Ongoing",
          title: "ROAS Scaling & Growth",
          description:
            "Continuous bid optimization, creative fatigue cycling, performance dashboard reporting, and ROI scale-up.",
          deliverables: ["Weekly ROI Reports", "Creative Iterations", "Growth Strategy"],
        },
      ],
    },
  },
];

function ProcessCard({ step }: { step: ProcessStep }) {
  return (
    <TiltCard
      className="rounded-2xl"
      maxTilt={7}
      clip={false}
      glowColor="rgba(255, 77, 31, 0.12)"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113] transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(255,77,31,0.07)]">

      {/* Top accent line — slides in on hover */}
      <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accent via-orange-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative flex flex-1 flex-col p-6 md:p-7">

        {/* Phase serial + timeframe row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/80">
            Phase {step.number}
          </span>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-ink/50">
            <Clock className="h-2.5 w-2.5 text-accent/70" />
            <span>{step.timeframe}</span>
          </div>
        </div>

        {/* Giant watermark number */}
        <div className="pointer-events-none absolute right-5 top-3 select-none font-mono text-[72px] font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-accent/[0.06]">
          {step.number}
        </div>

        {/* Title */}
        <h3 className="mt-5 font-display text-xl font-bold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-white md:text-2xl">
          {step.title}
        </h3>

        {/* Hairline divider */}
        <div className="mt-3 h-px w-10 bg-accent/50 transition-all duration-500 group-hover:w-16" />

        {/* Description */}
        <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-ink/55 md:text-sm">
          {step.description}
        </p>

        {/* Deliverables */}
        <div className="mt-5 space-y-1.5 border-t border-white/[0.05] pt-4">
          {step.deliverables.map((item, i) => (
            <div key={item} className="flex items-center gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-accent/20 bg-accent/5 font-mono text-[8px] font-bold text-accent/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[11px] text-ink/60 transition-colors group-hover:text-ink/80">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </TiltCard>
  );
}

/* ── Dynamic Signal Streak SVG ──
   Renders animated laser lines connecting each card to the center logo.
   Anchors are distributed evenly down the left (400) and right (800) columns. */
function SignalSvg({ left, right }: { left: number; right: number }) {
  const CY = 300;
  const lAnchors = Array.from({ length: left }, (_, i) => (i + 0.5) * (600 / left));
  const rAnchors = Array.from({ length: right }, (_, i) => (i + 0.5) * (600 / right));

  const lPaths = lAnchors.map((y, i) => ({
    id: `lp-${i}`,
    d: `M 400 ${y} C 470 ${y}, 480 ${CY}, 520 ${CY}`,
  }));
  const rPaths = rAnchors.map((y, i) => ({
    id: `rp-${i}`,
    d: `M 680 ${CY} C 720 ${CY}, 730 ${y}, 800 ${y}`,
  }));

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 1200 600"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="dotGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cometGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="sharp" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="mid" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="ambient" />
          <feMerge>
            <feMergeNode in="ambient" />
            <feMergeNode in="mid" />
            <feMergeNode in="sharp" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2a00" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#ff6b2b" stopOpacity="0.9" />
          <stop offset="90%" stopColor="#ffa066" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="15%" stopColor="#ffa066" stopOpacity="1" />
          <stop offset="45%" stopColor="#ff6b2b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff2a00" stopOpacity="0.4" />
        </linearGradient>

        {[...lPaths, ...rPaths].map((p) => (
          <path key={p.id} id={p.id} pathLength="1000" d={p.d} />
        ))}
      </defs>

      {/* Layer 1: Ambient Track Conduit */}
      {[...lPaths, ...rPaths].map((p) => (
        <g key={`ambient-${p.id}`}>
          <use href={`#${p.id}`} stroke="#ff4d1f" strokeWidth="6" opacity="0.08" filter="url(#cometGlow)" />
          <use href={`#${p.id}`} stroke="rgba(255,77,31,0.18)" strokeWidth="3" />
          <use href={`#${p.id}`} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </g>
      ))}

      {/* Layer 2: Traveling Micro-Pulse Currents */}
      {[...lPaths, ...rPaths].map((p, i) => (
        <use key={`pulse-${p.id}`} href={`#${p.id}`} stroke="rgba(255,140,80,0.3)" strokeWidth="1.2" strokeDasharray="10 30" pathLength="1000">
          <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="3.6s" begin={`${(i * 0.3) % 0.6}s`} repeatCount="indefinite" />
        </use>
      ))}

      {/* Layer 3: Anchor Portals (Card Connections) */}
      {[...lAnchors.map((y) => ({ x: 400, y })), ...rAnchors.map((y) => ({ x: 800, y }))].map((a, i) => (
        <g key={`portal-${i}`} transform={`translate(${a.x}, ${a.y})`}>
          <circle r="16" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.2">
            <animate attributeName="r" values="6;20;6" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          </circle>
          <circle r="9" fill="none" stroke="#ff7a3d" strokeWidth="1.2" opacity="0.4">
            <animate attributeName="r" values="4;12;4" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          </circle>
          <circle r="3.5" fill="#ff4d1f" filter="url(#dotGlow)" />
          <circle r="1.5" fill="#ffffff" />
        </g>
      ))}

      {/* Center Logo Portals */}
      {[520, 680].map((x, i) => (
        <g key={`center-${x}`} transform={`translate(${x}, ${CY})`}>
          <circle r="12" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.3">
            <animate attributeName="r" values="4;14;4" dur="1.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle r="3.5" fill="#ff4d1f" filter="url(#dotGlow)" />
          <circle r="1.5" fill="#ffffff" />
        </g>
      ))}

      {/* Layer 4: HIGH-ENERGY CONNECTING LASER STRIPES */}
      {lPaths.map((p, i) => {
        const begin = i * 0.26;
        return (
          <g key={`laser-${p.id}`}>
            <use href={`#${p.id}`} stroke="url(#gradLeft)" strokeWidth="5"
              strokeDasharray="200 800" strokeLinecap="round" filter="url(#cometGlow)" pathLength="1000">
              <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.6s" begin={`${begin}s`} repeatCount="indefinite" />
            </use>
            <use href={`#${p.id}`} stroke="#ffffff" strokeWidth="2"
              strokeDasharray="60 940" strokeLinecap="round" filter="url(#cometGlow)" pathLength="1000">
              <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.6s" begin={`${begin}s`} repeatCount="indefinite" />
            </use>
            <use href={`#${p.id}`} stroke="#ffcca8" strokeWidth="2.5"
              strokeDasharray="16 984" strokeLinecap="round" filter="url(#cometGlow)" pathLength="1000">
              <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.6s" begin={`${begin + 0.38}s`} repeatCount="indefinite" />
            </use>
          </g>
        );
      })}
      {rPaths.map((p, i) => {
        const begin = 0.26 + i * 0.26;
        return (
          <g key={`laser-${p.id}`}>
            <use href={`#${p.id}`} stroke="url(#gradRight)" strokeWidth="5"
              strokeDasharray="200 800" strokeLinecap="round" filter="url(#cometGlow)" pathLength="1000">
              <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.6s" begin={`${begin}s`} repeatCount="indefinite" />
            </use>
            <use href={`#${p.id}`} stroke="#ffffff" strokeWidth="2"
              strokeDasharray="60 940" strokeLinecap="round" filter="url(#cometGlow)" pathLength="1000">
              <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.6s" begin={`${begin}s`} repeatCount="indefinite" />
            </use>
            <use href={`#${p.id}`} stroke="#ffcca8" strokeWidth="2.5"
              strokeDasharray="16 984" strokeLinecap="round" filter="url(#cometGlow)" pathLength="1000">
              <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.6s" begin={`${begin + 0.38}s`} repeatCount="indefinite" />
            </use>
          </g>
        );
      })}
    </svg>
  );
}

type ProcessProps = {
  eyebrow?: string;
  title?: string;
  tagline?: string;
  steps?: ProcessStep[];
};

/* ── Circular Infographic SVG ──
   Cards orbit the center logo on a ring; animated comet spokes
   connect every card anchor to the center. */
function CircularSvg({ count, radius }: { count: number; radius: number }) {
  const CX = 600;
  const CY = 600;
  const R = (radius / 100) * 1200;
  const anchors = Array.from({ length: count }, (_, i) => {
    const angle = (-90 + (i * 360) / count) * (Math.PI / 180);
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  });

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 1200"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="circDotGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="circCometGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="sharp" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="mid" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="ambient" />
          <feMerge>
            <feMergeNode in="ambient" />
            <feMergeNode in="mid" />
            <feMergeNode in="sharp" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff2a00" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#ff6b2b" stopOpacity="0.9" />
          <stop offset="90%" stopColor="#ffa066" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* ── Ring: ambient base + orbiting comet arc ── */}
      <circle cx={CX} cy={CY} r={R} stroke="rgba(255,77,31,0.12)" strokeWidth="2" />
      <circle cx={CX} cy={CY} r={R} stroke="#ff4d1f" strokeWidth="8" opacity="0.06" filter="url(#circCometGlow)" />
      <circle cx={CX} cy={CY} r={R} stroke="url(#circGrad)" strokeWidth="4" strokeDasharray="90 700" strokeLinecap="round" filter="url(#circCometGlow)">
        <animate attributeName="stroke-dashoffset" from="0" to="-790" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx={CX} cy={CY} r={R} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="26 764" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" from="0" to="-790" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* ── Spokes: card anchors → center logo ── */}
      {anchors.map((a, i) => (
        <g key={`spoke-${i}`}>
          <path d={`M ${a.x} ${a.y} L ${CX} ${CY}`} stroke="#ff4d1f" strokeWidth="6" opacity="0.09" filter="url(#circCometGlow)" />
          <path d={`M ${a.x} ${a.y} L ${CX} ${CY}`} stroke="rgba(255,77,31,0.18)" strokeWidth="2" />
          <path d={`M ${a.x} ${a.y} L ${CX} ${CY}`} stroke="url(#circGrad)" strokeWidth="3.5" strokeDasharray="120 880" strokeLinecap="round" filter="url(#circCometGlow)" pathLength="1000">
            <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </path>
          <path d={`M ${a.x} ${a.y} L ${CX} ${CY}`} stroke="#ffcca8" strokeWidth="2" strokeDasharray="22 978" strokeLinecap="round" pathLength="1000">
            <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="2.4s" begin={`${i * 0.4 + 0.32}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}

      {/* ── Anchor portals (card connections) ── */}
      {anchors.map((a, i) => (
        <g key={`portal-${i}`} transform={`translate(${a.x}, ${a.y})`}>
          <circle r="16" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.2">
            <animate attributeName="r" values="6;20;6" dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle r="9" fill="none" stroke="#ff7a3d" strokeWidth="1.2" opacity="0.4">
            <animate attributeName="r" values="4;12;4" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle r="3.5" fill="#ff4d1f" filter="url(#circDotGlow)" />
          <circle r="1.5" fill="#ffffff" />
        </g>
      ))}

      {/* ── Center logo portal ── */}
      <g transform={`translate(${CX}, ${CY})`}>
        <circle r="26" fill="none" stroke="#ff4d1f" strokeWidth="1" opacity="0.35">
          <animate attributeName="r" values="10;30;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle r="14" fill="none" stroke="#ff7a3d" strokeWidth="1.4" opacity="0.5">
          <animate attributeName="r" values="6;18;6" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle r="4.5" fill="#ff4d1f" filter="url(#circDotGlow)" />
        <circle r="2" fill="#ffffff" />
      </g>
    </svg>
  );
}

/* ── Circular infographic stage: logo center, heading nodes orbiting ── */
function CircularProcess({ steps }: { steps: ProcessStep[] }) {
  const count = steps.length;
  const R = 26;
  const positions = steps.map((_, i) => {
    const angle = (-90 + (i * 360) / count) * (Math.PI / 180);
    return {
      left: 50 + R * Math.cos(angle),
      top: 50 + R * Math.sin(angle),
    };
  });

  const node = (step: ProcessStep) => (
    <TiltCard
      className="h-24 w-24 rounded-full md:h-32 md:w-32"
      maxTilt={14}
      glowColor="rgba(255, 77, 31, 0.25)"
    >
      <div className="group relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full border border-accent/40 bg-[#0e0e0e]/90 px-3 text-center shadow-[0_0_28px_rgba(255,77,31,0.18)] transition-colors duration-300 hover:border-accent/80 hover:bg-[#151515]">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent/80 transition-colors duration-300 group-hover:text-accent">
          {step.number}
        </span>
        <span className="mt-1 text-xs font-bold uppercase leading-tight tracking-wider text-ink transition-colors duration-300 group-hover:text-white md:text-sm">
          {step.title}
        </span>
        <span
          className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </TiltCard>
  );

  return (
    <div className="relative mx-auto w-full max-w-[1100px]">
      {/* Mobile fallback: logo + wrapped nodes */}
      <div className="flex flex-col items-center gap-8 lg:hidden">
        <Image
          src="/images/Logo-01.svg"
          alt="Danie Design"
          width={4167}
          height={1468}
          priority
          className="h-10 w-auto object-contain"
        />
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {steps.map((step) => (
            <div key={step.number}>{node(step)}</div>
          ))}
        </div>
      </div>

      {/* Desktop circular stage */}
      <div className="relative hidden aspect-square w-full lg:block">
        <CircularSvg count={count} radius={R} />

        {/* Center logo */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center p-4 md:p-5">
            <Image
              src="/images/Logo-01.svg"
              alt="Danie Design"
              width={4167}
              height={1468}
              priority
              className="h-10 w-auto object-contain md:h-12"
            />
          </div>
        </div>

        {/* Orbiting heading nodes */}
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="absolute z-10"
            style={{
              left: `${positions[i].left}%`,
              top: `${positions[i].top}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {node(step)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Process & methodology section. In tabbed mode it shows one of four
 * service workflows as two card columns around the logo; in single mode
 * (when `steps` is passed) it renders a circular orbit infographic instead.
 */
export default function Process({
  eyebrow = "Process & Methodology",
  title = "How We Execute Every Discipline.",
  tagline,
  steps,
}: ProcessProps = {}) {
  // Passing `steps` switches from the built-in tabbed processes to a custom circular layout
  const singleMode = !!steps;
  const [activeTab, setActiveTab] = useState(processes[0].id);
  // Locks tab buttons while the exit/enter card transition is playing
  const [isAnimating, setIsAnimating] = useState(false);
  const currentProcess = processes.find((p) => p.id === activeTab) || processes[0];
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const prevTabRef = useRef(processes[0].id);

  // Custom steps are split in half for the two columns (odd step goes left)
  const leftSteps = singleMode
    ? steps!.slice(0, Math.ceil(steps!.length / 2))
    : currentProcess.steps.left;
  const rightSteps = singleMode
    ? steps!.slice(Math.ceil(steps!.length / 2))
    : currentProcess.steps.right;

  // Entrance animation on first mount (re-runs when the visible card set changes)
  const cardSetKey = singleMode ? steps : activeTab;
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = cards.querySelectorAll(".process-card");
      gsap.fromTo(
        items,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
          stagger: { amount: 0.3, from: "start" },
        }
      );
    }, cards);

    return () => ctx.revert();
  }, [cardSetKey]);

  // Tab switch handler with GSAP transition
  const handleTabSwitch = (id: string) => {
    if (singleMode || id === activeTab || isAnimating) return;
    setIsAnimating(true);

    const cards = cardsRef.current;
    if (!cards || prefersReducedMotion()) {
      setActiveTab(id);
      setIsAnimating(false);
      return;
    }

    const items = cards.querySelectorAll(".process-card");

    // Phase 1: EXIT — cards fly out in stagger
    gsap.to(items, {
      opacity: 0,
      y: -18,
      scale: 0.96,
      filter: "blur(4px)",
      duration: 0.3,
      ease: "power2.in",
      stagger: { amount: 0.15, from: "start" },
      onComplete: () => {
        // Swap content
        setActiveTab(id);
        prevTabRef.current = id;

        // Phase 2: ENTER — new cards fly in from below with stagger
        requestAnimationFrame(() => {
          const newItems = cards.querySelectorAll(".process-card");
          gsap.fromTo(
            newItems,
            { opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.5,
              ease: "power3.out",
              stagger: { amount: 0.25, from: "start" },
              onComplete: () => setIsAnimating(false),
            }
          );
        });
      },
    });
  };


  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative border-y border-ink/10 bg-[#0e0e0e] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {singleMode ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Heading — left side */}
            <div className="lg:col-span-5">
              <p className="eyebrow mb-6 flex items-center gap-2 text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{eyebrow}</span>
              </p>

              <SplitText
                as="h2"
                text={title}
                className="display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
              />

              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
                {tagline}
              </p>

              <div className="mt-10 flex items-center gap-6">
                <span className="display text-6xl font-medium text-outline md:text-7xl">
                  {String(steps!.length).padStart(2, "0")}
                </span>
                <span className="max-w-[10rem] text-xs leading-relaxed text-muted">
                  Phases — one connected team from kickoff to growth
                </span>
              </div>
            </div>

            {/* Circular animation — right side */}
            <div ref={cardsRef} className="lg:col-span-7">
              <CircularProcess steps={steps!} />
            </div>
          </div>
        ) : (
          <>
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <p className="eyebrow mx-auto mb-3 flex items-center justify-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{eyebrow}</span>
          </p>

          <SplitText
            as="h2"
            text={title}
            className="display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
          />

          <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-ink/70 md:text-sm">
            {currentProcess.tagline}
          </p>

          {/* Interactive Service Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {processes.map((proc) => {
              const active = proc.id === activeTab;
              const Icon = proc.icon;
              return (
                <button
                  key={proc.id}
                  onClick={() => handleTabSwitch(proc.id)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 md:text-sm ${
                    active
                      ? "bg-accent text-[#0e0e0e] shadow-[0_5px_20px_rgba(255,77,31,0.3)]"
                      : "border border-ink/10 bg-card/60 text-ink/70 hover:border-ink/25 hover:text-ink"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{proc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
            {/* 3-Column Layout: Left Cards | Center Logo | Right Cards */}
            <div className="process-content-grid relative grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-6">

            <SignalSvg left={leftSteps.length} right={rightSteps.length} />

            {/* Cards wrapper — GSAP targets .process-card inside this ref */}
            <div ref={cardsRef} className="contents">

              {/* Left Side Cards */}
              <div className="process-card relative z-10 flex flex-col gap-5 lg:col-span-4">
                {leftSteps.map((step) => (
                  <ProcessCard key={step.number} step={step} />
                ))}
              </div>

              {/* Center Column: Pure Clean Logo */}
              <div className="relative z-10 flex items-center justify-center py-8 lg:col-span-4 lg:py-0">
                <div className="relative flex items-center justify-center p-6">
                  <Image
                    src="/images/Logo-01.svg"
                    alt="Danie Design"
                    width={4167}
                    height={1468}
                    priority
                    className="h-12 w-auto object-contain md:h-14 transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Right Side Cards */}
              <div className="process-card relative z-10 flex flex-col gap-5 lg:col-span-4">
                {rightSteps.map((step) => (
                  <ProcessCard key={step.number} step={step} />
                ))}
              </div>

            </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}