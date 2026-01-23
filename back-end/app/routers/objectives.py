"""Objective router endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.objective import (
    ObjectiveCreate,
    ObjectiveResponse,
    ObjectiveUpdate,
    ObjectiveWithKeyResults,
)
from app.services.objective import ObjectiveService

router = APIRouter(prefix="/objectives", tags=["objectives"])


def get_service(db: AsyncSession = Depends(get_db)) -> ObjectiveService:
    """Dependency to get ObjectiveService instance."""
    return ObjectiveService(db)


@router.get("/", response_model=None)
async def list_objectives(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: ObjectiveService = Depends(get_service),
) -> dict[str, Any]:
    """List all objectives with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=ObjectiveResponse, status_code=201)
async def create_objective(
    objective: ObjectiveCreate,
    service: ObjectiveService = Depends(get_service),
) -> ObjectiveResponse:
    """Create a new objective."""
    return await service.create(objective)


@router.get("/{objective_id}/", response_model=ObjectiveWithKeyResults)
async def get_objective(
    objective_id: int,
    service: ObjectiveService = Depends(get_service),
) -> ObjectiveWithKeyResults:
    """Get an objective by ID with its key results."""
    return await service.get_by_id_with_keyresults(objective_id)


@router.put("/{objective_id}/", response_model=ObjectiveResponse)
async def update_objective(
    objective_id: int,
    objective_update: ObjectiveUpdate,
    service: ObjectiveService = Depends(get_service),
) -> ObjectiveResponse:
    """Update an existing objective."""
    return await service.update(objective_id, objective_update)


@router.delete("/{objective_id}/", status_code=204)
async def delete_objective(
    objective_id: int,
    service: ObjectiveService = Depends(get_service),
) -> None:
    """Delete an objective by ID."""
    await service.delete(objective_id)
