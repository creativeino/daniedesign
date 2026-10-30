// "/services/ui-ux" service detail page. Fully static server component — all
// copy (hero, split sections, capabilities list, outro stats/process/CTA) is
// hardcoded in the JSX below; no data/ imports and no API fetch.
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import SolutionOutro from "@/components/solutions/SolutionOutro";
import { getServices } from "@/lib/api";
import { services as fallbackServices } from "@/data/services";

export const metadata: Metadata = {
  title: "UI/UX Design",
  description:
    "User-focused product and interface design covering research, structure, usability testing and interactive prototypes.",
  alternates: {
    canonical: "/services/ui-ux",
  },
};

export default async function UiUxPage() {
  const allServices = await getServices();
  const serviceData =
    allServices.find((s) => s.href === "/services/ui-ux" || s.title.toLowerCase().includes("ui/ux")) ??
    fallbackServices[1];
  const capabilities = serviceData?.capabilities?.length ? serviceData.capabilities : fallbackServices[1].capabilities;
  return (
    <main>
      <PageHero
        eyebrow="Service — UI/UX Design"
        title="Design Digital Experiences Around Real People."
        intro="We create digital products that are useful and intuitive — grounded in research, structured clearly, prototyped early and tested before they ship."
        meta={[
          { label: "From", value: "Research" },
          { label: "To", value: "Handoff" },
          { label: "Outcome", value: "Clarity" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Research & Strategy"
          title="Understand users before designing screens."
          copy={[
            "Interviews, analytics, competitive review and usability observation — we gather the evidence that turns design decisions from opinions into answers.",
            "The output is a UX strategy: who the product serves, what they're trying to do, and where the product currently fails them.",
          ]}
          image="https://picsum.photos/seed/danie-uiux/1200/900"
          imageAlt="Abstract artwork for UX research"
        />
        <SplitBlock
          eyebrow="Information Architecture & Wireframes"
          title="Structure that makes sense."
          copy={[
            "Before anything looks pretty, the product needs to make sense. We map user flows, define the information architecture and wireframe every key screen in black and white.",
            "This is where the expensive mistakes get caught — on paper, not in production.",
          ]}
          image="https://picsum.photos/seed/danie-uiux-2/1200/900"
          imageAlt="Abstract artwork for wireframing"
          reverse
        />
        <SplitBlock
          eyebrow="Visual Design & Prototyping"
          title="Interfaces people enjoy using."
          copy={[
            "High-fidelity UI design brings the structure to life — typography, color, spacing, motion and states. Clickable prototypes let stakeholders and testers feel the product before a line of production code exists.",
          ]}
          image="https://picsum.photos/seed/danie-uiux-3/1200/900"
          imageAlt="Abstract artwork for interface design"
        />
        <SplitBlock
          eyebrow="Testing & Design Systems"
          title="Prove it, then package it."
          copy={[
            "Usability testing validates the flows with real users, and the fixes feed straight back into the design. A token-based design system keeps the product consistent as it grows — and hands developers everything they need.",
          ]}
          image="https://picsum.photos/seed/danie-uiux-4/1200/900"
          imageAlt="Abstract artwork for usability testing"
          reverse
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="UI/UX capabilities."
          items={capabilities}
        />
      </section>

      <SolutionOutro
        statsTitle="Design that shows up in the numbers."
        stats={[
          { value: 98, suffix: "%", label: "Client satisfaction" },
          { value: 24, suffix: "", label: "Countries served" },
          { value: 2015, suffix: "", label: "Active since" },
        ]}
        processTitle="The design process."
        processTagline="Seven focused phases — from raw research to a developer-ready handoff, one connected design team."
        processSteps={[
          {
            number: "01",
            timeframe: "2–4 Days",
            title: "Research",
            description:
              "Interviews, analytics and usability observation to understand who the product serves.",
            deliverables: ["Research Brief", "User Insights", "Personas"],
          },
          {
            number: "02",
            timeframe: "1 Week",
            title: "User Flows",
            description:
              "Mapping every journey users take through the product — before any screen is designed.",
            deliverables: ["Journey Maps", "Flow Diagrams", "Edge Cases"],
          },
          {
            number: "03",
            timeframe: "5–7 Days",
            title: "Wireframes",
            description:
              "Black-and-white structure for every key screen, so the expensive mistakes stay on paper.",
            deliverables: ["Low-fi Wireframes", "IA Map", "Annotations"],
          },
          {
            number: "04",
            timeframe: "2 Weeks",
            title: "Visual Design",
            description:
              "High-fidelity UI — typography, color, spacing, motion and states that people enjoy using.",
            deliverables: ["UI Screens", "Style Guide", "Motion Specs"],
          },
          {
            number: "05",
            timeframe: "1 Week",
            title: "Prototype",
            description:
              "Clickable prototypes that let stakeholders feel the product before code exists.",
            deliverables: ["Interactive Prototype", "Handoff Deck", "Logic Notes"],
          },
          {
            number: "06",
            timeframe: "3–5 Days",
            title: "Testing",
            description:
              "Usability tests with real users — fixes feed straight back into the design.",
            deliverables: ["Test Scripts", "Findings Report", "Fix Log"],
          },
          {
            number: "07",
            timeframe: "3 Days",
            title: "Handoff",
            description:
              "A token-based design system and developer-ready assets for a seamless build.",
            deliverables: ["Design System", "Dev Specs", "Asset Pack"],
          },
        ]}
        ctaTitle="Have a product that deserves better UX?"
        ctaCopy="Tell us where your users get stuck — we'll turn it into a flow they enjoy."
        category="UI/UX"
      />
    </main>
  );
}