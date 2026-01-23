"""Role repository with eager loading for relationships."""

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.role import Role
from app.repositories.base import BaseRepository
from app.schemas.role import RoleCreate, RoleUpdate


class RoleRepository(BaseRepository[Role, RoleCreate, RoleUpdate]):
    """Repository for Role model with eager loading for relationships."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Role,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    def _build_base_queries(self) -> tuple[Select[tuple[Role]], Select[tuple[int]]]:
        """Build base queries with eager loading for relationships.

        Returns:
            Tuple of (select query with eager loading, count query).
        """
        query = select(Role).options(
            selectinload(Role.users),
            selectinload(Role.groups),
        )
        count_query = select(func.count()).select_from(Role)
        return query, count_query

    async def get_by_id(self, id: int) -> Role:
        """Get role by ID with eager-loaded relationships.

        Args:
            id: Primary key ID.

        Returns:
            Role with relationships loaded.

        Raises:
            NotFoundError: If role not found.
        """
        from app.core.exceptions import NotFoundError

        query = (
            select(Role)
            .options(
                selectinload(Role.users),
                selectinload(Role.groups),
            )
            .where(Role.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item
