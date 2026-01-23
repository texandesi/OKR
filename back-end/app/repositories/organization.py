"""Organization repository with eager loading for relationships."""

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.organization import Organization
from app.repositories.base import BaseRepository
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrganizationRepository(BaseRepository[Organization, OrganizationCreate, OrganizationUpdate]):
    """Repository for Organization model with eager loading for relationships."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Organization,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    def _build_base_queries(self) -> tuple[Select[tuple[Organization]], Select[tuple[int]]]:
        """Build base queries with eager loading for relationships.

        Returns:
            Tuple of (select query with eager loading, count query).
        """
        query = select(Organization).options(
            selectinload(Organization.users),
            selectinload(Organization.groups),
        )
        count_query = select(func.count()).select_from(Organization)
        return query, count_query

    async def get_by_id(self, id: int) -> Organization:
        """Get organization by ID with eager-loaded relationships.

        Args:
            id: Primary key ID.

        Returns:
            Organization with relationships loaded.

        Raises:
            NotFoundError: If organization not found.
        """
        from app.core.exceptions import NotFoundError

        query = (
            select(Organization)
            .options(
                selectinload(Organization.users),
                selectinload(Organization.groups),
            )
            .where(Organization.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item
