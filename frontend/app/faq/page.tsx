// "/faq" page. Static server component in the same layout language as
// /privacy-policy: PageHero with meta stats, then a sticky intro column
// (SplitText heading + count) beside the interactive FaqList — a client
// accordion with category chips and search. Questions are answered from what
// the site actually offers (services data, ApproachSteps phases, agency
// stats, contact + privacy pages). Linked from the navbar.
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import SplitText from "@/components/animations/SplitText";
import FaqList, { type FaqItem } from "@/components/shared/FaqList";
import Button from "@/components/shared/Button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about our services, process, pricing and how we work with clients worldwide.",
  alternates: {
    canonical: "/faq",
  },
};

const faqCategories = ["General", "Services", "Process", "Working Together"];

const faqItems: FaqItem[] = [
  {
    category: "General",
    question: "Who is Danie Design?",
    answer:
      "We're a full-service creative digital agency, active since 2015. We handle branding, UI/UX design, website development and digital marketing under one roof. So far we've shipped 160+ projects across 24 countries with a 98% client satisfaction rate.",
  },
  {
    category: "General",
    question: "Do you work with international clients?",
    answer:
      "Yes, international client relationships are core to how we work. Our team is a global collective of designers, engineers and strategists, so we're set up for remote collaboration, clear async updates and overlapping working hours.",
  },
  {
    category: "General",
    question: "Can I see your past work?",
    answer:
      "Absolutely. Browse selected case studies on our Portfolio page, and read our thinking on design, branding and growth on the Blog. If you want detail on a specific project, contact us and we'll happily walk you through relevant work.",
  },
  {
    category: "Services",
    question: "What services do you offer?",
    popular: true,
    answer:
      "Four pillars. Branding covers strategy, identity, creative direction and graphic design. UI/UX Design covers research, wireframing, prototyping, usability testing and mobile app design. Website Development covers the build itself. And Digital Marketing covers SEO, strategy, market research and social media.",
  },
  {
    category: "Services",
    question: "Which technologies do you build with?",
    answer:
      "For web we work with WordPress, Webflow, Laravel, React and React.js. For apps, Flutter and mobile application development. We also build design systems so products stay consistent as they grow. We pick the stack for the project, not the other way round.",
  },
  {
    category: "Services",
    question: "Can you handle both branding and the website?",
    answer:
      "Yes, and that's where we're strongest. Strategy, identity, design, development and marketing all run through one team, so the brand story doesn't get lost between the logo file and the live website.",
  },
  {
    category: "Process",
    question: "How does a project start?",
    answer:
      "With a conversation about your business, your challenge and your goals. From there we follow our approach: Problem Discovery (user, stakeholder and competitive research, journey and insights), then a Design System foundation, then Design Implementation. Every creative decision gets grounded in real user data.",
  },
  {
    category: "Process",
    question: "How long does a typical project take?",
    popular: true,
    answer:
      "It depends on scope. A focused brand identity or landing page runs weeks, while full products with research, design systems and development take longer. When you send an inquiry we'll come back with an honest timeline for what you're actually trying to build.",
  },
  {
    category: "Process",
    question: "How does pricing work?",
    popular: true,
    answer:
      "Projects are quoted per scope after we understand your goals, and there are no surprise fees. Our inquiry form offers typical budget brackets (under $5k, $5k–$15k, $15k–$50k, $50k+) as a starting point. Whatever your range, tell us and we'll be straight about what's achievable.",
  },
  {
    category: "Working Together",
    question: "Do you offer ongoing support after launch?",
    popular: true,
    answer:
      "Yes. Many clients keep us on for digital marketing, iteration and growth work after a site or product launches. We see launches as milestones, not endings, and our partnerships usually extend well beyond the deliverable.",
  },
  {
    category: "Working Together",
    question: "What happens to my data when I contact you?",
    answer:
      "Your inquiry details go straight to our team and are stored only so we can respond and follow up. We don't sell data, the site uses Google Analytics just to measure traffic (no ad trackers), and you can ask us to delete your information anytime. The full details are in our Privacy Policy.",
  },
  {
    category: "Working Together",
    question: "How do we get started?",
    answer:
      "Send us an inquiry through the contact form. Tell us about your business, the challenge you're facing and where you want to be. We'll come back with honest thoughts and a clear next step. No pressure, no jargon.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="FAQ & Answers"
        title="Questions, answered."
        intro="Everything people usually ask before working with us: services, process, pricing and how we collaborate. Can&apos;t find yours? A real human replies to every inquiry."
        meta={[
          { label: "Categories", value: String(faqCategories.length) },
          { label: "Questions", value: String(faqItems.length) },
          { label: "Hidden Fees", value: "None" },
        ]}
      />

      {/* Full FAQ */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ── Sticky intro column ── */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow mb-6 text-accent">Frequently Asked</p>
                <SplitText
                  as="h2"
                  text="The straight answers, no legalese."
                  className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl"
                />
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted md:text-base">
                  Filter by topic or search for what you need. If your question
                  isn&apos;t here, it probably deserves a personal answer, and
                  that&apos;s fine too.
                </p>
                <Button href="/contact" variant="primary" size="md" className="mt-8">
                  Ask Us Anything
                </Button>
              </div>
            </div>

            {/* ── Interactive list ── */}
            <div className="lg:col-span-8">
              <FaqList items={faqItems} categories={faqCategories} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
