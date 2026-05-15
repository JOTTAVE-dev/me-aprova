from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.base import get_db
from app.models.models import Flashcard
from app.schemas.schemas import FlashcardCreate, FlashcardOut, FlashcardUpdate

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


@router.get("", response_model=list[FlashcardOut])
def list_flashcards(due_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Flashcard).options(joinedload(Flashcard.topic))
    if due_only:
        query = query.filter(Flashcard.next_review_at <= date.today())
    return query.order_by(Flashcard.next_review_at).all()


@router.post("", response_model=FlashcardOut)
def create_flashcard(payload: FlashcardCreate, db: Session = Depends(get_db)):
    data = payload.model_dump()
    if data["next_review_at"] is None:
        data["next_review_at"] = date.today() + timedelta(days=1)
    card = Flashcard(**data)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


@router.put("/{card_id}", response_model=FlashcardOut)
def update_flashcard(card_id: int, payload: FlashcardUpdate, db: Session = Depends(get_db)):
    card = db.get(Flashcard, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard não encontrado")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(card, key, value)
    db.commit()
    db.refresh(card)
    return card


@router.post("/{card_id}/review", response_model=FlashcardOut)
def review_flashcard(card_id: int, remembered: bool = True, db: Session = Depends(get_db)):
    card = db.get(Flashcard, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard não encontrado")
    intervals = [1, 7, 30]
    card.review_stage = min(card.review_stage + 1, 2) if remembered else 0
    card.next_review_at = date.today() + timedelta(days=intervals[card.review_stage])
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}")
def delete_flashcard(card_id: int, db: Session = Depends(get_db)):
    card = db.get(Flashcard, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard não encontrado")
    db.delete(card)
    db.commit()
    return {"ok": True}
