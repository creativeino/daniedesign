"""Transactional email via Resend: notifies the site owner about new inquiries.

Sending is best-effort — a contact submission must succeed even when email is
misconfigured or the Resend API is down, so every failure is logged, not raised.
"""

import html
import logging
from dataclasses import dataclass
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class InquiryEmail:
    """Plain-data snapshot of a contact submission, safe to hand to a
    background task after the DB session has closed."""

    submission_id: int
    name: str
    email: str
    service: str
    company: Optional[str] = ""
    message: str = ""


def _email_html(inquiry: InquiryEmail) -> str:
    """Build the notification body; visitor text is escaped before embedding."""
    rows = [
        ("Name", inquiry.name),
        ("Email", inquiry.email),
        ("Company", inquiry.company or "—"),
        ("Service", inquiry.service),
    ]
    message = (inquiry.message or "").strip()
    row_html = "".join(
        f"<tr><td style='padding:6px 12px 6px 0;color:#6b7280;"
        f"white-space:nowrap;vertical-align:top'>{label}</td>"
        f"<td style='padding:6px 0;color:#111827'>{html.escape(str(value))}</td></tr>"
        for label, value in rows
    )
    message_html = (
        f"<p style='margin:12px 0 0;padding:12px;background:#f9fafb;border-radius:8px;"
        f"color:#111827'>{html.escape(message).replace(chr(10), '<br>')}</p>"
        if message
        else ""
    )
    return (
        "<div style='font-family:ui-sans-serif,system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;"
        "font-size:14px;line-height:1.5'>"
        f"<h2 style='margin:0 0 12px;font-size:16px'>New inquiry from "
        f"{html.escape(inquiry.name)}</h2>"
        f"<table style='border-collapse:collapse'>{row_html}</table>"
        f"{message_html}"
        f"<p style='margin:16px 0 0;color:#6b7280'>Replied to: "
        f"<a href='mailto:{html.escape(inquiry.email)}'>{html.escape(inquiry.email)}</a></p>"
        "</div>"
    )


def send_inquiry_notification(inquiry: InquiryEmail) -> bool:
    """Email the admin about a stored inquiry.

    Returns True on success. Never raises: a missing key, an API error or a
    rejected send is logged and reported as False.
    """
    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set; skipping inquiry notification")
        return False

    try:
        import resend  # imported lazily so the app boots without the package

        resend.api_key = settings.RESEND_API_KEY
        # The SDK defaults to a 30s timeout — the same as the Vercel function's
        # maxDuration. Cap it lower so a slow API can't stall the whole request.
        resend.default_http_client = resend.RequestsClient(timeout=8)

        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": settings.RESEND_TO_EMAIL,
            "reply_to": inquiry.email,  # one-click reply goes to the visitor
            "subject": f"New inquiry: {inquiry.name} — {inquiry.service}",
            "html": _email_html(inquiry),
        })
        logger.info("Sent inquiry notification for submission #%s", inquiry.submission_id)
        return True
    except Exception as e:
        logger.error("Resend notification failed for submission #%s: %s", inquiry.submission_id, e)
        return False
