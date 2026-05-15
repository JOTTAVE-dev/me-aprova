from datetime import date

from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.models.models import QuestionLog, Topic
from app.services.recommendation import days_remaining, next_sunday


def dashboard(db: Session) -> dict:
    today = date.today()
    total_topics = db.query(func.count(Topic.id)).scalar() or 0
    studied = db.query(func.count(Topic.id)).filter(Topic.questions_done > 0).scalar() or 0
    avg_accuracy = db.query(func.avg(Topic.accuracy)).filter(Topic.questions_done > 0).scalar() or 0
    total_questions = db.query(func.sum(QuestionLog.quantity)).scalar() or 0
    overdue = db.query(func.count(Topic.id)).filter(Topic.next_review_at.is_not(None), Topic.next_review_at <= today).scalar() or 0

    strong = (
        db.query(Topic)
        .filter(Topic.questions_done > 0, Topic.accuracy >= 80)
        .order_by(desc(Topic.accuracy))
        .limit(5)
        .all()
    )
    weak = (
        db.query(Topic)
        .filter((Topic.accuracy < 70) | (Topic.errors > 0))
        .order_by(desc(Topic.priority), desc(Topic.errors))
        .limit(5)
        .all()
    )

    return {
        "days_remaining": days_remaining(today),
        "total_topics": total_topics,
        "progress": round((studied / total_topics) * 100, 1) if total_topics else 0,
        "average_accuracy": round(float(avg_accuracy), 1),
        "total_questions": total_questions,
        "overdue_reviews": overdue,
        "strong_topics": strong,
        "weak_topics": weak,
        "next_simulation": next_sunday(today),
    }
