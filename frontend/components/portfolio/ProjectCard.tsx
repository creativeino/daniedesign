"use client";

import Link from "next/link";
import MediaImage from "@/components/shared/MediaImage";
import MediaVideo from "@/components/shared/MediaVideo";
import { isVideoUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import TiltCard from "@/components/animations/TiltCard";

type ProjectCardProps = {
  project: Project;
  className?: string;
  imgSizes?: string;
};

export default function ProjectCard({ project, className, imgSizes }: ProjectCardProps) {
  // A gallery video doubles as the animated card cover; the cover image stays
  // as the poster so nothing is lost while the video loads.
  const coverVideo = project.gallery?.find((url) => isVideoUrl(url));

  return (
    <TiltCard
      className={className}
      maxTilt={8}
      glowColor="rgba(255, 77, 31, 0.22)"
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor="VIEW"
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-panel transition-colors duration-500 hover:border-accent/25"
        aria-label={`${project.title} — ${project.category}, ${project.year}`}
      >
        {/* Image area — fixed aspect ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {coverVideo ? (
            <MediaVideo
              src={coverVideo}
              poster={project.image}
              fill
              autoPlay
              muted
              loop
              preload="metadata"
              buttonClassName="bottom-3 right-3"
              className="object-cover grayscale contrast-[1.15] brightness-[0.82] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
            />
          ) : (
            <MediaImage
              src={project.image}
              alt={project.title}
              fill
              sizes={imgSizes ?? "(min-width: 1024px) 50vw, 100vw"}
              className="object-cover grayscale contrast-[1.15] brightness-[0.82] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />

          {/* Category pill */}
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {project.category}
            </span>
          </div>

          {/* Arrow */}
          <div className="absolute right-4 top-4 z-10">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/80 backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-accent">
                {project.year}
              </span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>
            <h3 className="display text-xl font-semibold leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </div>

          {/* Services */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="rounded-md border border-ink/8 bg-panel/80 px-2 py-1 font-mono text-[10px] text-muted transition-colors duration-300 group-hover:border-ink/15"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
