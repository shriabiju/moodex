"""Tests for registration, login, and JWT-protected access."""


def test_register_creates_user(client):
    response = client.post(
        "/api/auth/register",
        json={"username": "alice", "email": "alice@example.com", "password": "Secret123!"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["username"] == "alice"
    assert body["email"] == "alice@example.com"
    assert "hashed_password" not in body  # never leak the hash


def test_register_rejects_duplicate_email(client):
    payload = {"username": "alice", "email": "alice@example.com", "password": "Secret123!"}
    client.post("/api/auth/register", json=payload)

    response = client.post(
        "/api/auth/register",
        json={**payload, "username": "alice2"},
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_register_rejects_duplicate_username(client):
    client.post(
        "/api/auth/register",
        json={"username": "alice", "email": "a1@example.com", "password": "Secret123!"},
    )
    response = client.post(
        "/api/auth/register",
        json={"username": "alice", "email": "a2@example.com", "password": "Secret123!"},
    )
    assert response.status_code == 400
    assert "username" in response.json()["detail"].lower()


def test_login_succeeds_with_correct_credentials(client):
    client.post(
        "/api/auth/register",
        json={"username": "bob", "email": "bob@example.com", "password": "Secret123!"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "bob@example.com", "password": "Secret123!"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert len(body["access_token"]) > 20


def test_login_fails_with_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"username": "bob", "email": "bob@example.com", "password": "Secret123!"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "bob@example.com", "password": "WrongPassword"},
    )
    assert response.status_code == 401


def test_login_fails_for_unknown_email(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "whatever"},
    )
    assert response.status_code == 401


def test_protected_route_requires_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_protected_route_returns_current_user(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


def test_invalid_token_is_rejected(client):
    response = client.get(
        "/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401
