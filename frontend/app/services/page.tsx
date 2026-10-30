// "/services" index. Static server component: the four service cards come from
// the @/data/services file and link to the per-discipline pages under
// app/services/, while the six-phase process steps below are hardcoded copy.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import TiltCard from "@/components/animations/TiltCard";
import Process from "@/components/home/Process";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Branding, UI/UX design, website development and digital marketing — four connected services from one creative digital agency.",
  alternates: {
    canonical: "/services",
  },
};

const processSteps = [
  {
    number: "01",
    timeframe: "2–4 Days",
    title: "Discovery",
    description:
      "Deep-dive research, goals mapping, audience analysis and a clear technical scope.",
    deliverables: ["Research Brief", "Audit Report", "Project Scope"],
  },
  {
    number: "02",
    timeframe: "1 Week",
    title: "Strategy",
    description:
      "Positioning, roadmap and the plan that keeps every phase of the project on track.",
    deliverables: ["Positioning Deck", "Project Roadmap", "Success KPIs"],
  },
  {
    number: "03",
    timeframe: "2 Weeks",
    title: "Design",
    description:
      "Identity, UI/UX and creative systems crafted directly around the strategy.",
    deliverables: ["Moodboards", "UI/UX Design", "Design System"],
  },
  {
    number: "04",
    timeframe: "2–3 Weeks",
    title: "Development",
    description:
      "Clean, high-performance builds with silky 60fps interactions and CMS flow.",
    deliverables: ["Frontend Build", "CMS Setup", "API Integration"],
  },
  {
    number: "05",
    timeframe: "3–5 Days",
    title: "Launch",
    description:
      "QA, cloud deploy, DNS and analytics — a flawless, stress-tested go-live.",
    deliverables: ["QA Pass", "Cloud Deploy", "Analytics Setup"],
  },
  {
    number: "06",
    timeframe: "Ongoing",
    title: "Growth",
    description:
      "Marketing, iteration and ROAS scaling to keep the momentum moving forward.",
    deliverables: ["Campaigns", "A/B Testing", "ROI Reports"],
  },
];

export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Everything a growing brand needs, under one roof."
        intro="Four service groups, one connected process. Whether you need a new identity, a product redesign, a high-performance website or a growth program — it all works together."
      />

      <section className="pb-8">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-5 md:grid-cols-2 md:px-10 md:gap-6">
          {services.map((service) => (
            <TiltCard
              key={service.number}
              className="rounded-3xl"
              maxTilt={8}
              glowColor="rgba(255, 77, 31, 0.2)"
            >
              <Link
                href={service.href}
                data-cursor="OPEN"
                className="group relative block h-[420px] overflow-hidden rounded-3xl border border-ink/10 md:h-[520px]"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="photo-duo object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-paper/90 via-paper/20 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 md:p-8">
                  <span className="eyebrow">
                    {service.number} — {service.tagline}
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-ink transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h2 className="display text-4xl font-medium leading-[1.02] tracking-tight text-ink md:text-5xl">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                    {service.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                    Explore {service.title}
                  </span>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      <Process
        eyebrow="How It Works"
        title="One process, from first conversation to launch."
        tagline="Six focused phases — one connected team taking your project from kickoff to growth."
        steps={processSteps}
      />
    </main>
  );
}