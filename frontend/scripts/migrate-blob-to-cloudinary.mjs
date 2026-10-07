#!/usr/bin/env node
/**
 * One-off migration: Vercel Blob (private store) → Cloudinary.
 *
 * Usage (from frontend/):
 *   node scripts/migrate-blob-to-cloudinary.mjs --list
 *       Inventory of every blob file + Cloudinary Free-plan limit report
 *       (image > 10MB / video > 100MB = cannot upload on Free plan).
 *
 *   node scripts/migrate-blob-to-cloudinary.mjs --run [--dry-run]
 *       Upload each blob to Cloudinary (folder: daniedesign/migrated) and
 *       checkpoint results to blob-to-cloudinary-mapping.json after every
 *       file. Already-mapped files are skipped, so the script is re-runnable.
 *
 *   node scripts/migrate-blob-to-cloudinary.mjs --verify
 *       Confirm every mapped file exists in Cloudinary with the same byte
 *       size as the original blob. Run before --delete-blobs.
 *
 *   node scripts/migrate-blob-to-cloudinary.mjs --delete-blobs
 *       Destructive: remove the original files from the Vercel Blob store
 *       (only files that are in the mapping, and aborts if any blob file is
 *       unmapped). Run only after --verify passes.
 *
 * The resulting mapping.json { blobPathname: cloudinarySecureUrl } is then
 * consumed by backend/scripts/rewrite_blob_urls.py to rewrite DB URLs.
 *
 * Requires frontend/.env.local to contain BLOB_READ_WRITE_TOKEN and CLOUDINARY_URL.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { list, get, del } = require("@vercel/blob");
const cloudinary = require("cloudinary").v2;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(SCRIPT_DIR, "..", ".env.local");
const MAPPING_PATH = join(SCRIPT_DIR, "blob-to-cloudinary-mapping.json");

// Cloudinary Free plan hard caps (https://cloudinary.com/pricing/compare-plans)
const FREE_MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const FREE_MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const UPLOAD_FOLDER = "daniedesign/migrated";

const args = process.argv.slice(2);
const MODE = args.includes("--list")
  ? "list"
  : args.includes("--run")
    ? "run"
    : args.includes("--verify")
      ? "verify"
      : args.includes("--delete-blobs")
        ? "delete"
        : null;
const DRY_RUN = args.includes("--dry-run");

if (!MODE) {
  console.error(
    "Usage: node scripts/migrate-blob-to-cloudinary.mjs --list | --run [--dry-run] | --verify | --delete-blobs"
  );
  process.exit(1);
}

function loadEnv() {
  const out = {};
  for (const line of readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+)=(?:"([^"]*)"|'([^']*)'|(.+))$/);
    if (m) out[m[1]] = m[2] ?? m[3] ?? m[4];
  }
  return out;
}

const env = loadEnv();
const BLOB_TOKEN = env.BLOB_READ_WRITE_TOKEN;
const CLOUDINARY_URL = env.CLOUDINARY_URL;

if (!BLOB_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN missing in frontend/.env.local");
  process.exit(1);
}
if (!CLOUDINARY_URL) {
  console.error("CLOUDINARY_URL missing in frontend/.env.local");
  process.exit(1);
}

const cu = new URL(CLOUDINARY_URL);
cloudinary.config({
  cloud_name: cu.hostname,
  api_key: decodeURIComponent(cu.username),
  api_secret: decodeURIComponent(cu.password),
});

function isVideo(pathname, contentType) {
  if (contentType?.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|qt|m4v)$/i.test(pathname);
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

/** Pagination-safe list of every blob in the store. */
async function listAllBlobs() {
  const blobs = [];
  let cursor;
  do {
    const res = await list({ token: BLOB_TOKEN, limit: 1000, ...(cursor ? { cursor } : {}) });
    blobs.push(...res.blobs);
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return blobs;
}

/** Files the Cloudinary Free plan will reject. */
function limitViolation(blob) {
  const video = isVideo(blob.pathname, blob.contentType);
  const max = video ? FREE_MAX_VIDEO_BYTES : FREE_MAX_IMAGE_BYTES;
  if (blob.size > max) {
    return `exceeds Cloudinary Free ${video ? "video" : "image"} cap (${formatMb(max)})`;
  }
  return null;
}

async function listMode() {
  const blobs = await listAllBlobs();
  console.log(`\nBlob store inventory — ${blobs.length} file(s), ${formatMb(blobs.reduce((s, b) => s + b.size, 0))} total\n`);

  const violations = [];
  let videoCount = 0;
  let imageCount = 0;
  let videoBytes = 0;
  let imageBytes = 0;

  for (const b of blobs.sort((a, b) => b.size - a.size)) {
    const video = isVideo(b.pathname, b.contentType);
    const violation = limitViolation(b);
    if (video) { videoCount++; videoBytes += b.size; } else { imageCount++; imageBytes += b.size; }
    if (violation) violations.push({ ...b, violation });
    const flag = violation ? `  ❌ ${violation}` : "";
    console.log(`  ${formatMb(b.size).padStart(8)}  ${video ? "video" : "image"}  ${b.pathname}${flag}`);
  }

  console.log(`\nSummary: ${videoCount} video(s) = ${formatMb(videoBytes)} | ${imageCount} image(s) = ${formatMb(imageBytes)}`);
  if (violations.length) {
    console.log(`\n⚠️  ${violations.length} file(s) CANNOT upload on Cloudinary Free plan:`);
    for (const v of violations) console.log(`    ${v.pathname} (${formatMb(v.size)}) — ${v.violation}`);
    console.log("    → Upgrade Cloudinary plan, or compress/split these files first.");
  } else {
    console.log("\n✅ All files fit within Cloudinary Free plan limits (image 10MB, video 100MB).");
  }
}

function loadMapping() {
  return existsSync(MAPPING_PATH) ? JSON.parse(readFileSync(MAPPING_PATH, "utf8")) : {};
}

function saveMapping(mapping) {
  writeFileSync(MAPPING_PATH, JSON.stringify(mapping, null, 2) + "\n");
}

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const sink = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: UPLOAD_FOLDER },
      (err, res) => (err ? reject(err) : resolve(res.secure_url))
    );
    sink.end(buffer);
  });
}

async function runMode() {
  const blobs = await listAllBlobs();
  const mapping = loadMapping();
  console.log(`\n${blobs.length} blob file(s) total, ${Object.keys(mapping).length} already mapped${DRY_RUN ? " (dry-run)" : ""}\n`);

  const MAX_ATTEMPTS = 4;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let migrated = 0;
  let skippedDone = 0;
  const skippedLimit = [];
  const failed = [];

  for (const b of blobs) {
    if (mapping[b.pathname]) {
      skippedDone++;
      continue;
    }
    const violation = limitViolation(b);
    if (violation) {
      skippedLimit.push(b);
      console.log(`  ⏭ SKIP ${b.pathname} (${formatMb(b.size)}) — ${violation}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`  [dry-run] would upload ${b.pathname} (${formatMb(b.size)})`);
      continue;
    }

    process.stdout.write(`  ↑ ${b.pathname} (${formatMb(b.size)}) `);
    let secureUrl = null;
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const { stream } = await get(b.pathname, { access: "private", token: BLOB_TOKEN });
        const buffer = Buffer.from(await new Response(stream).arrayBuffer());
        secureUrl = await uploadBuffer(buffer);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        if (attempt === MAX_ATTEMPTS) break;
        process.stdout.write(`[retry ${attempt + 1}/${MAX_ATTEMPTS}] `);
        await sleep(2000 * attempt);
      }
    }

    if (secureUrl) {
      mapping[b.pathname] = secureUrl;
      saveMapping(mapping); // checkpoint after every file — safe to re-run
      console.log(`done → ${secureUrl}`);
      migrated++;
    } else {
      console.log(`FAILED — ${lastError}`);
      failed.push({ pathname: b.pathname, error: lastError });
    }
  }

  console.log(`\nResult: ${migrated} uploaded, ${skippedDone} already done, ${skippedLimit.length} skipped (over Free-plan limit), ${failed.length} failed`);
  console.log(`Mapping: ${MAPPING_PATH}`);
  if (failed.length) {
    console.log("\n❌ Failed files:");
    for (const f of failed) console.log(`    ${f.pathname} — ${f.error}`);
    console.log("    → Re-run this script to retry them (mapping checkpoints are kept).");
    process.exitCode = 1;
  }
  if (skippedLimit.length) {
    console.log("⚠️  Skipped files still reference blob — resolve limits (upgrade/compress) before blob cleanup.");
  }
  if (!DRY_RUN && migrated > 0) {
    console.log("\nNext: run backend/scripts/rewrite_blob_urls.py with this mapping.");
  }
}

/** Extract the Cloudinary public_id (folder + id, no version/extension) from a delivery URL. */
function publicIdFromUrl(url) {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?(?:[?#].*)?$/i);
  return m ? m[1] : null;
}

/** Confirm every mapped file exists in Cloudinary with the original byte size. */
async function verifyMode() {
  const blobs = await listAllBlobs();
  const mapping = loadMapping();
  console.log(`\nVerifying ${blobs.length} blob file(s) against Cloudinary...\n`);

  let ok = 0;
  const problems = [];
  for (const b of blobs) {
    const url = mapping[b.pathname];
    if (!url) {
      problems.push(`${b.pathname}: NOT in mapping (never migrated)`);
      continue;
    }
    const publicId = publicIdFromUrl(url);
    const resourceType = isVideo(b.pathname, b.contentType) ? "video" : "image";
    try {
      const res = await cloudinary.api.resource(publicId, { resource_type: resourceType });
      if (res.bytes === b.size) {
        console.log(`  ✅ ${b.pathname} (${formatMb(b.size)})`);
        ok++;
      } else {
        problems.push(`${b.pathname}: size mismatch — blob ${b.size}B vs cloudinary ${res.bytes}B`);
      }
    } catch (err) {
      problems.push(`${b.pathname}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`\n${ok}/${blobs.length} file(s) verified.`);
  if (problems.length) {
    console.log("❌ Problems (do NOT delete blob files until fixed):");
    for (const p of problems) console.log(`    ${p}`);
    process.exitCode = 1;
  } else {
    console.log("✅ All migrated files match — safe to run --delete-blobs.");
  }
}

/** Destructive: delete the original files from the Vercel Blob store. */
async function deleteMode() {
  const blobs = await listAllBlobs();
  const mapping = loadMapping();
  const unmapped = blobs.filter((b) => !mapping[b.pathname]);
  if (unmapped.length) {
    console.error(`❌ ${unmapped.length} blob file(s) have no Cloudinary mapping — aborting:`);
    for (const b of unmapped) console.error(`    ${b.pathname}`);
    process.exitCode = 1;
    return;
  }
  const targets = blobs.map((b) => b.pathname);
  if (targets.length === 0) {
    console.log("Blob store is already empty — nothing to delete.");
    return;
  }
  if (DRY_RUN) {
    console.log(`[dry-run] would delete ${targets.length} file(s) from the blob store:`);
    for (const t of targets) console.log(`    ${t}`);
    return;
  }
  console.log(`Deleting ${targets.length} file(s) from the Vercel Blob store...`);
  await del(targets, { token: BLOB_TOKEN });
  console.log("✅ Done — Vercel Blob store is now empty.");
}

if (MODE === "list") {
  await listMode();
} else if (MODE === "verify") {
  await verifyMode();
} else if (MODE === "delete") {
  await deleteMode();
} else {
  await runMode();
}
