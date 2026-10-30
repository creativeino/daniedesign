"use client";

import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

export default function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (v: number) => prefix + v.toFixed(decimals) + suffix;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(value);
      return;
    }

    const obj = { v: 0 };
    el.textContent = format(obj.v);
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: value,
        duration,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(obj.v);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, prefix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}