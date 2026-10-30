// "/services/web-development" service detail page. Fully static server
// component — all copy (hero, split sections, capabilities list, outro
// stats/process/CTA) is hardcoded in the JSX below; no data/ imports and no API fetch.
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import SolutionOutro from "@/components/solutions/SolutionOutro";
import { getServices } from "@/lib/api";
import { services as fallbackServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Website Development",
  description:
    "Website and application development across WordPress, Webflow, Laravel, React and Flutter — responsive, fast and built to scale.",
  alternates: {
    canonical: "/services/web-development",
  },
};

export default async function WebDevelopmentPage() {
  const allServices = await getServices();
  const serviceData =
    allServices.find((s) => s.href === "/services/web-development" || s.title.toLowerCase().includes("web")) ??
    fallbackServices[2];
  const capabilities = serviceData?.capabilities?.length ? serviceData.capabilities : fallbackServices[2].capabilities;
  return (
    <main>
      <PageHero
        eyebrow="Service — Web Development"
        title="Turn Creative Ideas Into High-Performance Websites."
        intro="We build responsive websites and digital products on modern platforms and frameworks — engineered for speed, accessibility and growth."
        meta={[
          { label: "From", value: "Discovery" },
          { label: "To", value: "Optimization" },
          { label: "Outcome", value: "Performance" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Technical Planning"
          title="The right platform for the job."
          copy={[
            "WordPress for editorial and commerce, Webflow for design-led marketing sites, React and Laravel for product-grade applications, Flutter when a mobile presence matters most.",
            "We choose the stack based on the business problem — not on what's trendy.",
          ]}
          image="https://picsum.photos/seed/danie-dev/1200/900"
          imageAlt="Abstract artwork for development"
        />
        <SplitBlock
          eyebrow="UI Implementation"
          title="Design, delivered faithfully."
          copy={[
            "The gap between design file and live site is where most projects lose quality. We implement interfaces with disciplined attention to spacing, type, motion and states — so what ships matches what was approved.",
          ]}
          image="https://picsum.photos/seed/danie-dev-2/1200/900"
          imageAlt="Abstract artwork for UI implementation"
          reverse
        />
        <SplitBlock
          eyebrow="Engineering & QA"
          title="Built to be measured."
          copy={[
            "Performance budgets, accessibility checks, responsive testing at every breakpoint and rigorous QA before launch. We build for 90+ Lighthouse scores, not just for pretty screenshots.",
          ]}
          image="https://picsum.photos/seed/danie-dev-3/1200/900"
          imageAlt="Abstract artwork for engineering and QA"
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="Development capabilities."
          items={capabilities}
        />
      </section>

      <SolutionOutro
        statsTitle="Built to be measured."
        stats={[
          { value: 98, suffix: "%", label: "Client satisfaction" },
          { value: 24, suffix: "", label: "Countries served" },
          { value: 2015, suffix: "", label: "Active since" },
        ]}
        processTitle="The development process."
        processTagline="Seven focused phases — from discovery to a fast, scalable site in production."
        processSteps={[
          {
            number: "01",
            timeframe: "2–4 Days",
            title: "Discovery",
            description:
              "Goals, technical audit and platform fit — the stack chosen on evidence.",
            deliverables: ["Technical Audit", "Stack Pick", "Scope Brief"],
          },
          {
            number: "02",
            timeframe: "1 Week",
            title: "Planning",
            description:
              "Architecture, data model, performance budget and the build roadmap.",
            deliverables: ["Architecture", "Data Model", "Roadmap"],
          },
          {
            number: "03",
            timeframe: "2 Weeks",
            title: "Design",
            description:
              "UI implementation planning — tokens, breakpoints and motion specs.",
            deliverables: ["Design Tokens", "Breakpoint Map", "Motion Specs"],
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
            title: "QA",
            description:
              "Cross-browser, responsive and accessibility passes against the budget.",
            deliverables: ["Test Matrix", "Bug Fixes", "A11y Pass"],
          },
          {
            number: "06",
            timeframe: "3–5 Days",
            title: "Launch",
            description:
              "Cloud deploy, DNS, analytics and a stress-tested go-live.",
            deliverables: ["Cloud Deploy", "DNS Setup", "Analytics"],
          },
          {
            number: "07",
            timeframe: "Ongoing",
            title: "Optimization",
            description:
              "Speed, SEO and conversion iteration to keep the site compounding.",
            deliverables: ["Perf Report", "SEO Fixes", "Iteration Cycle"],
          },
        ]}
        ctaTitle="Got a design that needs to ship fast?"
        ctaCopy="Tell us about the build — we'll pick the stack, engineer it properly and put it in production."
        category="Web"
      />
    </main>
  );
}