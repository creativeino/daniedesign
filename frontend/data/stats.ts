/**
 * Static demo content for the stats and "impact story" sections.
 *
 * These figures are fallback/demo marketing content: the API layer
 * (`lib/api.ts`) returns them when the backend is unavailable, and the admin
 * dashboard falls back to them for placeholder counts.
 */

/** Shape of a single animated stat block used in the stats counters section. */
export type Stat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

/** Detailed agency stats rendered as animated counters. */
export const stats: Stat[] = [
  {
    value: 160,
    suffix: "+",
    label: "Projects Supported",
    description:
      "Design and development solutions that helped companies grow into recognizable market brands.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Years of Experience",
    description:
      "A journey that began with a small team focused on design and creativity, and grew into branding, design and digital work for startups and established brands.",
  },
  {
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description:
      "An average satisfaction rate built on quality, communication, transparency and proactive handling of challenges.",
  },
  {
    value: 24,
    suffix: "",
    label: "Countries Served",
    description:
      "Responsive, user-focused websites, branding, and applications delivered across 24 countries worldwide.",
  },
  {
    value: 2015,
    suffix: "",
    label: "Active Since",
    description:
      "A multidisciplinary studio covering branding, graphic design, responsive websites, applications and complete digital solutions.",
  },
];

/** Compact two-item stat strip used in the homepage hero. */
export const heroStats = [
  { value: 98, suffix: "%", label: "Client satisfaction and repeat partnerships" },
  { value: 160, suffix: "+", label: "Successful projects across 24 countries" },
];

/** One numbered block of the agency story timeline ("Foundation" through "Partnership"). */
export type ImpactStoryBlock = {
  number: string;
  title: string;
  body: string;
};

/** Numbered narrative blocks for the about-page impact story section. */
export const impactStory: ImpactStoryBlock[] = [
  {
    number: "01",
    title: "Foundation",
    body: "It started with a small team obsessed with design and creativity. What began as a couple of people and a sketchbook grew into a studio serving startups and established brands across the world.",
  },
  {
    number: "02",
    title: "Growth",
    body: "From the first website to complete brand systems — 160+ projects supported, digital products shipped and work delivered across 24 countries.",
  },
  {
    number: "03",
    title: "Craft",
    body: "Design is only half the story. Every pixel is engineered — responsive builds, performance budgets and interfaces that feel as good as they look.",
  },
  {
    number: "04",
    title: "Partnership",
    body: "98% of clients stay. We measure success in repeat partnerships, long-term retainers and the moments a product quietly outperforms the market.",
  },
];