// Root layout shared by every public page in the app. It registers the three
// Google fonts (each exposed as a CSS variable consumed via Tailwind), sets the
// site-wide default metadata (child page titles are wrapped by the "%s — Danie
// Design" template), and renders every route inside SiteShell (header, footer,
// cursor and other chrome). Server component — no data fetching here.
import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Roboto, Sora } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

/** Google Analytics 4 measurement ID. */
const GA_ID = "G-NLQT6JTW7G";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daniedesign.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Danie Design — Creative, Design & Web Development Studio",
    template: "%s — Danie Design",
  },
  description:
    "Danie Design is a full-service creative digital agency. We build recognizable brands, high-performance websites, and digital experiences that scale businesses worldwide.",
  applicationName: "Danie Design",
  authors: [{ name: "Danie Design", url: siteUrl }],
  creator: "Danie Design",
  publisher: "Danie Design",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    "branding agency",
    "UI/UX design",
    "web development studio",
    "digital marketing agency",
    "creative studio",
    "Next.js web development",
    "full-stack design agency",
    "brand identity",
    "custom software development",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Danie Design",
    title: "Danie Design — Creative, Design & Web Development Studio",
    description:
      "Full-service creative digital agency. We build recognizable brands, high-performance websites, and digital experiences that scale businesses worldwide.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Danie Design — Creative Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danie Design — Creative, Design & Web Development Studio",
    description:
      "Full-service creative digital agency. We craft enduring brand identities and modern high-speed web platforms.",
    images: ["/images/hero.jpg"],
    creator: "@daniedesign",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Danie Design",
      url: siteUrl,
      logo: `${siteUrl}/images/Logo-01.svg`,
      sameAs: [
        "https://twitter.com/daniedesign",
        "https://www.linkedin.com/company/daniedesign",
        "https://instagram.com/daniedesign",
      ],
      description:
        "Full-service creative digital agency specializing in branding, UI/UX, web development, and digital marketing.",
      foundingDate: "2015",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Danie Design",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${roboto.variable} ${plexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
        {/* Google Analytics (gtag.js) — loaded after hydration, production only,
            so local/dev traffic never skews the live property's stats. */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}