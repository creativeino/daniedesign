"""File upload router: accepts media files and returns public URLs.

Files are stored in the database (see app.storage), not on disk, because the
app runs as serverless functions on Vercel where the filesystem is ephemeral.
The public URL is served by the GET /uploads/{filename} route in app.main.
"""
from datetime import timezone
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, status, Request
from typing import List
from app import storage
from app.config import settings
from app.schemas.stat import UploadResponse, MultipleUploadResponse, MediaFileItem, MediaListResponse

router = APIRouter(prefix="/upload", tags=["Uploads & Media"])

# extension allowlist used to reject anything that is not an accepted media format
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"}
VIDEO_EXTENSIONS = {".mp4", ".webm"}
ALLOWED_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS


def max_upload_size_mb(ext: str) -> int:
    """Per-type upload limit in MB: videos get the larger allowance."""
    return (
        settings.MAX_VIDEO_UPLOAD_SIZE_MB
        if ext in VIDEO_EXTENSIONS
        else settings.MAX_UPLOAD_SIZE_MB
    )

def get_file_url(request: Request, filename: str) -> str:
    """Build the publicly reachable URL for a stored file from the current
    request's base URL (so it works behind any host/port)."""
    base_url = str(request.base_url).rstrip("/")
    return f"{base_url}/uploads/{filename}"

# NOTE: handlers are intentionally sync `def` — they perform blocking
# SQLAlchemy work against Neon, and FastAPI runs sync handlers in a threadpool
# so the event loop stays free for other requests.

@router.post("/image", response_model=UploadResponse, summary="Upload single image or media file")
def upload_single_image(request: Request, file: UploadFile = File(...)):
    """POST /upload/image — uploads one image file (admin CMS use);
    returns 201 by default via the UploadResponse payload, 400 for bad
    extension or oversize, 500 on storage failure."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    contents = file.file.read()
    file_size = len(contents)

    # enforce the size limit after reading (UploadFile has no reliable pre-size)
    limit_mb = max_upload_size_mb(ext)
    max_bytes = limit_mb * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {limit_mb}MB"
        )

    try:
        # store under a random UUID name to prevent collisions and path traversal
        # via attacker-supplied filenames
        unique_filename = storage.save_file(contents, ext, file.content_type)
        return UploadResponse(
            filename=unique_filename,
            url=get_file_url(request, unique_filename),
            content_type=file.content_type or "application/octet-stream",
            size=file_size
        )
    except HTTPException:
        # let deliberate validation errors pass through untouched
        raise
    except Exception as e:
        # collapse any unexpected storage failure into a 500 with the error text
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )

@router.post("/multiple", response_model=MultipleUploadResponse, summary="Upload multiple gallery images")
def upload_multiple_images(request: Request, files: List[UploadFile] = File(...)):
    """POST /upload/multiple — batch upload for gallery images (admin CMS
    use). Best-effort: files with a disallowed extension or that fail to
    store are silently skipped, and the response lists only what succeeded."""
    uploaded_files: List[UploadResponse] = []

    for file in files:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue  # skip bad file, keep processing the rest of the batch

        try:
            contents = file.file.read()
            file_size = len(contents)
            max_bytes = max_upload_size_mb(ext) * 1024 * 1024
            if file_size > max_bytes:
                continue
            unique_filename = storage.save_file(contents, ext, file.content_type)
            uploaded_files.append(UploadResponse(
                filename=unique_filename,
                url=get_file_url(request, unique_filename),
                content_type=file.content_type or "application/octet-stream",
                size=file_size
            ))
        except Exception:
            continue

    return MultipleUploadResponse(uploaded=uploaded_files)

@router.get("/media", response_model=MediaListResponse, summary="List previously uploaded media files")
def list_media(
    request: Request,
    kind: str = Query("all", pattern="^(all|image|video)$"),
    limit: int = Query(200, ge=1, le=1000),
):
    """GET /upload/media — returns files already stored in the database,
    newest first, so admin forms can pick from the library instead of
    re-uploading. `kind=image` / `kind=video` filter to one media type."""
    rows, total = storage.list_files(kind=kind, limit=limit)
    items = [
        MediaFileItem(
            filename=row.filename,
            url=get_file_url(request, row.filename),
            content_type=row.content_type,
            size=row.size,
            modified_at=row.modified_at if row.modified_at.tzinfo else row.modified_at.replace(tzinfo=timezone.utc),
        )
        for row in rows
    ]
    return MediaListResponse(files=items, total=total)
