// Serve private Vercel Blob files to the site.
//
// The store is configured with private access, so the raw blob URL is only
// reachable with the read-write token. Admin uploads therefore store a
// `/api/blob/file?p=<pathname>` URL in the database and every image/video is
// streamed from here — the token never leaves the server and visitors never
// need to authenticate.
import { get } from "@vercel/blob";

// Headers worth forwarding from blob storage to the browser.
const PASSTHROUGH_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
  "content-disposition",
];

/** Accept `p=<pathname>` (preferred) or a full `url=` pointing at our store. */
function resolvePathname(raw: string): string | null {
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (!parsed.hostname.endsWith(".blob.vercel-storage.com")) return null;
      return decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    } catch {
      return null;
    }
  }
  return raw.replace(/^\//, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("p") ?? searchParams.get("url");
  if (!raw) {
    return Response.json({ error: "Missing ?p=<blob pathname>" }, { status: 400 });
  }

  const pathname = resolvePathname(raw);
  if (!pathname) {
    return Response.json({ error: "Unsupported blob URL" }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return Response.json(
      { error: "Vercel Blob storage is not configured" },
      { status: 503 }
    );
  }

  const range = request.headers.get("range");
  const ifNoneMatch = request.headers.get("if-none-match");

  try {
    const result = await get(pathname, {
      access: "private",
      token,
      ...(ifNoneMatch ? { ifNoneMatch } : {}),
      // Range passthrough so <video> can seek instead of downloading fully.
      ...(range ? { headers: { range } } : {}),
    });

    if (!result) {
      return new Response("Not found", { status: 404 });
    }
    if (result.statusCode === 304) {
      return new Response(null, { status: 304, headers: { etag: result.blob.etag } });
    }

    const headers = new Headers();
    for (const name of PASSTHROUGH_HEADERS) {
      const value = result.headers.get(name);
      if (value) headers.set(name, value);
    }
    headers.set(
      "cache-control",
      "public, max-age=86400, stale-while-revalidate=604800"
    );

    const status = result.headers.get("content-range") ? 206 : 200;
    return new Response(result.stream as ReadableStream, { status, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Blob read failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
