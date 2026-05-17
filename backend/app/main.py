from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.api import auth, mood, journal, analytics, insights

app = FastAPI(
    title="Moodex API",
    description="AI-powered emotional wellness analytics platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# Routers
app.include_router(auth.router)
app.include_router(mood.router)
app.include_router(journal.router)
app.include_router(analytics.router)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"message": "Moodex API is running"}