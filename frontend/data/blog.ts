/**
 * Static demo content for the blog.
 *
 * These posts are fallback/demo data: they render on the public blog pages and
 * in the admin dashboard whenever the backend API is unavailable. The API layer
 * (`lib/api.ts`) returns them in place of live records on request failure.
 */

/** Shape of a single blog post as rendered on the blog listing and post pages. */
export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  featured?: boolean;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
};

/** Demo blog posts, newest first; `featured` posts are highlighted on the blog landing page. */
export const blogPosts: BlogPost[] = [
  {
    slug: "what-a-full-service-marketing-agency-can-do-for-your-brand",
    title: "What a Full-Service Marketing Agency Can Do for Your Brand",
    category: "Digital Agency",
    date: "May 2025",
    readTime: "4 min read",
    excerpt:
      "Discover the comprehensive capabilities of an end-to-end design and engineering studio, from brand architecture to custom web development and growth marketing.",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-05.jpg",
    featured: true,
    content: [
      {
        heading: "Full-Spectrum Creative & Engineering Alignment",
        paragraphs: [
           "Myriam was first trained as a sculptor in Montreal and then in Helsinki, Finland. She is now based in Quebec but works for clients all around the globe. From textile design to murals, editorial illustrations and book covers, her style is recognized by her simple and perfectly arranged shapes as well as her rich and vibrant color palette.",
           "Always ready to push the boundaries, especially when it comes to our own platform, our analytical eye creates sites that are visually engaging and also optimized for maximum performance. It perfectly reflects the journey to help your brand tell a story that increases understanding and drives decisive action.",
        ],
      },
      {
        heading: "Typography Hierarchy & Visual Order",
        paragraphs: [
          "Beckoning a diverse audience of customers who demand bold, premium experiences. The unique blend of quirkiness and personality sets a brand apart, establishing its distinct place in competitive markets.",
          "Visual hierarchy is the fundamental principle of arranging elements to show their order of importance. By laying out elements logically and strategically, visitors navigate complex value propositions effortlessly.",
        ],
      },
      {
        heading: "Deep Execution & Streamlined ROI",
        paragraphs: [
          "Achieving deep work is our primary mission across every project. Full-service execution replaces fragmented communication with multiple freelancers by delivering unified strategy, high-speed code, and continuous conversion optimization.",
        ],
      },
    ],
  },
  {
    slug: "various-ideas-and-creative-concepts-based-on-market-research",
    title: "Various Ideas and Creative Concepts Based on Market Research",
    category: "Creative Strategy",
    date: "May 2025",
    readTime: "5 min read",
    excerpt:
      "Simple, perfectly arranged shapes combined with a rich, vibrant aesthetic. How deep market intelligence fuels innovative brand concepts that convert.",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-03.jpg",
    content: [
      {
        heading: "Market Research as the Creative Anchor",
        paragraphs: [
          "Creative concepts only succeed commercially when rooted in authentic consumer behavior. By analyzing competitor positioning and identifying whitespace opportunities, design transitions from subjective decoration into a high-performing revenue engine.",
          "Our research frameworks uncover what your target audience values most before writing a single line of code or designing the first artboard.",
        ],
      },
      {
        heading: "Rapid Concept Prototyping & Validation",
        paragraphs: [
          "From moodboard directions to clickable interactive prototypes, rapid iterative testing allows senior squads to validate user assumptions early in the product lifecycle.",
          "By arranging design tokens and layout grids systematically, we ensure brand consistency across web, mobile, and social touchpoints.",
        ],
      },
    ],
  },
  {
    slug: "the-role-of-a-marketing-agency-in-scaling-your-startup",
    title: "The Role of a Marketing Agency in Scaling Your Startup",
    category: "Startup Growth",
    date: "May 2025",
    readTime: "4 min read",
    excerpt:
      "Why early-stage startups need a specialized digital agency partner to accelerate product-market fit, acquisition funnels, and enterprise brand credibility.",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-04.jpg",
    content: [
      {
        heading: "Transitioning from MVP to Scalable Market Leader",
        paragraphs: [
          "Startups often launch with functional MVPs that lack visual credibility. A dedicated design and engineering partner builds the bespoke design systems, high-speed landing pages, and conversion architecture necessary to close enterprise accounts and raise capital.",
          "Execution speed is the ultimate startup superpower. Partnering with an agile senior squad eliminates internal hiring friction and multiplies launch velocity.",
        ],
      },
      {
        heading: "Acquisition Funnels and Performance Optimization",
        paragraphs: [
          "Sustainable scaling requires repeatable customer acquisition channels. Aligning landing page messaging with targeted multi-channel campaigns ensures lower CAC and higher lifetime value.",
        ],
      },
    ],
  },
  {
    slug: "the-ultimate-guide-to-choosing-the-right-startup-agency-for-your-new-business",
    title: "The Ultimate Guide to Choosing the Right Startup Agency for Your New Business",
    category: "Strategy",
    date: "May 2025",
    readTime: "6 min read",
    excerpt:
      "A practical founder's framework for evaluating agency portfolios, technical engineering standards, sprint workflows, and transparent pricing models.",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-08.jpg",
    content: [
      {
        heading: "Evaluating Portfolios Beyond Surface Aesthetics",
        paragraphs: [
          "Look for measurable case studies, live production websites, and client testimonials that demonstrate real business impact rather than static mockups.",
          "Engineering standards matter: ensure your agency partner builds with modern production tech like Next.js 16, TypeScript, clean semantic CSS, and responsive layouts.",
        ],
      },
      {
        heading: "Direct Senior Access vs Agency Layers",
        paragraphs: [
          "Prioritize agencies that provide direct collaboration with senior creators and developers without layers of account management slowing down iteration cycles.",
        ],
      },
    ],
  },
];

/**
 * Look up a demo blog post by its slug.
 *
 * @param slug URL slug of the post to find.
 * @returns The matching post, or undefined when the slug is unknown.
 */
export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}