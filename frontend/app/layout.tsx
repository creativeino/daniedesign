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

export const metadata: Metadata = {
  title: {
    default: "Danie Design — Creative, Design & Digital Marketing for Growing Brands",
    template: "%s — Danie Design",
  },
  description:
    "Danie Design is a full-service creative digital agency. We build recognizable brands, strong websites and digital experiences designed to turn attention into meaningful action.",
  keywords: [
    "branding",
    "UI/UX design",
    "web development",
    "digital marketing",
    "creative agency",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${roboto.variable} ${plexMono.variable}`}
    >
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