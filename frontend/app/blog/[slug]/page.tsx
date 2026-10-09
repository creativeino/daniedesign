// "/blog/[slug]" article pages. Server components, statically prerendered at
// build time (one page per slug via generateStaticParams) and fully sourced
// from the static @/data/blog file — no API fetch.
import type { Metadata } from "next";
import MediaImage from "@/components/shared/MediaImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { blogPosts, getPost } from "@/data/blog";
import Button from "@/components/shared/Button";

import { getBlogPosts, getBlogPostBySlug } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const apiPosts = await getBlogPosts();
    const slugs = new Set<string>();
    apiPosts.forEach((p) => {
      if (p.slug) slugs.add(p.slug);
    });
    blogPosts.forEach((p) => {
      if (p.slug) slugs.add(p.slug);
    });
    return Array.from(slugs).map((slug) => ({ slug }));
  } catch {
    return blogPosts.map((post) => ({ slug: post.slug }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogPostBySlug(slug)) ?? getPost(slug);
  if (!post) return { title: "Article Not Found" };

  const title = `${post.title} — Danie Design Insights`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.date,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  // params is a Promise in this Next version — await it before reading the slug.
  const { slug } = await params;
  const post = (await getBlogPostBySlug(slug)) ?? getPost(slug);
  // Unknown slug: render the app-level 404 (app/not-found.tsx).
  if (!post) notFound();

  // Circular "next up in journal" link — wraps back to the first post after the last.
  const index = blogPosts.findIndex((p) => p.slug === slug);
  const nextPost = blogPosts[(index + 1) % blogPosts.length];

  return (
    <main className="bg-[#0e0e0e] text-ink">
      {/* Article Header */}
      <section className="px-5 pb-12 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-[1200px]">
          {/* Breadcrumb Back */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs font-semibold text-ink/70 transition-all hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to All Insights
          </Link>

          <div className="max-w-4xl">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent px-3 py-1 font-mono text-xs font-bold text-[#0e0e0e]">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-ink/60">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {post.readTime}
              </span>
              <span className="font-mono text-xs text-ink/40">•</span>
              <span className="font-mono text-xs text-ink/60">{post.date}</span>
            </div>

            {/* Headline */}
            <h1 className="display mt-6 text-3xl font-bold leading-[1.08] tracking-tight text-ink md:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* Sub-headline / Excerpt */}
            <p className="mt-6 text-base leading-relaxed text-ink/70 md:text-xl">
              {post.excerpt}
            </p>
          </div>

          {/* Hero Featured Image */}
          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-card md:aspect-[21/9]">
            <MediaImage
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1200px) 1200px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Article Content Layout */}
      <section className="border-t border-ink/10 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                {/* Author Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#121214] p-6">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                    Author Squad
                  </span>
                  <p className="mt-2 font-display text-base font-bold text-ink">
                    Danie Design Senior Team
                  </p>
                  <p className="mt-1 text-xs text-ink/60">
                    Bespoke design systems, full-stack engineering, and conversion architecture.
                  </p>
                </div>

                {/* Key Pillars */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#121214] p-6">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                    Key Topics
                  </span>
                  <ul className="mt-3 space-y-2">
                    {post.content.map((block, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs font-medium text-ink/75"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                        <span>{block.heading}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content Body */}
            <div className="flex flex-col gap-12 lg:col-span-8">
              {post.content.map((block) => (
                <article key={block.heading} className="space-y-4">
                  <h2 className="display text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
                    {block.heading}
                  </h2>
                  <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink/75 md:text-base">
                    {block.paragraphs.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}

              {/* End of article CTA Banner */}
              <div className="mt-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-[#161618] to-[#121214] p-8 md:p-10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  Transform Your Brand
                </span>
                <h3 className="display mt-2 text-xl font-bold text-ink md:text-2xl">
                  Ready to execute these principles on your next project?
                </h3>
                <p className="mt-2 text-xs text-ink/65 md:text-sm">
                  Let&apos;s engineer a bespoke digital experience that drives measurable commercial growth.
                </p>

                <Button href="/contact" variant="primary" size="md" className="mt-6">
                  Start The Conversation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Article Carousel Banner */}
      <section className="border-t border-ink/10 bg-[#121214]/60 py-20">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Next Up In Journal
          </p>

          <Link
            href={`/blog/${nextPost.slug}`}
            className="group mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
          >
            <div className="max-w-2xl">
              <span className="font-mono text-xs text-ink/50">{nextPost.category} • {nextPost.readTime}</span>
              <h3 className="display mt-2 text-2xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-4xl">
                {nextPost.title}
              </h3>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-[#0e0e0e]">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}