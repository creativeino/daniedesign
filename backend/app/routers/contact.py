"""Contact form router: public inquiry submission plus admin triage endpoints."""
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.email import InquiryEmail, send_inquiry_notification
from app.models.contact import ContactSubmission
from app.schemas.stat import ContactCreate, ContactResponse

router = APIRouter(prefix="/contact", tags=["Contact Inquiries"])

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED, summary="Submit inquiry")
def submit_contact_form(contact_in: ContactCreate, background: BackgroundTasks, db: Session = Depends(get_db)):
    """POST /contact — public endpoint for the website contact form; stores
    the inquiry with a default status and returns 201, then notifies the
    site owner via Resend (best-effort, off the response path)."""
    submission = ContactSubmission(**contact_in.model_dump())
    db.add(submission)
    db.commit()
    db.refresh(submission)
    background.add_task(
        send_inquiry_notification,
        InquiryEmail(
            submission_id=submission.id,
            name=submission.name,
            email=submission.email,
            service=submission.service,
            company=submission.company,
            message=submission.message,
        ),
    )
    return submission

@router.get("", response_model=List[ContactResponse], summary="Get inquiries")
def get_contact_submissions(db: Session = Depends(get_db)):
    """GET /contact — lists all inquiries, newest first (admin CMS use;
    contains visitors' personal data)."""
    return db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()

@router.patch("/{submission_id}/status", response_model=ContactResponse, summary="Update inquiry status")
def update_inquiry_status(submission_id: int, status_val: str, db: Session = Depends(get_db)):
    """PATCH /contact/{submission_id}/status — moves an inquiry through the
    triage workflow (admin CMS use). The new status arrives as a raw query
    parameter and is stored verbatim; 404 if the submission does not exist."""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    submission.status = status_val
    db.commit()
    db.refresh(submission)
    return submission

@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete inquiry")
def delete_contact_submission(submission_id: int, db: Session = Depends(get_db)):
    """DELETE /contact/{submission_id} — permanently removes the inquiry
    (admin CMS use); 404 if unknown id, 204 on success."""
    submission = db.query(ContactSubmission).filter(ContactSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    db.delete(submission)
    db.commit()
    return None
