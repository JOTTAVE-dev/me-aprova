from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.data.seed_data import TOPIC_GROUPS, priority_for
from app.models.models import Flashcard, Topic, User


def seed_database(db: Session) -> None:
    if not db.query(User).first():
        db.add(User(name="Candidato FCC TI", email="candidato@local"))

    if db.query(Topic).first():
        db.commit()
        return

    topics: list[Topic] = []
    for category, names in TOPIC_GROUPS.items():
        for name in names:
            priority = priority_for(category, name)
            topics.append(Topic(name=name, category=category, priority=priority, weight=priority))
    db.add_all(topics)
    db.flush()

    for topic in topics[:24]:
        db.add(
            Flashcard(
                question=f"O que a FCC costuma cobrar em {topic.name}?",
                answer=f"Revise conceito, aplicação prática, diferenças e pegadinhas recorrentes sobre {topic.name}.",
                difficulty=max(2, 6 - topic.priority),
                topic_id=topic.id,
                next_review_at=date.today() + timedelta(days=1),
            )
        )

    db.commit()
