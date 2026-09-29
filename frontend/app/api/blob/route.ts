// Vercel Blob client-upload token exchange.
//
// The browser asks this route for a short-lived, scope-limited upload token
// and then PUTs the file bytes directly to Vercel Blob — the payload never
// passes through a serverless function, so the platform's ~4.5MB request-body
// limit (which broke multi-image and video uploads) no longer applies.
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Formats the CRM accepts; enforced by Vercel Blob itself via the client token.
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

// Matches the ceiling the media library advertises (backend MAX_VIDEO_UPLOAD_SIZE_MB).
const MAX_UPLOAD_BYTES = 160 * 1024 * 1024;

/** Verify the caller holds a valid admin JWT (checked by the FastAPI backend). */
async function isAdmin(authorization: string | null): Promise<boolean> {
  if (!authorization) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { authorization },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request.headers.get("authorization")))) {
    return Response.json({ error: "Admin login required to upload files" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) {
    return Response.json({ error: "Invalid upload request" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
    });
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Blob upload failed";
    // Raised by the SDK when the store isn't connected / the token is absent.
    if (/BLOB_READ_WRITE_TOKEN/i.test(message)) {
      return Response.json(
        {
          error: "Vercel Blob storage is not configured",
          hint: "Connect a Blob store to this project (Vercel → Storage → Blob) so BLOB_READ_WRITE_TOKEN is set.",
        },
        { status: 503 }
      );
    }
    return Response.json({ error: message }, { status: 400 });
  }
}
