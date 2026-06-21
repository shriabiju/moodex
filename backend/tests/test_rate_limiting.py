"""
Verifies the login rate limiter actually engages.

This test builds its own TestClient with the limiter forced on, since the
rest of the suite disables it (see conftest.py / app.core.limiter) to avoid
cross-test interference under TestClient's shared fake IP.
"""
from fastapi.testclient import TestClient
from app.core.limiter import limiter
from app.main import app


def test_login_is_rate_limited_after_repeated_attempts(client):
    limiter.enabled = True
    try:
        fresh_client = TestClient(app)
        fresh_client.post(
            "/api/auth/register",
            json={"username": "ratelimited", "email": "rl@example.com", "password": "Secret123!"},
        )

        responses = [
            fresh_client.post(
                "/api/auth/login",
                json={"email": "rl@example.com", "password": "WrongPassword"},
            )
            for _ in range(15)
        ]
        statuses = [r.status_code for r in responses]
        assert 429 in statuses, "expected at least one 429 after exceeding the login rate limit"
    finally:
        limiter.enabled = False
