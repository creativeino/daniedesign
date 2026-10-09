// Edit-project screen — server component that resolves the [slug] route
// param, fetches the existing project, and hands it to ProjectForm in edit mode.
import { getProjectBySlug } from "@/lib/api";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

// Admin pages require a live server (API calls) — skip static pre-rendering.
export const dynamic = "force-dynamic";

// Required by output: "export" — return empty array since admin is server-only.
export function generateStaticParams() {
  return [];
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
