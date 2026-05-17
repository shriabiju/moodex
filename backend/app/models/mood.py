from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood = Column(String(50), nullable=False)
    stress_level = Column(Integer, nullable=False)      # 1-10
    energy_level = Column(Integer, nullable=False)      # 1-10
    sleep_quality = Column(Integer, nullable=False)     # 1-10
    productivity_score = Column(Integer, nullable=False) # 1-10
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="moods")