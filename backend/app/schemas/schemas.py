from datetime import date
from pydantic import BaseModel, Field


class TopicBase(BaseModel):
    name: str
    category: str
    priority: int = Field(default=3, ge=1, le=5)
    weight: int = Field(default=3, ge=1, le=5)
    status: str = "pending"


class TopicCreate(TopicBase):
    pass


class TopicUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    priority: int | None = Field(default=None, ge=1, le=5)
    weight: int | None = Field(default=None, ge=1, le=5)
    status: str | None = None
    accuracy: float | None = Field(default=None, ge=0, le=100)


class TopicOut(TopicBase):
    id: int
    accuracy: float
    questions_done: int
    errors: int
    last_studied_at: date | None
    next_review_at: date | None

    class Config:
        from_attributes = True


class FlashcardBase(BaseModel):
    question: str
    answer: str
    difficulty: int = Field(default=3, ge=1, le=5)
    topic_id: int
    next_review_at: date | None = None


class FlashcardCreate(FlashcardBase):
    pass


class FlashcardUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    difficulty: int | None = Field(default=None, ge=1, le=5)
    next_review_at: date | None = None
    review_stage: int | None = None


class FlashcardOut(FlashcardBase):
    id: int
    review_stage: int
    topic: TopicOut | None = None

    class Config:
        from_attributes = True


class QuestionLogCreate(BaseModel):
    bank: str = "FCC"
    topic_id: int
    quantity: int = Field(gt=0)
    correct: int = Field(ge=0)


class QuestionLogOut(BaseModel):
    id: int
    bank: str
    topic_id: int
    quantity: int
    correct: int
    wrong: int
    logged_at: date

    class Config:
        from_attributes = True


class SimulationCreate(BaseModel):
    total_questions: int = Field(default=70, gt=0)
    correct: int = Field(ge=0)
    notes: str = ""


class SimulationOut(BaseModel):
    id: int
    simulation_date: date
    total_questions: int
    correct: int
    score: float
    notes: str

    class Config:
        from_attributes = True


class RecommendationOut(BaseModel):
    date: date
    is_sunday: bool
    days_remaining: int
    main_topic: TopicOut | None
    secondary_topic: TopicOut | None
    review_topic: TopicOut | None
    questions_target: int
    flashcards_due: list[FlashcardOut]
    checklist: list[str]


class DashboardOut(BaseModel):
    days_remaining: int
    total_topics: int
    progress: float
    average_accuracy: float
    total_questions: int
    overdue_reviews: int
    strong_topics: list[TopicOut]
    weak_topics: list[TopicOut]
    next_simulation: date
