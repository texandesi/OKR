"""Service layer for recurring schedules."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.models.recurring_schedule import RecurringSchedule
from app.repositories.recurring import RecurringRepository
from app.schemas.recurring import (
    DueTodayItem,
    Frequency,
    RecurringScheduleCreate,
    RecurringScheduleResponse,
    RecurringScheduleUpdate,
    RegenerateResponse,
)


class RecurringService:
    """Service for managing recurring schedules."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repository = RecurringRepository(db)

    async def create_schedule(
        self, key_result_id: int, data: RecurringScheduleCreate
    ) -> RecurringScheduleResponse:
        """Create a recurring schedule for a key result."""
        schedule = await self.repository.create(
            key_result_id=key_result_id,
            frequency=data.frequency.value,
            next_due_date=data.next_due_date,
            rotation_enabled=data.rotation_enabled,
            rotation_users=data.rotation_users,
        )
        return await self._to_response(schedule)

    async def get_schedule(self, key_result_id: int) -> RecurringScheduleResponse | None:
        """Get a recurring schedule by key result ID."""
        schedule = await self.repository.get_by_key_result(key_result_id)
        if not schedule:
            return None
        return await self._to_response(schedule)

    async def update_schedule(
        self, key_result_id: int, data: RecurringScheduleUpdate
    ) -> RecurringScheduleResponse:
        """Update a recurring schedule."""
        schedule = await self.repository.update(
            key_result_id=key_result_id,
            frequency=data.frequency.value if data.frequency else None,
            rotation_enabled=data.rotation_enabled,
            rotation_users=data.rotation_users,
            next_due_date=data.next_due_date,
        )
        return await self._to_response(schedule)

    async def delete_schedule(self, key_result_id: int) -> None:
        """Delete a recurring schedule."""
        await self.repository.delete(key_result_id)

    async def get_due_today(self, group_id: int | None = None) -> list[DueTodayItem]:
        """Get all items due today."""
        schedules = await self.repository.get_due_today(group_id)
        items = []

        for schedule in schedules:
            kr = schedule.key_result
            objective = kr.objective if hasattr(kr, 'objective') else None

            # Get assignee name if rotation is enabled
            assignee_id = self.repository.get_current_assignee(schedule)
            assignee_name = None
            if assignee_id:
                user_query = select(User).where(User.id == assignee_id)
                user_result = await self.db.execute(user_query)
                user = user_result.scalar_one_or_none()
                if user:
                    assignee_name = user.name

            items.append(
                DueTodayItem(
                    key_result_id=kr.id,
                    key_result_name=kr.name,
                    objective_name=objective.name if objective else "Unknown",
                    frequency=Frequency(schedule.frequency),
                    assignee_id=assignee_id,
                    assignee_name=assignee_name,
                )
            )

        return items

    async def get_group_schedules(
        self, group_id: int
    ) -> list[RecurringScheduleResponse]:
        """Get all recurring schedules for a group."""
        schedules = await self.repository.get_all_for_group(group_id)
        return [await self._to_response(s) for s in schedules]

    async def run_regeneration(self) -> RegenerateResponse:
        """Run the regeneration job for completed recurring tasks."""
        regenerated, rotated = await self.repository.regenerate_completed()

        if regenerated == 0:
            message = "No completed recurring tasks to regenerate."
        else:
            message = f"Regenerated {regenerated} task(s)"
            if rotated > 0:
                message += f", rotated {rotated} assignee(s)"
            message += "."

        return RegenerateResponse(
            regenerated_count=regenerated,
            rotated_count=rotated,
            message=message,
        )

    async def _to_response(
        self, schedule: RecurringSchedule
    ) -> RecurringScheduleResponse:
        """Convert schedule model to response schema."""
        assignee_id = self.repository.get_current_assignee(schedule)

        return RecurringScheduleResponse(
            id=schedule.id,
            key_result_id=schedule.key_result_id,
            key_result_name=schedule.key_result.name,
            frequency=Frequency(schedule.frequency),
            rotation_enabled=schedule.rotation_enabled,
            rotation_users=schedule.rotation_users,
            current_rotation_index=schedule.current_rotation_index,
            next_due_date=schedule.next_due_date,
            last_generated_at=schedule.last_generated_at,
            current_assignee_id=assignee_id,
        )
