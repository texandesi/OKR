"""User router endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user import UserService

router = APIRouter(prefix="/users", tags=["users"])


def get_service(db: AsyncSession = Depends(get_db)) -> UserService:
    """Dependency to get UserService instance."""
    return UserService(db)


@router.get("/", response_model=None)
async def list_users(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    service: UserService = Depends(get_service),
) -> dict[str, Any]:
    """List all users with pagination, ordering, and filtering."""
    filters = {"name": name, "description": description}
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        filters=filters,
    )


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user: UserCreate,
    service: UserService = Depends(get_service),
) -> UserResponse:
    """Create a new user."""
    return await service.create(user)


@router.get("/{user_id}/", response_model=UserResponse)
async def get_user(
    user_id: int,
    service: UserService = Depends(get_service),
) -> UserResponse:
    """Get a user by ID."""
    return await service.get_by_id(user_id)


@router.put("/{user_id}/", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    service: UserService = Depends(get_service),
) -> UserResponse:
    """Update an existing user."""
    return await service.update(user_id, user_update)


@router.delete("/{user_id}/", status_code=204)
async def delete_user(
    user_id: int,
    service: UserService = Depends(get_service),
) -> None:
    """Delete a user by ID."""
    await service.delete(user_id)
