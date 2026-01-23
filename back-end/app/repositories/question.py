"""Question repository for polls."""

from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.poll import Question
from app.repositories.base import BaseRepository
from app.schemas.poll import QuestionCreate, QuestionUpdate


class QuestionRepository(BaseRepository[Question, QuestionCreate, QuestionUpdate]):
    """Repository for Question model."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Question,
            db=db,
            allowed_order_fields=["id", "question_text", "pub_date"],
            allowed_filter_fields=["question_text"],
            default_order_field="pub_date",
            default_order_desc=True,
        )

    async def create(self, data: QuestionCreate) -> Question:
        """Create new question with default pub_date if not provided.

        Args:
            data: QuestionCreate schema.

        Returns:
            Created Question.
        """
        item = Question(
            question_text=data.question_text,
            pub_date=data.pub_date or datetime.utcnow(),
        )
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item
