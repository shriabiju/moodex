from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.mood import MoodEntry
from app.models.journal import JournalEntry

def get_weekly_averages(db: Session, user_id: int) -> dict:
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id,
        MoodEntry.created_at >= seven_days_ago
    ).all()

    if not entries:
        return {}

    count = len(entries)
    return {
        "avg_stress": round(sum(e.stress_level for e in entries) / count, 2),
        "avg_energy": round(sum(e.energy_level for e in entries) / count, 2),
        "avg_sleep": round(sum(e.sleep_quality for e in entries) / count, 2),
        "avg_productivity": round(sum(e.productivity_score for e in entries) / count, 2),
        "total_entries": count,
        "mood_counts": _count_moods(entries)
    }

def get_mood_trend(db: Session, user_id: int, days: int = 7) -> list:
    since = datetime.utcnow() - timedelta(days=days)
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
    since = datetime.utcnow() - timedelta(days=days)
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
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id
    ).all()
    return _count_moods(entries)

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

def _count_moods(entries: list) -> dict:
    counts = {}
    for e in entries:
        counts[e.mood] = counts.get(e.mood, 0) + 1
    return counts