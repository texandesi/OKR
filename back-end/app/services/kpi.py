"""KPI service."""

from app.models.kpi import Kpi
from app.repositories.kpi import KPIRepository
from app.schemas.kpi import KpiCreate, KpiResponse, KpiUpdate
from app.services.base import BaseService


class KPIService(BaseService[Kpi, KpiCreate, KpiUpdate, KpiResponse]):
    """Service for KPI operations."""

    repository_class = KPIRepository
    response_schema = KpiResponse
