from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.schemas.schemas import DashboardOut, RecommendationOut
from app.services.dashboard import dashboard
from app.services.recommendation import daily_recommendation

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard(db: Session = Depends(get_db)):
    return dashboard(db)


@router.get("/study/today", response_model=RecommendationOut)
def get_today_study(db: Session = Depends(get_db)):
    return daily_recommendation(db)
