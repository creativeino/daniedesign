"""FastAPI application entry point: wires up CORS, uploads serving, routers and startup seeding."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from app import storage
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import (
    auth_router,
    dashboard_router,
    upload_router,
    projects_router,
    blogs_router,
    services_router,
    creative_router,
    clients_router,
    team_router,
    gallery_router,
    stats_router,
    contact_router,
    cloudinary_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs on startup (create tables + seed) and shutdown; a startup failure is logged, not fatal."""
    logger.info("Connecting to Neon DB & creating tables...")
    try:
        # create_all is idempotent: it only creates tables that don't already exist
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized.")

        # Seed demo/initial content once, on its own session (seeding is skipped for non-empty tables)
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        # Keep serving even if the DB is unreachable; endpoints will surface the errors
        logger.error(f"Database startup error: {e}")

    # Hand control to the running application; shutdown continues below on exit
    yield
    logger.info("Backend shut down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Danie Design CRM & Website FastAPI Backend powered by Neon PostgreSQL.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS: open to all origins in development, restricted in production. Keep the
# production frontend here as well as in config so an older CORS_ORIGINS Vercel
# environment variable cannot accidentally block the deployed CMS.
production_origins = list(dict.fromkeys([
    *settings.cors_origin_list,
    # Current production frontend (Sarfraz Vercel account).
    "https://daniedesign-six.vercel.app",
    # Transitional — old account's domains, removable once it is retired.
    "https://daniedesign.vercel.app",
    "https://daniedesign-3zq6.vercel.app",
]))
# Preview deployments get generated hosts
# (daniedesign-git-<branch>-<team>.vercel.app / daniedesign-<id>-<team>.vercel.app);
# cover this project's previews so admin uploads work while testing PRs.
preview_origin_regex = r"^https://daniedesign(-git-[\w-]+|-[0-9a-z]+)?-sarfraz-ahmads-projects-39784d47\.vercel\.app$"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else production_origins,
    allow_origin_regex=preview_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads are stored in the database (Vercel's function filesystem is read-only
# and ephemeral) and served by the /uploads/{filename} route below.

# Include Routers (all API routes live under the /api prefix)
app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(blogs_router, prefix="/api")
app.include_router(services_router, prefix="/api")
app.include_router(creative_router, prefix="/api")
app.include_router(clients_router, prefix="/api")
app.include_router(team_router, prefix="/api")
app.include_router(gallery_router, prefix="/api")
app.include_router(stats_router, prefix="/api")
app.include_router(contact_router, prefix="/api")
app.include_router(cloudinary_router, prefix="/api")

@app.get("/", tags=["Health"])
def health_check():
    """Public health endpoint used by uptime checks and the frontend to verify the API is up."""
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "database": "Neon PostgreSQL",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "crm_auth": "/api/auth/login",
    }

@app.get("/uploads/{filename}", tags=["Uploads & Media"], summary="Serve an uploaded media file")
def serve_upload(filename: str):
    """GET /uploads/{filename} — returns the stored bytes with their content type.

    Filenames are UUID-based and immutable, so the response is safe to cache
    aggressively at the edge.
    """
    loaded = storage.load_file(filename)
    if loaded is None:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = loaded
    return Response(
        content=data,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
