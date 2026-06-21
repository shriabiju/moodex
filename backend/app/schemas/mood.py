from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

class MoodEntryCreate(BaseModel):
    mood: str
    stress_level: int = Field(..., ge=1, le=10)
    energy_level: int = Field(..., ge=1, le=10)
    sleep_quality: int = Field(..., ge=1, le=10)
    productivity_score: int = Field(..., ge=1, le=10)
    notes: Optional[str] = None

class MoodEntryResponse(BaseModel):
    id: int
    user_id: int
    mood: str
    stress_level: int
    energy_level: int
    sleep_quality: int
    productivity_score: int
    notes: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MoodEntryUpdate(BaseModel):
    mood: Optional[str] = None
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    productivity_score: Optional[int] = Field(None, ge=1, le=10)
    notes: Optional[str] = None