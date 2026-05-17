from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.analytics_service import (
    get_weekly_averages,
    get_mood_trend,
    get_sentiment_trend,
    get_mood_distribution,
    get_sleep_productivity_correlation
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/summary")
def weekly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_weekly_averages(db, current_user.id)

@router.get("/mood-trend")
def mood_trend(
    days: int = Query(default=7, ge=1, le=30),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_mood_trend(db, current_user.id, days)

@router.get("/sentiment-trend")
def sentiment_trend(
    days: int = Query(default=7, ge=1, le=30),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_sentiment_trend(db, current_user.id, days)

@router.get("/mood-distribution")
def mood_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_mood_distribution(db, current_user.id)

@router.get("/correlations")
def correlations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_sleep_productivity_correlation(db, current_user.id)