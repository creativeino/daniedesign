"use client";

import SplitText from "@/components/animations/SplitText";
import CountUp from "@/components/animations/CountUp";
import FadeUp from "@/components/animations/FadeUp";

export type ProjectStat = {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
};

type ImpactBandProps = {
  /** The outcome text, shown as a large editorial pull quote. */
  quote: string;
  /** Numbers auto-extracted from the outcome, shown as counting stat chips. */
  stats: ProjectStat[];
  projectTitle: string;
};

/**
 * Outcome highlight: the case-study result as a mask-revealed pull quote with
 * animated stat chips, on a spotlighted dark band.
 */
export default function ImpactBand({ quote, stats, projectTitle }: ImpactBandProps) {
  return (
    <section className="grain relative overflow-hidden border-t border-ink/10 py-24 md:py-36">
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[64rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow mb-10 flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          The Outcome
          <span className="h-px flex-1 bg-ink/10" />
        </p>

        <blockquote className="max-w-5xl">
          <SplitText
            text={quote}
            as="p"
            mode="chars"
            className="display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl"
          />
        </blockquote>
        <FadeUp delay={0.4} className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            — {projectTitle}
          </p>
        </FadeUp>

        {stats.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.08}>
                <div className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-panel/80 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-accent/40">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/0 blur-2xl transition-all duration-700 group-hover:bg-accent/15" aria-hidden="true" />
                  <p className="display relative text-5xl font-bold tracking-tight text-ink md:text-6xl">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      duration={2.2}
                      className="text-accent"
                    />
                  </p>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted">
                    {stat.label}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
