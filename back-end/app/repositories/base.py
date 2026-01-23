"""Base repository with generic CRUD operations."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

from app.core.exceptions import InvalidFieldError, NotFoundError
from app.database import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Generic CRUD repository with field validation and pagination.

    Attributes:
        model: SQLAlchemy model class.
        db: Async database session.
        allowed_order_fields: Whitelist of fields allowed for ordering.
        allowed_filter_fields: Whitelist of fields allowed for filtering.
        default_order_field: Default field to order by.
        default_order_desc: Whether to order descending by default.
    """

    def __init__(
        self,
        model: type[ModelType],
        db: AsyncSession,
        *,
        allowed_order_fields: list[str],
        allowed_filter_fields: list[str],
        default_order_field: str = "name",
        default_order_desc: bool = False,
    ) -> None:
        self.model = model
        self.db = db
        self.allowed_order_fields = allowed_order_fields
        self.allowed_filter_fields = allowed_filter_fields
        self.default_order_field = default_order_field
        self.default_order_desc = default_order_desc

    @property
    def _model_name(self) -> str:
        """Get human-readable model name for error messages."""
        return self.model.__name__

    def _validate_order_field(self, field: str) -> str:
        """Validate ordering field against whitelist.

        Args:
            field: Field name (may include '-' prefix for descending).

        Returns:
            Clean field name without prefix.

        Raises:
            InvalidFieldError: If field not in whitelist.
        """
        clean_field = field.lstrip("-")
        if clean_field not in self.allowed_order_fields:
            raise InvalidFieldError(
                field=clean_field,
                valid_fields=self.allowed_order_fields,
                operation="ordering",
            )
        return clean_field

    def _get_model_attr(self, field: str) -> InstrumentedAttribute[Any]:
        """Get model attribute by field name.

        Args:
            field: Field name.

        Returns:
            SQLAlchemy column attribute.
        """
        return getattr(self.model, field)

    def _apply_ordering(self, query: Select[tuple[ModelType]], ordering: str | None) -> Select[tuple[ModelType]]:
        """Apply ordering to query.

        Args:
            query: Base select query.
            ordering: Ordering string (e.g., "name" or "-name").

        Returns:
            Query with ordering applied.
        """
        if ordering:
            clean_field = self._validate_order_field(ordering)
            attr = self._get_model_attr(clean_field)
            if ordering.startswith("-"):
                return query.order_by(attr.desc())
            return query.order_by(attr)

        # Default ordering
        attr = self._get_model_attr(self.default_order_field)
        if self.default_order_desc:
            return query.order_by(attr.desc())
        return query.order_by(attr)

    def _apply_text_filter(
        self,
        query: Select[tuple[ModelType]],
        count_query: Select[tuple[int]],
        field: str,
        value: str,
    ) -> tuple[Select[tuple[ModelType]], Select[tuple[int]]]:
        """Apply ilike text filter to both queries.

        Args:
            query: Main select query.
            count_query: Count query for pagination.
            field: Field name to filter on.
            value: Value to filter by (uses ilike with wildcards).

        Returns:
            Tuple of (filtered query, filtered count query).
        """
        if field not in self.allowed_filter_fields:
            raise InvalidFieldError(
                field=field,
                valid_fields=self.allowed_filter_fields,
                operation="filtering",
            )
        attr = self._get_model_attr(field)
        filter_condition = attr.ilike(f"%{value}%")
        return query.where(filter_condition), count_query.where(filter_condition)

    def _apply_exact_filter(
        self,
        query: Select[tuple[ModelType]],
        count_query: Select[tuple[int]],
        field: str,
        value: Any,
    ) -> tuple[Select[tuple[ModelType]], Select[tuple[int]]]:
        """Apply exact match filter to both queries.

        Args:
            query: Main select query.
            count_query: Count query for pagination.
            field: Field name to filter on.
            value: Value to filter by (exact match).

        Returns:
            Tuple of (filtered query, filtered count query).
        """
        attr = self._get_model_attr(field)
        filter_condition = attr == value
        return query.where(filter_condition), count_query.where(filter_condition)

    def _apply_filters(
        self,
        query: Select[tuple[ModelType]],
        count_query: Select[tuple[int]],
        filters: dict[str, Any],
    ) -> tuple[Select[tuple[ModelType]], Select[tuple[int]]]:
        """Apply multiple filters to both queries.

        Args:
            query: Main select query.
            count_query: Count query for pagination.
            filters: Dictionary of field -> value filters.

        Returns:
            Tuple of (filtered query, filtered count query).
        """
        for field, value in filters.items():
            if value is not None:
                if field in self.allowed_filter_fields:
                    query, count_query = self._apply_text_filter(query, count_query, field, value)
        return query, count_query

    def _build_base_queries(self) -> tuple[Select[tuple[ModelType]], Select[tuple[int]]]:
        """Build base select and count queries.

        Returns:
            Tuple of (select query, count query).
        """
        query = select(self.model)
        count_query = select(func.count()).select_from(self.model)
        return query, count_query

    async def get_by_id(self, id: int) -> ModelType:
        """Get single item by ID.

        Args:
            id: Primary key ID.

        Returns:
            Model instance.

        Raises:
            NotFoundError: If item not found.
        """
        query = select(self.model).where(self.model.id == id)
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item

    async def get_list(
        self,
        *,
        page: int = 1,
        page_size: int = 10,
        ordering: str | None = None,
        filters: dict[str, Any] | None = None,
    ) -> tuple[list[ModelType], int]:
        """Get paginated list of items.

        Args:
            page: Page number (1-indexed).
            page_size: Number of items per page.
            ordering: Ordering string (e.g., "name" or "-name").
            filters: Dictionary of field -> value filters.

        Returns:
            Tuple of (list of items, total count).
        """
        query, count_query = self._build_base_queries()

        # Apply filters
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

    async def create(self, data: CreateSchemaType) -> ModelType:
        """Create new item.

        Args:
            data: Pydantic schema with creation data.

        Returns:
            Created model instance.
        """
        item = self.model(**data.model_dump())
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def update(self, id: int, data: UpdateSchemaType) -> ModelType:
        """Update existing item.

        Args:
            id: Primary key ID.
            data: Pydantic schema with update data.

        Returns:
            Updated model instance.

        Raises:
            NotFoundError: If item not found.
        """
        item = await self.get_by_id(id)

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(item, field, value)

        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def delete(self, id: int) -> None:
        """Delete item by ID.

        Args:
            id: Primary key ID.

        Raises:
            NotFoundError: If item not found.
        """
        item = await self.get_by_id(id)
        await self.db.delete(item)
        await self.db.commit()

    async def exists(self, id: int) -> bool:
        """Check if item exists.

        Args:
            id: Primary key ID.

        Returns:
            True if item exists, False otherwise.
        """
        query = select(func.count()).select_from(self.model).where(self.model.id == id)
        count = await self.db.scalar(query)
        return bool(count and count > 0)
