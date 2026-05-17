from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.journal import JournalEntry
from app.schemas.journal import JournalEntryCreate, JournalEntryUpdate
from app.services.nlp_service import analyze_sentiment

def create_journal_entry(db: Session, user_id: int, data: JournalEntryCreate) -> JournalEntry:
    # Run NLP on content
    nlp_result = analyze_sentiment(data.content)

    entry = JournalEntry(
        user_id=user_id,
        title=data.title,
        content=data.content,
        sentiment=nlp_result["sentiment"],
        sentiment_score=nlp_result["sentiment_score"],
        emotional_tags=",".join(nlp_result["emotional_tags"]),
        ai_summary=None  # Phase 2 — AI summary
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def get_journal_entries(db: Session, user_id: int, limit: int = 30) -> list:
    return (
        db.query(JournalEntry)
        .filter(JournalEntry.user_id == user_id)
        .order_by(JournalEntry.created_at.desc())
        .limit(limit)
        .all()
    )

def get_journal_entry_by_id(db: Session, entry_id: int, user_id: int) -> JournalEntry:
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == user_id
    ).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    return entry

def update_journal_entry(db: Session, entry_id: int, user_id: int, data: JournalEntryUpdate) -> JournalEntry:
    entry = get_journal_entry_by_id(db, entry_id, user_id)
    if data.title:
        entry.title = data.title
    if data.content:
        # Re-run NLP if content changed
        nlp_result = analyze_sentiment(data.content)
        entry.content = data.content
        entry.sentiment = nlp_result["sentiment"]
        entry.sentiment_score = nlp_result["sentiment_score"]
        entry.emotional_tags = ",".join(nlp_result["emotional_tags"])
    db.commit()
    db.refresh(entry)
    return entry

def delete_journal_entry(db: Session, entry_id: int, user_id: int) -> dict:
    entry = get_journal_entry_by_id(db, entry_id, user_id)
    db.delete(entry)
    db.commit()
    return {"message": "Journal entry deleted successfully"}

def analyze_journal_text(text: str) -> dict:
    return analyze_sentiment(text)