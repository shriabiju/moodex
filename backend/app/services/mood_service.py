from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from app.models.mood import MoodEntry
from app.schemas.mood import MoodEntryCreate, MoodEntryUpdate

def create_mood_entry(db: Session, user_id: int, data: MoodEntryCreate) -> MoodEntry:
    entry = MoodEntry(
        user_id=user_id,
        mood=data.mood,
        stress_level=data.stress_level,
        energy_level=data.energy_level,
        sleep_quality=data.sleep_quality,
        productivity_score=data.productivity_score,
        notes=data.notes
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_mood_entries(db: Session, user_id: int, limit: int = 30) -> list:
    return (
        db.query(MoodEntry)
        .filter(MoodEntry.user_id == user_id)
        .order_by(MoodEntry.created_at.desc())
        .limit(limit)
        .all()
    )

def get_mood_entry_by_id(db: Session, entry_id: int, user_id: int) -> MoodEntry:
    entry = db.query(MoodEntry).filter(
        MoodEntry.id == entry_id,
        MoodEntry.user_id == user_id
    ).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mood entry not found"
        )
    return entry

def update_mood_entry(db: Session, entry_id: int, user_id: int, data: MoodEntryUpdate) -> MoodEntry:
    entry = get_mood_entry_by_id(db, entry_id, user_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry

def delete_mood_entry(db: Session, entry_id: int, user_id: int) -> dict:
    entry = get_mood_entry_by_id(db, entry_id, user_id)
    db.delete(entry)
    db.commit()
    return {"message": "Mood entry deleted successfully"}

def get_weekly_mood_summary(db: Session, user_id: int) -> list:
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    entries = (
        db.query(MoodEntry)
        .filter(
            MoodEntry.user_id == user_id,
            MoodEntry.created_at >= seven_days_ago
        )
        .order_by(MoodEntry.created_at.asc())
        .all()
    )
    return entries