"""Application settings loaded from environment variables / .env, with safe defaults.

Secrets (DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD) have no hardcoded values:
they must come from the environment. In production a missing one fails fast at
startup instead of silently running on a leaked default.
"""

from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    """Central configuration for the API; each field can be overridden via .env."""

    PROJECT_NAME: str = "Danie Design CRM API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # Neon DB — set DATABASE_URL in the environment (backend/.env locally,
    # Vercel project settings in production); never hardcode the credential.
    DATABASE_URL: str = ""

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    BASE_URL: str = "http://localhost:8000"

    # CORS
    CORS_ORIGINS: str = (
        "http://localhost:3000,http://127.0.0.1:3000,"
        "http://localhost:3001,http://127.0.0.1:3001,"
        "https://daniedesign.vercel.app,"
        "https://daniedesign-3zq6.vercel.app"
    )

    # Uploads (files live in the DB now).
    MAX_UPLOAD_SIZE_MB: int = 25
    MAX_VIDEO_UPLOAD_SIZE_MB: int = 160

    # Admin CRM — creds must come from the environment
    ADMIN_EMAIL: str = ""
    ADMIN_PASSWORD: str = ""

    # Signing key for admin JWTs — set a strong random value in every environment
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Resend transactional email — API key must come from the environment
    RESEND_API_KEY: str = ""
    RESEND_TO_EMAIL: str = "daniedesignz@gmail.com"
    RESEND_FROM_EMAIL: str = "onboarding@resend.dev"

    @property
    def cors_origin_list(self) -> List[str]:
        """CORS_ORIGINS as a list, dropping any blank entries."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def normalized_database_url(self) -> str:
        """Rewrite legacy postgres:// scheme to postgresql:// for SQLAlchemy."""
        url = self.DATABASE_URL.strip()
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        # Load overrides from the backend/.env file; unknown keys are ignored
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

# Fail fast on serverless/production where a missing secret means a broken or
# hijackable deployment (the previous hardcoded defaults leaked a real DB URL).
if settings.ENVIRONMENT == "production":
    missing = [
        name for name in ("DATABASE_URL", "JWT_SECRET", "ADMIN_PASSWORD")
        if not getattr(settings, name)
    ]
    if missing:
        raise RuntimeError(
            f"Required environment variable(s) not set in production: {', '.join(missing)}"
        )
