"""One-off migration: rewrite Vercel Blob URLs in the database → Cloudinary.

Run from the backend/ directory, against the SAME Neon database production
uses (backend/.env points at it):

    python scripts/rewrite_blob_urls.py [--dry-run]

Inputs:
    frontend/scripts/blob-to-cloudinary-mapping.json
        { blobPathname: cloudinarySecureUrl } produced by
        frontend/scripts/migrate-blob-to-cloudinary.mjs

What it does:
    1. Scans EVERY text/JSON column of every table (blogs.content,
       projects.gallery, gallery.src, creative, team, …) for the two URL
       shapes the frontend ever stored for blob media:
         - /api/blob/file?p=<url-encoded pathname>   (proxied, relative)
         - https://*.blob.vercel-storage.com/<pathname>  (raw host URL)
       and replaces them with the mapped Cloudinary URL.
    2. Reports how many references were replaced, how many could not be
       mapped (must be 0 before blob cleanup), and a final verification scan
       confirming zero blob references remain.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, Optional, Set
from urllib.parse import unquote

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # allow `python scripts/...` too

# Windows consoles default to cp1252, which cannot encode → ✓ etc.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from sqlalchemy import JSON, String, TEXT, select  # noqa: E402
from sqlalchemy.dialects.postgresql import JSONB  # noqa: E402

from app.database import SessionLocal, engine, Base  # noqa: E402  (loads .env via app.config)

MAPPING_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "frontend" / "scripts" / "blob-to-cloudinary-mapping.json"
)

# The two URL shapes ever stored for blob media (see frontend/lib/api.ts history).
PROXY_RE = re.compile(r"/api/blob/file\?p=([^&\s\"'<>)]+)")
RAW_HOST_RE = re.compile(r"https?://[a-z0-9.-]*\.blob\.vercel-storage\.com/([^\s\"'<>)]+)", re.IGNORECASE)

# Substrings that must be gone from every text cell after the rewrite.
BLOB_MARKERS = ("/api/blob/file", "blob.vercel-storage")


def is_texty(column) -> bool:
    """Only read columns that can hold a URL — never binary/numeric/datetime."""
    return isinstance(column.type, (JSON, JSONB, TEXT, String))


def rewrite_str(value: str, mapping: Dict[str, str], unmapped: Set[str]) -> str:
    def replace(match: re.Match) -> str:
        pathname = unquote(match.group(1))
        replacement = mapping.get(pathname)
        if replacement is None:
            unmapped.add(pathname)
            return match.group(0)
        return replacement

    return PROXY_RE.sub(replace, RAW_HOST_RE.sub(replace, value))


def rewrite_value(value: Any, mapping: Dict[str, str], unmapped: Set[str]) -> Any:
    """Recursively rewrite strings inside JSON lists/objects; pass through others."""
    if isinstance(value, str):
        return rewrite_str(value, mapping, unmapped)
    if isinstance(value, list):
        return [rewrite_value(v, mapping, unmapped) for v in value]
    if isinstance(value, dict):
        return {k: rewrite_value(v, mapping, unmapped) for k, v in value.items()}
    return value


def blob_marker_count(value: Any) -> int:
    """How many blob references still live inside a (possibly nested) value."""
    if isinstance(value, str):
        return sum(value.count(marker) for marker in BLOB_MARKERS)
    if isinstance(value, list):
        return sum(blob_marker_count(v) for v in value)
    if isinstance(value, dict):
        return sum(blob_marker_count(v) for v in value.values())
    return 0


def run(dry_run: bool) -> None:
    if not MAPPING_PATH.is_file():
        sys.exit(f"Mapping file not found: {MAPPING_PATH}\nRun frontend/scripts/migrate-blob-to-cloudinary.mjs --run first.")

    mapping: Dict[str, str] = json.loads(MAPPING_PATH.read_text(encoding="utf-8"))
    print(f"Loaded {len(mapping)} pathname → Cloudinary URL mapping(s) from {MAPPING_PATH}")

    db = SessionLocal()
    changed_cells = 0
    changed_rows = 0
    unmapped: Set[str] = set()
    try:
        for table in Base.metadata.sorted_tables:
            rows = db.execute(select(table)).all()
            for row in rows:
                updates: Dict[str, Any] = {}
                for column in table.columns:
                    if not is_texty(column):
                        continue
                    value = row._mapping[column.name]
                    if value is None:
                        continue
                    new_value = rewrite_value(value, mapping, unmapped)
                    if new_value != value:
                        updates[column.name] = new_value
                        print(f"  {'[dry-run] ' if dry_run else ''}{table.name}.{column.name}#{row._mapping.get('id', '?')}: blob URL → Cloudinary")
                        changed_cells += 1
                if updates:
                    changed_rows += 1
                    if not dry_run:
                        pk = {c.name: row._mapping[c.name] for c in table.primary_key.columns}
                        if not pk:
                            print(f"  ⚠ skip {table.name}: no primary key, update manually")
                            continue
                        stmt = table.update().where(
                            *[(table.c[k] == v) for k, v in pk.items()]
                        ).values(**updates)
                        db.execute(stmt)
        if not dry_run:
            db.commit()

        # Final verification pass — fresh read, count whatever still points at blob.
        remaining = 0
        remaining_where: Dict[str, int] = {}
        for table in Base.metadata.sorted_tables:
            for row in db.execute(select(table)).all():
                for column in table.columns:
                    if not is_texty(column):
                        continue
                    n = blob_marker_count(row._mapping[column.name])
                    if n:
                        remaining += n
                        key = f"{table.name}.{column.name}"
                        remaining_where[key] = remaining_where.get(key, 0) + n

        print(f"\nRewrote {changed_cells} cell(s) across {changed_rows} row(s).")
        if unmapped:
            print(f"\n⚠️  {len(unmapped)} blob pathname(s) had NO Cloudinary mapping (file was deleted before migration?):")
            for p in sorted(unmapped):
                print(f"    {p}")
            print("    → Re-run migrate-blob-to-cloudinary.mjs for any that still exist in the blob store.")
        if dry_run:
            print("\nDry run only — nothing was written. Re-run without --dry-run to apply.")
        elif remaining:
            print(f"\n❌ {remaining} blob reference(s) still remain: {remaining_where}")
            print("    Fix mapping and re-run before deleting anything from blob storage.")
        else:
            print("\n✅ Verification: 0 blob references remain in the database.")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Print what would change without writing")
    args = parser.parse_args()
    run(args.dry_run)
