"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { isVideoUrl } from "@/lib/utils";
import RollNumber from "@/components/animations/RollNumber";
import { X, ArrowLeft, ArrowRight, ZoomIn, Play } from "lucide-react";

type GalleryDeckProps = {
  images: string[];
  title: string;
};

export default function GalleryDeck({ images, title }: GalleryDeckProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (lightboxIndex !== null) {
        const wrappedNext = lightboxIndex === images.length - 1 && index === 0;
        const wrappedPrev = lightboxIndex === 0 && index === images.length - 1;
        setDirection(wrappedNext || (index > lightboxIndex && !wrappedPrev) ? "next" : "prev");
      }
      setLightboxIndex(index);
    },
    [lightboxIndex, images.length]
  );

  const nextImage = useCallback(() => {
    setDirection("next");
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setDirection("prev");
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
  }, [images.length]);

  // Keyboard + body scroll lock
  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextImage(); }
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(images.length - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images.length, nextImage, prevImage, goTo]);

  // Prefetch adjacent images so next/prev feels instant (videos stream on demand).
  useEffect(() => {
    if (lightboxIndex === null) return;
    [1, -1].forEach((delta) => {
      const src = images[(lightboxIndex + delta + images.length) % images.length];
      if (src && !isVideoUrl(src)) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [lightboxIndex, images]);

  // Touch swipe on the lightbox
  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) > 48) (dx < 0 ? nextImage : prevImage)();
    },
  };

  // GSAP scroll animation
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 80);

        const cards = Array.from(
          track.querySelectorAll<HTMLElement>("[data-deck-card]")
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "gallery-deck",
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + 250}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const idx = Math.min(images.length - 1, Math.floor(p * images.length));
              if (counterRef.current) {
                counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
              }
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
              }
            },
          },
        });

        tl.to(track, { x: () => -distance(), duration: 1 });

        cards.forEach((card, i) => {
          if (i % 2 === 0) return;
          tl.fromTo(card, { yPercent: 4 }, { yPercent: -4, duration: 1 }, 0);
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [images.length]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden border-t border-ink/10 lg:h-[100svh] lg:py-0"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col justify-center px-5 pt-16 md:px-10 md:pt-24 lg:h-full lg:px-0 lg:pt-0">
          <p className="eyebrow mb-8 flex items-center gap-3 px-5 lg:hidden md:px-10">
            Gallery
            <span className="h-px flex-1 bg-ink/10" />
            <span className="font-mono text-[10px] text-muted">
              {String(images.length).padStart(2, "0")} views
            </span>
          </p>

          <div
            ref={trackRef}
            className="[-ms-overflow-style:none] [scrollbar-width:none] flex w-full snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden lg:snap-none lg:overflow-visible lg:pb-0 lg:w-max lg:pl-10"
          >
            {images.map((image, i) => (
              <figure
                key={image}
                data-deck-card
                onClick={() => openLightbox(i)}
                className="group relative aspect-[4/5] w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-ink/10 transition-all duration-500 hover:border-accent/30 cursor-pointer sm:w-[56vw] md:w-[42vw] lg:aspect-[3/4] lg:w-[34vw] lg:max-w-[520px]"
              >
                {isVideoUrl(image) ? (
                  <video
                    src={image}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover grayscale contrast-[1.15] brightness-[0.8] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={`${title} — gallery image ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 34vw, 78vw"
                    className="object-cover grayscale contrast-[1.15] brightness-[0.8] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md">
                    {isVideoUrl(image) ? <Play className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
                  </span>
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/80">
                    {title}
                  </span>
                  <span className="display text-6xl font-bold leading-none text-white/15 [-webkit-text-stroke:1.5px_rgba(255,255,255,0.7)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:text-accent/30 group-hover:[-webkit-text-stroke:1.5px_rgba(255,77,31,0.95)] md:text-7xl">
                    <RollNumber value={i + 1} />
                  </span>
                </figcaption>
              </figure>
            ))}

            <div className="flex aspect-[4/5] w-[78vw] shrink-0 snap-center items-center justify-center rounded-2xl border border-dashed border-ink/15 sm:w-[56vw] md:w-[42vw] lg:aspect-[3/4] lg:w-[34vw] lg:max-w-[520px] lg:mr-10">
              <p className="display max-w-[16ch] text-center text-2xl font-medium leading-tight tracking-tight text-ink/40 lg:text-3xl">
                Every pixel of {title}, up close.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-10">
            <span
              ref={counterRef}
              className="font-mono text-[11px] font-medium tracking-[0.3em] text-muted"
            >
              01 / {String(images.length).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-ink/10">
              <div
                ref={barRef}
                className="h-full w-full origin-left bg-accent"
                style={{ transform: "scaleX(0.04)" }}
              />
            </div>
            <span className="eyebrow text-ink/40">Scroll &rarr;</span>
          </div>
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — gallery viewer`}
          {...touchHandlers}
        >
          {/* Ambient glow behind image — tinted by current view */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div
              key={`glow-${lightboxIndex}`}
              className="lightbox-pop h-[60vh] w-[60vh] rounded-full bg-accent/8 blur-[150px]"
            />
          </div>

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="lightbox-ui absolute right-5 top-5 z-[120] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] md:right-8 md:top-8"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter + position ring */}
          <div className="lightbox-ui absolute left-5 top-5 z-[120] md:left-8 md:top-8">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <svg className="absolute inset-0 h-4 w-4 -rotate-90" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <circle
                    cx="8" cy="8" r="6.5" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 6.5}
                    strokeDashoffset={2 * Math.PI * 6.5 * (1 - (lightboxIndex + 1) / images.length)}
                    style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                </svg>
              </span>
              <span className="font-mono text-xs font-medium tracking-[0.2em] text-white/80">
                <span key={`c-${lightboxIndex}`} className="lightbox-pop inline-block text-accent">
                  {String(lightboxIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-1.5 text-white/30">/</span>
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Image + buttons container */}
          <div
            key={lightboxIndex}
            className={`cursor-default relative h-[85vh] w-[92vw] max-w-[1400px] ${
              direction === "next" ? "lightbox-enter-next" : "lightbox-enter-prev"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle border glow */}
            <div className="pointer-events-none absolute -inset-px rounded-lg bg-gradient-to-b from-white/10 via-transparent to-white/5 z-[1]" aria-hidden="true" />

            {/* Image / Video */}
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              {isVideoUrl(images[lightboxIndex]) ? (
                <video
                  key={`video-${lightboxIndex}`}
                  src={images[lightboxIndex]}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                <Image
                  src={images[lightboxIndex]}
                  alt={`${title} — gallery image ${lightboxIndex + 1}`}
                  fill
                  sizes="92vw"
                  className="object-contain"
                  priority
                />
              )}
              {/* Sheen sweep after the image settles */}
              <span
                key={`sheen-${lightboxIndex}`}
                aria-hidden="true"
                className="lightbox-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/14 to-transparent"
              />
            </div>

            {/* Prev button — inside image, left side */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 top-1/2 z-[10] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] hover:scale-110 hover:-translate-x-0.5 sm:left-4 md:left-5 md:h-14 md:w-14"
              aria-label="Previous"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {/* Next button — inside image, right side */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 top-1/2 z-[10] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent hover:text-[#0e0e0e] hover:scale-110 hover:translate-x-0.5 sm:right-4 md:right-5 md:h-14 md:w-14"
              aria-label="Next"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Bottom bar */}
          <div className="lightbox-ui absolute bottom-0 inset-x-0 z-[120]">
            {/* Scrub progress line */}
            <div className="mx-auto mb-4 h-px max-w-[1440px] overflow-hidden bg-white/10 md:px-10">
              <div
                className="h-full bg-accent transition-[width] duration-500 ease-out"
                style={{ width: `${((lightboxIndex + 1) / images.length) * 100}%` }}
              />
            </div>
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 md:py-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                {title}
              </p>

              {/* Thumbnail dots */}
              <div className="flex items-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === lightboxIndex
                        ? "w-6 bg-accent"
                        : "w-1.5 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                <span className="hidden md:inline">Swipe · ← → keys · Esc to close</span>
                <span className="md:hidden">Swipe to browse</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
