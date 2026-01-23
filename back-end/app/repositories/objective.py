"""Objective repository with eager loading support."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError
from app.models.objective import Objective
from app.repositories.base import BaseRepository
from app.schemas.objective import ObjectiveCreate, ObjectiveUpdate


class ObjectiveRepository(BaseRepository[Objective, ObjectiveCreate, ObjectiveUpdate]):
    """Repository for Objective model with eager loading for key results."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Objective,
            db=db,
            allowed_order_fields=["id", "name", "description", "start_date", "end_date"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    async def get_by_id_with_keyresults(self, id: int) -> Objective:
        """Get objective with eager-loaded key results and ownerships.

        Args:
            id: Primary key ID.

        Returns:
            Objective with keyresults and ownerships loaded.

        Raises:
            NotFoundError: If objective not found.
        """
        query = (
            select(Objective)
            .options(
                selectinload(Objective.keyresults),
                selectinload(Objective.ownerships),
            )
            .where(Objective.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item

    async def create(self, data: ObjectiveCreate) -> Objective:
        """Create new objective.

        Args:
            data: ObjectiveCreate schema.

        Returns:
            Created Objective.
        """
        item = Objective(
            name=data.name,
            description=data.description,
            start_date=data.start_date,
            end_date=data.end_date,
        )
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def update(self, id: int, data: ObjectiveUpdate) -> Objective:
        """Update objective.

        Args:
            id: Primary key ID.
            data: ObjectiveUpdate schema.

        Returns:
            Updated Objective.

        Raises:
            NotFoundError: If objective not found.
        """
        item = await self.get_by_id(id)
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(item, field, value)

        await self.db.commit()
        await self.db.refresh(item)
        return item
