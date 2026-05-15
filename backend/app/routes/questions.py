from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.models import QuestionLog, Topic
from app.schemas.schemas import QuestionLogCreate, QuestionLogOut

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("", response_model=list[QuestionLogOut])
def list_question_logs(db: Session = Depends(get_db)):
    return db.query(QuestionLog).order_by(QuestionLog.logged_at.desc(), QuestionLog.id.desc()).all()


@router.post("", response_model=QuestionLogOut)
def create_question_log(payload: QuestionLogCreate, db: Session = Depends(get_db)):
    topic = db.get(Topic, payload.topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Tema não encontrado")
    wrong = max(payload.quantity - payload.correct, 0)
    log = QuestionLog(**payload.model_dump(), wrong=wrong)
    db.add(log)

    topic.questions_done += payload.quantity
    topic.errors += wrong
    total_correct = ((topic.accuracy / 100) * (topic.questions_done - payload.quantity)) + payload.correct
    topic.accuracy = round((total_correct / topic.questions_done) * 100, 1)
    topic.last_studied_at = date.today()
    topic.next_review_at = date.today() + timedelta(days=1 if topic.accuracy < 70 else 7)

    db.commit()
    db.refresh(log)
    return log
