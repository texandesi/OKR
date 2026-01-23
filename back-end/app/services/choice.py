"""Choice service for polls."""

from typing import Any, cast

from fastapi import Request

from app.models.poll import Choice
from app.repositories.choice import ChoiceRepository
from app.routers.utils import paginate_response
from app.schemas.poll import ChoiceCreate, ChoiceResponse, ChoiceUpdate
from app.services.base import BaseService


class ChoiceService(BaseService[Choice, ChoiceCreate, ChoiceUpdate, ChoiceResponse]):
    """Service for Choice operations with question filtering."""

    repository_class = ChoiceRepository
    response_schema = ChoiceResponse

    async def get_list(
        self,
        request: Request,
        *,
        page: int = 1,
        page_size: int = 10,
        ordering: str | None = None,
        filters: dict[str, Any] | None = None,
        question_id: int | None = None,
    ) -> dict[str, Any]:
        """Get paginated list of choices with optional question filter.

        Args:
            request: FastAPI request for URL building.
            page: Page number (1-indexed).
            page_size: Number of items per page.
            ordering: Ordering string (e.g., "id" or "-id").
            filters: Dictionary of field -> value filters.
            question_id: Optional question ID to filter by.

        Returns:
            Paginated response dictionary.
        """
        repo = cast(ChoiceRepository, self.repository)
        items, total_count = await repo.get_list(
            page=page,
            page_size=page_size,
            ordering=ordering,
            filters=filters,
            question_id=question_id,
        )

        response_items = [self._to_response(item) for item in items]
        return paginate_response(request, response_items, total_count, page, page_size)
