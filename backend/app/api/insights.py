from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.analytics_service import (
    get_weekly_averages,
    get_mood_trend,
    get_sleep_productivity_correlation
)

router = APIRouter(prefix="/api/insights", tags=["Insights"])

@router.get("/")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summary = get_weekly_averages(db, current_user.id)
    correlations = get_sleep_productivity_correlation(db, current_user.id)
    insights = []

    if not summary:
        return {"insights": ["Start logging your mood to get personalized insights!"]}

    # Sleep vs Stress insight
    if summary.get("avg_sleep", 0) < 5 and summary.get("avg_stress", 0) > 6:
        insights.append("Your stress tends to be higher on days with poor sleep. Try to aim for 7-8 hours.")

    # Energy vs Productivity insight
    if summary.get("avg_energy", 0) < 5:
        insights.append("Your energy levels have been low this week. Consider short breaks and light movement.")

    # Productivity insight
    if summary.get("avg_productivity", 0) >= 7:
        insights.append("Great job! Your productivity has been strong this week. Keep up the momentum.")

    # Stress insight
    if summary.get("avg_stress", 0) >= 7:
        insights.append("You've had elevated stress levels this week. Try mindfulness or breathing exercises.")

    # Sleep insight
    if summary.get("avg_sleep", 0) >= 7:
        insights.append("Your sleep quality has been excellent this week — this supports better mood stability.")

    # Mood variety insight
    mood_counts = summary.get("mood_counts", {})
    if "anxious" in mood_counts and mood_counts["anxious"] >= 3:
        insights.append("You've logged anxiety multiple times this week. Consider journaling your thoughts.")

    if "motivated" in mood_counts and mood_counts["motivated"] >= 3:
        insights.append("You've been feeling motivated frequently — a great sign of emotional momentum!")

    # Correlation insight
    high_sleep_low_productivity = [
        e for e in correlations
        if e["sleep"] >= 7 and e["productivity"] >= 7
    ]
    if len(high_sleep_low_productivity) >= 2:
        insights.append("Good sleep strongly correlates with your productive days. Keep prioritizing rest.")

    if not insights:
        insights.append("Your emotional wellness looks balanced this week. Keep tracking to uncover patterns!")

    return {"insights": insights}