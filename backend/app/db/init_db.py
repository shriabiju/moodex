from app.db.database import Base, engine
from app.models import user, mood, journal  # noqa: F401 — ensures models are registered

def init_db():
    Base.metadata.create_all(bind=engine)