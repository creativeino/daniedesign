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

const BLOB_TO_CLOUDINARY_MAPPING: Record<string, string> = {
  "Media Library ‹ Danie Design — WordPress-eoFhMcofu0Hy3W1IBAQWASaGaUFpJW.mp4":
    "https://res.cloudinary.com/diajvaro/video/upload/v1791370360/daniedesign/migrated/ygd4kdsqurl1gdosysrk.mp4",
  "Media Library ‹ Danie Design — WordPress_2-caeNuDJ4afXBRvRrTwqBUSTIsuUN43.mp4":
    "https://res.cloudinary.com/diajvaro/video/upload/v1791370379/daniedesign/migrated/ttas8ljrcrua01gcmev3.mp4",
  "Media Library ‹ Danie Design — WordPress_3-GX9zVZiHTksVrN322BdvaOQSGBtv0J.mp4":
    "https://res.cloudinary.com/diajvaro/video/upload/v1791370673/daniedesign/migrated/k7bpifchtoav6giy7s3e.mp4",
  "Media Library ‹ Danie Design — WordPress_4-P8agwLJsrKwEQCoZEypdBgrEKq04zN.mp4":
    "https://res.cloudinary.com/diajvaro/video/upload/v1791370691/daniedesign/migrated/ysn98kczlok2tk8hw7nu.mp4",
  "Media Library ‹ Danie Design — WordPress_5-6p635rxDqwNia0DdSYAYUJfl2oi20E.mp4":
    "https://res.cloudinary.com/diajvaro/video/upload/v1791370727/daniedesign/migrated/ayhhtjuynvzzhgiuojil.mp4",
  "Media Library ‹ Danie Design — WordPress_6-6pu8cSA8t1MjEItnWErob8sm0L1wSI.mp4":
    "https://res.cloudinary.com/diajvaro/video/upload/v1791370764/daniedesign/migrated/spvkrao22gpg2awaizot.mp4",
};

/**
 * Resolve any legacy or proxy URL to its direct accessible CDN / media URL.
 * In particular, old Vercel Blob URLs like `/api/blob/file?p=...` are redirected
 * to their actual uploaded Cloudinary video URLs.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;

  if (url.includes("/api/blob/file")) {
    const cut = url.search(/[?#]/);
    if (cut !== -1) {
      const params = new URLSearchParams(url.slice(cut + 1));
      const p = params.get("p") || "";
      const decoded = decodeURIComponent(p);
      if (BLOB_TO_CLOUDINARY_MAPPING[p]) return BLOB_TO_CLOUDINARY_MAPPING[p];
      if (BLOB_TO_CLOUDINARY_MAPPING[decoded]) return BLOB_TO_CLOUDINARY_MAPPING[decoded];
    }
  }

  return url;
}

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
  const resolved = resolveMediaUrl(url);

  // Cloudinary video delivery URLs contain /video/upload/ or /video/ in their pathname
  if (resolved.includes("res.cloudinary.com") && resolved.includes("/video/")) {
    return true;
  }

  const name = mediaName(resolved).toLowerCase();
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
