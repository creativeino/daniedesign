/**
 * Typed client for the backend REST API.
 *
 * Every read helper degrades gracefully: when the backend is unreachable or
 * returns an error, the request falls back to the static demo data in
 * `@/data/*` so the public site always renders. Mutating helpers (create,
 * update, delete) require an admin JWT and throw on failure instead.
 */

import { projects as fallbackProjects, Project } from "@/data/projects";
import { blogPosts as fallbackBlogPosts, BlogPost } from "@/data/blog";
import { services as fallbackServices, Service } from "@/data/services";
import { creativeItems as fallbackCreative, CreativeItem } from "@/data/creative";
import { clients as fallbackClients } from "@/data/clients";

/** Root URL of the backend API, overridable via NEXT_PUBLIC_API_URL. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Fetch JSON from the API, returning `fallbackData` on any failure.
 * Never throws — network errors and non-2xx responses both degrade to the fallback.
 *
 * @param url Absolute URL to fetch (always revalidated, no caching).
 * @param fallbackData Static data to return when the API is unavailable.
 * @returns The parsed API response, or `fallbackData` on failure.
 */
async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      return fallbackData;
    }
    return (await res.json()) as T;
  } catch {
    return fallbackData;
  }
}

// Normalize backend snake_case to frontend camelCase for BlogPost
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBlogPost(raw: any): BlogPost {
  return {
    ...raw,
    readTime: raw.readTime ?? raw.read_time ?? "4 min read",
  };
}


// -------------------------------------------------------------
// Auth & Token Management
// -------------------------------------------------------------
/**
 * Read the stored admin JWT from localStorage.
 *
 * @returns The token string, or null during SSR or when not logged in.
 */
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("danie_admin_token");
}

/** Persist the admin JWT to localStorage (client only). */
export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("danie_admin_token", token);
  }
}

/** Remove the admin token and cached admin profile, logging the user out. */
export function clearAdminToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("danie_admin_token");
    localStorage.removeItem("danie_admin_user");
  }
}

/**
 * Read the cached admin profile from localStorage.
 *
 * @returns The stored `{ name, email }`, or null during SSR or when absent.
 */
export function getAdminUser(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("danie_admin_user");
  return user ? JSON.parse(user) : null;
}

/** Persist the admin profile to localStorage for display in the dashboard. */
export function setAdminUser(user: { name: string; email: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("danie_admin_user", JSON.stringify(user));
  }
}

/**
 * Authenticate an admin and store the returned token and profile.
 *
 * @param email Admin account email.
 * @param password Admin account password.
 * @returns The raw login response (access token, admin name/email).
 * @throws Error with the backend's `detail` message when credentials are rejected.
 */
export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Invalid email or password");
  }
  const data = await res.json();
  setAdminToken(data.access_token);
  setAdminUser({ name: data.admin_name, email: data.admin_email });
  return data;
}

// -------------------------------------------------------------
// Dashboard Summary API
// -------------------------------------------------------------
/**
 * Fetch dashboard counts and recent records for the admin overview.
 *
 * @returns Counts plus recent inquiries/projects/blogs, or a fallback built
 *   from the static demo data when the API is unavailable.
 */
export async function getDashboardSummary() {
  const fallback = {
    counts: {
      projects: fallbackProjects.length,
      blogs: fallbackBlogPosts.length,
      services: fallbackServices.length,
      inquiries: 0,
      new_inquiries: 0,
      creative: fallbackCreative.length,
      clients: fallbackClients.length,
      team: 10,
    },
    recent_inquiries: [],
    recent_projects: fallbackProjects.slice(0, 4),
    recent_blogs: fallbackBlogPosts.slice(0, 4),
  };
  return fetchWithFallback(`${API_BASE_URL}/dashboard/summary`, fallback);
}

// -------------------------------------------------------------
// Projects API (CRUD)
// -------------------------------------------------------------
/**
 * List projects, optionally filtered.
 *
 * @param params Optional category ("All" is ignored), featured flag and search term.
 * @returns Projects from the API, or the static demo list on failure.
 */
export async function getProjects(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
}): Promise<Project[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") query.set("category", params.category);
  if (params?.featured !== undefined) query.set("featured", String(params.featured));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return fetchWithFallback<Project[]>(
    `${API_BASE_URL}/projects${qs}`,
    fallbackProjects
  );
}

/**
 * Fetch a single project by slug.
 *
 * @param slug URL slug of the project.
 * @returns The project, or the matching demo project (undefined if unknown) on failure.
 */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`, { cache: "no-store" });
    if (res.ok) {
      return (await res.json()) as Project;
    }
  } catch {}
  return fallbackProjects.find((p) => p.slug === slug);
}

/**
 * Create a new project (admin only).
 *
 * @param projectData Partial project fields to create with.
 * @returns The created project record.
 * @throws Error with the backend's `detail` message on failure.
 */
export async function createProject(projectData: Partial<Project>) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create project" }));
    throw new Error(err.detail || "Failed to create project");
  }
  return await res.json();
}

/**
 * Update an existing project (admin only).
 *
 * @param slug Slug of the project to update.
 * @param projectData Partial project fields to apply.
 * @returns The updated project record.
 * @throws Error with the backend's `detail` message on failure.
 */
export async function updateProject(slug: string, projectData: Partial<Project>) {
  const res = await fetch(`${API_BASE_URL}/projects/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update project" }));
    throw new Error(err.detail || "Failed to update project");
  }
  return await res.json();
}

/**
 * Delete a project (admin only).
 *
 * @param slug Slug of the project to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteProject(slug: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete project");
  }
  return true;
}

// -------------------------------------------------------------
// Blogs API (CRUD)
// -------------------------------------------------------------
/**
 * List blog posts, optionally filtered, with snake_case normalized to camelCase.
 *
 * @param params Optional category ("All" is ignored) and search term.
 * @returns Posts from the API, or the static demo list on failure.
 */
export async function getBlogPosts(params?: {
  category?: string;
  search?: string;
}): Promise<BlogPost[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "All") query.set("category", params.category);
  if (params?.search) query.set("search", params.search);

  const qs = query.toString() ? `?${query.toString()}` : "";
  try {
    const res = await fetch(`${API_BASE_URL}/blogs${qs}`, { cache: "no-store" });
    if (res.ok) {
      const raw = (await res.json()) as Record<string, unknown>[];
      return raw.map(normalizeBlogPost);
    }
  } catch {}
  return fallbackBlogPosts;
}

/**
 * Fetch a single blog post by slug (normalized to camelCase).
 *
 * @param slug URL slug of the post.
 * @returns The post, or the matching demo post (undefined if unknown) on failure.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const raw = await res.json();
      return normalizeBlogPost(raw);
    }
  } catch {}
  return fallbackBlogPosts.find((p) => p.slug === slug);
}

/**
 * Create a new blog post (admin only).
 *
 * @param blogData Partial blog post fields to create with.
 * @returns The created blog record.
 * @throws Error with the backend's `detail` message on failure.
 */
export async function createBlogPost(blogData: Partial<BlogPost>) {
  const res = await fetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(blogData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create blog" }));
    throw new Error(err.detail || "Failed to create blog");
  }
  return await res.json();
}

/**
 * Update an existing blog post (admin only).
 *
 * @param slug Slug of the post to update.
 * @param blogData Partial blog post fields to apply.
 * @returns The updated blog record.
 * @throws Error with the backend's `detail` message on failure.
 */
export async function updateBlogPost(slug: string, blogData: Partial<BlogPost>) {
  const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(blogData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to update blog" }));
    throw new Error(err.detail || "Failed to update blog");
  }
  return await res.json();
}

/**
 * Delete a blog post (admin only).
 *
 * @param slug Slug of the post to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteBlogPost(slug: string) {
  const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete blog");
  }
  return true;
}

// -------------------------------------------------------------
// Services API
// -------------------------------------------------------------
/**
 * List services.
 *
 * @returns Services from the API, or the static demo list on failure.
 */
export async function getServices(): Promise<Service[]> {
  return fetchWithFallback<Service[]>(
    `${API_BASE_URL}/services`,
    fallbackServices
  );
}

/**
 * Update an existing service (admin only).
 *
 * @param id Numeric id of the service to update.
 * @param serviceData Partial service fields to apply.
 * @returns The updated service record.
 * @throws Error when the API rejects the request.
 */
export async function updateService(id: number, serviceData: Partial<Service>) {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(serviceData),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return await res.json();
}

// -------------------------------------------------------------
// Creative Wall API
// -------------------------------------------------------------
/**
 * List creative wall items.
 *
 * @returns Items from the API, or the static demo list on failure.
 */
export async function getCreativeItems(): Promise<CreativeItem[]> {
  return fetchWithFallback<CreativeItem[]>(
    `${API_BASE_URL}/creative`,
    fallbackCreative
  );
}

/**
 * Add a new creative wall item (admin only).
 *
 * @param data Label, image URL and category of the new tile.
 * @returns The created creative item record.
 * @throws Error when the API rejects the request.
 */
export async function createCreativeItem(data: { label: string; image: string; category: string }) {
  const res = await fetch(`${API_BASE_URL}/creative`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add creative item");
  return await res.json();
}

/**
 * Delete a creative wall item (admin only).
 *
 * @param id Numeric id of the item to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteCreativeItem(id: number) {
  const res = await fetch(`${API_BASE_URL}/creative/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete creative item");
  return true;
}

// -------------------------------------------------------------
// Clients API
// -------------------------------------------------------------
/**
 * List clients.
 *
 * @returns Clients from the API, or the static demo list on failure.
 */
export async function getClients() {
  return fetchWithFallback(`${API_BASE_URL}/clients`, fallbackClients);
}

/**
 * Add a new client (admin only).
 *
 * @param data Client name plus optional quote, logo URL and featured flag.
 * @returns The created client record.
 * @throws Error when the API rejects the request.
 */
export async function createClient(data: { name: string; quote?: string; logo?: string; featured?: boolean }) {
  const res = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add client");
  return await res.json();
}

/**
 * Delete a client (admin only).
 *
 * @param id Numeric id of the client to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteClient(id: number) {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete client");
  return true;
}

// -------------------------------------------------------------
// Team Squad API
// -------------------------------------------------------------
/**
 * List team members.
 *
 * @returns Team members from the API, or an empty array on failure.
 */
export async function getTeamMembers() {
  return fetchWithFallback(`${API_BASE_URL}/team`, []);
}

/**
 * Add a new team member (admin only).
 *
 * @param data Name, role and image URL of the member.
 * @returns The created team member record.
 * @throws Error when the API rejects the request.
 */
export async function createTeamMember(data: { name: string; role: string; image: string }) {
  const res = await fetch(`${API_BASE_URL}/team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add team member");
  return await res.json();
}

/**
 * Delete a team member (admin only).
 *
 * @param id Numeric id of the member to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteTeamMember(id: number) {
  const res = await fetch(`${API_BASE_URL}/team/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete team member");
  return true;
}

// -------------------------------------------------------------
// Studio Gallery API
// -------------------------------------------------------------
/**
 * List studio gallery images.
 *
 * @returns Gallery images from the API, or an empty array on failure.
 */
export async function getGalleryImages() {
  return fetchWithFallback(`${API_BASE_URL}/gallery`, []);
}

/**
 * Add a new gallery image (admin only).
 *
 * @param data Image source URL and alt text.
 * @returns The created gallery record.
 * @throws Error when the API rejects the request.
 */
export async function createGalleryImage(data: { src: string; alt: string }) {
  const res = await fetch(`${API_BASE_URL}/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add gallery image");
  return await res.json();
}

/**
 * Delete a gallery image (admin only).
 *
 * @param id Numeric id of the image to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteGalleryImage(id: number) {
  const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete gallery image");
  return true;
}

// -------------------------------------------------------------
// Contact Inquiries API
// -------------------------------------------------------------
/** Fields submitted by the public contact form. */
export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
};

/**
 * Submit a contact form inquiry to the backend (no auth required).
 *
 * @param payload Visitor's contact details, selected service and message.
 * @returns The created inquiry record.
 * @throws Error when the API rejects the submission.
 */
export async function submitContactInquiry(payload: ContactPayload) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit inquiry");
  return await res.json();
}

/**
 * List contact inquiries for the admin dashboard.
 *
 * @returns Inquiries from the API, or an empty array on failure.
 */
export async function getContactInquiries() {
  return fetchWithFallback(`${API_BASE_URL}/contact`, []);
}

/**
 * Change an inquiry's status (admin only), e.g. "new" or "handled".
 *
 * @param id Numeric id of the inquiry.
 * @param status New status value.
 * @returns The updated inquiry record.
 * @throws Error when the API rejects the request.
 */
export async function updateInquiryStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/contact/${id}/status?status_val=${status}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
}

/**
 * Delete a contact inquiry (admin only).
 *
 * @param id Numeric id of the inquiry to delete.
 * @returns True when the deletion succeeds.
 * @throws Error when the API rejects the request.
 */
export async function deleteInquiry(id: number) {
  const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error("Failed to delete inquiry");
  return true;
}

// -------------------------------------------------------------
// Image / Media Upload API
// -------------------------------------------------------------
/** One file returned by a successful upload. */
export type UploadedMediaItem = {
  filename: string;
  url: string;
  content_type: string;
  size: number;
};

/**
 * Server-side signature endpoint for direct browser → Cloudinary uploads
 * (see `app/api/cloudinary/sign/route.ts`). Only this tiny request hits the
 * server — the file bytes go straight to Cloudinary, so Vercel's ~4.5MB
 * function request-body limit never applies (videos included).
 */
const CLOUDINARY_SIGN_ROUTE = "/api/cloudinary/sign";

// Cloudinary Free plan hard caps (image 10MB / video 100MB) — fail fast
// client-side with a clear message instead of a rejected upload.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

// Allowed formats (mirrors the old backend upload allowlist).
const ALLOWED_IMAGE_TYPE = /^image\//;
const ALLOWED_VIDEO_TYPE = /^video\/(mp4|webm|quicktime)$/;

const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

/**
 * Upload a file straight from the browser to Cloudinary.
 *
 * A signed request to `/api/cloudinary/sign` (admin JWT required) provides
 * the timestamp/signature; the file bytes then travel browser → Cloudinary
 * directly, bypassing the platform's request-body limit.
 *
 * @param file Media file selected by the admin.
 * @returns The stored `filename`, Cloudinary `url`, `content_type` and `size`.
 * @throws Error when the type/size is not allowed or the upload fails.
 */
async function uploadToCloudinary(file: File): Promise<UploadedMediaItem> {
  const video = file.type.startsWith("video/");
  if (!ALLOWED_IMAGE_TYPE.test(file.type) && !ALLOWED_VIDEO_TYPE.test(file.type)) {
    throw new Error(
      `Unsupported file type "${file.type || file.name}" — images (jpg/png/webp/gif/avif/svg) and MP4/WEBM/MOV videos only`
    );
  }
  const maxBytes = video ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(
      `"${file.name}" is ${formatMb(file.size)} — max ${formatMb(maxBytes)} for ${video ? "videos" : "images"} (Cloudinary Free plan)`
    );
  }

  const signRes = await fetch(CLOUDINARY_SIGN_ROUTE, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  });
  if (!signRes.ok) {
    const error = (await signRes.json().catch(() => ({}))) as { error?: string };
    throw new Error(error.error || "Failed to sign Cloudinary upload");
  }
  const { cloudName, apiKey, timestamp, folder, signature } = (await signRes.json()) as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
  };

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });
  const data = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    format?: string;
    bytes?: number;
    error?: { message?: string };
  };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || `Cloudinary upload failed (HTTP ${res.status})`);
  }

  return {
    filename: file.name,
    url: data.secure_url,
    content_type: file.type || `image/${data.format ?? "png"}`,
    size: data.bytes ?? file.size,
  };
}

/**
 * Upload a single media file (image or video) to Cloudinary.
 *
 * @param file Media file selected by the admin.
 * @returns The stored `filename`, Cloudinary `url`, `content_type` and `size`.
 * @throws Error explaining why the upload failed.
 */
export async function uploadImage(file: File): Promise<UploadedMediaItem> {
  return uploadToCloudinary(file);
}

/**
 * Upload several media files (used by multi-image admin forms and the
 * media library).
 *
 * Files go up one at a time: each is a signed direct-to-Cloudinary upload.
 *
 * @param files File list or array of files to upload.
 * @returns The uploaded records; empty if none succeeded.
 * @throws Error with the first failure's message when every file failed.
 */
export async function uploadMultipleImages(files: FileList | File[]): Promise<UploadedMediaItem[]> {
  const uploaded: UploadedMediaItem[] = [];
  let lastError: Error | null = null;

  for (const file of Array.from(files)) {
    try {
      uploaded.push(await uploadImage(file));
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Failed to upload file");
    }
  }

  if (uploaded.length === 0 && lastError) throw lastError;
  return uploaded;
}

/** A Cloudinary asset listed by the admin media library. */
export type MediaFileItem = {
  filename: string;
  url: string;
  content_type: string;
  size: number;
  modified_at: string;
};

/**
 * List previously uploaded media files (newest first) so admin forms can
 * pick from the library instead of re-uploading. Backed by the Cloudinary
 * Admin API via `/api/cloudinary/media` (admin JWT required).
 *
 * @returns The library files; throws when the listing fails.
 */
export async function listMedia(): Promise<MediaFileItem[]> {
  const res = await fetch("/api/cloudinary/media", {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(errorData.detail || "Failed to load media library");
  }

  const data = (await res.json()) as { files?: MediaFileItem[] };
  return data.files || [];
}
