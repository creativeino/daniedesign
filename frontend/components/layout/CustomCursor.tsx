"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, prefersReducedMotion, isCoarsePointer } from "@/lib/gsap";

type Mode = "default" | "interactive" | "badge";

/**
 * Playful custom cursor:
 *
 * - "daniedesign" circular text slowly orbiting the cursor (speeds up on hover)
 * - velocity-stretched "gummy" ring that leans into the direction of travel
 * - magnetic snap: the ring is pulled toward the center of the hovered link/button
 * - spark + ripple burst on every click
 * - a rotating dashed orbit around the label badge
 */
const ORBIT_TEXT = "daniedesign ✦ ";
const ORBIT_RADIUS = 30;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const orbitTextRef = useRef<HTMLDivElement>(null);
  const orbitSpinRef = useRef<HTMLDivElement>(null);
  const orbitBadgeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  // slow spin of the dashed orbit while a badge label is showing
  useEffect(() => {
    const orbit = orbitBadgeRef.current;
    if (!orbit || prefersReducedMotion() || isCoarsePointer()) return;
    const spin = gsap.to(orbit, { rotation: "+=360", duration: 7, ease: "none", repeat: -1 });
    return () => {
      spin.kill();
    };
  }, [label]);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const orbit = orbitTextRef.current;
    const orbitSpin = orbitSpinRef.current;
    const burst = burstRef.current;
    const textEl = textRef.current;
    if (!dot || !ring || !orbit || !orbitSpin || !burst) return;

    document.body.classList.add("custom-cursor-active");

    // lay out "daniedesign ✦ " around a circle, char by char
    const chars = Array.from(ORBIT_TEXT);
    const charEls: HTMLSpanElement[] = [];
    const frag = document.createDocumentFragment();
    chars.forEach((ch, i) => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.className =
        "absolute left-0 top-0 font-mono text-[8px] font-bold uppercase tracking-[0.05em] text-accent select-none";
      const a = (360 * i) / chars.length;
      s.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${ORBIT_RADIUS}px)`;
      charEls.push(s);
      frag.appendChild(s);
    });
    orbitSpin.appendChild(frag);
    const spin = gsap.to(orbitSpin, { rotation: "+=360", duration: 7, ease: "none", repeat: -1 });

    // raw pointer position
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    // follower positions: ring, orbit, dot
    let rx = px;
    let ry = py;
    let gx = px;
    let gy = py;
    let dx = px;
    let dy = py;
    let lrx = px;
    let lry = py;

    let mode: Mode = "default";
    let snapEl: HTMLElement | null = null;
    let pressed = false;
    let visible = false;
    let stretchS = 1;
    const state = { baseScale: 1 };
    let snapRect: DOMRect | null = null;

    const updateSnapRect = () => {
      if (snapEl && snapEl.isConnected && mode !== "default") {
        const r = snapEl.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.width < 360 && r.height < 360) {
          snapRect = r;
          return;
        }
      }
      snapRect = null;
    };

    const tick = () => {
      if (!visible) return;

      // magnetic follow target: blend cursor with hovered element center
      let fx = px;
      let fy = py;
      if (snapRect) {
        const pull = mode === "badge" ? 0.7 : 0.5;
        fx = px + (snapRect.left + snapRect.width / 2 - px) * pull;
        fy = py + (snapRect.top + snapRect.height / 2 - py) * pull;
      }

      dx += (px - dx) * 0.55;
      dy += (py - dy) * 0.55;
      gx += (fx - gx) * 0.11;
      gy += (fy - gy) * 0.11;
      const ringEase = pressed ? 0.3 : 0.15;
      rx += (fx - rx) * ringEase;
      ry += (fy - ry) * ringEase;

      const vx = rx - lrx;
      const vy = ry - lry;
      lrx = rx;
      lry = ry;
      const speed = Math.hypot(vx, vy);

      const stiff = mode === "badge" || pressed;
      const targetStretch = stiff ? 1 : Math.min(1 + speed * 0.05, 2.2);
      stretchS += (targetStretch - stretchS) * 0.2;
      // slight directional lean while gliding (kept small so badge text stays upright)
      const lean = stiff ? 0 : Math.max(-14, Math.min(14, vy * 1.2)) * (stretchS - 1);
      const sX = state.baseScale * stretchS;
      const sY = state.baseScale / Math.sqrt(stretchS);

      gsap.set(ring, { x: rx, y: ry, rotation: lean, scaleX: sX, scaleY: sY });
      gsap.set(orbit, { x: gx, y: gy });
      gsap.set(dot, { x: dx, y: dy });
    };

    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: "auto" });
        gsap.to(orbit, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
    };

    const spawnBurst = () => {
      const count = 8;
      for (let i = 0; i < count; i++) {
        const p = document.createElement("span");
        p.className =
          "absolute left-0 top-0 h-1 w-1 rounded-full " +
          (i % 2 ? "bg-accent" : "bg-white");
        burst.appendChild(p);
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.7;
        const dist = 24 + Math.random() * 26;
        gsap.fromTo(
          p,
          { x: px, y: py, opacity: 1, scale: 1 },
          {
            x: px + Math.cos(a) * dist,
            y: py + Math.sin(a) * dist,
            opacity: 0,
            scale: 0.2,
            duration: 0.45 + Math.random() * 0.25,
            ease: "power3.out",
            onComplete: () => p.remove(),
          }
        );
      }
      const ripple = document.createElement("span");
      ripple.className =
        "absolute left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent";
      burst.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { x: px, y: py, scale: 0.4, opacity: 0.9 },
        {
          x: px,
          y: py,
          scale: 2.4,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    const onMouseDown = () => {
      pressed = true;
      gsap.to(state, { baseScale: 0.75, duration: 0.15, ease: "power2.in" });
      gsap.to(dot, { scale: 0.4, duration: 0.15, ease: "power2.in" });
      gsap.to(orbit, { scale: 0.8, duration: 0.2, ease: "power2.in" });
      spawnBurst();
    };

    const onMouseUp = () => {
      pressed = false;
      const targetScale = mode === "badge" ? 1 : mode === "interactive" ? 1.15 : 1;
      gsap.to(state, { baseScale: targetScale, duration: 0.35, ease: "back.out(3)" });
      gsap.to(dot, { scale: mode === "interactive" ? 1.5 : 1, duration: 0.25, ease: "back.out(2)" });
      gsap.to(orbit, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      );

      if (target) {
        const customText =
          target.getAttribute("data-cursor-label") ??
          target.getAttribute("data-cursor") ??
          null;

        if (customText) {
          const wasBadge = mode === "badge";
          mode = "badge";
          snapEl = target;
          setLabel(customText);

          gsap.to(ring, {
            width: 84,
            height: 84,
            backgroundColor: "rgba(255, 77, 31, 0.92)",
            borderColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 0 35px rgba(255, 77, 31, 0.45)",
            duration: 0.32,
            ease: "power3.out",
          });
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.18 });
          // orbit nudges out just enough to clear the label, turns dark on the orange badge
          gsap.to(orbit, { opacity: 1, scale: 1.6, duration: 0.35, ease: "power3.out" });
          gsap.to(charEls, { color: "#0e0e0e", duration: 0.25 });
          gsap.to(spin, { timeScale: 3, duration: 0.4 });
          updateSnapRect();
          if (!wasBadge && textEl) {
            gsap.fromTo(
              textEl,
              { opacity: 0, scale: 0.6, rotation: -12 },
              { opacity: 1, scale: 1, rotation: 0, duration: 0.3, delay: 0.05, ease: "back.out(2.5)" }
            );
          }
        } else {
          mode = "interactive";
          snapEl = target;
          updateSnapRect();
          setLabel(null);

          gsap.to(ring, {
            width: 48,
            height: 48,
            backgroundColor: "rgba(255, 77, 31, 0.12)",
            borderColor: "rgba(255, 77, 31, 0.75)",
            boxShadow: "0 0 20px rgba(255, 77, 31, 0.25)",
            duration: 0.25,
            ease: "power3.out",
          });
          gsap.to(dot, {
            scale: 1.5,
            opacity: 1,
            backgroundColor: "#ffffff",
            boxShadow: "0 0 12px rgba(255, 255, 255, 0.9)",
            duration: 0.2,
          });
          gsap.to(orbit, { opacity: 1, scale: 1, duration: 0.25 });
          gsap.to(charEls, { color: "#ff4d1f", duration: 0.25 });
          gsap.to(spin, { timeScale: 2.2, duration: 0.4 });
        }
      } else {
        mode = "default";
        snapEl = null;
        snapRect = null;
        setLabel(null);

        gsap.to(ring, {
          width: 32,
          height: 32,
          backgroundColor: "transparent",
          borderColor: "rgba(244, 242, 238, 0.25)",
          boxShadow: "none",
          duration: 0.28,
          ease: "power3.out",
        });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          backgroundColor: "#ff4d1f",
          boxShadow: "0 0 8px rgba(255, 77, 31, 0.7)",
          duration: 0.2,
        });
        gsap.to(orbit, { opacity: 1, scale: 1, duration: 0.25 });
        gsap.to(charEls, { color: "#ff4d1f", duration: 0.25 });
        gsap.to(spin, { timeScale: 1, duration: 0.5 });
      }
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring, orbit], { opacity: 0, duration: 0.2 });
    };

    const onEnter = () => {
      visible = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      gsap.to(orbit, { opacity: 1, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    gsap.ticker.add(tick);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      gsap.ticker.remove(tick);
      spin.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-[999]" aria-hidden="true">
      <div ref={burstRef} className="absolute inset-0" />

      <div
        ref={orbitTextRef}
        className="absolute left-0 top-0 h-0 w-0 opacity-0"
      >
        <div ref={orbitSpinRef} className="relative h-0 w-0" />
      </div>

      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/25 opacity-0"
      >
        {label && (
          <>
            <div
              ref={orbitBadgeRef}
              className="absolute -inset-[7px] rounded-full border border-dashed border-white/70"
            />
            <span
              ref={textRef}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#0e0e0e] drop-shadow-sm select-none"
            >
              {label}
            </span>
          </>
        )}
      </div>

      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 shadow-[0_0_8px_rgba(255,77,31,0.7)]"
      />
    </div>
  );
}
