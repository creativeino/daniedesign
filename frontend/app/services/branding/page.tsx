// "/services/branding" service detail page. Fully static server component —
// all copy (hero, split sections, capabilities list, outro stats/process/CTA)
// is hardcoded in the JSX below; no data/ imports and no API fetch.
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitBlock from "@/components/solutions/SplitBlock";
import Capabilities from "@/components/solutions/Capabilities";
import SolutionOutro from "@/components/solutions/SolutionOutro";
import { getServices } from "@/lib/api";
import { services as fallbackServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Branding",
  description:
    "Brand strategy, creative direction and visual identity that give growing businesses a recognizable and consistent presence.",
  alternates: {
    canonical: "/services/branding",
  },
};

export default async function BrandingPage() {
  const allServices = await getServices();
  const serviceData =
    allServices.find((s) => s.href === "/services/branding" || s.title.toLowerCase().includes("branding")) ??
    fallbackServices[0];
  const capabilities = serviceData?.capabilities?.length ? serviceData.capabilities : fallbackServices[0].capabilities;
  return (
    <main>
      <PageHero
        eyebrow="Service — Branding"
        title="Build a Stronger Brand Foundation."
        intro="We help businesses clarify their identity, position and visual language — then build the systems that keep the brand consistent everywhere it shows up."
        meta={[
          { label: "From", value: "Strategy" },
          { label: "To", value: "Rollout" },
          { label: "Outcome", value: "Clarity" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Brand Strategy"
          title="Positioning before pixels."
          copy={[
            "A recognizable brand starts with a clear answer to a simple question: what makes you different, and who cares? We map your market, your audience and your competitors before a single logo sketch.",
            "The result is a strategy document the whole team can stand behind — and a brief that makes creative decisions faster and easier.",
          ]}
          image="https://picsum.photos/seed/danie-branding/1200/900"
          imageAlt="Abstract artwork for brand strategy"
        />
        <SplitBlock
          eyebrow="Creative Direction"
          title="One vision, executed everywhere."
          copy={[
            "Creative direction connects strategy to execution. We define the tone, the art direction and the rules of the road so that a website, a packaging line and a social feed all feel like the same brand.",
          ]}
          image="https://picsum.photos/seed/danie-branding-2/1200/900"
          imageAlt="Abstract artwork for creative direction"
          reverse
        />
        <SplitBlock
          eyebrow="Visual Identity"
          title="A system, not a logo."
          copy={[
            "Identity work covers the logo, color, typography, layout grids and imagery. But what makes it valuable is the system: flexible enough for new products and campaigns, strict enough to stay recognizable.",
            "We deliver the full toolkit — from the mark itself to the guidelines that keep it consistent.",
          ]}
          image="https://picsum.photos/seed/danie-branding-3/1200/900"
          imageAlt="Abstract artwork for visual identity"
        />
        <SplitBlock
          eyebrow="Applications"
          title="Built to be used."
          copy={[
            "A brand only matters where people meet it. We design the applications that carry the identity into the world — packaging, stationery, social media assets, presentations, signage and digital surfaces.",
            "Everything ships with templates and guidelines, so your team can execute without us in the room.",
          ]}
          image="https://picsum.photos/seed/danie-branding-4/1200/900"
          imageAlt="Abstract artwork for brand applications"
          reverse
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="Branding capabilities."
          items={capabilities}
        />
      </section>

      <SolutionOutro
        statsTitle="Identity work that compounds."
        stats={[
          { value: 98, suffix: "%", label: "Client satisfaction" },
          { value: 24, suffix: "", label: "Countries served" },
          { value: 2015, suffix: "", label: "Active since" },
        ]}
        processTitle="The branding process."
        processTagline="Six focused phases — from first conversation to a brand that ships everywhere."
        processSteps={[
          {
            number: "01",
            timeframe: "2–4 Days",
            title: "Discovery",
            description:
              "Stakeholder interviews, market mapping and brand audit to find the real gap.",
            deliverables: ["Brand Audit", "Market Map", "Kickoff Brief"],
          },
          {
            number: "02",
            timeframe: "1 Week",
            title: "Strategy",
            description:
              "Positioning, personality and messaging that the whole brand hangs on.",
            deliverables: ["Positioning Deck", "Personality", "Messaging"],
          },
          {
            number: "03",
            timeframe: "5–7 Days",
            title: "Concept",
            description:
              "Two creative directions — moodboards and visual routes to react against.",
            deliverables: ["Moodboards", "Concept Routes", "Direction Pick"],
          },
          {
            number: "04",
            timeframe: "2 Weeks",
            title: "Identity Development",
            description:
              "Logo, color, type and layout grids crafted into a working identity system.",
            deliverables: ["Logo Suite", "Color & Type", "Layout Grids"],
          },
          {
            number: "05",
            timeframe: "1 Week",
            title: "Guidelines",
            description:
              "The rules of the road — a brand book that keeps everything recognizable.",
            deliverables: ["Brand Book", "Usage Rules", "Templates"],
          },
          {
            number: "06",
            timeframe: "Ongoing",
            title: "Brand Rollout",
            description:
              "Applications and assets that carry the identity into the real world.",
            deliverables: ["Applications", "Asset Library", "Launch Kit"],
          },
        ]}
        ctaTitle="Have a brand that looks like everyone else?"
        ctaCopy="Tell us where you are today — we'll map the identity system that makes you unmistakable."
        category="Branding"
      />
    </main>
  );
}