from datetime import date, timedelta

from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.models.models import Flashcard, Topic


def days_remaining(today: date | None = None) -> int:
    base = today or date.today()
    return max((settings.exam_date - base).days, 0)


def next_sunday(today: date | None = None) -> date:
    base = today or date.today()
    return base + timedelta(days=(6 - base.weekday()) % 7)


def pick_topics(db: Session, today: date) -> tuple[Topic | None, Topic | None, Topic | None]:
    review_topic = (
        db.query(Topic)
        .filter(Topic.next_review_at.is_not(None), Topic.next_review_at <= today)
        .order_by(desc(Topic.priority), asc(Topic.next_review_at))
        .first()
    )

    main_topic = (
        db.query(Topic)
        .filter(or_(Topic.accuracy < 75, Topic.questions_done == 0))
        .order_by(desc(Topic.priority), asc(Topic.accuracy), asc(Topic.last_studied_at.is_(None)))
        .first()
    )

    secondary_topic = (
        db.query(Topic)
        .filter(Topic.id != (main_topic.id if main_topic else 0))
        .order_by(desc(Topic.priority), asc(Topic.questions_done), asc(Topic.accuracy))
        .first()
    )
    return main_topic, secondary_topic, review_topic


def question_target(topic: Topic | None, remaining_days: int) -> int:
    base = 25 if remaining_days > 30 else 35
    if topic and topic.priority >= 5:
        base += 10
    if topic and topic.accuracy and topic.accuracy < 60:
        base += 10
    return base


def daily_recommendation(db: Session, today: date | None = None) -> dict:
    current = today or date.today()
    remaining = days_remaining(current)
    is_sunday = current.weekday() == 6

    due_cards = (
        db.query(Flashcard)
        .options(joinedload(Flashcard.topic))
        .filter(Flashcard.next_review_at <= current)
        .order_by(asc(Flashcard.next_review_at))
        .limit(10)
        .all()
    )
    main_topic, secondary_topic, review_topic = pick_topics(db, current)

    if is_sunday:
        checklist = [
            "Gerar simulado FCC com temas de maior prioridade",
            "Corrigir questões e registrar percentual por tema",
            "Transformar erros em flashcards",
            "Replanejar pontos fracos da semana",
        ]
    else:
        checklist = [
            "Bloco 1: 60 min de teoria principal",
            "Bloco 2: 60 min de revisão ou teoria secundária",
            "Bloco 3: questões FCC e revisão de erros",
            "Registrar desempenho ao terminar",
        ]

    return {
        "date": current,
        "is_sunday": is_sunday,
        "days_remaining": remaining,
        "main_topic": main_topic,
        "secondary_topic": secondary_topic,
        "review_topic": review_topic,
        "questions_target": 70 if is_sunday else question_target(main_topic, remaining),
        "flashcards_due": due_cards,
        "checklist": checklist,
    }
