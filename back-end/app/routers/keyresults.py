"""KeyResult router endpoints."""

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.keyresult import KeyResultCreate, KeyResultResponse, KeyResultUpdate
from app.services.keyresult import KeyResultService

router = APIRouter(prefix="/keyresults", tags=["keyresults"])


def get_service(db: AsyncSession = Depends(get_db)) -> KeyResultService:
    """Dependency to get KeyResultService instance."""
    return KeyResultService(db)


@router.get("/", response_model=None)
async def list_keyresults(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: KeyResultService = Depends(get_service),
):
    """List all key results with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=KeyResultResponse, status_code=201)
async def create_keyresult(
    keyresult: KeyResultCreate,
    service: KeyResultService = Depends(get_service),
):
    """Create a new key result."""
    return await service.create(keyresult)


@router.get("/{keyresult_id}/", response_model=KeyResultResponse)
async def get_keyresult(
    keyresult_id: int,
    service: KeyResultService = Depends(get_service),
):
    """Get a key result by ID."""
    return await service.get_by_id(keyresult_id)


@router.put("/{keyresult_id}/", response_model=KeyResultResponse)
async def update_keyresult(
    keyresult_id: int,
    keyresult_update: KeyResultUpdate,
    service: KeyResultService = Depends(get_service),
):
    """Update an existing key result."""
    return await service.update(keyresult_id, keyresult_update)


@router.delete("/{keyresult_id}/", status_code=204)
async def delete_keyresult(
    keyresult_id: int,
    service: KeyResultService = Depends(get_service),
):
    """Delete a key result by ID."""
    await service.delete(keyresult_id)
    return None
