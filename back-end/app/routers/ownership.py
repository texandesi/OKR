"""Ownership router endpoints for managing objective assignments."""

from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.ownership import OwnershipCreate, OwnershipResponse, UserAssignedOKRs
from app.services.ownership import OwnershipService

router = APIRouter(prefix="/ownership", tags=["ownership"])


def get_service(db: AsyncSession = Depends(get_db)) -> OwnershipService:
    """Dependency to get OwnershipService instance."""
    return OwnershipService(db)


@router.post(
    "/objectives/{objective_id}/owner",
    response_model=OwnershipResponse,
    status_code=201,
)
async def add_objective_owner(
    objective_id: int,
    ownership: OwnershipCreate,
    service: OwnershipService = Depends(get_service),
) -> OwnershipResponse:
    """Add an owner to an objective.

    Owner can be a user, role, or group.
    """
    return await service.add_ownership(
        objective_id,
        ownership.owner_type,
        ownership.owner_id,
    )


@router.delete("/objectives/{objective_id}/owner")
async def remove_objective_owner(
    objective_id: int,
    owner_type: Literal["user", "role", "group"] = Query(alias="ownerType"),
    owner_id: int = Query(alias="ownerId"),
    service: OwnershipService = Depends(get_service),
) -> dict[str, str]:
    """Remove an owner from an objective."""
    await service.remove_ownership(objective_id, owner_type, owner_id)
    return {"message": "Owner removed successfully"}


@router.get(
    "/objectives/{objective_id}/owners",
    response_model=list[OwnershipResponse],
)
async def get_objective_owners(
    objective_id: int,
    service: OwnershipService = Depends(get_service),
) -> list[OwnershipResponse]:
    """Get all owners of an objective."""
    return await service.get_objective_ownerships(objective_id)


@router.get(
    "/users/{user_id}/objectives",
    response_model=UserAssignedOKRs,
)
async def get_user_objectives(
    user_id: int,
    service: OwnershipService = Depends(get_service),
) -> UserAssignedOKRs:
    """Get all objectives assigned to a user.

    Returns objectives grouped by assignment type:
    - individual: Directly assigned to the user
    - byRole: Assigned via roles the user has
    - byGroup: Assigned via groups the user belongs to
    """
    return await service.get_user_assigned_okrs(user_id)
