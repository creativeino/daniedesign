"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { stats } from "@/data/stats";
import Counter from "@/components/animations/Counter";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const impactItems = [
  {
    number: "01",
    label: "Foundation & Experience",
    value: stats[1].value,
    suffix: stats[1].suffix,
    metricLabel: "Years of Craft",
    title: "A decade of turning ideas into impact.",
    description:
      "Our journey began over 10 years ago with a small team passionate about design and creativity. From those early days, we focused on helping businesses turn ideas into impactful experiences. Over time, we grew, taking on bigger projects, collaborating with startups and established brands alike, and expanding our expertise across design, branding, and digital solutions. Each step of our journey has been guided by a commitment to quality, innovation, and meaningful results, shaping who we are today as a trusted creative partner for businesses worldwide.",
    tag: "Est. 2015",
  },
  {
    number: "02",
    label: "Funding & Growth",
    value: 200,
    suffix: "M+",
    metricLabel: "Funding Raised",
    title: "Backing milestones like $200M+ in funding.",
    description:
      "We help companies grow by providing comprehensive design and development solutions, supporting them to achieve milestones like $200M+ in funding.",
    tag: "$200M+ Raised",
  },
  {
    number: "03",
    label: "Partnership & Loyalty",
    value: stats[2].value,
    suffix: stats[2].suffix,
    metricLabel: "Client Satisfaction",
    title: "98% client satisfaction, built on care.",
    description:
      "Over time, we’ve achieved an average client satisfaction of 98%, a reflection of our commitment to quality and care. While occasional challenges arise, we are transparent, proactive, and always focused on making our clients happy.",
    tag: "5-Star Rating",
  },
  {
    number: "04",
    label: "Engineering & Speed",
    value: stats[3].value,
    suffix: stats[3].suffix,
    metricLabel: "Websites & Applications",
    title: "Responsive websites & apps on any platform.",
    description:
      "We create responsive, user-focused websites and applications on any platform our clients choose, including WordPress, Figma, Webflow, or custom solutions, delivering designs that perform and impress.",
    tag: "60fps Optimized",
  },
  {
    number: "05",
    label: "Team & Expertise",
    value: stats[4].value,
    suffix: stats[4].suffix,
    metricLabel: "In-House Specialists",
    title: "A multidisciplinary team across design & code.",
    description:
      "Our team consists of professional, skilled designers and developers who bring creativity and expertise to every project. From branding and graphic design to responsive websites, apps, and complete digital solutions, we cover all aspects of design and development. Every team member is dedicated to delivering high-quality work, constantly refining their skills, and embracing new challenges to help our clients grow and succeed. With a passion for innovation and a commitment to excellence, we ensure that every project meets the highest standards while driving meaningful results.",
    tag: "Senior In-House Squad",
  },
];

/**
 * Impact metrics section: five editorial stat rows paired with a
 * sticky statement column; scroll position highlights the active row.
 */
export default function ImpactStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Index of the metric row currently in focus (null before first scroll trigger)
  const [activeRow, setActiveRow] = useState<number | null>(null);
  // Vertical offset of the spotlight dot, aligned to the active row's midpoint
  const [dotTop, setDotTop] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    // Track which metric row crosses the viewport middle band (60% → 40%)
    // and move the spotlight dot to that row's vertical center
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".impact-metric-row");
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveRow(i);
              if (containerRef.current) {
                setDotTop(row.offsetTop + row.offsetHeight / 2);
              }
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="relative border-y border-ink/10 bg-[#0e0e0e] text-ink py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Sticky Title & Statement */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4 flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                <span>Impact — Measured</span>
              </p>

              <h2 className="display max-w-md text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl">
                A decade of impact, measured in numbers.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/70 md:text-base">
                We believe exceptional design and robust engineering should produce measurable business outcomes. A decade in, that means 10+ years of craft, $200M+ in funded growth, 98% client satisfaction, and a 25+ person team building for startups and global brands alike.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Impact Rows */}
          <div
            ref={containerRef}
            className="relative flex flex-col pl-8 lg:col-span-7 lg:pl-12"
          >
            {/* Travelling spotlight dot */}
            {dotTop !== null && (
              <span
                className="pointer-events-none absolute left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_20px_rgba(255,77,31,0.75)] transition-[top] duration-500 ease-out"
                style={{ top: dotTop }}
                aria-hidden="true"
              />
            )}

            {impactItems.map((item, idx) => {
              // Only the focused row is emphasized; the others dim back
              const isActive = activeRow === idx;
              const dimmed = activeRow !== null && !isActive;
              return (
                <div
                  key={item.number}
                  className={`group relative border-t border-ink/15 py-10 first:border-t-0 transition-all duration-500 md:py-12 ${
                    dimmed ? "opacity-30" : "opacity-100"
                  }`}
                >
                  {/* Subtle hover background highlight */}
                  <div className="pointer-events-none absolute -inset-x-4 inset-y-0 rounded-2xl bg-card/0 transition-colors duration-300 group-hover:bg-card/40 md:-inset-x-6" />

                  <div className="relative z-10">
                    {/* Top Row: Index & Category & Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-accent">
                          {item.number}
                        </span>
                        <span className="text-ink/20">/</span>
                        <span className="font-mono text-xs uppercase tracking-wider text-ink/60">
                          {item.label}
                        </span>
                      </div>

                      <span className="rounded-full border border-ink/15 bg-paper/60 px-3 py-1 font-mono text-[10px] text-ink/80">
                        {item.tag}
                      </span>
                    </div>

                    {/* Middle: Big Metric Value & Title */}
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <Counter
                          value={item.value}
                          suffix={item.suffix}
                          className={`display block text-5xl font-extrabold tracking-tight transition-transform duration-500 ease-out md:text-6xl ${
                            isActive ? "scale-110 text-accent" : "text-ink"
                          }`}
                        />
                        <span className="mt-1 block font-mono text-xs font-medium uppercase tracking-wider text-accent">
                          {item.metricLabel}
                        </span>
                      </div>
                    </div>

                    <h3
                      className={`display mt-5 text-xl font-semibold transition-colors duration-300 md:text-2xl ${
                        isActive ? "text-accent" : "text-ink"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Bottom Final Row / CTA */}
            <div className="group relative mt-4 border-t border-accent/40 pt-10 md:pt-12">
              <Link
                href="/contact"
                data-cursor="OPEN"
                className="flex flex-col justify-between gap-6 rounded-2xl border border-ink/10 bg-card/60 p-8 backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:shadow-[0_20px_50px_-15px_rgba(255,77,31,0.25)] sm:flex-row sm:items-center sm:p-10"
              >
                <div>
                  <span className="eyebrow text-accent">Next Step</span>
                  <h3 className="display mt-2 text-2xl font-bold text-ink transition-colors group-hover:text-accent md:text-3xl">
                    Your project could be next.
                  </h3>
                  <p className="mt-1 text-xs text-ink/60 md:text-sm">
                    Let&apos;s engineer something unforgettable together.
                  </p>
                </div>

                <span className="group/btn relative inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-full bg-accent px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0e0e0e] shadow-[0_8px_25px_rgba(255,77,31,0.4)] transition-transform duration-300 group-hover:scale-105">
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
                    aria-hidden="true"
                  />
                  <span className="relative">Start the conversation</span>
                  <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
