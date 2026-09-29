/**
 * Static demo content for the portfolio / project case studies.
 *
 * These projects are fallback/demo data: the API layer (`lib/api.ts`) returns
 * them on the public work pages and in the admin dashboard whenever the backend
 * is unavailable. The long-form fields (challenge, approach, design,
 * development, outcome) mirror the case-study page layout.
 */

/** Shape of a single project case study as rendered on the work and project detail pages. */
export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  services: string[];
  featured?: boolean;
  /** Manual display position (1 = first); lower numbers appear before higher ones. */
  order?: number;
  challenge: string;
  approach: string;
  design: string;
  development: string;
  outcome: string;
  gallery: string[];
  features?: string[];
  technologies?: string[];
};

/** Demo portfolio case studies; `featured` entries are highlighted on the work landing page. */
export const projects: Project[] = [
  {
    slug: "ember-coffee",
    title: "Ember Coffee",
    category: "Branding",
    year: "2025",
    description:
      "A complete identity and packaging system for a specialty coffee roaster expanding from one city to national retail.",
    image: "https://picsum.photos/seed/danie-ember/1600/1100",
    services: ["Brand Strategy", "Visual Identity", "Packaging"],
    featured: true,
    challenge:
      "Ember was a beloved local roaster with strong coffee and an inconsistent visual presence. As retail orders grew, the brand needed to look as refined as the product — without losing the warmth regulars recognized.",
    approach:
      "We started with positioning workshops and a competitive audit, then distilled the brand into a single idea: fire, patience and craft. Everything — from the logotype to the roast labels — was built around that idea.",
    design:
      "The identity pairs a bold wordmark with a flexible flame motif that scales from a 4mm coffee bag stamp to a storefront sign. A warm, earthy palette and two display typefaces give the brand editorial confidence.",
    development:
      "We built the packaging system as a modular grid, so new roast launches reuse the same structure without a redesign. A Webflow storefront carries the identity through to the checkout experience.",
    outcome:
      "Within eight months, Ember secured placement in 60+ retail locations and reported a 45% lift in direct-to-consumer sales attributed to the rebrand.",
    gallery: ["https://picsum.photos/seed/danie-gallery-01/1200/900", "https://picsum.photos/seed/danie-gallery-02/1200/900", "https://picsum.photos/seed/danie-gallery-03/1200/900"],
    features: [
      "Modular packaging system that scales from bag stamps to storefront signs",
      "A single brand idea — fire, patience and craft — applied across every touchpoint",
      "Warm, earthy palette with two display typefaces for editorial confidence",
      "Webflow storefront carrying the identity through to checkout",
    ],
    technologies: ["Webflow", "Figma", "Adobe Illustrator", "After Effects"],
  },
  {
    slug: "northline-saas",
    title: "Northline",
    category: "UI/UX",
    year: "2025",
    description:
      "End-to-end product design for a B2B analytics platform that cut onboarding time by more than half.",
    image: "https://picsum.photos/seed/danie-northline/1600/1100",
    services: ["UX Research", "Product Design", "Design System"],
    featured: true,
    challenge:
      "Northline's analytics product was powerful but dense. New customers regularly abandoned setup within the first session, and the support team was buried in questions about basic configuration.",
    approach:
      "We ran 18 user interviews, mapped the activation funnel, and rebuilt the product around three job-to-be-done flows instead of a feature list. Every screen was tested in high-fidelity prototypes before development.",
    design:
      "The interface uses a calm, data-dense visual language: large typography for answers, quiet charts, and one accent color reserved for actions. A living design system keeps the team consistent at speed.",
    development:
      "We handed off a React component library with full states, responsive behavior and accessibility notes, then supported the engineering team through two release cycles.",
    outcome:
      "Onboarding completion rose from 34% to 81%, and the support queue around setup dropped by roughly two-thirds within a quarter.",
    gallery: ["https://picsum.photos/seed/danie-gallery-04/1200/900", "https://picsum.photos/seed/danie-gallery-05/1200/900", "https://picsum.photos/seed/danie-gallery-06/1200/900"],
  },
  {
    slug: "vanta-mobile",
    title: "Vanta Finance App",
    category: "Mobile",
    year: "2024",
    description:
      "Mobile app design and development for a personal finance app with 200k+ installs in its first year.",
    image: "https://picsum.photos/seed/danie-vanta/1600/1100",
    services: ["App Design", "Flutter Development", "UX Research"],
    featured: true,
    challenge:
      "Vanta needed to make budgeting feel effortless for people who had never stuck with a finance app. The founding team wanted a product that felt more like a calm daily habit than a spreadsheet.",
    approach:
      "We researched habits around money anxiety, then prototyped a frictionless 'check-in' model: five seconds of interaction per day, with the app doing the heavy analysis in the background.",
    design:
      "The interface leans on generous spacing, soft motion and plain-language copy. A dark-first palette reduces the 'dashboard dread' users reported with competitors.",
    development:
      "Built in Flutter for iOS and Android with a shared codebase, including biometric onboarding, offline transactions and a widget system for glanceable balances.",
    outcome:
      "200k+ installs in year one, a 4.7-star average rating, and a retention curve that beat the category benchmark at every interval.",
    gallery: ["https://picsum.photos/seed/danie-gallery-07/1200/900", "https://picsum.photos/seed/danie-gallery-08/1200/900", "https://picsum.photos/seed/danie-gallery-09/1200/900"],
  },
  {
    slug: "lumen-studio",
    title: "Lumen Studio",
    category: "Web",
    year: "2024",
    description:
      "An award-style editorial website for an architecture practice — heavy imagery, restrained motion, obsessive typography.",
    image: "https://picsum.photos/seed/danie-lumen/1600/1100",
    services: ["Website Design", "Web Development", "Art Direction"],
    featured: true,
    challenge:
      "Lumen's previous site buried its most striking projects under a conventional gallery grid. The practice wanted the website to feel like walking through a well-edited monograph.",
    approach:
      "We structured the site around the project, not the page: full-bleed imagery, generous whitespace and a reading rhythm that slows the visitor down deliberately.",
    design:
      "A near-monochrome system with one accent signals interactive moments. Custom type sizing and careful line length make even dense technical text feel editorial.",
    development:
      "Built on a React front end with a headless CMS, featuring predictive project navigation, lazy-loaded high-resolution imagery and 95+ performance scores across devices.",
    outcome:
      "The site doubled average session time and became the practice's primary source of new inquiries within six months of launch.",
    gallery: ["https://picsum.photos/seed/danie-gallery-10/1200/900", "https://picsum.photos/seed/danie-gallery-11/1200/900", "https://picsum.photos/seed/danie-gallery-12/1200/900"],
  },
  {
    slug: "meridian-market",
    title: "Meridian Market",
    category: "Marketing",
    year: "2023",
    description:
      "A full-funnel digital marketing program that tripled organic revenue for a grocery delivery startup.",
    image: "https://picsum.photos/seed/danie-meridian/1600/1100",
    services: ["SEO", "Content Strategy", "Paid Media"],
    challenge:
      "Meridian had a strong product and almost no organic presence. Search demand existed but competitors owned every head term, and paid acquisition costs were climbing each quarter.",
    approach:
      "We rebuilt their content around shopping intent, launched a technical SEO cleanup, and unified paid social with a single creative system built from the brand identity.",
    design:
      "Campaign creative used the brand's fresh, food-led photography system with short, honest copy — a deliberate contrast to the discount-heavy tone of the category.",
    development:
      "A headless landing-page system let the marketing team launch new campaigns in hours instead of weeks, with built-in A/B testing and analytics hooks.",
    outcome:
      "Organic revenue tripled within nine months, while blended acquisition costs fell 38% over the same period.",
    gallery: ["https://picsum.photos/seed/danie-gallery-13/1200/900", "https://picsum.photos/seed/danie-gallery-14/1200/900", "https://picsum.photos/seed/danie-gallery-15/1200/900"],
  },
  {
    slug: "sable-ceramics",
    title: "Sable Ceramics",
    category: "Branding",
    year: "2023",
    description:
      "Brand identity and art direction for a handmade ceramics studio carried in 40+ independent stores.",
    image: "https://picsum.photos/seed/danie-sable/1600/1100",
    services: ["Brand Identity", "Art Direction", "Social Media Design"],
    challenge:
      "Sable's products were beautiful; its brand was invisible. Wholesale buyers couldn't remember the studio, and social feeds looked like a different brand every week.",
    approach:
      "We built the identity from the material itself — glaze, clay and kiln marks — translating the maker's process into a flexible visual language.",
    design:
      "The system pairs a quiet serif for storytelling with a functional sans for commerce, over a warm, clay-toned palette. Pattern motifs echo the studio's signature glaze textures.",
    development:
      "A complete guidelines package, wholesale sell-sheet templates and social grid system made the brand easy for the small team to run consistently.",
    outcome:
      "Sable grew from 12 to 40+ wholesale accounts in a year and doubled its social audience without paid promotion.",
    gallery: ["https://picsum.photos/seed/danie-gallery-16/1200/900", "https://picsum.photos/seed/danie-gallery-17/1200/900", "https://picsum.photos/seed/danie-gallery-18/1200/900"],
  },
  {
    slug: "arc-legal",
    title: "Arc Legal",
    category: "Web",
    year: "2022",
    description:
      "A conversion-focused website redesign for a litigation firm, with a lead-gen system built on Webflow.",
    image: "https://picsum.photos/seed/danie-arc/1600/1100",
    services: ["Website Design", "Webflow Development", "SEO"],
    challenge:
      "Arc Legal's site looked credible but converted poorly — visitors couldn't tell which practice areas the firm actually led in, and the contact path was buried.",
    approach:
      "We rebuilt the information architecture around practice depth rather than firm history, then engineered every page toward a single, obvious next step.",
    design:
      "A restrained, trustworthy visual system with strong typography and courtroom photography. Trust signals — verdicts, credentials, recognitions — appear consistently near decision points.",
    development:
      "Webflow build with a CMS for case studies, strict technical SEO, and an integrated form pipeline with CRM routing and team notifications.",
    outcome:
      "Consultation requests more than doubled year over year, and organic traffic grew 140% in the first twelve months.",
    gallery: ["https://picsum.photos/seed/danie-gallery-19/1200/900", "https://picsum.photos/seed/danie-gallery-20/1200/900", "https://picsum.photos/seed/danie-gallery-21/1200/900"],
  },
  {
    slug: "pulsewear",
    title: "Pulsewear",
    category: "Mobile",
    year: "2022",
    description:
      "UI/UX and product design for a fitness wearables companion app used by 90k monthly athletes.",
    image: "https://picsum.photos/seed/danie-pulse/1600/1100",
    services: ["UI/UX Design", "Design System", "Prototyping"],
    challenge:
      "Pulsewear's app displayed enormous amounts of biometric data but no guidance. Users opened it, felt overwhelmed, and closed it.",
    approach:
      "We designed around a single question per screen: 'What should I do next?' Research sessions with amateur and competitive athletes shaped a goal-first navigation model.",
    design:
      "A bold, athletic visual language — dense but ordered, with big numbers, high-contrast charts and a dark mode designed first.",
    development:
      "A token-based design system shipped alongside the redesign, cutting the client's UI implementation time on new features by roughly 40%.",
    outcome:
      "Weekly active usage rose 62% after launch, and feature adoption for training plans went from 9% to 41%.",
    gallery: ["https://picsum.photos/seed/danie-gallery-22/1200/900", "https://picsum.photos/seed/danie-gallery-23/1200/900", "https://picsum.photos/seed/danie-gallery-24/1200/900"],
  },
];

/** Filter options for the portfolio grid; "All" is the unfiltered view. */
export const projectCategories = ["All", "Branding", "UI/UX", "Web", "Mobile", "Marketing"];

/**
 * Look up a demo project by its slug.
 *
 * @param slug URL slug of the project to find.
 * @returns The matching project, or undefined when the slug is unknown.
 */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}