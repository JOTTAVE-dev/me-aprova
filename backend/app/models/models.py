from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, Enum as SAEnum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TopicStatus(str, Enum):
    pending = "pending"
    studying = "studying"
    reviewed = "reviewed"
    mastered = "mastered"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), default="Candidato")
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(180), index=True)
    category: Mapped[str] = mapped_column(String(160), index=True)
    priority: Mapped[int] = mapped_column(Integer, default=3)
    weight: Mapped[int] = mapped_column(Integer, default=3)
    status: Mapped[TopicStatus] = mapped_column(SAEnum(TopicStatus), default=TopicStatus.pending)
    accuracy: Mapped[float] = mapped_column(Float, default=0)
    questions_done: Mapped[int] = mapped_column(Integer, default=0)
    errors: Mapped[int] = mapped_column(Integer, default=0)
    last_studied_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    next_review_at: Mapped[date | None] = mapped_column(Date, nullable=True)

    flashcards: Mapped[list["Flashcard"]] = relationship(back_populates="topic")
    question_logs: Mapped[list["QuestionLog"]] = relationship(back_populates="topic")


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    plan_date: Mapped[date] = mapped_column(Date, index=True)
    main_topic_id: Mapped[int | None] = mapped_column(ForeignKey("topics.id"), nullable=True)
    secondary_topic_id: Mapped[int | None] = mapped_column(ForeignKey("topics.id"), nullable=True)
    review_topic_id: Mapped[int | None] = mapped_column(ForeignKey("topics.id"), nullable=True)
    questions_target: Mapped[int] = mapped_column(Integer, default=30)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class StudySession(Base):
    __tablename__ = "study_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"))
    session_date: Mapped[date] = mapped_column(Date, index=True)
    minutes: Mapped[int] = mapped_column(Integer, default=60)
    kind: Mapped[str] = mapped_column(String(40), default="theory")
    completed: Mapped[bool] = mapped_column(default=False)
    notes: Mapped[str] = mapped_column(Text, default="")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[int] = mapped_column(Integer, default=3)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    next_review_at: Mapped[date] = mapped_column(Date, default=date.today)
    review_stage: Mapped[int] = mapped_column(Integer, default=0)

    topic: Mapped[Topic] = relationship(back_populates="flashcards")


class QuestionLog(Base):
    __tablename__ = "question_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    bank: Mapped[str] = mapped_column(String(40), default="FCC")
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    correct: Mapped[int] = mapped_column(Integer)
    wrong: Mapped[int] = mapped_column(Integer)
    logged_at: Mapped[date] = mapped_column(Date, default=date.today)

    topic: Mapped[Topic] = relationship(back_populates="question_logs")


class Simulation(Base):
    __tablename__ = "simulations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    simulation_date: Mapped[date] = mapped_column(Date, default=date.today, index=True)
    total_questions: Mapped[int] = mapped_column(Integer, default=70)
    correct: Mapped[int] = mapped_column(Integer, default=0)
    score: Mapped[float] = mapped_column(Float, default=0)
    notes: Mapped[str] = mapped_column(Text, default="")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(180))
    body: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class WeakPoint(Base):
    __tablename__ = "weak_points"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id"))
    reason: Mapped[str] = mapped_column(Text)
    severity: Mapped[int] = mapped_column(Integer, default=3)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
