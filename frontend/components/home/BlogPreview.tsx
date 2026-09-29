import MediaImage from "@/components/shared/MediaImage";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog";
import SplitText from "@/components/animations/SplitText";
import TiltCard from "@/components/animations/TiltCard";
import Button from "@/components/shared/Button";

/**
 * Homepage blog teaser: renders the three latest studio posts as
 * tilt-hover cards linking into the full blog.
 */
export default function BlogPreview() {
  // Only the first three posts are featured on the homepage
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="relative border-t border-ink/10 bg-[#0e0e0e] py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3 flex items-center gap-2 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Studio Insights &amp; Journal</span>
            </p>
            <SplitText
              as="h2"
              text="Notes from the frontlines of craft."
              className="display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl"
            />
          </div>
          <Button href="/blog" variant="outline" size="md">
            All Insights
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <TiltCard
              key={post.slug}
              className="rounded-2xl"
              maxTilt={7}
              clip={false}
              glowColor="rgba(255, 77, 31, 0.15)"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113] transition-all duration-500 hover:border-accent/35 hover:shadow-[0_10px_35px_rgba(255,77,31,0.06)]"
                aria-label={`Read: ${post.title}`}
              >
              {/* Top Accent bar on hover */}
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accent via-orange-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-card">
                  <MediaImage
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-40" />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/10 bg-[#0e0e0e]/85 px-2.5 py-1 font-mono text-[10px] font-semibold text-ink/90 backdrop-blur-md">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-ink/50">
                    <Clock className="h-3 w-3 text-accent" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="display mt-3 text-lg font-bold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-xl">
                    {post.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-ink/60 md:text-[13px]">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] px-6 py-4">
                <span className="font-mono text-[11px] text-ink/40">Danie Design</span>
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-accent transition-transform duration-300 group-hover:translate-x-1">
                  Read
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}