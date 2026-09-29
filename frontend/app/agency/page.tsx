// "/agency" about page. Static server component: all content is hardcoded in
// this file — the marquee, gallery, stats and team arrays below feed the
// sections directly, and the shared components (ApproachSteps, AwardsShowcase,
// ClientsMarquee) carry their own inline data. No data/ imports, no API fetch.
import type { Metadata } from "next";
import MediaImage from "@/components/shared/MediaImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import SplitText from "@/components/animations/SplitText";
import ImageReveal from "@/components/animations/ImageReveal";
import Counter from "@/components/animations/Counter";
import Marquee from "@/components/animations/Marquee";
import TiltCard from "@/components/animations/TiltCard";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import ApproachSteps from "@/components/solutions/ApproachSteps";
import AwardsShowcase from "@/components/solutions/AwardsShowcase";
import Button from "@/components/shared/Button";

export const metadata: Metadata = {
  title: "About Us — Danie Design",
  description:
    "Since 2015, Danie Design crafts digital products with a unique vision to elevate the user experience. Branding, UI/UX, Web & App Development.",
};

const marqueeItems = [
  "Since 2015",
  "Brand Design",
  "Web Development",
  "Brand Identity",
  "App Development",
  "UI UX Design",
];

const galleryImages = [
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/charlesdeluvio-Lks7vei-eAg-unsplash-1-scaled.jpg",
    alt: "Studio workspace with design screens",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/israel-andrade-YI_9SivVt_s-unsplash-scaled.jpg",
    alt: "Creative team collaborating in the studio",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/charlesdeluvio-Lks7vei-eAg-unsplash-1-1-scaled.jpg",
    alt: "Designer reviewing interface layouts",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/campaign-creators-gMsnXqILjp4-unsplash-scaled.jpg",
    alt: "Team workshop session",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2025/05/ax-about-gallery-01.webp",
    alt: "Danie Design studio gallery",
  },
];

const statCards = [
  {
    value: 900,
    suffix: "+",
    label: "Clients World-wide",
    note: "Thousands plus 5-star reviews on PeoplePerHour & global platforms.",
  },
  {
    value: 1000,
    suffix: "+",
    label: "Completed Projects",
    note: "Branding, UI/UX, websites and apps shipped across 24 countries.",
  },
  {
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    note: "Built on quality, communication, transparency and care.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Years of Craft",
    note: "A decade of creative and digital work for growing brands.",
  },
];

const teamSquad = [
  {
    name: "Danie",
    role: "CEO & Creative Director",
    image: "https://daniedesign.com/wp-content/uploads/2026/01/212-01.jpg",
  },
  {
    name: "Fiona Sid",
    role: "Head of Strategy",
    image: "https://daniedesign.com/wp-content/uploads/2026/01/212-02.jpg",
  },
  {
    name: "Danish",
    role: "Lead Designer",
    image: "https://daniedesign.com/wp-content/uploads/2026/01/212-03.jpg",
  },
  {
    name: "Owais",
    role: "Website And App Developer",
    image: "https://daniedesign.com/wp-content/uploads/2026/01/12121.jpg",
  },
  {
    name: "Ana Dina Belić",
    role: "Graphic Designer",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/team-5.webp",
  },
  {
    name: "Giuseppe Carbonara",
    role: "Brand Strategist",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/team-6.webp",
  },
  {
    name: "Vedran Starčić",
    role: "Jr. Designer",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/team-7.webp",
  },
  {
    name: "Izquierdo Bayà",
    role: "Creative Writer",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/team-8.webp",
  },
  {
    name: "Jared Silverman",
    role: "Motion Designer",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/team-9.webp",
  },
  {
    name: "Samuel Bertain",
    role: "WordPress Developer",
    image: "https://daniedesign.com/wp-content/uploads/2025/05/team-10.webp",
  },
];

export default function AgencyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Since 2015 — About Danie Design"
        title="Crafting digital products with a unique vision to elevate the user experience."
        intro="Danie Design is a creative studio dedicated to exploring ideas and transforming them into beautifully crafted digital experiences. Our mission is to make design intuitive, inspiring, and impactful for every user."
        meta={[
          { label: "Clients World-wide", value: "900+" },
          { label: "Completed Projects", value: "1,000+" },
          { label: "Client Satisfaction", value: "98%" },
        ]}
      />

      {/* Typographic Marquee Band */}
      <section className="border-y border-ink/10 bg-panel/40 py-10 md:py-14">
        <p className="eyebrow mb-6 text-center">
          Design — Development — Marketing — One studio
        </p>
        <Marquee items={marqueeItems} speed={70} separator="✦" />
      </section>

      {/* Studio Gallery */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SplitText
              as="h2"
              text="Inside the studio."
              className="display max-w-md text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
            />
            <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
              A global collective of designers, engineers and strategists
              working as one team — from first sketch to final build.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {galleryImages.map((image, i) => (
              <div
                key={image.src}
                className={i === 0 ? "col-span-2 row-span-2" : "col-span-1"}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-[1.25rem]">
                  <ImageReveal
                    src={image.src}
                    alt={image.alt}
                    className={`relative h-full w-full ${
                      i === 0 ? "min-h-[280px] md:min-h-[420px]" : "h-[140px] md:h-[200px]"
                    }`}
                    imgClassName="photo-duo object-cover transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, 50vw"
                  />
                  <span
                    className="absolute bottom-3 left-3 rounded-full border border-ink/10 bg-paper/70 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-ink backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach: Method of making better result */}
      <ApproachSteps />

      {/* Who are we? */}
      <section className="py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-6">Who are we?</p>
            <SplitText
              as="h2"
              text="We deliver creative ideas to a crowded world."
              className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
            />
            <div className="mt-6 flex flex-col gap-4">
              <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
                As a global creative studio, we know the value of staying ahead. That&apos;s why we
                collaborate with top talent from around the world to bring fresh, innovative ideas to
                every project.
              </p>
              <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
                Collaborate with a super down-to-earth, mad-talented team — a collective bunch working
                on incredible projects and building enduring partnerships that extend well beyond the
                deliverable.
              </p>
            </div>
            <Button href="/services" variant="primary" size="md" className="mt-10">
              Explore Services
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((stat) => (
              <TiltCard key={stat.label} className="rounded-2xl">
                <div className="group relative h-full border border-ink/10 bg-panel p-6 transition-colors duration-500 hover:border-accent/40 hover:bg-card md:p-7">
                  <span
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-all duration-500 group-hover:bg-accent/25"
                    aria-hidden="true"
                  />
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="display block text-4xl font-extrabold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-5xl"
                  />
                  <p className="mt-2 font-mono text-xs font-semibold text-accent">{stat.label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{stat.note}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Statement + Clients */}
      <section className="border-y border-ink/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow mb-6 text-center">Our Promise</p>
          <SplitText
            as="h2"
            text="Help to brands growing up and show their success stories to the world."
            className="display mx-auto max-w-5xl text-center text-3xl font-medium leading-[1.08] tracking-tight md:text-6xl"
          />
        </div>
      </section>
      <ClientsMarquee />

      {/* Awards */}
      <AwardsShowcase />

      {/* Team */}
      <section className="border-y border-ink/10 bg-panel/40 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-6">Team</p>
              <SplitText
                as="h2"
                text="Meet the talented squad behind the creativity."
                className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
              />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted lg:col-span-5 lg:justify-self-end md:text-base">
              Senior directors, brand strategists, UI/UX creators and full-stack
              engineers — one collective, many crafts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {teamSquad.map((member) => (
              <TiltCard
                key={member.name}
                className="rounded-2xl"
                maxTilt={8}
                glowColor="rgba(255, 77, 31, 0.25)"
              >
                <Link
                  href="/contact"
                  data-cursor="OPEN"
                  className="group relative flex h-full flex-col border border-ink/10 bg-panel transition-colors duration-500 hover:border-accent/50"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <MediaImage
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 19vw, 50vw"
                      className="photo-duo object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                    />
                    <span
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 bg-paper/60 text-ink opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e]"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <h3 className="display text-sm font-bold text-ink transition-colors group-hover:text-accent md:text-base">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] text-muted">{member.role}</p>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}