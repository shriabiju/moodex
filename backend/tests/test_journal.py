"""Tests for journal entries, including the auto-attached sentiment analysis."""


def test_create_journal_entry_attaches_sentiment(client, auth_headers):
    response = client.post(
        "/api/journal/",
        json={"title": "Great day", "content": "I feel happy, grateful, and motivated today."},
        headers=auth_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["sentiment"] == "positive"
    assert body["sentiment_score"] is not None
    assert "happiness" in body["emotional_tags"] or "motivation" in body["emotional_tags"]


def test_update_journal_entry_recomputes_sentiment(client, auth_headers):
    created = client.post(
        "/api/journal/",
        json={"title": "Rough day", "content": "I feel sad and hopeless."},
        headers=auth_headers,
    ).json()
    assert created["sentiment"] == "negative"

    updated = client.put(
        f"/api/journal/{created['id']}",
        json={"content": "I feel joyful and grateful now."},
        headers=auth_headers,
    ).json()
    assert updated["sentiment"] == "positive"


def test_get_journal_entries_list(client, auth_headers):
    client.post(
        "/api/journal/",
        json={"title": "Entry 1", "content": "A calm and peaceful afternoon."},
        headers=auth_headers,
    )
    response = client.get("/api/journal/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_delete_journal_entry(client, auth_headers):
    created = client.post(
        "/api/journal/",
        json={"title": "Temp", "content": "Just a temporary note."},
        headers=auth_headers,
    ).json()
    response = client.delete(f"/api/journal/{created['id']}", headers=auth_headers)
    assert response.status_code == 200

    follow_up = client.get(f"/api/journal/{created['id']}", headers=auth_headers)
    assert follow_up.status_code == 404


def test_analyze_endpoint_returns_sentiment_without_saving(client, auth_headers):
    response = client.post(
        "/api/journal/analyze",
        json={"text": "I am thrilled and excited about this!"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["sentiment"] == "positive"
    assert "confidence" in body
