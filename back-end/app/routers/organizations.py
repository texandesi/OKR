"""Organization router endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.organization import OrganizationService

router = APIRouter(prefix="/organizations", tags=["organizations"])


def get_service(db: AsyncSession = Depends(get_db)) -> OrganizationService:
    """Dependency to get OrganizationService instance."""
    return OrganizationService(db)


@router.get("/", response_model=None)
async def list_organizations(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: OrganizationService = Depends(get_service),
) -> dict[str, Any]:
    """List all organizations with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=OrganizationResponse, status_code=201)
async def create_organization(
    organization: OrganizationCreate,
    service: OrganizationService = Depends(get_service),
) -> OrganizationResponse:
    """Create a new organization."""
    return await service.create(organization)


@router.get("/{organization_id}/", response_model=OrganizationResponse)
async def get_organization(
    organization_id: int,
    service: OrganizationService = Depends(get_service),
) -> OrganizationResponse:
    """Get an organization by ID."""
    return await service.get_by_id(organization_id)


@router.put("/{organization_id}/", response_model=OrganizationResponse)
async def update_organization(
    organization_id: int,
    organization_update: OrganizationUpdate,
    service: OrganizationService = Depends(get_service),
) -> OrganizationResponse:
    """Update an existing organization."""
    return await service.update(organization_id, organization_update)


@router.delete("/{organization_id}/", status_code=204)
async def delete_organization(
    organization_id: int,
    service: OrganizationService = Depends(get_service),
) -> None:
    """Delete an organization by ID."""
    await service.delete(organization_id)
