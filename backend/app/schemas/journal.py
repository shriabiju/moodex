from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class JournalEntryCreate(BaseModel):
    title: str
    content: str

class JournalEntryResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    sentiment: Optional[str]
    sentiment_score: Optional[float]
    emotional_tags: Optional[str]
    ai_summary: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class SentimentResponse(BaseModel):
    sentiment: str
    sentiment_score: float
    emotional_tags: list[str]
    confidence: str