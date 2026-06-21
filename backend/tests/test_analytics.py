"""Tests for analytics aggregation endpoints (SQL-side AVG/COUNT/GROUP BY)."""

MOODS = [
    {"mood": "happy", "stress_level": 2, "energy_level": 8, "sleep_quality": 8, "productivity_score": 7},
    {"mood": "happy", "stress_level": 4, "energy_level": 6, "sleep_quality": 6, "productivity_score": 6},
    {"mood": "anxious", "stress_level": 8, "energy_level": 3, "sleep_quality": 3, "productivity_score": 4},
]


def _seed_moods(client, headers):
    for m in MOODS:
        client.post("/api/mood/", json=m, headers=headers)


def test_weekly_summary_returns_correct_averages(client, auth_headers):
    _seed_moods(client, auth_headers)
    response = client.get("/api/analytics/summary", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total_entries"] == 3
    expected_avg_stress = round((2 + 4 + 8) / 3, 2)
    assert body["avg_stress"] == expected_avg_stress
    assert body["mood_counts"] == {"happy": 2, "anxious": 1}


def test_weekly_summary_empty_when_no_entries(client, auth_headers):
    response = client.get("/api/analytics/summary", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == {}


def test_mood_distribution_groups_correctly(client, auth_headers):
    _seed_moods(client, auth_headers)
    response = client.get("/api/analytics/mood-distribution", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == {"happy": 2, "anxious": 1}


def test_mood_trend_returns_chronological_entries(client, auth_headers):
    _seed_moods(client, auth_headers)
    response = client.get("/api/analytics/mood-trend?days=7", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 3
    assert all("date" in entry and "mood" in entry for entry in body)


def test_analytics_requires_auth(client):
    response = client.get("/api/analytics/summary")
    assert response.status_code == 401


def test_insights_returns_default_message_with_no_data(client, auth_headers):
    response = client.get("/api/insights/", headers=auth_headers)
    assert response.status_code == 200
    assert "Start logging" in response.json()["insights"][0]
