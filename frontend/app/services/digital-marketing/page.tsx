// "/services/digital-marketing" service detail page. Fully static server
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
  title: "Digital Marketing",
  description:
    "Digital growth support combining online marketing, search visibility, strategy and audience research.",
  alternates: {
    canonical: "/services/digital-marketing",
  },
};

export default async function DigitalMarketingPage() {
  const allServices = await getServices();
  const serviceData =
    allServices.find((s) => s.href === "/services/digital-marketing" || s.title.toLowerCase().includes("marketing")) ??
    fallbackServices[3];
  const capabilities = serviceData?.capabilities?.length ? serviceData.capabilities : fallbackServices[3].capabilities;
  return (
    <main>
      <PageHero
        eyebrow="Service — Digital Marketing"
        title="Build Visibility. Create Demand. Grow."
        intro="We turn digital attention into business growth — through search visibility, market research, social channels and campaigns built on strategy, not guesswork."
        meta={[
          { label: "From", value: "Research" },
          { label: "To", value: "Reporting" },
          { label: "Outcome", value: "Growth" },
        ]}
      />

      <section className="flex flex-col gap-24 pb-8 md:gap-32">
        <SplitBlock
          eyebrow="Research & Strategy"
          title="Know the market before spending a dollar."
          copy={[
            "Audience research, competitor analysis and search landscape mapping define where the opportunity actually is. Strategy comes first; channels and budgets follow the evidence.",
          ]}
          image="https://picsum.photos/seed/danie-marketing/1200/900"
          imageAlt="Abstract artwork for marketing strategy"
        />
        <SplitBlock
          eyebrow="SEO & Content"
          title="Be found by people who are already looking."
          copy={[
            "Technical SEO, search-intent content and authority building work together to grow organic visibility — the channel that compounds instead of resetting every month.",
          ]}
          image="https://picsum.photos/seed/danie-marketing-2/1200/900"
          imageAlt="Abstract artwork for SEO"
          reverse
        />
        <SplitBlock
          eyebrow="Campaigns & Social"
          title="Creative that earns the click."
          copy={[
            "Paid campaigns and organic social run on one creative system, built from the brand itself. Consistent visual language, honest copy and constant testing — from awareness to conversion.",
          ]}
          image="https://picsum.photos/seed/danie-marketing-3/1200/900"
          imageAlt="Abstract artwork for campaigns"
        />
        <SplitBlock
          eyebrow="Analytics & Reporting"
          title="Every channel held accountable."
          copy={[
            "We measure what matters — pipeline and revenue, not vanity metrics. Monthly reporting shows what worked, what didn't, and what we're doing about it next.",
          ]}
          image="https://picsum.photos/seed/danie-marketing-4/1200/900"
          imageAlt="Abstract artwork for analytics"
          reverse
        />
      </section>

      <section className="py-24 md:py-32">
        <Capabilities
          title="Marketing capabilities."
          items={capabilities}
        />
      </section>

      <SolutionOutro
        statsTitle="Growth you can track."
        stats={[
          { value: 98, suffix: "%", label: "Client satisfaction" },
          { value: 24, suffix: "", label: "Countries served" },
          { value: 2015, suffix: "", label: "Active since" },
        ]}
        processTitle="The growth process."
        processTagline="Six focused phases — from research to reporting, one connected growth team."
        processSteps={[
          {
            number: "01",
            timeframe: "1 Week",
            title: "Research",
            description:
              "Audience, competitor and search landscape mapping to find the opportunity.",
            deliverables: ["Audience Map", "Competitor Scan", "Search Landscape"],
          },
          {
            number: "02",
            timeframe: "1 Week",
            title: "Strategy",
            description:
              "Channels, budget split and KPIs chosen on evidence, not guesswork.",
            deliverables: ["Channel Plan", "Budget Split", "Success KPIs"],
          },
          {
            number: "03",
            timeframe: "1 Week",
            title: "Campaign Setup",
            description:
              "Tracking, funnels and creative systems wired before spend starts.",
            deliverables: ["Tracking Setup", "Funnels", "Creative Kit"],
          },
          {
            number: "04",
            timeframe: "Ongoing",
            title: "Execution",
            description:
              "Paid, organic and content running on one connected creative system.",
            deliverables: ["Live Campaigns", "Content Calendar", "Community"],
          },
          {
            number: "05",
            timeframe: "Ongoing",
            title: "Optimization",
            description:
              "A/B testing and budget shifting toward what the data rewards.",
            deliverables: ["A/B Tests", "Bid Adjustments", "Creative Refresh"],
          },
          {
            number: "06",
            timeframe: "Monthly",
            title: "Reporting",
            description:
              "Pipeline and revenue reporting — what worked, what didn't, what's next.",
            deliverables: ["Monthly Report", "ROI Analysis", "Next Moves"],
          },
        ]}
        ctaTitle="Ready to turn attention into revenue?"
        ctaCopy="Tell us where your growth is stuck — we'll build the channel plan and hold it accountable."
        category="Marketing"
      />
    </main>
  );
}