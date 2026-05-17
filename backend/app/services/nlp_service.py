from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import re

analyzer = SentimentIntensityAnalyzer()

EMOTION_KEYWORDS = {
    "anxiety":    ["anxious", "nervous", "worried", "panic", "fear", "scared", "uneasy", "tense"],
    "stress":     ["stressed", "overwhelmed", "pressure", "exhausted", "burnout", "overloaded"],
    "motivation": ["motivated", "inspired", "determined", "focused", "goal", "achieve", "driven"],
    "sadness":    ["sad", "depressed", "unhappy", "lonely", "hopeless", "miserable", "down"],
    "happiness":  ["happy", "joyful", "excited", "grateful", "content", "pleased", "wonderful"],
    "calm":       ["calm", "peaceful", "relaxed", "serene", "balanced", "centered", "tranquil"],
    "anger":      ["angry", "frustrated", "irritated", "annoyed", "furious", "mad", "rage"],
}

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

def detect_emotional_tags(text: str) -> list:
    cleaned = preprocess_text(text)
    words = cleaned.split()
    detected = []
    for emotion, keywords in EMOTION_KEYWORDS.items():
        if any(kw in words for kw in keywords):
            detected.append(emotion)
    return detected if detected else ["neutral"]

def get_confidence(compound: float) -> str:
    abs_score = abs(compound)
    if abs_score >= 0.7:
        return "high"
    elif abs_score >= 0.4:
        return "medium"
    return "low"

def analyze_sentiment(text: str) -> dict:
    vader_scores = analyzer.polarity_scores(text)
    compound = vader_scores["compound"]

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    avg_score = round((compound + polarity) / 2, 4)

    if avg_score >= 0.05:
        sentiment = "positive"
    elif avg_score <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    emotional_tags = detect_emotional_tags(text)
    confidence = get_confidence(compound)

    return {
        "sentiment": sentiment,
        "sentiment_score": avg_score,
        "emotional_tags": emotional_tags,
        "confidence": confidence
    }