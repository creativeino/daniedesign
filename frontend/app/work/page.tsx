// "/work" portfolio index. Server component providing hero copy, dynamic
// project count fetched from the API/database, and the filterable ProjectGrid.
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import { getProjects } from "@/lib/api";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected projects in branding, UI/UX, web, mobile and marketing — work that speaks through design.",
  alternates: {
    canonical: "/work",
  },
};

export default async function WorkPage() {
  const projects = await getProjects().catch(() => []);
  const count = projects.length > 0 ? String(projects.length) : "32";

  return (
    <main>
      <PageHero
        eyebrow="Portfolio"
        title="Work That Speaks Through Design."
        intro="Every project below carries the same standard: strategy first, craft always. Filter by discipline to explore."
        meta={[{ label: "Projects", value: count }]}
      />
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <ProjectGrid initialProjects={projects} />
        </div>
      </section>
    </main>
  );
}
