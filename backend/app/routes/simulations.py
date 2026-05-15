from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.models import Simulation
from app.schemas.schemas import SimulationCreate, SimulationOut

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.get("", response_model=list[SimulationOut])
def list_simulations(db: Session = Depends(get_db)):
    return db.query(Simulation).order_by(Simulation.simulation_date.desc()).all()


@router.post("", response_model=SimulationOut)
def create_simulation(payload: SimulationCreate, db: Session = Depends(get_db)):
    score = round((payload.correct / payload.total_questions) * 100, 1)
    simulation = Simulation(**payload.model_dump(), score=score)
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    return simulation
