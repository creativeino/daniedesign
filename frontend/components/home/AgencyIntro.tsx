"use client";

import { useState, useEffect } from "react";
import MediaImage from "@/components/shared/MediaImage";
import { motion } from "framer-motion";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";
import Button from "@/components/shared/Button";

const corePillars = [
  "Brand Design",
  "Web Development",
  "Brand Identity",
  "App Development",
  "UI UX Design",
];

const galleryImages = [
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/israel-andrade-YI_9SivVt_s-unsplash-scaled.jpg",
    alt: "Creative team collaborating in the studio",
    label: "Collaborate with a Mad-Talented Team",
    caption: "Building enduring partnerships extending well beyond the deliverable.",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/campaign-creators-gMsnXqILjp4-unsplash-scaled.jpg",
    alt: "Team workshop session",
    label: "Workshops & Creative Sprints",
    caption: "Strategy, design and engineering teams working as one unit.",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2026/01/charlesdeluvio-Lks7vei-eAg-unsplash-1-1-scaled.jpg",
    alt: "Designer reviewing interface layouts",
    label: "Pixel-Perfect Craft",
    caption: "Every interface is designed, tested and refined in-house.",
  },
  {
    src: "https://daniedesign.com/wp-content/uploads/2025/05/ax-about-gallery-01.webp",
    alt: "Danie Design studio gallery",
    label: "Since 2015 — Danie Design",
    caption: "A decade of creative and digital work for growing brands.",
  },
];

/**
 * About/intro section of the homepage: studio mission copy with
 * auto-cycling discipline pills, a rotating gallery image, and verified stat cards.
 */
export default function AgencyIntro() {
  // Index of the currently shown gallery image / discipline pill (both auto-advance below)
  const [active, setActive] = useState(0);
  const [activePillar, setActivePillar] = useState(0);

  // Auto-rotate the gallery every 4s, wrapping back to the first image
  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % galleryImages.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  // Auto-cycle the highlighted core-discipline pill every 2.6s
  useEffect(() => {
    const id = setInterval(
      () => setActivePillar((a) => (a + 1) % corePillars.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section id="agency-intro" className="relative border-b border-ink/10 bg-[#0e0e0e] text-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        
        {/* Left Column: Authentic Story & Mission */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="eyebrow mb-4 flex items-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Since 2015 — About Danie Design</span>
          </p>

          <SplitText
            as="h2"
            text="Crafting digital products with a unique vision to elevate the user experience."
            className="display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
          />

          <p className="mt-6 text-sm leading-relaxed text-ink/70 md:text-base">
            Danie Design is a creative studio dedicated to exploring ideas and transforming them into
            beautifully crafted digital experiences. We provide a seamless space to showcase, refine, and
            bring your digital vision to life. Our mission is to make design intuitive, inspiring, and impactful
            for every user.
          </p>

          <p className="mt-3 text-xs leading-relaxed text-ink/55 md:text-sm">
            As a global creative studio, we know the value of staying ahead. That&apos;s why we collaborate with
            top talent from around the world to bring fresh, innovative ideas and flawless engineering to every project.
          </p>

          {/* Core Discipline Tabs — auto-cycling with sliding active pill */}
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Core disciplines">
            {corePillars.map((pillar, i) => {
              const isActive = i === activePillar;
              return (
                <motion.button
                  key={pillar}
                  type="button"
                  onClick={() => setActivePillar(i)}
                  aria-pressed={isActive}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative rounded-full px-4 py-2 font-mono text-xs font-semibold transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-ink/80 hover:text-accent"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="agency-pillar-active"
                      className="absolute inset-0 rounded-full border border-accent/50 bg-accent/10 shadow-[0_0_22px_rgba(255,77,31,0.28)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 520, damping: 20 }}
                        className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
                      />
                    )}
                    {pillar}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/agency" variant="primary" animate delay={0.1}>
              Explore Full Studio Story
            </Button>

            <Button href="/services" variant="outline" animate delay={0.2}>
              Explore Services
            </Button>
          </div>
        </div>

        {/* Right Column: Studio Showcase & Verified Stats */}
        <div className="flex flex-col justify-center gap-6 lg:col-span-6">
          <TiltCard
            maxTilt={8}
            glowColor="rgba(255, 77, 31, 0.22)"
            className="rounded-3xl"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-card md:aspect-[4/3]">
              {galleryImages.map((img, i) => (
                <MediaImage
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-cover transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === active
                      ? "scale-105 opacity-100"
                      : "scale-100 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/75 via-[#0e0e0e]/10 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span
                  key={`label-${active}`}
                  className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent transition-opacity duration-700"
                >
                  {galleryImages[active].label}
                </span>
                <p
                  key={`caption-${active}`}
                  className="mt-1 font-display text-base font-bold text-white transition-opacity duration-700"
                >
                  {galleryImages[active].caption}
                </p>
              </div>
            </div>
          </TiltCard>

          <div className="grid grid-cols-2 gap-4">
            <TiltCard
              maxTilt={12}
              glowColor="rgba(255, 77, 31, 0.18)"
              className="rounded-2xl"
            >
              <div className="h-full w-full rounded-2xl border border-white/[0.08] bg-[#121214] p-5">
                <p className="display text-3xl font-bold text-accent md:text-4xl">900+</p>
                <p className="mt-1 font-mono text-xs font-semibold text-ink">
                  Clients Worldwide
                </p>
                <p className="mt-1 text-[11px] leading-snug text-ink/50">
                  Thousands plus 5-star reviews on PeoplePerHour &amp; global platforms.
                </p>
              </div>
            </TiltCard>

            <TiltCard
              maxTilt={12}
              glowColor="rgba(255, 77, 31, 0.18)"
              className="rounded-2xl"
            >
              <div className="h-full w-full rounded-2xl border border-white/[0.08] bg-[#121214] p-5">
                <p className="display text-3xl font-bold text-accent md:text-4xl">1,000+</p>
                <p className="mt-1 font-mono text-xs font-semibold text-ink">
                  Completed Projects
                </p>
                <p className="mt-1 text-[11px] leading-snug text-ink/50">
                  98% client satisfaction rate across branding, UI/UX, and apps.
                </p>
              </div>
            </TiltCard>
          </div>
        </div>

      </div>
    </section>
  );
}