// Cloudinary signed-upload params exchange.
//
// The browser asks this route for a short-lived signature (computed
// server-side with the API secret) and then POSTs the file bytes directly to
// Cloudinary — the payload never passes through a serverless function, so
// Vercel's ~4.5MB request-body limit (which broke video uploads) does not
// apply. Mirrors the old Vercel Blob token exchange in app/api/blob/route.ts.
import { v2 as cloudinary } from "cloudinary";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Folder every admin upload lands in (keep in sync with the migration script).
const UPLOAD_FOLDER = "daniedesign";

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

/** Parse CLOUDINARY_URL (cloudinary://api_key:api_secret@cloud_name). */
function credentials(): { cloudName: string; apiKey: string; apiSecret: string } | null {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return {
      cloudName: url.hostname,
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password),
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin(request.headers.get("authorization")))) {
    return Response.json({ error: "Admin login required to upload files" }, { status: 401 });
  }

  const creds = credentials();
  if (!creds) {
    return Response.json(
      {
        error: "Cloudinary is not configured",
        hint: "Set CLOUDINARY_URL for this project (frontend/.env.local locally, Vercel → Settings → Environment Variables in production).",
      },
      { status: 503 }
    );
  }

  // The signature must cover exactly the params the browser will submit.
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: UPLOAD_FOLDER, timestamp };
  const signature = cloudinary.utils.api_sign_request(params, creds.apiSecret);

  return Response.json({
    cloudName: creds.cloudName,
    apiKey: creds.apiKey,
    ...params,
    signature,
  });
}
