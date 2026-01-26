"""KeyResult repository with objective relationship handling."""


from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError, ValidationError
from app.models.keyresult import KeyResult
from app.models.objective import Objective
from app.repositories.base import BaseRepository
from app.schemas.keyresult import KeyResultCreate, KeyResultUpdate


class KeyResultRepository(BaseRepository[KeyResult, KeyResultCreate, KeyResultUpdate]):
    """Repository for KeyResult model with objective validation."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=KeyResult,
            db=db,
            allowed_order_fields=["id", "name", "description", "target_value", "current_value"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    def _build_base_queries(self) -> tuple[Select[tuple[KeyResult]], Select[tuple[int]]]:
        """Build base queries with eager loading for objective."""
        query = select(KeyResult).options(selectinload(KeyResult.objective))
        count_query = select(func.count()).select_from(KeyResult)
        return query, count_query

    async def get_by_id(self, id: int) -> KeyResult:
        """Get key result by ID with eager-loaded objective.

        Args:
            id: Primary key ID.

        Returns:
            KeyResult with objective loaded.

        Raises:
            NotFoundError: If key result not found.
        """
        query = (
            select(KeyResult)
            .options(selectinload(KeyResult.objective))
            .where(KeyResult.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item

    async def _validate_objective_exists(self, objective_id: int) -> None:
        """Validate that the objective exists.

        Args:
            objective_id: Objective ID to validate.

        Raises:
            ValidationError: If objective not found.
        """
        query = select(func.count()).select_from(Objective).where(Objective.id == objective_id)
        count = await self.db.scalar(query)
        if not count:
            raise ValidationError(
                message="Objective not found",
                field="objective",
                value=objective_id,
            )

    async def create(self, data: KeyResultCreate) -> KeyResult:
        """Create new key result with objective validation.

        Args:
            data: KeyResultCreate schema.

        Returns:
            Created KeyResult with objective loaded.

        Raises:
            ValidationError: If objective not found.
        """
        await self._validate_objective_exists(data.objective)

        item = KeyResult(
            name=data.name,
            description=data.description,
            objective_id=data.objective,
            target_value=data.target_value,
            current_value=data.current_value,
            unit=data.unit,
            start_date=data.start_date,
            end_date=data.end_date,
        )
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)

        # Reload with objective
        return await self.get_by_id(item.id)

    async def update(self, id: int, data: KeyResultUpdate) -> KeyResult:
        """Update key result with field mapping and objective validation.

        Args:
            id: Primary key ID.
            data: KeyResultUpdate schema.

        Returns:
            Updated KeyResult with objective loaded.

        Raises:
            NotFoundError: If key result not found.
            ValidationError: If new objective not found.
        """
        item = await self.get_by_id(id)

        update_data = data.model_dump(exclude_unset=True)

        # Handle objective field mapping
        if "objective" in update_data:
            objective_id = update_data.pop("objective")
            await self._validate_objective_exists(objective_id)
            update_data["objective_id"] = objective_id

        for field, value in update_data.items():
            setattr(item, field, value)

        await self.db.commit()
        await self.db.refresh(item)

        # Reload with objective
        return await self.get_by_id(item.id)
