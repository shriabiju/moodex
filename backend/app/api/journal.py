from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.journal import (
    JournalEntryCreate,
    JournalEntryResponse,
    JournalEntryUpdate,
    SentimentResponse
)
from app.services.journal_service import (
    create_journal_entry,
    get_journal_entries,
    get_journal_entry_by_id,
    update_journal_entry,
    delete_journal_entry,
    analyze_journal_text
)

router = APIRouter(prefix="/api/journal", tags=["Journal"])

@router.post("/", response_model=JournalEntryResponse)
def create_entry(
    data: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_journal_entry(db, current_user.id, data)

@router.get("/", response_model=List[JournalEntryResponse])
def get_entries(
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_journal_entries(db, current_user.id, limit)

@router.get("/{entry_id}", response_model=JournalEntryResponse)
def get_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_journal_entry_by_id(db, entry_id, current_user.id)

@router.put("/{entry_id}", response_model=JournalEntryResponse)
def update_entry(
    entry_id: int,
    data: JournalEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_journal_entry(db, entry_id, current_user.id, data)

@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_journal_entry(db, entry_id, current_user.id)

@router.post("/analyze", response_model=SentimentResponse)
def analyze_text(
    payload: dict,
    current_user: User = Depends(get_current_user)
):
    text = payload.get("text", "")
    return analyze_journal_text(text)