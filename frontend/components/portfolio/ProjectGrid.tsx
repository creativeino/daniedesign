"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getProjects } from "@/lib/api";
import { Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";

export default function ProjectGrid({
  initialProjects = [],
}: {
  initialProjects?: Project[];
}) {
  const [active, setActive] = useState("All");
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    if (initialProjects.length === 0) {
      getProjects().then(setProjects).catch(() => {});
    }
  }, [initialProjects.length]);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="flex flex-col gap-8">
      <ProjectFilters active={active} onChange={setActive} />

      <motion.div
        layout
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              layout
              key={project.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard
                project={project}
                imgSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
