"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, prefersReducedMotion, isCoarsePointer } from "@/lib/gsap";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glow?: boolean;
  glowColor?: string;
  glare?: boolean;
  shadow?: boolean;
  clip?: boolean;
};

export default function TiltCard({
  children,
  className,
  maxTilt = 8,
  glow = true,
  glowColor = "rgba(255, 77, 31, 0.18)",
  glare = true,
  shadow = true,
  clip = true,
}: TiltCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const glowEl = glowRef.current;
    const glareEl = glareRef.current;
    if (!root || !inner) return;
    if (prefersReducedMotion() || isCoarsePointer()) return;

    gsap.set(inner, {
      transformPerspective: 1100,
      transformOrigin: "50% 50%",
    });
    if (shadow) {
      gsap.set(inner, {
        boxShadow: "0 18px 40px -18px rgba(0, 0, 0, 0.3)",
      });
    }

    // Springy rotation + lift + scale — the "premium" feel
    const rotX = gsap.quickTo(inner, "rotationX", {
      duration: 0.6,
      ease: "back.out(1.4)",
    });
    const rotY = gsap.quickTo(inner, "rotationY", {
      duration: 0.6,
      ease: "back.out(1.4)",
    });
    const rotZ = gsap.quickTo(inner, "rotationZ", {
      duration: 0.6,
      ease: "back.out(1.4)",
    });
    const yTo = gsap.quickTo(inner, "y", {
      duration: 0.6,
      ease: "back.out(1.2)",
    });
    const sTo = gsap.quickTo(inner, "scale", {
      duration: 0.6,
      ease: "back.out(1.2)",
    });

    const onEnter = () => {
      sTo(1.06);
      yTo(-12);
      if (shadow) {
        gsap.to(inner, {
          boxShadow: "0 44px 80px -24px rgba(0, 0, 0, 0.5)",
          duration: 0.5,
          overwrite: "auto",
        });
      }
      if (glowEl) glowEl.style.opacity = "1";
      if (glareEl) glareEl.style.opacity = "1";
    };

    let rafId: number | null = null;
    let pendingEvent: MouseEvent | null = null;

    const updateTilt = () => {
      if (!pendingEvent) return;
      const rect = root.getBoundingClientRect();
      const px = (pendingEvent.clientX - rect.left) / rect.width - 0.5;
      const py = (pendingEvent.clientY - rect.top) / rect.height - 0.5;

      rotY(px * maxTilt);
      rotX(-py * maxTilt);
      rotZ(px * -py * 10);

      const gx = (px + 0.5) * 100;
      const gy = (py + 0.5) * 100;
      if (glowEl) {
        glowEl.style.background = `radial-gradient(480px circle at ${gx}% ${gy}%, ${glowColor}, transparent 70%)`;
      }
      if (glareEl) {
        glareEl.style.background = `radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.2), transparent 45%)`;
      }
      rafId = null;
    };

    const onMove = (e: MouseEvent) => {
      pendingEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(updateTilt);
      }
    };

    const onLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingEvent = null;
      rotX(0);
      rotY(0);
      rotZ(0);
      yTo(0);
      sTo(1);
      if (shadow) {
        gsap.to(inner, {
          boxShadow: "0 18px 40px -18px rgba(0, 0, 0, 0.3)",
          duration: 0.5,
          overwrite: "auto",
        });
      }
      if (glowEl) glowEl.style.opacity = "0";
      if (glareEl) glareEl.style.opacity = "0";
    };

    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [maxTilt, glow, glare, shadow, glowColor]);

  return (
    <div ref={rootRef} className={className} style={{ perspective: "1000px" }}>
      <div
        ref={innerRef}
        className={`relative h-full w-full rounded-[inherit] will-change-transform ${
          clip ? "overflow-hidden" : ""
        }`}
      >
        {children}
        {glow && (
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
            aria-hidden="true"
          />
        )}
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
            style={{ mixBlendMode: "overlay" }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
