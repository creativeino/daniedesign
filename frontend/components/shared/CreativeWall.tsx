"use client";

import MediaImage from "@/components/shared/MediaImage";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { creativeItems } from "@/data/creative";
import { gsap, isCoarsePointer, prefersReducedMotion } from "@/lib/gsap";

export default function CreativeWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const wall = wallRef.current;
    const previewEl = previewRef.current;
    const img = imgRef.current;
    if (!wall || !previewEl || !img) return;

    const xTo = gsap.quickTo(previewEl, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(previewEl, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const row = (e.target as HTMLElement).closest<HTMLElement>("[data-preview]");
      if (row) {
        const src = row.getAttribute("data-preview");
        if (src) {
          img.src = src;
          setPreview(src);
        }
        gsap.to(previewEl, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        gsap.to(previewEl, { opacity: 0, scale: 0.9, duration: 0.25 });
      }
    };

    wall.addEventListener("mousemove", onMove);
    wall.addEventListener("mouseover", onOver);

    return () => {
      wall.removeEventListener("mousemove", onMove);
      wall.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div ref={wallRef} className="relative">
      <ul className="flex flex-col">
        {creativeItems.map((item, i) => (
          <li key={item.label}>
            <a
              href="/contact"
              data-preview={item.image}
              data-cursor="OPEN"
              className="group flex items-baseline justify-between gap-4 border-t border-ink/10 py-6 transition-colors hover:bg-paper/[0.02] last:border-b md:py-8"
            >
              <span className="flex min-w-0 items-baseline gap-4 md:gap-8">
                <span className="text-xs font-bold text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display min-w-0 text-3xl font-medium tracking-tight text-ink transition-all duration-300 group-hover:translate-x-3 group-hover:text-accent sm:text-4xl md:text-6xl">
                  {item.label}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="eyebrow hidden md:inline">{item.category}</span>
                <ArrowUpRight className="h-6 w-6 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-accent md:h-8 md:w-8" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-56 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl opacity-0 lg:block"
        aria-hidden="true"
      >
        <MediaImage
          ref={imgRef}
          src={creativeItems[0].image}
          alt=""
          fill
          sizes="176px"
          className="photo-duo object-cover"
        />
        {preview && (
          <div className="absolute inset-0">
            <MediaImage src={preview} alt="" fill sizes="176px" className="photo-duo object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}