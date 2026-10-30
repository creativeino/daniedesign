import RelatedWork from "@/components/solutions/RelatedWork";
import Process, { type ProcessStep } from "@/components/home/Process";
import TiltCard from "@/components/animations/TiltCard";
import CountUp from "@/components/animations/CountUp";
import SplitText from "@/components/animations/SplitText";
import Button from "@/components/shared/Button";

type SolutionOutroProps = {
  statsTitle: string;
  stats: { value: number; suffix: string; label: string }[];
  processTitle: string;
  processTagline: string;
  processSteps: ProcessStep[];
  ctaTitle: string;
  ctaCopy: string;
  category: string;
};

export default function SolutionOutro({
  statsTitle,
  stats,
  processTitle,
  processTagline,
  processSteps,
  ctaTitle,
  ctaCopy,
  category,
}: SolutionOutroProps) {
  return (
    <>
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow mb-6">Outcomes</p>
          <SplitText
            as="h2"
            mode="chars"
            text={statsTitle}
            className="display mb-12 max-w-2xl text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <TiltCard
                key={stat.label}
                className="rounded-2xl"
                maxTilt={10}
                glowColor="rgba(255, 77, 31, 0.18)"
              >
                <div className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-panel p-6 transition-colors duration-300 hover:border-accent/40 hover:bg-card">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="display block text-4xl font-medium text-ink transition-colors duration-300 group-hover:text-accent md:text-5xl"
                  />
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-widest text-muted">
                    {stat.label}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <Process
        eyebrow="Process"
        title={processTitle}
        tagline={processTagline}
        steps={processSteps}
      />

      <section className="pb-24 md:pb-32">
        <RelatedWork category={category} />
      </section>

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <TiltCard className="rounded-[2rem]" maxTilt={5} glowColor="rgba(255, 77, 31, 0.25)">
            <div className="group relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2rem] border border-ink/10 bg-panel px-6 py-16 text-center md:px-12 md:py-20 lg:flex-row lg:text-left">
              <div className="max-w-2xl">
                <p className="eyebrow mb-6">Let&apos;s build</p>
                <SplitText
                  as="h2"
                  mode="chars"
                  text={ctaTitle}
                  className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
                />
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                  {ctaCopy}
                </p>
              </div>
              <div className="shrink-0">
                <Button href="/contact" variant="primary" size="lg" animate>
                  Start your project
                </Button>
              </div>
              <span
                className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[100%] group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
          </TiltCard>
        </div>
      </section>
    </>
  );
}