"""Router for group streak endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.streak import GroupStreakResponse, StreakCheckResponse
from app.services.streak import StreakService

router = APIRouter(prefix="/groups", tags=["streaks"])


@router.get(
    "/{group_id}/streak",
    response_model=GroupStreakResponse,
)
async def get_group_streak(
    group_id: int,
    db: AsyncSession = Depends(get_db),
) -> GroupStreakResponse:
    """Get streak information for a group."""
    service = StreakService(db)
    return await service.get_streak(group_id)


@router.post(
    "/{group_id}/streak/check",
    response_model=StreakCheckResponse,
)
async def check_group_streak(
    group_id: int,
    db: AsyncSession = Depends(get_db),
) -> StreakCheckResponse:
    """
    Record activity for a group and update its streak.

    This endpoint should be called internally when a key result is completed.
    """
    service = StreakService(db)
    return await service.record_activity(group_id)
