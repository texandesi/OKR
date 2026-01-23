"""Group router endpoints."""

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.group import GroupCreate, GroupResponse, GroupUpdate
from app.services.group import GroupService

router = APIRouter(prefix="/groups", tags=["groups"])


def get_service(db: AsyncSession = Depends(get_db)) -> GroupService:
    """Dependency to get GroupService instance."""
    return GroupService(db)


@router.get("/", response_model=None)
async def list_groups(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: GroupService = Depends(get_service),
):
    """List all groups with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=GroupResponse, status_code=201)
async def create_group(
    group: GroupCreate,
    service: GroupService = Depends(get_service),
):
    """Create a new group."""
    return await service.create(group)


@router.get("/{group_id}/", response_model=GroupResponse)
async def get_group(
    group_id: int,
    service: GroupService = Depends(get_service),
):
    """Get a group by ID."""
    return await service.get_by_id(group_id)


@router.put("/{group_id}/", response_model=GroupResponse)
async def update_group(
    group_id: int,
    group_update: GroupUpdate,
    service: GroupService = Depends(get_service),
):
    """Update an existing group."""
    return await service.update(group_id, group_update)


@router.delete("/{group_id}/", status_code=204)
async def delete_group(
    group_id: int,
    service: GroupService = Depends(get_service),
):
    """Delete a group by ID."""
    await service.delete(group_id)
    return None
