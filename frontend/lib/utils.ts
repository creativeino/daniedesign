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
 * Resolve the stored media name behind a URL.
 *
 * Blob-proxied uploads (`/api/blob/file?p=<pathname>`) keep the real filename
 * — extension included — in the query string, so look there first; everything
 * else (backend `/uploads/<file>.jpg`, WordPress URLs…) uses the path.
 *
 * @param url Media URL.
 * @returns The filename/URL to test extensions against.
 */
function mediaName(url: string): string {
  const cut = url.search(/[?#]/);
  if (cut === -1) return url;
  const params = new URLSearchParams(url.slice(cut + 1));
  return params.get("p") ?? params.get("url") ?? url.slice(0, cut);
}

/**
 * Detect whether a media URL points at a video file so gallery components
 * can render a `<video>` instead of `next/image`.
 *
 * @param url Media URL (query strings and hashes are ignored).
 * @returns true for known video extensions.
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const name = mediaName(url).toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => name.endsWith(ext));
}

/**
 * Formats the Next.js image optimizer can re-encode. Anything else (svg, gif,
 * bmp, tiff, ico, heic…) must bypass `next/image` or the optimizer throws a
 * 400 on the source format — see `components/shared/MediaImage`.
 */
const OPTIMIZABLE_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/**
 * Whether a media URL is safe to render through `next/image`.
 *
 * @param url Media URL (query strings and hashes are ignored).
 * @returns true for jpg/png/webp/avif sources.
 */
export function isOptimizableImage(url: string): boolean {
  if (!url) return false;
  const path = url.split(/[?#]/)[0].toLowerCase();
  return OPTIMIZABLE_IMAGE_EXTENSIONS.some((ext) => path.endsWith(ext));
}
