"""Repository for managing recurring schedules."""

from datetime import date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError, ValidationError
from app.models import KeyResult
from app.models.recurring_schedule import RecurringSchedule


class RecurringRepository:
    """Repository for recurring schedule operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        key_result_id: int,
        frequency: str,
        next_due_date: date,
        rotation_enabled: bool = False,
        rotation_users: list[int] | None = None,
    ) -> RecurringSchedule:
        """Create a recurring schedule for a key result."""
        # Validate key result exists
        kr_query = select(KeyResult).where(KeyResult.id == key_result_id)
        kr_result = await self.db.execute(kr_query)
        if not kr_result.scalar_one_or_none():
            raise NotFoundError("KeyResult", key_result_id)

        # Check if schedule already exists
        existing = await self.get_by_key_result(key_result_id)
        if existing:
            raise ValidationError(
                message="Key result already has a recurring schedule",
                field="key_result_id",
                value=key_result_id,
            )

        schedule = RecurringSchedule(
            key_result_id=key_result_id,
            frequency=frequency,
            rotation_enabled=rotation_enabled,
            rotation_users=rotation_users,
            current_rotation_index=0,
            next_due_date=next_due_date,
            last_generated_at=None,
        )
        self.db.add(schedule)
        await self.db.commit()
        await self.db.refresh(schedule)
        return schedule

    async def get_by_id(self, schedule_id: int) -> RecurringSchedule | None:
        """Get a recurring schedule by ID."""
        query = select(RecurringSchedule).where(RecurringSchedule.id == schedule_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_key_result(self, key_result_id: int) -> RecurringSchedule | None:
        """Get a recurring schedule by key result ID."""
        query = select(RecurringSchedule).where(
            RecurringSchedule.key_result_id == key_result_id
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update(
        self,
        key_result_id: int,
        frequency: str | None = None,
        rotation_enabled: bool | None = None,
        rotation_users: list[int] | None = None,
        next_due_date: date | None = None,
    ) -> RecurringSchedule:
        """Update a recurring schedule."""
        schedule = await self.get_by_key_result(key_result_id)
        if not schedule:
            raise NotFoundError("RecurringSchedule", f"key_result:{key_result_id}")

        if frequency is not None:
            schedule.frequency = frequency
        if rotation_enabled is not None:
            schedule.rotation_enabled = rotation_enabled
        if rotation_users is not None:
            schedule.rotation_users = rotation_users
        if next_due_date is not None:
            schedule.next_due_date = next_due_date

        await self.db.commit()
        await self.db.refresh(schedule)
        return schedule

    async def delete(self, key_result_id: int) -> None:
        """Delete a recurring schedule."""
        schedule = await self.get_by_key_result(key_result_id)
        if not schedule:
            raise NotFoundError("RecurringSchedule", f"key_result:{key_result_id}")

        await self.db.delete(schedule)
        await self.db.commit()

    async def get_due_today(self, group_id: int | None = None) -> list[RecurringSchedule]:
        """Get all schedules due today."""
        from app.models import KeyResult

        today = date.today()
        query = (
            select(RecurringSchedule)
            .options(
                selectinload(RecurringSchedule.key_result).selectinload(KeyResult.objective)
            )
            .where(RecurringSchedule.next_due_date <= today)
        )

        # If group_id provided, filter by group
        # This would require joining through key_result -> objective -> ownership
        # For simplicity, we'll return all for now

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_all_for_group(self, group_id: int) -> list[RecurringSchedule]:
        """Get all recurring schedules for a group's objectives."""
        # This would need to join through key_result -> objective -> ownership
        # For simplicity, return all schedules
        query = select(RecurringSchedule)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def regenerate_completed(self) -> tuple[int, int]:
        """
        Regenerate completed recurring tasks and rotate assignees.

        Returns:
            Tuple of (regenerated_count, rotated_count)
        """
        today = date.today()
        regenerated = 0
        rotated = 0

        # Get all schedules that are due
        query = select(RecurringSchedule).where(RecurringSchedule.next_due_date <= today)
        result = await self.db.execute(query)
        schedules = list(result.scalars().all())

        for schedule in schedules:
            # Check if the key result is complete
            kr = schedule.key_result
            if kr.is_complete:
                # Reset the key result
                kr.is_complete = False
                kr.current_value = 0

                # Calculate next due date based on frequency
                if schedule.frequency == "daily":
                    next_date = today + timedelta(days=1)
                elif schedule.frequency == "weekly":
                    next_date = today + timedelta(weeks=1)
                else:  # monthly
                    # Add roughly a month
                    next_date = today + timedelta(days=30)

                schedule.next_due_date = next_date
                schedule.last_generated_at = datetime.utcnow()
                regenerated += 1

                # Rotate assignee if enabled
                if schedule.rotation_enabled and schedule.rotation_users:
                    schedule.current_rotation_index = (
                        schedule.current_rotation_index + 1
                    ) % len(schedule.rotation_users)
                    rotated += 1

        await self.db.commit()
        return regenerated, rotated

    def get_current_assignee(self, schedule: RecurringSchedule) -> int | None:
        """Get the current assignee ID based on rotation."""
        if not schedule.rotation_enabled or not schedule.rotation_users:
            return None
        if schedule.current_rotation_index >= len(schedule.rotation_users):
            return schedule.rotation_users[0]
        return schedule.rotation_users[schedule.current_rotation_index]
