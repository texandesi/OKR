"""Choice repository for polls."""

from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ValidationError
from app.models.poll import Choice, Question
from app.repositories.base import BaseRepository
from app.schemas.poll import ChoiceCreate, ChoiceUpdate


class ChoiceRepository(BaseRepository[Choice, ChoiceCreate, ChoiceUpdate]):
    """Repository for Choice model with question validation."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Choice,
            db=db,
            allowed_order_fields=["id", "choice_text", "votes", "question_id"],
            allowed_filter_fields=["choice_text"],
            default_order_field="id",
        )

    async def _validate_question_exists(self, question_id: int) -> None:
        """Validate that the question exists.

        Args:
            question_id: Question ID to validate.

        Raises:
            ValidationError: If question not found.
        """
        query = select(func.count()).select_from(Question).where(Question.id == question_id)
        count = await self.db.scalar(query)
        if not count:
            raise ValidationError(
                message="Question not found",
                field="question_id",
                value=question_id,
            )

    async def create(self, data: ChoiceCreate) -> Choice:
        """Create new choice with question validation.

        Args:
            data: ChoiceCreate schema.

        Returns:
            Created Choice.

        Raises:
            ValidationError: If question not found.
        """
        await self._validate_question_exists(data.question_id)
        return await super().create(data)

    async def get_list(
        self,
        *,
        page: int = 1,
        page_size: int = 10,
        ordering: str | None = None,
        filters: dict[str, Any] | None = None,
        question_id: int | None = None,
    ) -> tuple[list[Choice], int]:
        """Get paginated list of choices with optional question filter.

        Args:
            page: Page number (1-indexed).
            page_size: Number of items per page.
            ordering: Ordering string (e.g., "id" or "-id").
            filters: Dictionary of field -> value filters.
            question_id: Optional question ID to filter by.

        Returns:
            Tuple of (list of items, total count).
        """
        query, count_query = self._build_base_queries()

        # Apply question_id filter if provided
        if question_id is not None:
            query, count_query = self._apply_exact_filter(query, count_query, "question_id", question_id)

        # Apply text filters
        if filters:
            query, count_query = self._apply_filters(query, count_query, filters)

        # Apply ordering
        query = self._apply_ordering(query, ordering)

        # Get total count
        total_count = await self.db.scalar(count_query) or 0

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self.db.execute(query)
        items = list(result.scalars().all())

        return items, total_count
