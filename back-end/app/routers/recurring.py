"""Router for recurring schedule endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.recurring import (
    DueTodayItem,
    RecurringScheduleCreate,
    RecurringScheduleResponse,
    RecurringScheduleUpdate,
    RegenerateResponse,
)
from app.services.recurring import RecurringService

router = APIRouter(prefix="/recurring", tags=["recurring"])


@router.post(
    "/keyresults/{key_result_id}",
    response_model=RecurringScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_recurring_schedule(
    key_result_id: int,
    data: RecurringScheduleCreate,
    db: AsyncSession = Depends(get_db),
) -> RecurringScheduleResponse:
    """Create a recurring schedule for a key result."""
    service = RecurringService(db)
    return await service.create_schedule(key_result_id, data)


@router.get(
    "/keyresults/{key_result_id}",
    response_model=RecurringScheduleResponse | None,
)
async def get_recurring_schedule(
    key_result_id: int,
    db: AsyncSession = Depends(get_db),
) -> RecurringScheduleResponse | None:
    """Get the recurring schedule for a key result."""
    service = RecurringService(db)
    return await service.get_schedule(key_result_id)


@router.patch(
    "/keyresults/{key_result_id}",
    response_model=RecurringScheduleResponse,
)
async def update_recurring_schedule(
    key_result_id: int,
    data: RecurringScheduleUpdate,
    db: AsyncSession = Depends(get_db),
) -> RecurringScheduleResponse:
    """Update the recurring schedule for a key result."""
    service = RecurringService(db)
    return await service.update_schedule(key_result_id, data)


@router.delete(
    "/keyresults/{key_result_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_recurring_schedule(
    key_result_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete the recurring schedule for a key result."""
    service = RecurringService(db)
    await service.delete_schedule(key_result_id)


@router.get(
    "/due-today",
    response_model=list[DueTodayItem],
)
async def get_due_today(
    group_id: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[DueTodayItem]:
    """Get all recurring items due today."""
    service = RecurringService(db)
    return await service.get_due_today(group_id)


@router.get(
    "/groups/{group_id}",
    response_model=list[RecurringScheduleResponse],
)
async def get_group_schedules(
    group_id: int,
    db: AsyncSession = Depends(get_db),
) -> list[RecurringScheduleResponse]:
    """Get all recurring schedules for a group."""
    service = RecurringService(db)
    return await service.get_group_schedules(group_id)


@router.post(
    "/regenerate",
    response_model=RegenerateResponse,
)
async def run_regeneration(
    db: AsyncSession = Depends(get_db),
) -> RegenerateResponse:
    """
    Run the regeneration job for completed recurring tasks.

    This resets completed key results that have recurring schedules
    and rotates assignees if rotation is enabled.
    """
    service = RecurringService(db)
    return await service.run_regeneration()
