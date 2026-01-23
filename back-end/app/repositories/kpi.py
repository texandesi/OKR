"""KPI repository."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.kpi import Kpi
from app.repositories.base import BaseRepository
from app.schemas.kpi import KpiCreate, KpiUpdate


class KPIRepository(BaseRepository[Kpi, KpiCreate, KpiUpdate]):
    """Repository for Kpi model."""

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(
            model=Kpi,
            db=db,
            allowed_order_fields=["id", "name", "description"],
            allowed_filter_fields=["name", "description"],
            default_order_field="name",
        )
