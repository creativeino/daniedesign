// Cloudinary media-library listing (admin).
//
// Returns every uploaded asset (images + videos) in the MediaFileItem shape
// the admin media page and picker expect, newest first. Uses the Admin API —
// credentials come from CLOUDINARY_URL on the server only.
import { v2 as cloudinary } from "cloudinary";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const MAX_RESULTS = 100;

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

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | string;
  format?: string;
  bytes?: number;
  created_at?: string;
};

/** Map a Cloudinary resource to the frontend's MediaFileItem shape. */
function toItem(r: CloudinaryResource) {
  const ext = r.format ?? "";
  const lastSegment = r.public_id.split("/").pop() ?? r.public_id;
  const content_type =
    r.resource_type === "video"
      ? `video/${ext || "mp4"}`
      : `image/${ext === "jpg" ? "jpeg" : ext || "png"}`;
  return {
    filename: ext ? `${lastSegment}.${ext}` : lastSegment,
    url: r.secure_url,
    content_type,
    size: r.bytes ?? 0,
    modified_at: r.created_at ?? new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  if (!(await isAdmin(request.headers.get("authorization")))) {
    return Response.json({ detail: "Admin login required" }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_URL) {
    return Response.json({ detail: "Cloudinary is not configured (CLOUDINARY_URL missing)" }, { status: 503 });
  }

  try {
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({ resource_type: "image", type: "upload", max_results: MAX_RESULTS }),
      cloudinary.api.resources({ resource_type: "video", type: "upload", max_results: MAX_RESULTS }),
    ]);

    const files = [
      ...(images.resources as CloudinaryResource[]),
      ...(videos.resources as CloudinaryResource[]),
    ]
      .map(toItem)
      .sort((a, b) => (a.modified_at < b.modified_at ? 1 : -1));

    return Response.json({ files, total: files.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list Cloudinary resources";
    return Response.json({ detail: message }, { status: 502 });
  }
}
