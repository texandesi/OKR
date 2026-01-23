"""Role router endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.role import RoleCreate, RoleResponse, RoleUpdate
from app.services.role import RoleService

router = APIRouter(prefix="/roles", tags=["roles"])


def get_service(db: AsyncSession = Depends(get_db)) -> RoleService:
    """Dependency to get RoleService instance."""
    return RoleService(db)


@router.get("/", response_model=None)
async def list_roles(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: RoleService = Depends(get_service),
) -> dict[str, Any]:
    """List all roles with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=RoleResponse, status_code=201)
async def create_role(
    role: RoleCreate,
    service: RoleService = Depends(get_service),
) -> RoleResponse:
    """Create a new role."""
    return await service.create(role)


@router.get("/{role_id}/", response_model=RoleResponse)
async def get_role(
    role_id: int,
    service: RoleService = Depends(get_service),
) -> RoleResponse:
    """Get a role by ID."""
    return await service.get_by_id(role_id)


@router.put("/{role_id}/", response_model=RoleResponse)
async def update_role(
    role_id: int,
    role_update: RoleUpdate,
    service: RoleService = Depends(get_service),
) -> RoleResponse:
    """Update an existing role."""
    return await service.update(role_id, role_update)


@router.delete("/{role_id}/", status_code=204)
async def delete_role(
    role_id: int,
    service: RoleService = Depends(get_service),
) -> None:
    """Delete a role by ID."""
    await service.delete(role_id)
