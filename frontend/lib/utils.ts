/**
 * Small shared utility helpers for the frontend.
 *
 * Currently only holds the Tailwind-aware class name merge helper that
 * components use to combine conditional class lists.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class values and resolve conflicting Tailwind utilities.
 *
 * @param inputs Class strings, arrays or conditional objects to combine.
 * @returns A single class string where later utilities override earlier ones.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Media extensions treated as playable video in galleries/feeds.
 * Matches the backend upload allowlist (app/routers/upload.py).
 */
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

/**
 * Detect whether a media URL points at a video file so gallery components
 * can render a `<video>` instead of `next/image`.
 *
 * @param url Media URL (query strings and hashes are ignored).
 * @returns true for known video extensions.
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const path = url.split(/[?#]/)[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => path.endsWith(ext));
}
