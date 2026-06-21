from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from app.models.mood import MoodEntry
from app.models.journal import JournalEntry

def get_weekly_averages(db: Session, user_id: int) -> dict:
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

    # Aggregate in SQL (AVG/COUNT) instead of pulling every row into Python —
    # scales to large histories without growing memory or transfer size.
    stats = (
        db.query(
            func.avg(MoodEntry.stress_level),
            func.avg(MoodEntry.energy_level),
            func.avg(MoodEntry.sleep_quality),
            func.avg(MoodEntry.productivity_score),
            func.count(MoodEntry.id),
        )
        .filter(MoodEntry.user_id == user_id, MoodEntry.created_at >= seven_days_ago)
        .one()
    )
    avg_stress, avg_energy, avg_sleep, avg_productivity, count = stats

    if not count:
        return {}

    mood_counts = dict(
        db.query(MoodEntry.mood, func.count(MoodEntry.id))
        .filter(MoodEntry.user_id == user_id, MoodEntry.created_at >= seven_days_ago)
        .group_by(MoodEntry.mood)
        .all()
    )

    return {
        "avg_stress": round(avg_stress, 2),
        "avg_energy": round(avg_energy, 2),
        "avg_sleep": round(avg_sleep, 2),
        "avg_productivity": round(avg_productivity, 2),
        "total_entries": count,
        "mood_counts": mood_counts
    }

def get_mood_trend(db: Session, user_id: int, days: int = 7) -> list:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id,
        MoodEntry.created_at >= since
    ).order_by(MoodEntry.created_at.asc()).all()

    return [
        {
            "date": e.created_at.strftime("%Y-%m-%d"),
            "mood": e.mood,
            "stress": e.stress_level,
            "energy": e.energy_level,
            "sleep": e.sleep_quality,
            "productivity": e.productivity_score
        }
        for e in entries
    ]

def get_sentiment_trend(db: Session, user_id: int, days: int = 7) -> list:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == user_id,
        JournalEntry.created_at >= since,
        JournalEntry.sentiment_score != None
    ).order_by(JournalEntry.created_at.asc()).all()

    return [
        {
            "date": e.created_at.strftime("%Y-%m-%d"),
            "sentiment": e.sentiment,
            "score": e.sentiment_score,
            "title": e.title
        }
        for e in entries
    ]

def get_mood_distribution(db: Session, user_id: int) -> dict:
    return dict(
        db.query(MoodEntry.mood, func.count(MoodEntry.id))
        .filter(MoodEntry.user_id == user_id)
        .group_by(MoodEntry.mood)
        .all()
    )

def get_sleep_productivity_correlation(db: Session, user_id: int) -> list:
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id
    ).order_by(MoodEntry.created_at.desc()).limit(30).all()

    return [
        {
            "date": e.created_at.strftime("%Y-%m-%d"),
            "sleep": e.sleep_quality,
            "productivity": e.productivity_score,
            "energy": e.energy_level,
            "stress": e.stress_level
        }
        for e in entries
    ]