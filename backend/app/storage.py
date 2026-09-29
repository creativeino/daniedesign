"""Database-backed media storage.

Uploads are stored as rows in `stored_files` instead of on the local disk:
Vercel serverless functions have an ephemeral, read-only filesystem, while the
Neon Postgres database is shared between local dev and production, so a file
written from either environment is servable from both.
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from sqlalchemy import func, or_

from app.database import SessionLocal
from app.models.stored_file import StoredFile

# Extension allowlists used by the media-library kind filter (mirrors upload.py)
IMAGE_EXTS = {
    ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".bmp", ".tif", ".tiff",
    ".avif", ".ico", ".jfif", ".heic", ".heif",
}
VIDEO_EXTS = {".mp4", ".webm", ".mov"}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def save_file(contents: bytes, ext: str, content_type: Optional[str]) -> str:
    """Persist bytes as a StoredFile row and return its generated filename."""
    filename = f"{uuid.uuid4().hex}{ext.lower()}"
    db = SessionLocal()
    try:
        db.add(StoredFile(
            filename=filename,
            content_type=content_type or "application/octet-stream",
            size=len(contents),
            modified_at=_now(),
            data=contents,
        ))
        db.commit()
    finally:
        db.close()
    return filename


def load_file(filename: str) -> Optional[Tuple[bytes, str]]:
    """Return (data, content_type) for a stored file, or None if it doesn't exist."""
    # defense-in-depth against path traversal (the URL route can't contain "/"
    # anyway, but never pass untrusted strings into a lookup)
    if not filename or "/" in filename or "\\" in filename or ".." in filename:
        return None
    db = SessionLocal()
    try:
        row = db.query(StoredFile).filter(StoredFile.filename == filename).first()
        if row is None or row.data is None:
            return None
        return bytes(row.data), row.content_type
    finally:
        db.close()


def list_files(kind: str = "all", limit: int = 200) -> Tuple[List[StoredFile], int]:
    """Newest-first metadata (image/all) and the total match count.

    Selects StoredFile entities without touching the `data` column, so listing
    the media library never streams blobs back from the database.
    """
    db = SessionLocal()
    try:
        query = db.query(
            StoredFile.id, StoredFile.filename, StoredFile.content_type,
            StoredFile.size, StoredFile.modified_at,
        )
        exts = None
        content_type_prefix = None
        if kind == "image":
            exts = IMAGE_EXTS
            content_type_prefix = "image/"
        elif kind == "video":
            exts = VIDEO_EXTS
            content_type_prefix = "video/"
        if exts is not None:
            # Match on the stored MIME type first (covers unfamiliar extensions
            # such as `.heic`) with an extension LIKE as the fallback for rows
            # saved with a generic `application/octet-stream` content type.
            query = query.filter(
                or_(
                    func.lower(StoredFile.content_type).like(f"{content_type_prefix}%"),
                    *[func.lower(StoredFile.filename).like(f"%{e}") for e in sorted(exts)],
                )
            )
        total = query.count()
        rows = query.order_by(StoredFile.modified_at.desc()).limit(limit).all()
        # Hydrate lightweight objects with the same attribute names the router expects
        return [StoredFile(**row._asdict()) for row in rows], total
    finally:
        db.close()
