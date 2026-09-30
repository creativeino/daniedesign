// "/work/[slug]" — full case-study page. Server component.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Target, Lightbulb, PenTool, Code2, Sparkles } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { getProjectBySlug, getProjects } from "@/lib/api";
import FadeUp from "@/components/animations/FadeUp";
import TiltCard from "@/components/animations/TiltCard";
import RollNumber from "@/components/animations/RollNumber";
import ProjectHero from "@/components/portfolio/ProjectHero";
import GalleryDeck from "@/components/portfolio/GalleryDeck";
import ScrollProgress from "@/components/portfolio/ScrollProgress";
import ParallaxFrame from "@/components/portfolio/ParallaxFrame";
import ImpactBand, { type ProjectStat } from "@/components/portfolio/ImpactBand";
import ChapterRail from "@/components/portfolio/ChapterRail";
import MediaImage from "@/components/shared/MediaImage";
import { isVideoUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjectBySlug(slug)) ?? getProject(slug);
  if (!project) return { title: "Project Not Found" };
  return { title: project.title, description: project.description };
}

/** Narrative steps; "outcome" is promoted to its own ImpactBand section. */
const NARRATIVE_STEPS = [
  { key: "challenge", label: "The Challenge", icon: Target, color: "text-red-400", note: "Where we started" },
  { key: "approach", label: "Our Approach", icon: Lightbulb, color: "text-amber-400", note: "How we thought" },
  { key: "design", label: "The Design", icon: PenTool, color: "text-purple-400", note: "How it took shape" },
  { key: "development", label: "In Development", icon: Code2, color: "text-blue-400", note: "How it was built" },
] as const;

/**
 * Pull up-to-three metric highlights out of the outcome copy so the ImpactBand
 * can animate them as counting stats ("45% lift…" → 45% + "lift in …").
 */
function extractStats(text: string): ProjectStat[] {
  const re = /(\d+(?:\.\d+)?)\s*(k\+|%|\+|x|X)?/g;
  const stats: ProjectStat[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null && stats.length < 3) {
    const value = parseFloat(m[1]);
    if (!Number.isFinite(value)) continue;
    const suffix = m[2] === "X" ? "x" : m[2] ?? "";
    const decimals = (m[1].split(".")[1] ?? "").length;
    const label =
      text
        .slice(m.index + m[0].length)
        .match(/^[,.\s]*([A-Za-z][A-Za-z'’/-]+(?:\s+[A-Za-z][A-Za-z'’/-]+){0,4})/)?.[1]
        .toLowerCase() ?? "";
    if (label.length < 3) continue;
    stats.push({ value, suffix, decimals, label });
  }
  return stats;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = (await getProjectBySlug(slug)) ?? getProject(slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const activeIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(activeIndex + 1 + allProjects.length) % allProjects.length] ?? project;
  const prevProject = allProjects[(activeIndex - 1 + allProjects.length) % allProjects.length] ?? project;

  const steps = NARRATIVE_STEPS.map((s, i) => ({
    ...s,
    index: i + 1,
    body: (project[s.key] ?? "").trim(),
  })).filter((s) => s.body.length > 0);

  const outcome = (project.outcome ?? "").trim();
  const stats = outcome ? extractStats(outcome) : [];
  const chapters = steps.map((s) => ({ key: s.key, label: s.label }));

  // Gallery video doubles as the project's animated cover (hero + plate);
  // the cover image stays as its poster.
  const coverVideo = project.gallery?.find((url) => isVideoUrl(url));

  return (
    <main>
      <ScrollProgress />

      <ProjectHero
        image={project.image}
        video={coverVideo}
        title={project.title}
        category={project.category}
        year={project.year}
        description={project.description}
        services={project.services}
      />

      {/* ── Facts Strip ─────────────────────────────────────────────────── */}
      <section className="border-y border-ink/10 bg-panel/50">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px px-5 md:grid-cols-4 md:px-10">
          {[
            { label: "Discipline", value: project.category, num: "01" },
            { label: "Year", value: project.year, num: "02" },
            { label: "Scope", value: `${project.services.length} service${project.services.length === 1 ? "" : "s"}`, num: "03" },
            { label: "Stack", value: project.technologies?.length ? `${project.technologies.length} technologies` : "Full-stack", num: "04" },
          ].map((fact, i) => (
            <FadeUp key={fact.label} delay={i * 0.06} className="group relative py-7 md:py-9 md:not-first:border-l md:not-first:border-ink/10 md:pl-6">
              <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full md:left-6" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-accent/60">{fact.num}</span>
                <p className="eyebrow">{fact.label}</p>
              </div>
              <p className="display mt-2 text-lg font-semibold text-ink md:text-xl">{fact.value}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Full-width project image, parallax plate ────────────────────── */}
      {project.image && (
        <ParallaxFrame
          src={project.image}
          video={coverVideo}
          alt={`${project.title} — full project view`}
          caption={`${project.title} — ${project.year}`}
        />
      )}

      {/* ── Narrative ───────────────────────────────────────────────────── */}
      {steps.length > 0 && (
        <section className="relative py-20 md:py-32">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <FadeUp className="mb-12 md:mb-16">
              <p className="eyebrow mb-4 flex items-center gap-3">
                Case Study
                <span className="h-px flex-1 bg-ink/10" />
              </p>
              <p className="display text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">
                The story <span className="text-accent">behind</span> the work.
              </p>
            </FadeUp>

            <div className="md:grid md:grid-cols-[16rem_1fr] md:gap-16">
              {/* Sticky chapter rail + project meta */}
              <div className="mb-10 md:mb-0">
                <div className="sticky top-32">
                  {chapters.length > 1 && (
                    <div className="mb-6 hidden md:block">
                      <p className="eyebrow mb-3">Chapters</p>
                      <ChapterRail chapters={chapters} />
                    </div>
                  )}
                  <div className="rounded-2xl border border-ink/10 bg-panel/60 p-6">
                    <p className="eyebrow mb-2">Project</p>
                    <p className="display text-xl font-semibold leading-tight text-ink">
                      {project.title}
                    </p>
                    <p className="mt-1.5 text-sm text-muted">
                      {project.category} · {project.year}
                    </p>
                    <div className="my-4 h-px bg-ink/10" />
                    <p className="eyebrow mb-2">Services</p>
                    <div className="space-y-1.5">
                      {project.services.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          <p className="text-xs text-muted">{service}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="flex flex-col">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <FadeUp key={step.key}>
                      <div
                        id={`step-${step.key}`}
                        className="group relative scroll-mt-32 border-t border-ink/10 py-10 first:border-t-0 first:pt-0 md:py-14"
                      >
                        <span
                          className="display pointer-events-none absolute -top-2 right-0 select-none text-[7rem] font-bold leading-none text-ink/[0.03] transition-colors duration-700 group-hover:text-accent/[0.07] md:text-[9rem]"
                          aria-hidden="true"
                        >
                          {String(step.index).padStart(2, "0")}
                        </span>
                        <div className="relative flex items-start gap-5">
                          <div className="relative shrink-0">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-panel transition-all duration-500 group-hover:-rotate-6 group-hover:border-accent/30 group-hover:bg-accent/10">
                              <Icon className={`h-5 w-5 ${step.color}`} />
                            </span>
                            {i < steps.length - 1 && (
                              <div className="absolute left-1/2 top-full h-10 w-px -translate-x-1/2 bg-gradient-to-b from-ink/10 to-transparent" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-accent">
                                {String(step.index).padStart(2, "0")}
                              </span>
                              <p className="eyebrow">{step.label}</p>
                              <span className="hidden font-mono text-[10px] tracking-[0.15em] text-ink/25 lg:inline">
                                · {step.note}
                              </span>
                            </div>
                            <p className="display max-w-3xl text-lg font-medium leading-[1.6] tracking-tight text-ink/85 md:text-xl">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </FadeUp>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Impact / Outcome ────────────────────────────────────────────── */}
      {outcome && <ImpactBand quote={outcome} stats={stats} projectTitle={project.title} />}

      {/* ── Key Features ────────────────────────────────────────────────── */}
      {project.features && project.features.length > 0 && (
        <section className="relative border-t border-ink/10 py-20 md:py-28">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" aria-hidden="true" />

          <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
            <FadeUp className="mb-10 md:mb-14">
              <p className="eyebrow mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </span>
                Key Features
                <span className="h-px flex-1 bg-ink/10" />
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.features.map((feature, i) => (
                <FadeUp key={i} delay={(i % 2) * 0.08} className="h-full">
                  <TiltCard maxTilt={4} className="h-full rounded-2xl">
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-ink/10 bg-panel p-7 md:p-8">
                      <div className="relative flex items-start gap-5 md:gap-6">
                        <span className="display shrink-0 text-5xl font-bold leading-none text-ink/10 [-webkit-text-stroke:1.5px_rgba(244,242,238,0.45)] transition-all duration-500 group-hover:text-accent/20 group-hover:[-webkit-text-stroke:1.5px_rgba(255,77,31,0.85)] md:text-6xl">
                          <RollNumber value={i + 1} />
                        </span>
                        <p className="pt-1 text-sm leading-relaxed text-ink/80 md:text-base">{feature}</p>
                      </div>
                    </div>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <FadeUp className="mt-12 flex flex-wrap items-center gap-2.5">
                <span className="eyebrow mr-2">Built with</span>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="group rounded-full border border-ink/15 px-4 py-1.5 font-mono text-xs font-medium text-ink/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* ── Gallery ─────────────────────────────────────────────────────── */}
      {project.gallery.length > 0 && <GalleryDeck images={project.gallery} title={project.title} />}

      {/* ── Prev / Next ─────────────────────────────────────────────────── */}
      <section className="border-t border-ink/10 py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <FadeUp className="mb-8 md:mb-10">
            <p className="eyebrow mb-6 flex items-center gap-3">
              Keep Exploring
              <span className="h-px flex-1 bg-ink/10" />
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr] md:gap-5">
            {/* Previous */}
            <Link
              href={`/work/${prevProject.slug}`}
              data-cursor="VIEW"
              className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-panel p-6 transition-colors duration-500 hover:border-accent/40 md:min-h-56 md:p-7"
            >
              <span className="absolute inset-x-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" aria-hidden="true" />
              <span className="eyebrow">Previous</span>
              <div className="pr-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  {prevProject.category} · {prevProject.year}
                </span>
                <span className="display mt-1 block text-lg font-semibold tracking-tight text-ink transition-transform duration-500 group-hover:-translate-x-1 md:text-xl">
                  {prevProject.title}
                </span>
              </div>
              <span className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 group-hover:-translate-x-1 group-hover:border-accent group-hover:text-accent">
                <ArrowLeft className="h-4 w-4" />
              </span>
            </Link>

            {/* Next */}
            <Link
              href={`/work/${nextProject.slug}`}
              data-cursor="VIEW"
              className="group relative block overflow-hidden rounded-2xl border border-ink/10 bg-panel"
            >
              <div className="relative h-56 w-full overflow-hidden md:h-64">
                <MediaImage
                  src={nextProject.image}
                  alt={`${nextProject.title} — next project`}
                  fill
                  className="object-cover grayscale brightness-[0.7] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:brightness-90"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 md:p-7">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    Next Project · {nextProject.category} · {nextProject.year}
                  </span>
                  <span className="display mt-1.5 block truncate text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
                    {nextProject.title}
                  </span>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-paper transition-all duration-300 group-hover:rotate-45 group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>

          <FadeUp className="mt-8 flex justify-center md:mt-10">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to all work
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
