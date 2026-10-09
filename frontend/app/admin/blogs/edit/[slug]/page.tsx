// Edit-article screen — server component that resolves the [slug] route
// param, fetches the existing post, and hands it to BlogForm in edit mode.
import { getBlogPostBySlug, getBlogPosts } from "@/lib/api";
import BlogForm from "@/components/admin/BlogForm";
import { notFound } from "next/navigation";

import { blogPosts } from "@/data/blog";

// Required by output: "export" — provide static params so Next can pre-render pages.
export async function generateStaticParams() {
  try {
    const apiPosts = await getBlogPosts();
    const slugs = new Set<string>();
    apiPosts.forEach((p: { slug?: string }) => {
      if (p.slug) slugs.add(p.slug);
    });
    blogPosts.forEach((p) => {
      if (p.slug) slugs.add(p.slug);
    });
    const list = Array.from(slugs);
    return (list.length > 0 ? list : ["preview"]).map((slug) => ({ slug }));
  } catch {
    return blogPosts.map((p) => ({ slug: p.slug }));
  }
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
