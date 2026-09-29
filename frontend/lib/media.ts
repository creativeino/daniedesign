/**
 * Client-side media preparation for uploads.
 *
 * The production backend runs as Vercel serverless functions, which reject any
 * request body larger than ~4.5MB with `413 FUNCTION_PAYLOAD_TOO_LARGE` before
 * the FastAPI code ever runs (the backend's own limit is far higher). Oversized
 * photos are therefore downscaled and re-encoded in the browser first, so an
 * upload from any phone or camera still fits in one request.
 */

/** Files at or below this size are sent untouched — no quality loss. */
const SAFE_BYTES = 3 * 1024 * 1024;

/** Hard ceiling for the encoded payload (multipart overhead included). */
const TARGET_BYTES = 3 * 1024 * 1024;

/** Longest edge kept after re-encoding; covers 4K-ish portfolio exports. */
const MAX_EDGE = 2560;

/** Quality ladder tried in order until the result fits `TARGET_BYTES`. */
const QUALITIES = [0.85, 0.78, 0.7, 0.6, 0.5, 0.4, 0.3];

/** Formats the canvas can reasonably re-encode for a given source type. */
function candidateTypes(type: string): string[] {
  if (type === "image/jpeg" || type === "image/jpg") return ["image/jpeg"];
  if (type === "image/webp") return ["image/webp", "image/jpeg"];
  // PNG and friends may carry transparency → webp first, jpeg as the fallback.
  return ["image/webp", "image/jpeg"];
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image"));
    };
    img.src = url;
  });
}

function drawScaled(
  img: HTMLImageElement,
  scale: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, ctx };
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Return a file that is safe to POST to the upload endpoint.
 *
 * Small files and non-raster types (svg, gif, video…) pass through unchanged;
 * anything larger than `SAFE_BYTES` is scaled to `MAX_EDGE` and re-encoded at
 * descending quality levels until it fits `TARGET_BYTES`. If nothing fits, the
 * smallest candidate is returned — still better than a guaranteed 413.
 *
 * @param file File chosen by the admin.
 * @returns The original file, or a smaller re-encoded replacement.
 */
export async function prepareUploadFile(file: File): Promise<File> {
  if (file.size <= SAFE_BYTES) return file;
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  try {
    const img = await loadImage(file);
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    if (!longest) return file;

    let best: Blob | null = null;
    const baseScale = Math.min(1, MAX_EDGE / longest);

    // Shrink geometry as a last resort when even the lowest quality is too big.
    for (const geometry of [baseScale, baseScale * 0.75, baseScale * 0.5]) {
      const drawn = drawScaled(img, geometry);
      if (!drawn) return file;
      for (const type of candidateTypes(file.type)) {
        for (const quality of QUALITIES) {
          const blob = await encode(drawn.canvas, type, quality);
          if (!blob) break;
          if (!best || blob.size < best.size) best = blob;
          if (blob.size <= TARGET_BYTES) return toFile(blob, file.name);
        }
      }
    }

    if (best && best.size < file.size) return toFile(best, file.name);
    return file;
  } catch {
    // Any decode/encode failure (unsupported codec, private mode…) → send as-is.
    return file;
  }
}

function toFile(blob: Blob, originalName: string): File {
  const stem = originalName.replace(/\.[^.]+$/, "");
  const ext = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] || "png";
  return new File([blob], `${stem}.${ext}`, { type: blob.type, lastModified: Date.now() });
}
