// Edit-article screen — server component that resolves the [slug] route
// param, fetches the existing post, and hands it to BlogForm in edit mode.
import { getBlogPostBySlug } from "@/lib/api";
import BlogForm from "@/components/admin/BlogForm";
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

export default async function EditBlogPage({ params }: Props) {
  // params is a Promise in this Next.js version; await it to read the slug.
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  // Unknown slug -> render the 404 page.
  if (!post) {
    notFound();
  }

  return <BlogForm initialData={post} isEdit={true} />;
}
