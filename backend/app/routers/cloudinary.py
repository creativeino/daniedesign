"""Cloudinary helpers for the admin CMS.

Provides two endpoints:
  POST /api/cloudinary/sign   — returns a short-lived Cloudinary upload signature
                                so the browser can POST files directly (bypassing
                                the serverless request-body limit).
  GET  /api/cloudinary/media  — lists every asset in the Cloudinary library
                                (images + videos), newest first.

Both endpoints require a valid admin JWT (Authorization: Bearer <token>).
Cloudinary credentials are read from the CLOUDINARY_URL environment variable
(cloudinary://api_key:api_secret@cloud_name).
"""

import hashlib
import os
import time
from urllib.parse import unquote, urlparse

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.auth import get_current_admin

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(prefix="/cloudinary", tags=["Cloudinary"])

# Folder every admin upload lands in (keep in sync with the frontend constant).
UPLOAD_FOLDER = "daniedesign"


# ---------------------------------------------------------------------------
# Cloudinary credentials helper
# ---------------------------------------------------------------------------

def _creds() -> dict:
    """Parse CLOUDINARY_URL → {cloud_name, api_key, api_secret}.

    Raises HTTP 503 when the variable is absent or malformed.
    """
    raw = os.environ.get("CLOUDINARY_URL", "")
    if not raw:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cloudinary is not configured (CLOUDINARY_URL missing)",
        )
    try:
        parsed = urlparse(raw)
        return {
            "cloud_name": parsed.hostname,
            "api_key": unquote(parsed.username or ""),
            "api_secret": unquote(parsed.password or ""),
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CLOUDINARY_URL is malformed",
        )


# ---------------------------------------------------------------------------
# POST /api/cloudinary/sign
# ---------------------------------------------------------------------------

class SignResponse(BaseModel):
    cloudName: str
    apiKey: str
    timestamp: int
    folder: str
    signature: str


@router.post("/sign", response_model=SignResponse, summary="Get a Cloudinary upload signature")
def sign_upload(admin=Depends(get_current_admin)):
    """Return a short-lived Cloudinary signature so the browser can upload
    files directly to Cloudinary (file bytes never touch this server)."""
    creds = _creds()
    ts = int(time.time())
    # Signature must cover exactly the params the browser will submit.
    to_sign = f"folder={UPLOAD_FOLDER}&timestamp={ts}{creds['api_secret']}"
    signature = hashlib.sha256(to_sign.encode()).hexdigest()

    return SignResponse(
        cloudName=creds["cloud_name"],
        apiKey=creds["api_key"],
        timestamp=ts,
        folder=UPLOAD_FOLDER,
        signature=signature,
    )


# ---------------------------------------------------------------------------
# GET /api/cloudinary/media
# ---------------------------------------------------------------------------

class MediaFile(BaseModel):
    filename: str
    url: str
    content_type: str
    size: int
    modified_at: str


class MediaListResponse(BaseModel):
    files: list[MediaFile]
    total: int


@router.get("/media", response_model=MediaListResponse, summary="List Cloudinary media library")
def list_media(admin=Depends(get_current_admin)):
    """Return every uploaded Cloudinary asset (images + videos), newest first."""
    try:
        import cloudinary
        import cloudinary.api  # type: ignore
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="cloudinary package is not installed on the backend",
        )

    creds = _creds()
    cloudinary.config(
        cloud_name=creds["cloud_name"],
        api_key=creds["api_key"],
        api_secret=creds["api_secret"],
    )

    MAX_RESULTS = 500
    try:
        images = cloudinary.api.resources(
            resource_type="image", type="upload", max_results=MAX_RESULTS
        )
        videos = cloudinary.api.resources(
            resource_type="video", type="upload", max_results=MAX_RESULTS
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        )

    def to_item(r: dict) -> MediaFile:
        ext = r.get("format", "")
        resource_type = r.get("resource_type", "image")
        last_segment = (r.get("public_id") or "").split("/")[-1]
        content_type = (
            f"video/{ext or 'mp4'}"
            if resource_type == "video"
            else f"image/{'jpeg' if ext == 'jpg' else ext or 'png'}"
        )
        return MediaFile(
            filename=f"{last_segment}.{ext}" if ext else last_segment,
            url=r.get("secure_url", ""),
            content_type=content_type,
            size=r.get("bytes", 0),
            modified_at=r.get("created_at", ""),
        )

    resources = [*images.get("resources", []), *videos.get("resources", [])]
    files = sorted(
        [to_item(r) for r in resources],
        key=lambda f: f.modified_at,
        reverse=True,
    )

    return MediaListResponse(files=files, total=len(files))
