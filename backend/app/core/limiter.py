"""
Shared rate limiter instance.

Lives in its own module (not main.py) so routers can import it without
creating a circular import — main.py imports the routers, and routers
need the limiter.
"""
import os
from slowapi import Limiter
from slowapi.util import get_remote_address

# Disabled during tests: TestClient sends every request from the same
# fake address, so per-IP limits would trip across unrelated test cases
# rather than reflecting real abuse.
_testing = os.getenv("MOODEX_TESTING") == "1"

limiter = Limiter(key_func=get_remote_address, enabled=not _testing)

