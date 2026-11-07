/**
 * Static demo content for the clients / social-proof sections.
 *
 * These lists are fallback/demo data: the API layer (`lib/api.ts`) returns them
 * when the backend is unavailable, and the admin dashboard uses their length
 * for placeholder counts.
 */

/** Client names shown in the logo/name marquee and other social-proof strips. */
export const clients: string[] = [
  "Northline",
  "Ember Coffee",
  "Lumen Studio",
  "Vanta Finance",
  "Meridian",
  "Sable Ceramics",
  "Arc Legal",
  "Pulsewear",
  "Halcyon Labs",
  "Orbit Health",
];

/** Hand-picked client quotes used in testimonial sections; only a subset of `clients` appear here. */
export const clientBlurbs = [
  {
    name: "Northline",
    quote:
      "They rebuilt our product experience from the ground up, and our activation numbers prove it.",
  },
  {
    name: "Ember Coffee",
    quote:
      "The rebrand made us look like the company we always knew we were. Retail doors opened almost immediately.",
  },
  {
    name: "Meridian",
    quote:
      "Tripled organic revenue in nine months. The team operates like an extension of our own.",
  },
  {
    name: "Vanta Finance",
    quote:
      "Rare to find a partner this good at both design and engineering. The app simply works.",
  },
];