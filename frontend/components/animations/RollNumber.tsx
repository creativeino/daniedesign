"use client";

import { useEffect, useRef, useState } from "react";

type RollNumberProps = {
  value: number;
  /** Minimum digit count; shorter values are zero-padded ("01", "02"…). */
  digits?: number;
  className?: string;
};

/**
 * Slot-machine style number that rolls up to its value when it scrolls into
 * view, digit by digit with a slight stagger. Inherits font/color from its
 * container so it can replace plain `{String(i+1).padStart(2,"0")}` numerals.
 * Respects prefers-reduced-motion (rolls instantly).
 */
export default function RollNumber({ value, digits = 2, className }: RollNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setArmed(true), 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const chars = String(value).padStart(digits, "0").slice(-digits).split("");

  return (
    <span
      ref={ref}
      className={`inline-flex items-center leading-none tabular-nums ${className ?? ""}`}
      aria-label={String(value)}
      role="text"
    >
      {chars.map((c, i) => {
        const n = parseInt(c, 10);
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block h-[1.3em] w-[0.78em] overflow-hidden"
          >
            <span
              className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              style={{
                transform: `translateY(-${armed ? n * 10 : 0}%)`,
                transitionDelay: `${150 + i * 110}ms`,
              }}
            >
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="flex h-[1.3em] items-center justify-center leading-none">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
