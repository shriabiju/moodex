"""
Shared pytest fixtures.

Tests run against an in-memory SQLite database instead of MySQL so the
suite is fast, isolated, and doesn't require a running database server
(this is what makes CI work without provisioning MySQL).
"""
import os

# Settings are read at import time, so env vars must be set before
# app.core.config / app.db.database get imported anywhere.
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "10080")
os.environ.setdefault("MOODEX_TESTING", "1")

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.db.database import Base, get_db
from app.main import app
from app.models import user, mood, journal  # noqa: F401 — register models on Base


# A single shared in-memory SQLite connection for the whole test run.
# StaticPool keeps the same connection alive across sessions, which is
# required for SQLite ":memory:" to work with SQLAlchemy's session-per-request
# pattern.
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    """Fresh schema for every test function — keeps tests independent."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    """Register + log in a throwaway user, return Authorization headers."""
    client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123!",
        },
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "TestPassword123!"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
