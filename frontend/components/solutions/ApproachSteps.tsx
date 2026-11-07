"use client";

import SplitText from "@/components/animations/SplitText";

const phases = [
  {
    number: "01",
    phase: "Problem Discovery",
    description:
      "Deep exploratory research and stakeholder alignment to ground every creative decision in real user data.",
    items: [
      "Usability Studies",
      "User Interviews",
      "Stakeholder Interviews",
      "Competitive Research",
      "Insights Report",
      "User Journey",
    ],
  },
  {
    number: "02",
    phase: "Design System Ready",
    description:
      "Translating strategic insights into structural architecture, concepts, designs and tested prototypes.",
    items: [
      "Thinking Workshops",
      "Sitemaps",
      "Concepts",
      "Designs",
      "Prototypes",
      "Usability Studies",
    ],
  },
  {
    number: "03",
    phase: "Design Implementation",
    description:
      "Production-grade execution: user flows, annotations and interactions choreographed to 60fps.",
    items: [
      "Design Use Cases",
      "User Flows",
      "Various User Types",
      "Annotations",
      "Interactions",
      "Developer Handoff",
    ],
  },
];

export default function ApproachSteps() {
  return (
    <section className="border-y border-ink/10 bg-panel/40 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Approach</p>
            <SplitText
              as="h2"
              text="Method of making better results."
              className="display text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted lg:col-span-5 lg:justify-self-end md:text-base">
            Three phases. One disciplined framework. Every project moves
            through the same loop: discover, design, implement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <div
              key={phase.number}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113] transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(255,77,31,0.07)]"
            >
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accent via-orange-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

              <div className="relative flex flex-1 flex-col p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/80">
                    Phase {phase.number}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-ink/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                    <span>{phase.phase}</span>
                  </div>
                </div>

                <div className="pointer-events-none absolute right-5 top-3 select-none font-mono text-[72px] font-black leading-none text-white/[0.03] transition-all duration-500 group-hover:text-accent/[0.06]">
                  {phase.number}
                </div>

                <h3 className="mt-5 font-display text-xl font-bold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-white md:text-2xl">
                  {phase.phase}
                </h3>

                <div className="mt-3 h-px w-10 bg-accent/50 transition-all duration-500 group-hover:w-16" />

                <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-ink/55 md:text-sm">
                  {phase.description}
                </p>

                <div className="mt-5 space-y-1.5 border-t border-white/[0.05] pt-4">
                  {phase.items.map((item, i) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-accent/20 bg-accent/5 font-mono text-[8px] font-bold text-accent/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[11px] text-ink/60 transition-colors group-hover:text-ink/80">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}