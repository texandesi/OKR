"""Organization repository."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.organization import Organization
from app.repositories.base import BaseRepository
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrganizationRepository(BaseRepository[Organization, OrganizationCreate, OrganizationUpdate]):
    """Repository for Organization model."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Organization,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )
