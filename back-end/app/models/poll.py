from datetime import datetime

from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Question(Base):
    __tablename__ = "polls_question"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_text: Mapped[str] = mapped_column(String(200), nullable=False)
    pub_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    choices: Mapped[list["Choice"]] = relationship(
        "Choice", back_populates="question", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"Question(id={self.id}, text={self.question_text[:30]})"


class Choice(Base):
    __tablename__ = "polls_choice"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("polls_question.id"), nullable=False)
    choice_text: Mapped[str] = mapped_column(String(200), nullable=False)
    votes: Mapped[int] = mapped_column(Integer, default=0)

    question: Mapped["Question"] = relationship("Question", back_populates="choices")

    def __repr__(self) -> str:
        return f"Choice(id={self.id}, text={self.choice_text[:30]})"
