"""Tests for mood entry CRUD and per-user data isolation."""

VALID_MOOD = {
    "mood": "happy",
    "stress_level": 3,
    "energy_level": 8,
    "sleep_quality": 7,
    "productivity_score": 6,
    "notes": "Good day overall",
}


def test_create_mood_entry(client, auth_headers):
    response = client.post("/api/mood/", json=VALID_MOOD, headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["mood"] == "happy"
    assert body["stress_level"] == 3
    assert "id" in body


def test_create_mood_rejects_out_of_range_values(client, auth_headers):
    bad_payload = {**VALID_MOOD, "stress_level": 15}  # max is 10
    response = client.post("/api/mood/", json=bad_payload, headers=auth_headers)
    assert response.status_code == 422


def test_create_mood_requires_auth(client):
    response = client.post("/api/mood/", json=VALID_MOOD)
    assert response.status_code == 401


def test_get_mood_entries_returns_created_entry(client, auth_headers):
    client.post("/api/mood/", json=VALID_MOOD, headers=auth_headers)
    response = client.get("/api/mood/", headers=auth_headers)
    assert response.status_code == 200
    entries = response.json()
    assert len(entries) == 1
    assert entries[0]["mood"] == "happy"


def test_update_mood_entry(client, auth_headers):
    created = client.post("/api/mood/", json=VALID_MOOD, headers=auth_headers).json()
    response = client.put(
        f"/api/mood/{created['id']}",
        json={"mood": "calm", "stress_level": 1},
        headers=auth_headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["mood"] == "calm"
    assert body["stress_level"] == 1
    assert body["energy_level"] == VALID_MOOD["energy_level"]  # untouched fields persist


def test_delete_mood_entry(client, auth_headers):
    created = client.post("/api/mood/", json=VALID_MOOD, headers=auth_headers).json()
    response = client.delete(f"/api/mood/{created['id']}", headers=auth_headers)
    assert response.status_code == 200

    follow_up = client.get(f"/api/mood/{created['id']}", headers=auth_headers)
    assert follow_up.status_code == 404


def test_get_nonexistent_mood_entry_returns_404(client, auth_headers):
    response = client.get("/api/mood/9999", headers=auth_headers)
    assert response.status_code == 404


def test_user_cannot_access_another_users_mood_entry(client):
    # User A creates an entry
    client.post(
        "/api/auth/register",
        json={"username": "userA", "email": "a@example.com", "password": "Secret123!"},
    )
    token_a = client.post(
        "/api/auth/login", json={"email": "a@example.com", "password": "Secret123!"}
    ).json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}
    entry = client.post("/api/mood/", json=VALID_MOOD, headers=headers_a).json()

    # User B tries to access it
    client.post(
        "/api/auth/register",
        json={"username": "userB", "email": "b@example.com", "password": "Secret123!"},
    )
    token_b = client.post(
        "/api/auth/login", json={"email": "b@example.com", "password": "Secret123!"}
    ).json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    response = client.get(f"/api/mood/{entry['id']}", headers=headers_b)
    assert response.status_code == 404  # not 403 — avoids leaking existence
