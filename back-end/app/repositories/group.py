"""Group repository with eager loading for relationships."""

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.group import Group
from app.repositories.base import BaseRepository
from app.schemas.group import GroupCreate, GroupUpdate


class GroupRepository(BaseRepository[Group, GroupCreate, GroupUpdate]):
    """Repository for Group model with eager loading for relationships."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Group,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    def _build_base_queries(self) -> tuple[Select[tuple[Group]], Select[tuple[int]]]:
        """Build base queries with eager loading for relationships.

        Returns:
            Tuple of (select query with eager loading, count query).
        """
        query = select(Group).options(
            selectinload(Group.parent),
            selectinload(Group.children),
            selectinload(Group.owner),
            selectinload(Group.delegates),
            selectinload(Group.users),
            selectinload(Group.organizations),
            selectinload(Group.roles),
        )
        count_query = select(func.count()).select_from(Group)
        return query, count_query

    async def get_by_id(self, id: int) -> Group:
        """Get group by ID with eager-loaded relationships.

        Args:
            id: Primary key ID.

        Returns:
            Group with relationships loaded.

        Raises:
            NotFoundError: If group not found.
        """
        from app.core.exceptions import NotFoundError

        query = (
            select(Group)
            .options(
                selectinload(Group.parent),
                selectinload(Group.children),
                selectinload(Group.owner),
                selectinload(Group.delegates),
                selectinload(Group.users),
                selectinload(Group.organizations),
                selectinload(Group.roles),
            )
            .where(Group.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item
