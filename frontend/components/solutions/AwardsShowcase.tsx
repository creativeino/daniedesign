"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";

const awardGroups = [
  {
    platform: "Awwwards",
    total: 15,
    since: "Since 2015",
    awards: [
      { name: "Honorable Mention", count: "7x", year: "2015" },
      { name: "Site of the Day", count: "4x", year: "2016" },
      { name: "Developer Awards", count: "2x", year: "2016" },
      { name: "Site of the Year", count: "1x", year: "2019" },
      { name: "Design of the Year", count: "1x", year: "2025" },
    ],
  },
  {
    platform: "CSS Design",
    total: 14,
    since: "Since 2015",
    awards: [
      { name: "Website of the Day", count: "2x", year: "2015" },
      { name: "Best Innovation", count: "1x", year: "2016" },
      { name: "UX Design", count: "5x", year: "2016" },
      { name: "Creative Design", count: "6x", year: "2019" },
    ],
  },
  {
    platform: "Dribbble",
    total: 4,
    since: "Since 2015",
    awards: [
      { name: "Design of the Day", count: "2x", year: "2015" },
      { name: "Site of the Day", count: "2x", year: "2016" },
    ],
  },
  {
    platform: "Behance",
    total: 5,
    since: "Since 2025",
    awards: [{ name: "Featured Design", count: "5x", year: "2025" }],
  },
];

export default function AwardsShowcase() {
  const [active, setActive] = useState(0);
  const grandTotal = awardGroups.reduce((sum, group) => sum + group.total, 0);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Awards</p>
            <SplitText
              as="h2"
              text="We believe in quality, not quantity — that&apos;s why we&apos;re great."
              className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
            />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:justify-self-end">
            <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
              International recognition for craft, UX and creative design —
              earned the slow way, one project at a time.
            </p>
            <div className="flex items-baseline gap-3">
              <span className="display text-5xl font-extrabold text-accent md:text-6xl">
                {grandTotal}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Awards Won
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {awardGroups.map((group, i) => {
            const isActive = active === i;
            return (
              <div
                key={group.platform}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                className={`transition-all duration-500 ${
                  isActive ? "opacity-100" : "opacity-100 pointer-fine:opacity-60"
                }`}
              >
                <TiltCard
                  className="h-full rounded-2xl"
                  maxTilt={5}
                  glowColor="rgba(255, 77, 31, 0.2)"
                >
                  <div
                    className={`group relative flex h-full flex-col border bg-panel p-7 transition-all duration-500 md:p-8 ${
                      isActive
                        ? "border-accent/50 shadow-[0_30px_70px_-30px_rgba(255,77,31,0.4)]"
                        : "border-ink/10"
                    }`}
                  >
                    <span
                      className={`absolute inset-x-0 top-0 h-[2px] origin-left transition-transform duration-500 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      } bg-gradient-to-r from-accent to-transparent`}
                      aria-hidden="true"
                    />

                    <div className="flex items-center justify-between border-b border-ink/10 pb-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${
                            isActive
                              ? "rotate-[360deg] bg-accent text-[#0e0e0e] shadow-[0_0_20px_rgba(255,77,31,0.5)]"
                              : "bg-accent/10 text-accent"
                          }`}
                          aria-hidden="true"
                        >
                          <Trophy className="h-4 w-4" />
                        </span>
                        <h3 className="font-display text-lg font-bold text-ink">
                          {group.platform}
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] text-ink/40">{group.since}</span>
                    </div>

                    <div className="mt-5 flex items-baseline gap-2">
                      <span className="display text-5xl font-extrabold tracking-tight text-ink transition-colors duration-500 group-hover:text-accent">
                        {group.total}
                      </span>
                      <span className="text-xs font-bold text-accent">awards</span>
                    </div>

                    <ul className="mt-6 flex flex-col gap-3.5">
                      {group.awards.map((award, ai) => (
                        <li
                          key={award.name}
                          className="flex items-start justify-between gap-4 text-xs"
                          style={{ transitionDelay: `${ai * 40}ms` }}
                        >
                          <span className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                            {award.name}
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors duration-300 ${
                                isActive
                                  ? "bg-accent text-[#0e0e0e]"
                                  : "bg-accent/15 text-accent"
                              }`}
                            >
                              {award.count}
                            </span>
                            <span className="font-mono text-[10px] text-ink/40">{award.year}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
