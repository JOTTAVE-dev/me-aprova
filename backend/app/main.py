from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base, SessionLocal, engine
from app.routes import dashboard, flashcards, questions, simulations, topics
from app.services.seed import seed_database


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    api = FastAPI(title=settings.app_name)
    api.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api.include_router(dashboard.router, prefix="/api")
    api.include_router(topics.router, prefix="/api")
    api.include_router(flashcards.router, prefix="/api")
    api.include_router(questions.router, prefix="/api")
    api.include_router(simulations.router, prefix="/api")
    return api


app = create_app()
