"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
  start?: string;
};

export default function Counter({
  value,
  suffix = "",
  className,
  duration = 1.6,
  start = "top 85%",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    const counter = { val: 0 };
    el.textContent = `${counter.val}${suffix}`;
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.val)}${suffix}`;
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, duration, start]);

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  );
}