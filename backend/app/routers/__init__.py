"""Re-exports every APIRouter so main.py can import them from one place."""
from app.routers.auth import router as auth_router
from app.routers.dashboard import router as dashboard_router
from app.routers.upload import router as upload_router
from app.routers.projects import router as projects_router
from app.routers.blogs import router as blogs_router
from app.routers.services import router as services_router
from app.routers.creative import router as creative_router
from app.routers.clients import router as clients_router
from app.routers.team import router as team_router
from app.routers.gallery import router as gallery_router
from app.routers.stats import router as stats_router
from app.routers.contact import router as contact_router
from app.routers.cloudinary import router as cloudinary_router

__all__ = [
    "auth_router",
    "dashboard_router",
    "upload_router",
    "projects_router",
    "blogs_router",
    "services_router",
    "creative_router",
    "clients_router",
    "team_router",
    "gallery_router",
    "stats_router",
    "contact_router",
    "cloudinary_router",
]
