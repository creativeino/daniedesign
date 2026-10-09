"use client";

import MediaImage from "@/components/shared/MediaImage";
import MediaVideo from "@/components/shared/MediaVideo";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import FadeUp from "@/components/animations/FadeUp";

type ParallaxFrameProps = {
  src: string;
  /** Project gallery video shown in place of the still (src stays as poster). */
  video?: string;
  alt: string;
  caption?: string;
  /** Rendered height ratio, e.g. "16/9". */
  aspect?: string;
};

/**
 * Editorial image frame with scroll-linked parallax.
 *
 * The frame starts inset and opens to full width while the oversized image
 * inside drifts bottom-to-top as the section crosses the viewport — the
 * classic gallery-plate move. Respects prefers-reduced-motion (static frame).
 */
export default function ParallaxFrame({ src, video, alt, caption, aspect = "16/7" }: ParallaxFrameProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  // Parallax/Ken Burns target the media wrapper (not the <img> itself) so a
  // video cover gets the same drift without needing a DOM ref into MediaVideo.
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const img = mediaRef.current;
    if (!section || !frame || !img) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([frame, img], { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { clipPath: "inset(10% 5% 10% 5% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 35%",
            scrub: 0.8,
          },
        }
      );
      // Ken Burns breathing — a slow continuous zoom drift layered on top of
      // the scroll-linked yPercent (GSAP composes both into one transform).
      gsap.to(img, {
        scale: 1.07,
        duration: 9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center",
      });
      // Image wrapper is 124% tall inside a 100% clip window (12% bleed top and
      // bottom) — drift from bottom-crop to top-crop. Max drift (10% of the
      // wrapper = 12.4%) exactly matches the bleed so no gap is ever exposed.
      gsap.fromTo(
        img,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <FadeUp>
          <figure>
            <div
              ref={frameRef}
              className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-panel"
              style={{ aspectRatio: aspect }}
            >
              <div ref={mediaRef} className="absolute -inset-y-[12%] inset-x-0 will-change-transform">
                {video ? (
                  <MediaVideo
                    src={video}
                    poster={src}
                    fill
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    buttonClassName="bottom-6 right-6"
                    className="object-cover will-change-transform"
                  />
                ) : (
                  <MediaImage
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 80vw, 100vw"
                    className="object-cover will-change-transform"
                  />
                )}
              </div>

              {/* Corner crop marks */}
              <span className="pointer-events-none absolute left-4 top-4 z-10 h-5 w-5 border-l border-t border-white/30" aria-hidden="true" />
              <span className="pointer-events-none absolute right-4 top-4 z-10 h-5 w-5 border-r border-t border-white/30" aria-hidden="true" />
              <span className="pointer-events-none absolute bottom-4 left-4 z-10 h-5 w-5 border-b border-l border-white/30" aria-hidden="true" />
              <span className="pointer-events-none absolute bottom-4 right-4 z-10 h-5 w-5 border-b border-r border-white/30" aria-hidden="true" />

              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
            </div>
            {caption && (
              <figcaption className="eyebrow mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                {caption}
              </figcaption>
            )}
          </figure>
        </FadeUp>
      </div>
    </section>
  );
}
