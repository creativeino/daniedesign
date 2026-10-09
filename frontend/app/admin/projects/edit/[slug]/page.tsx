// Edit-project screen — server component that resolves the [slug] route
// param, fetches the existing project, and hands it to ProjectForm in edit mode.
import { getProjectBySlug, getProjects } from "@/lib/api";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";

// Required by output: "export" — provide static params so Next can pre-render pages.
export async function generateStaticParams() {
  try {
    const apiProjects = await getProjects();
    const slugs = new Set<string>();
    apiProjects.forEach((p: { slug?: string }) => {
      if (p.slug) slugs.add(p.slug);
    });
    projects.forEach((p) => {
      if (p.slug) slugs.add(p.slug);
    });
    const list = Array.from(slugs);
    return (list.length > 0 ? list : ["preview"]).map((slug) => ({ slug }));
  } catch {
    return projects.map((p) => ({ slug: p.slug }));
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  // params is a Promise in this Next.js version; await it to read the slug.
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // Unknown slug -> render the 404 page.
  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} isEdit={true} />;
}
