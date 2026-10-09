"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { heroStats } from "@/data/stats";
import Counter from "@/components/animations/Counter";
import Button from "@/components/shared/Button";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const eyebrow = section.querySelector("[data-hero-eyebrow]");
      const lines = section.querySelectorAll("[data-hero-line]");
      const copy = section.querySelector("[data-hero-copy]");
      const ctas = section.querySelector("[data-hero-ctas]");
      const stats = section.querySelector("[data-hero-stats]");
      const hint = section.querySelector("[data-hero-hint]");
      const heading = section.querySelector("[data-hero-heading]");
      const marker = section.querySelector("[data-hero-marker]");
      const markerGlow = section.querySelectorAll("[data-hero-marker-glow]");
      const markerTip = section.querySelector("[data-hero-marker-tip]");
      const markerPass2 = section.querySelector("[data-hero-marker-pass2]");
      const shimmer = section.querySelector("[data-hero-marker-shimmer]");
      const markerRing = section.querySelector("[data-hero-marker-ring]");
      const markerChars = section.querySelectorAll("[data-hero-marker-char]");
      const splat = section.querySelector("[data-hero-marker-splat]");
      const splatSm = section.querySelector("[data-hero-marker-splat-sm]");
      const video = section.querySelector("[data-hero-video]");
      const curtainTop = section.querySelector("[data-hero-curtain-top]");
      const curtainBottom = section.querySelector("[data-hero-curtain-bottom]");

      if (reduce) {
        gsap.set(
          [eyebrow, copy, ctas, stats, hint, curtainTop, curtainBottom],
          { opacity: 1, y: 0, scaleY: 0 }
        );
        gsap.set(video, { scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(curtainTop, { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: "power4.inOut" })
        .fromTo(
          curtainBottom,
          { scaleY: 1 },
          { scaleY: 0, duration: 1.1, ease: "power4.inOut" },
          "<"
        )
        .fromTo(video, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "power3.out" }, "-=0.9")
        .fromTo(eyebrow, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.8")
        .fromTo(
          lines,
          { yPercent: 120 },
          { yPercent: 0, duration: 1, stagger: 0.1 },
          "-=0.5"
        )
        .addLabel("draw", "-=0.5")
        .from(
          marker,
          { strokeDashoffset: 240, duration: 0.7, ease: "expo.out" },
          "draw"
        )
        .fromTo(
          markerTip,
          {
            autoAlpha: 1,
            motionPath: {
              path: "#hero-marker-path",
              align: "#hero-marker-path",
              alignOrigin: [0.5, 0.5],
              start: 0,
              end: 0,
            },
          },
          {
            motionPath: {
              path: "#hero-marker-path",
              align: "#hero-marker-path",
              alignOrigin: [0.5, 0.5],
              start: 0,
              end: 1,
            },
            duration: 0.7,
            ease: "expo.out",
          },
          "draw"
        )
        .to(
          markerTip,
          { autoAlpha: 0, scale: 1.8, duration: 0.28, ease: "power1.in" },
          "draw+=0.46"
        )
        .from(
          markerGlow,
          { strokeDashoffset: 240, duration: 0.9, ease: "expo.out" },
          "draw+=0.08"
        )
        .from(
          markerPass2,
          { strokeDashoffset: 240, duration: 0.5, ease: "expo.out" },
          "draw+=0.72"
        )
        .from(
          markerChars,
          { yPercent: 16, duration: 0.45, ease: "back.out(2.6)", stagger: 0.022 },
          "draw+=0.5"
        )
        .fromTo(
          markerRing,
          { scale: 0, opacity: 0.9 },
          { scale: 3, opacity: 0, duration: 0.7, ease: "power2.out" },
          "draw+=0.6"
        )
        .to(splat, { scale: 1, duration: 0.35, ease: "back.out(3.5)" }, "draw+=0.58")
        .to(splatSm, { scale: 1, duration: 0.3, ease: "back.out(4)" }, "draw+=0.66")
        .to(
          [splat, splatSm],
          { scale: 1.7, opacity: 0, duration: 0.45, ease: "power1.in" },
          "draw+=0.95"
        )
        .fromTo(copy, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6")
        .fromTo(ctas, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .fromTo(stats, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.4");

      const sweep = gsap.timeline({ repeat: -1, repeatDelay: 5.5, delay: 3.4 });
      sweep
        .fromTo(
          shimmer,
          { strokeDashoffset: 240, autoAlpha: 0 },
          { autoAlpha: 0.9, duration: 0.22 },
          0
        )
        .to(shimmer, { strokeDashoffset: -20, duration: 0.85, ease: "power1.inOut" }, 0)
        .to(shimmer, { autoAlpha: 0, duration: 0.22 }, ">-0.16");

      gsap.to(heading, {
        yPercent: -45,
        scale: 0.55,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });
      gsap.to(video, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#0b0d13]" aria-hidden="true">
        <video
          ref={videoRef}
          data-hero-video
          src="/images/0_Code_Programming_1280x720.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.72;
          }}
          className="h-full w-full scale-125 object-cover opacity-60 transition-opacity duration-700 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-paper/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-paper/30 to-paper/80" />
      </div>

      <div
        data-hero-curtain-top
        className="absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-[#0e0e0e]"
        aria-hidden="true"
      />
      <div
        data-hero-curtain-bottom
        className="absolute inset-x-0 bottom-0 z-20 h-1/2 origin-bottom bg-[#0e0e0e]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-36">
        <p
          data-hero-eyebrow
          className="eyebrow mb-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          <span>Full-Stack Web Development &amp; Brand Studio</span>
        </p>

        <h1
          data-hero-heading
          className="display max-w-5xl text-3xl font-bold leading-[1.08] tracking-tight will-change-transform sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.4rem]"
        >
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block will-change-transform">
              Creative, Design &amp;
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block text-accent will-change-transform">
              Web Development
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.34em] -mb-[0.34em]">
            <span data-hero-line className="block text-ink/75 will-change-transform">
              for{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="inline-block">
                  {"Growing Brands".split("").map((ch, i) =>
                    ch === " " ? (
                      <span key={i} className="inline-block">
                        {" "}
                      </span>
                    ) : (
                      <span key={i} data-hero-marker-char className="inline-block">
                        {ch}
                      </span>
                    )
                  )}
                </span>
                <svg
                  className="absolute -bottom-[0.14em] left-0 h-[0.13em] w-full overflow-visible"
                  viewBox="0 0 220 8"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="hero-marker-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="var(--color-accent)" />
                      <stop offset="0.75" stopColor="#ff6a3a" />
                      <stop offset="1" stopColor="#ffb08a" />
                    </linearGradient>
                  </defs>
                  <path
                    data-hero-marker-glow
                    d="M4 5.5 C 62 1.8, 158 1.8, 216 4.8"
                    stroke="var(--color-accent)"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray="240"
                    opacity="0.07"
                  />
                  <path
                    data-hero-marker-glow
                    d="M4 5.5 C 62 1.8, 158 1.8, 216 4.8"
                    stroke="var(--color-accent)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="240"
                    opacity="0.14"
                  />
                  <path
                    data-hero-marker-glow
                    d="M4 5.5 C 62 1.8, 158 1.8, 216 4.8"
                    stroke="var(--color-accent)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="240"
                    opacity="0.24"
                  />
                  <path
                    data-hero-marker-pass2
                    d="M7 6.4 C 64 3, 156 3.2, 213 6.6"
                    stroke="var(--color-accent)"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeDasharray="240"
                    opacity="0.45"
                  />
                  <path
                    id="hero-marker-path"
                    data-hero-marker
                    d="M4 5.5 C 62 1.8, 158 1.8, 216 4.8"
                    stroke="url(#hero-marker-grad)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeDasharray="240"
                  />
                  <path
                    data-hero-marker-shimmer
                    d="M4 5.5 C 62 1.8, 158 1.8, 216 4.8"
                    stroke="#ffb08a"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeDasharray="16 400"
                    opacity="0"
                  />
                </svg>
                <span
                  data-hero-marker-tip
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-full h-2.5 w-2.5 rounded-full bg-accent opacity-0 shadow-[0_0_16px_5px_rgba(255,77,31,0.6)]"
                />
                <span
                  data-hero-marker-ring
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-[0.06em] right-[1%] h-[0.32em] w-[0.32em] rounded-full border border-accent/70 opacity-0"
                />
                <span
                  data-hero-marker-splat
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-[0.04em] right-[1.5%] h-[0.15em] w-[0.15em] scale-0 rounded-full bg-accent/80"
                />
                <span
                  data-hero-marker-splat-sm
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-[0.26em] right-[5%] h-[0.09em] w-[0.09em] scale-0 rounded-full bg-accent/60"
                />
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-5 flex max-w-3xl flex-col gap-6 md:mt-6">
          <p
            data-hero-copy
            className="max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg"
          >
            We engineer high-performance web applications, bespoke design systems, and converting digital experiences for modern brands.
          </p>

          <div data-hero-ctas className="flex flex-wrap items-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Start a Project
            </Button>
            <Button href="/work" variant="circle" size="lg">
              View Our Work
            </Button>
          </div>
        </div>

        <div
          data-hero-stats
          className="mt-16 grid max-w-3xl grid-cols-3 divide-x divide-ink/15 border-t border-ink/15 pt-8"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="display block text-3xl font-bold text-ink md:text-4xl"
              />
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-ink/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        data-hero-hint
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
      >
        <span className="eyebrow">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-accent" />
      </div>
    </section>
  );
}
