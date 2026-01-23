"""Group repository."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.group import Group
from app.repositories.base import BaseRepository
from app.schemas.group import GroupCreate, GroupUpdate


class GroupRepository(BaseRepository[Group, GroupCreate, GroupUpdate]):
    """Repository for Group model."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Group,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )
