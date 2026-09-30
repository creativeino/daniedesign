"use client";

import MediaImage from "@/components/shared/MediaImage";
import MediaVideo from "@/components/shared/MediaVideo";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";
import { isVideoUrl } from "@/lib/utils";
import TiltCard from "@/components/animations/TiltCard";

/**
 * Sticky "deck of cards" scroll stack: each featured project sits pinned and,
 * as the next card rises over it, the card behind recedes — scaling down,
 * tilting back on a 3D plane and darkening under a tint. A spring smooths
 * every transform so the stack glides instead of stepping.
 */
const StickyCard_001 = ({
  i,
  total,
  title,
  category,
  year,
  src,
  video,
  slug,
  progress,
}: {
  i: number;
  total: number;
  title: string;
  category: string;
  year: string;
  src: string;
  video?: string;
  slug: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  // How deep this card sits in the deck over the scroll range:
  // 0 = front card, 1 = fully receded under the stack.
  const start = (i / Math.max(total, 1)) * 0.85;
  const depthRaw = useTransform(progress, [start, start + 0.3], [0, 1], {
    clamp: true,
  });
  const depth = useSpring(depthRaw, { stiffness: 120, damping: 26, mass: 0.6 });

  const scale = useTransform(depth, [0, 1], [1, 0.86]);
  const rotateX = useTransform(depth, [0, 1], [0, -7]);
  const y = useTransform(depth, [0, 1], [0, -26]);
  const tint = useTransform(depth, [0, 1], [0, 0.5]);
  const blur = useTransform(depth, [0, 1], ["0px", "3px"]);

  // Gentle in-card parallax on the photo for extra life.
  const imgY = useTransform(depth, [0, 1], ["0%", "-4%"]);

  return (
    <div
      className="sticky top-0 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      {/* Enter layer: opacity-only so it never fights the transform-driven recede below */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1400 }}
        className="relative origin-top
                   h-[270px] w-[min(440px,92vw)]
                   sm:h-[320px] sm:w-[620px]
                   md:h-[380px] md:w-[800px]
                   lg:h-[440px] lg:w-[1020px]
                   xl:w-[1160px]"
      >
        {/* Recede layer: scale / 3D tilt / rise driven purely by scroll depth */}
        <motion.div
          style={{
            scale,
            rotateX,
            y,
            filter: blur,
            top: `calc(-4vh + ${i * 15 + 220}px)`,
            transformStyle: "preserve-3d",
          }}
          className="relative h-full w-full"
        >
          <TiltCard
            maxTilt={7}
            glowColor="rgba(255, 77, 31, 0.28)"
            className="h-full w-full rounded-[1.5rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] sm:rounded-[2rem]"
          >
            <Link
              href={`/work/${slug}`}
              data-cursor="VIEW"
              aria-label={`${title} — ${category}, ${year}`}
              className="group relative block h-full w-full overflow-hidden rounded-[1.5rem] border border-ink/10 bg-card sm:rounded-[2rem]"
            >
              <div className="absolute inset-[-4%] overflow-hidden">
                <motion.div style={{ y: imgY }} className="h-full w-full">
                  {video ? (
                    <MediaVideo
                      src={video}
                      poster={src}
                      fill
                      autoPlay
                      muted
                      loop
                      preload="metadata"
                      className="object-cover"
                      buttonClassName="bottom-4 right-4"
                    />
                  ) : (
                    <MediaImage
                      src={src}
                      alt={title}
                      fill
                      sizes="(min-width: 1280px) 1160px, (min-width: 1024px) 1020px, (min-width: 768px) 800px, 620px"
                      className="photo-duo object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  )}
                </motion.div>
              </div>
              <div
                className="photo-duo-overlay absolute inset-0 transition-opacity duration-700 group-hover:opacity-40"
                aria-hidden="true"
              />
              {/* Recede tint — darkens the card as it slides under the deck */}
              <motion.div
                style={{ opacity: tint }}
                className="pointer-events-none absolute inset-0 bg-ink"
                aria-hidden="true"
              />
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper/95 via-paper/30 to-transparent p-5 sm:p-7"
                aria-hidden="true"
              >
                <p className="eyebrow mb-2">
                  {category} — {year}
                </p>
                <h3 className="display text-2xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-3xl">
                  {title}
                </h3>
              </div>
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-paper/50 text-ink backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0e0e0e] sm:right-5 sm:top-5">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </TiltCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ImagesScrollingAnimation = ({ projects }: { projects: Project[] }) => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  // Spring the section progress too so the whole deck moves with inertia.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  });

  return (
    <main
      ref={container}
      className="relative flex w-full flex-col items-center justify-center pb-[45vh] pt-[2vh] sm:pb-[55vh] sm:pt-[3vh] lg:pb-[65vh] lg:pt-[4vh]"
    >
      {projects.map((project, i) => (
        <StickyCard_001
          key={`p_${project.slug}`}
          i={i}
          total={projects.length}
          title={project.title}
          category={project.category}
          year={project.year}
          src={project.image}
          video={project.gallery?.find((url) => isVideoUrl(url))}
          slug={project.slug}
          progress={smooth}
        />
      ))}
    </main>
  );
};

export { ImagesScrollingAnimation, StickyCard_001 };
