from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.mood import MoodEntryCreate, MoodEntryResponse, MoodEntryUpdate
from app.services.mood_service import (
    create_mood_entry,
    get_mood_entries,
    get_mood_entry_by_id,
    update_mood_entry,
    delete_mood_entry,
    get_weekly_mood_summary
)

router = APIRouter(prefix="/api/mood", tags=["Mood"])

@router.post("/", response_model=MoodEntryResponse)
def log_mood(
    data: MoodEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_mood_entry(db, current_user.id, data)

@router.get("/", response_model=List[MoodEntryResponse])
def get_moods(
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_mood_entries(db, current_user.id, limit)

@router.get("/weekly", response_model=List[MoodEntryResponse])
def get_weekly(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_weekly_mood_summary(db, current_user.id)

@router.get("/{entry_id}", response_model=MoodEntryResponse)
def get_mood(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_mood_entry_by_id(db, entry_id, current_user.id)

@router.put("/{entry_id}", response_model=MoodEntryResponse)
def update_mood(
    entry_id: int,
    data: MoodEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_mood_entry(db, entry_id, current_user.id, data)

@router.delete("/{entry_id}")
def delete_mood(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_mood_entry(db, entry_id, current_user.id)