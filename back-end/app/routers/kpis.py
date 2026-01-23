"""KPI router endpoints."""

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.kpi import KpiCreate, KpiResponse, KpiUpdate
from app.services.kpi import KPIService

router = APIRouter(prefix="/kpis", tags=["kpis"])


def get_service(db: AsyncSession = Depends(get_db)) -> KPIService:
    """Dependency to get KPIService instance."""
    return KPIService(db)


@router.get("/", response_model=None)
async def list_kpis(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: KPIService = Depends(get_service),
):
    """List all KPIs with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=KpiResponse, status_code=201)
async def create_kpi(
    kpi: KpiCreate,
    service: KPIService = Depends(get_service),
):
    """Create a new KPI."""
    return await service.create(kpi)


@router.get("/{kpi_id}/", response_model=KpiResponse)
async def get_kpi(
    kpi_id: int,
    service: KPIService = Depends(get_service),
):
    """Get a KPI by ID."""
    return await service.get_by_id(kpi_id)


@router.put("/{kpi_id}/", response_model=KpiResponse)
async def update_kpi(
    kpi_id: int,
    kpi_update: KpiUpdate,
    service: KPIService = Depends(get_service),
):
    """Update an existing KPI."""
    return await service.update(kpi_id, kpi_update)


@router.delete("/{kpi_id}/", status_code=204)
async def delete_kpi(
    kpi_id: int,
    service: KPIService = Depends(get_service),
):
    """Delete a KPI by ID."""
    await service.delete(kpi_id)
    return None
