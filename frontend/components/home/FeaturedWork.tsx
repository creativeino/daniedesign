"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import { Project } from "@/data/projects";
import ProjectCard from "@/components/portfolio/ProjectCard";
import SplitText from "@/components/animations/SplitText";
import Button from "@/components/shared/Button";

/**
 * "Recent Work" homepage grid: shows the latest projects as portfolio cards
 * with a link to the full work archive. (The "Signature projects." stack
 * below is separate — that one is driven by the featured checkbox.)
 */
export default function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([]);

  // Live list from the backend API (demo data is the fallback if unreachable).
  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
  }, []);

  // Homepage grid shows the six most recent projects
  const recent = projects.slice(0, 6);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-16 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6">Recent Work — 2025 / 2026</p>
            <SplitText
              as="h2"
              text="Work that works."
              className="display text-5xl font-semibold leading-[0.98] tracking-tight md:text-6xl"
            />
          </div>
          <div className="flex items-center gap-6 md:pb-2">
            <span className="display text-6xl font-medium text-outline md:text-7xl">
              {projects.length > 0 ? projects.length : "—"}
            </span>
            <span className="max-w-[10rem] text-xs leading-relaxed text-muted">
              Projects delivered for brands in four countries
            </span>
            <Button href="/work" variant="outline" size="md">
              View All Work
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {recent.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              imgSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}