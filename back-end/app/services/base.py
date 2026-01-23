"""Base service with generic CRUD operations."""

from typing import Any, ClassVar, Generic, TypeVar

from fastapi import Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import Base
from app.repositories.base import BaseRepository
from app.routers.utils import paginate_response

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
ResponseSchemaType = TypeVar("ResponseSchemaType", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType, ResponseSchemaType]):
    """Generic CRUD service with validation hooks.

    Subclasses should override:
    - repository_class: The repository class to use.
    - response_schema: The Pydantic response schema.
    - _to_response: If custom conversion is needed.
    - _validate_create/_validate_update/_validate_delete: For custom validation.
    """

    repository_class: ClassVar[type[BaseRepository[Any, Any, Any]]]
    response_schema: ClassVar[type[BaseModel]]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        # Concrete repository classes have __init__(db: AsyncSession), so this call is valid at runtime
        self.repository: BaseRepository[ModelType, CreateSchemaType, UpdateSchemaType] = self.repository_class(db)  # type: ignore[arg-type, call-arg]

    def _to_response(self, instance: ModelType) -> ResponseSchemaType:
        """Convert model instance to response schema.

        Override this method for custom conversion logic.

        Args:
            instance: Model instance.

        Returns:
            Response schema instance.
        """
        return self.response_schema.model_validate(instance)  # type: ignore[return-value]

    async def _validate_create(self, data: CreateSchemaType) -> None:
        """Validate data before creation.

        Override this method for custom validation logic.

        Args:
            data: Create schema data.

        Raises:
            ValidationError: If validation fails.
        """
        pass

    async def _validate_update(self, id: int, data: UpdateSchemaType) -> None:
        """Validate data before update.

        Override this method for custom validation logic.

        Args:
            id: Item ID being updated.
            data: Update schema data.

        Raises:
            ValidationError: If validation fails.
        """
        pass

    async def _validate_delete(self, id: int) -> None:
        """Validate before deletion.

        Override this method for custom validation logic.

        Args:
            id: Item ID being deleted.

        Raises:
            ValidationError: If validation fails.
        """
        pass

    async def get_by_id(self, id: int) -> ResponseSchemaType:
        """Get single item by ID.

        Args:
            id: Primary key ID.

        Returns:
            Response schema instance.

        Raises:
            NotFoundError: If item not found.
        """
        instance = await self.repository.get_by_id(id)
        return self._to_response(instance)

    async def get_list(
        self,
        request: Request,
        *,
        page: int = 1,
        page_size: int = 10,
        ordering: str | None = None,
        filters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Get paginated list of items.

        Args:
            request: FastAPI request for URL building.
            page: Page number (1-indexed).
            page_size: Number of items per page.
            ordering: Ordering string (e.g., "name" or "-name").
            filters: Dictionary of field -> value filters.

        Returns:
            Paginated response dictionary.
        """
        items, total_count = await self.repository.get_list(
            page=page,
            page_size=page_size,
            ordering=ordering,
            filters=filters,
        )

        response_items = [self._to_response(item) for item in items]
        return paginate_response(request, response_items, total_count, page, page_size)

    async def create(self, data: CreateSchemaType) -> ResponseSchemaType:
        """Create new item.

        Args:
            data: Create schema data.

        Returns:
            Response schema instance.

        Raises:
            ValidationError: If validation fails.
        """
        await self._validate_create(data)
        instance = await self.repository.create(data)
        return self._to_response(instance)

    async def update(self, id: int, data: UpdateSchemaType) -> ResponseSchemaType:
        """Update existing item.

        Args:
            id: Primary key ID.
            data: Update schema data.

        Returns:
            Response schema instance.

        Raises:
            NotFoundError: If item not found.
            ValidationError: If validation fails.
        """
        await self._validate_update(id, data)
        instance = await self.repository.update(id, data)
        return self._to_response(instance)

    async def delete(self, id: int) -> None:
        """Delete item by ID.

        Args:
            id: Primary key ID.

        Raises:
            NotFoundError: If item not found.
            ValidationError: If validation fails.
        """
        await self._validate_delete(id)
        await self.repository.delete(id)
