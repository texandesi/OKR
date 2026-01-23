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
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    async def get_by_id_with_keyresults(self, id: int) -> Objective:
        """Get objective with eager-loaded key results.

        Args:
            id: Primary key ID.

        Returns:
            Objective with keyresults loaded.

        Raises:
            NotFoundError: If objective not found.
        """
        query = (
            select(Objective)
            .options(selectinload(Objective.keyresults))
            .where(Objective.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item
