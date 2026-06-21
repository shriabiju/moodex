"""
Unit tests for the sentiment/NLP pipeline, isolated from the API and DB.
These run fast and pin down the contract of analyze_sentiment() so the
ensemble logic (VADER + TextBlob + keyword tagging) doesn't silently drift.
"""
from app.services.nlp_service import analyze_sentiment, detect_emotional_tags


def test_analyze_sentiment_detects_positive_text():
    result = analyze_sentiment("I feel absolutely wonderful and grateful today!")
    assert result["sentiment"] == "positive"
    assert result["sentiment_score"] > 0


def test_analyze_sentiment_detects_negative_text():
    result = analyze_sentiment("I feel hopeless, exhausted, and completely overwhelmed.")
    assert result["sentiment"] == "negative"
    assert result["sentiment_score"] < 0


def test_analyze_sentiment_detects_neutral_text():
    result = analyze_sentiment("I went to the store and bought groceries.")
    assert result["sentiment"] == "neutral"


def test_analyze_sentiment_returns_expected_keys():
    result = analyze_sentiment("Just a regular day.")
    assert set(result.keys()) == {
        "sentiment",
        "sentiment_score",
        "emotional_tags",
        "confidence",
    }


def test_detect_emotional_tags_finds_anxiety_keywords():
    tags = detect_emotional_tags("I've been so anxious and nervous about the exam.")
    assert "anxiety" in tags


def test_detect_emotional_tags_finds_multiple_emotions():
    tags = detect_emotional_tags("I'm motivated but also a bit stressed about deadlines.")
    assert "motivation" in tags
    assert "stress" in tags


def test_detect_emotional_tags_defaults_to_neutral():
    tags = detect_emotional_tags("The weather report says it will rain tomorrow.")
    assert tags == ["neutral"]


def test_confidence_scales_with_score_magnitude():
    strong = analyze_sentiment("I am ecstatic, thrilled, and overjoyed beyond words!")
    mild = analyze_sentiment("It was an okay day, nothing special.")
    # Strong emotional language should not produce lower confidence than
    # a mild, low-signal sentence.
    confidence_order = {"low": 0, "medium": 1, "high": 2}
    assert confidence_order[strong["confidence"]] >= confidence_order[mild["confidence"]]
