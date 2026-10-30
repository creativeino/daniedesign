/**
 * Static contact-page configuration and form option lists.
 *
 * This is fallback/demo content: it feeds the contact page, newsletter and
 * footer social links when the backend is unavailable. Edit these values to
 * change the studio's published contact details site-wide.
 */

/** Contact details, newsletter/legal notes and social profile links. */
export const contact = {
  email: "daniedesignz@gmail.com",
  phone: "+44 7362 042090",
  phoneDisplay: "+44 7362 042090",
  phoneTel: "+447362042090",
  address: "253 Gurney Close, Barking, London IG11 8LB",
  /** Studio location shown in the contact page info boxes. */
  location: "London, United Kingdom",
  locationNote: "Working worldwide, remote-first",
  newsletterNote:
    "Monthly updates on our work, design thinking and brand stories. No spam, unsubscribe anytime.",
  privacyNote:
    "By subscribing you agree to our privacy policy. We never share your data.",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/595929813602598" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/danie-design" },
    { label: "X", href: "https://x.com/daniedesignz" },
    { label: "Dribbble", href: "https://dribbble.com/daniedesign" },
    { label: "Behance", href: "https://www.behance.net/daniedesigns" },
    { label: "Instagram", href: "https://www.instagram.com/danie.designz/" },
    { label: "Pinterest", href: "https://uk.pinterest.com/daniedesignz/" },
  ] as { label: string; href: string }[],
};

/** Options offered in the "service" dropdown of the contact form. */
export const formServices = [
  "Branding",
  "UI/UX Design",
  "Website Development",
  "Digital Marketing",
  "Other",
];

/** Options offered in the "budget" dropdown of the contact form. */
export const formBudgets = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
];