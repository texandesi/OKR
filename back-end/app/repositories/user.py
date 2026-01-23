"""User repository with eager loading for relationships."""

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.repositories.base import BaseRepository
from app.schemas.user import UserCreate, UserUpdate


class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    """Repository for User model with eager loading for relationships."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=User,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )

    def _build_base_queries(self) -> tuple[Select[tuple[User]], Select[tuple[int]]]:
        """Build base queries with eager loading for relationships.

        Returns:
            Tuple of (select query with eager loading, count query).
        """
        query = select(User).options(
            selectinload(User.organizations),
            selectinload(User.groups),
            selectinload(User.roles),
        )
        count_query = select(func.count()).select_from(User)
        return query, count_query

    async def get_by_id(self, id: int) -> User:
        """Get user by ID with eager-loaded relationships.

        Args:
            id: Primary key ID.

        Returns:
            User with relationships loaded.

        Raises:
            NotFoundError: If user not found.
        """
        from app.core.exceptions import NotFoundError

        query = (
            select(User)
            .options(
                selectinload(User.organizations),
                selectinload(User.groups),
                selectinload(User.roles),
            )
            .where(User.id == id)
        )
        result = await self.db.execute(query)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundError(self._model_name, id)
        return item
