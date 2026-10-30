// "/privacy-policy" page. Static server component following the same layout
// language as /agency: PageHero with meta stats, TiltCard summary cards,
// then the full policy as numbered cards with a sticky section index. Policy
// copy lives in the local `sections` array and mirrors what the site actually
// does — contact form + newsletter submissions to the backend, plus Google
// Analytics for traffic stats. Linked from the footer bottom bar.
import type { Metadata } from "next";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";
import Button from "@/components/shared/Button";
import { contact } from "@/data/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Danie Design collects, uses and protects your personal information — what we gather, why, and your rights.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

const tldrCards = [
  {
    icon: ShieldCheck,
    title: "What we collect",
    text: "Only what you send us on purpose — your contact form inquiry and, if you opt in, your newsletter email.",
  },
  {
    icon: Lock,
    title: "How we use it",
    text: "To reply to your project inquiry, follow up honestly, and — if you asked — send occasional newsletter updates.",
  },
  {
    icon: EyeOff,
    title: "What we never do",
    text: "We never sell or rent your data, never run ad trackers, and never bombard your inbox. Full stop.",
  },
];

const effectiveDate = "Last updated: 6 September 2026";

const sections: PolicySection[] = [
  {
    heading: "Who We Are",
    paragraphs: [
      "Danie Design (“we”, “us” or “our”) is a full-service creative digital agency offering branding, UI/UX design, website development and digital marketing. This policy explains how we collect, use and safeguard personal information when you visit our website or interact with us through it.",
    ],
  },
  {
    heading: "Information We Collect",
    paragraphs: [
      "We only collect what you deliberately give us through the forms on this site:",
    ],
    bullets: [
      "Contact form — your name, email address, company name (optional), the service you're interested in and your message.",
      "Newsletter — the email address you submit when subscribing to updates.",
      "Analytics — Google Analytics collects standard visit information (pages viewed, referring site, approximate location, device and browser) so we understand how the site is used.",
      "Admin area — a login token stored in your browser's local storage so authorised team members stay signed in. This applies to our staff only, not to visitors.",
    ],
  },
  {
    heading: "How We Use Your Information",
    bullets: [
      "To respond to project inquiries and get back to you with a clear next step.",
      "To send newsletter updates, if you asked for them.",
      "To keep a record of leads and conversations in our internal CRM so the right people can follow up.",
      "To improve our services and the way we communicate with clients.",
    ],
  },
  {
    heading: "Cookies and Tracking",
    paragraphs: [
      "We use Google Analytics, which sets a first-party analytics cookie to count page views and sessions. It is used for measurement only — not for advertising or cross-site tracking. Beyond that, this website does not set advertising or tracking cookies. We will always update this policy before introducing any new tracking technology.",
    ],
  },
  {
    heading: "How We Share Your Information",
    paragraphs: [
      "We do not sell, rent or trade your personal information. We share it only in these limited cases:",
    ],
    bullets: [
      "With service providers that host our website and store form submissions, strictly to operate the site.",
      "When required by law, or to protect our rights, property or safety.",
    ],
  },
  {
    heading: "Data Retention",
    paragraphs: [
      "Inquiry and newsletter data is kept for as long as needed to serve the purposes described above — typically the life of a client relationship plus a reasonable period afterwards. You can ask us to delete your data at any time (see Contact Us).",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "We protect submissions with reasonable technical and organisational measures, including encrypted transport (HTTPS) and access-controlled administration. No method of transmission or storage is 100% secure, but we work to keep your information safe.",
    ],
  },
  {
    heading: "Your Rights",
    paragraphs: [
      "Where applicable law (such as the GDPR) grants them, you may request access to the personal data we hold about you, ask that it be corrected or deleted, or object to / withdraw consent for its processing. Requests are handled free of charge, usually within 30 days.",
    ],
  },
  {
    heading: "Changes to This Policy",
    paragraphs: [
      "We may update this page from time to time. The effective date at the top of this page always reflects the latest version.",
    ],
  },
];

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal — Privacy Policy"
        title="Your data stays your data."
        intro="The short version: we collect only what you send us through our contact or newsletter forms, plus anonymous traffic stats via Google Analytics. We never sell your data, and there are no advertising trackers on this site. The full details are below."
        meta={[
          { label: "Ad Trackers", value: "None" },
          { label: "Data Selling", value: "Never" },
          { label: "Your Rights", value: "Respected" },
        ]}
      />

      {/* TL;DR */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SplitText
              as="h2"
              text="The privacy promise, in 30 seconds."
              className="display max-w-xl text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
            />
            <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
              No legalese needed for the headline — here&apos;s what this whole
              page comes down to.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {tldrCards.map((card, i) => (
              <TiltCard key={card.title} className="rounded-2xl">
                <div className="group relative h-full border border-ink/10 bg-panel p-7 transition-colors duration-500 hover:border-accent/40 hover:bg-card md:p-8">
                  <span
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-all duration-500 group-hover:bg-accent/25"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] font-bold tracking-widest text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <card.icon className="mt-4 h-7 w-7 text-accent" aria-hidden="true" />
                  <h3 className="display mt-5 text-xl font-bold text-ink transition-colors group-hover:text-accent md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{card.text}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Full Policy */}
      <section className="border-t border-ink/10 bg-panel/40 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6">The Full Policy</p>
              <SplitText
                as="h2"
                text="Everything, spelled out plainly."
                className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
              />
            </div>
            <p className="eyebrow max-w-sm text-muted lg:col-span-5 lg:justify-self-end">
              {effectiveDate}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ── Sticky section index ── */}
            <nav aria-label="Policy sections" className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <h3 className="eyebrow text-accent">On this page</h3>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {[...sections.map((s) => s.heading), "Contact Us"].map(
                    (heading, i) => (
                      <li key={heading}>
                        <a
                          href={`#${sectionId(heading)}`}
                          className="group flex items-baseline gap-3 text-sm text-muted transition-colors duration-300 hover:text-accent"
                        >
                          <span className="font-mono text-[10px] font-bold text-accent/70">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {heading}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </nav>

            {/* ── Policy cards ── */}
            <div className="flex flex-col gap-6 lg:col-span-9">
              {sections.map((section, i) => (
                  <article
                    key={section.heading}
                    id={sectionId(section.heading)}
                    className="group scroll-mt-28 rounded-[1.25rem] border border-ink/10 bg-panel p-7 transition-colors duration-500 hover:border-accent/40 md:p-10"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs font-bold tracking-widest text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="display text-xl font-medium text-ink md:text-2xl">
                        {section.heading}
                      </h4>
                    </div>
                    {section.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="mt-5 max-w-3xl text-sm leading-relaxed text-muted md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="mt-5 flex max-w-3xl flex-col gap-3">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet.slice(0, 40)}
                            className="flex gap-3 text-sm leading-relaxed text-muted md:text-base"
                          >
                            <span
                              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                              aria-hidden="true"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ),
              )}

              {/* Contact card */}
              <article
                id="contact-us"
                className="scroll-mt-28 rounded-[1.25rem] border border-accent/30 bg-card p-7 md:p-10"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs font-bold tracking-widest text-accent">
                    10
                  </span>
                  <h4 className="display text-xl font-medium text-ink md:text-2xl">
                    Contact Us
                  </h4>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
                  If you have questions about this policy, or want to exercise your
                  rights, email us at{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
                  >
                    {contact.email}
                  </a>{" "}
                  — we&apos;ll get back to you.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 text-center md:px-10">
          <p className="eyebrow mb-6">Still Curious?</p>
          <SplitText
            as="h2"
            text="Questions about your data? Ask a human."
            className="display mx-auto max-w-4xl text-3xl font-medium leading-[1.08] tracking-tight md:text-6xl"
          />
          <div className="mt-10">
            <Button href="/contact" variant="primary" size="md">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
