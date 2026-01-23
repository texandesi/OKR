"""Service layer for group streaks."""

from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.group_streak import GroupStreak
from app.repositories.streak import StreakRepository
from app.schemas.streak import GroupStreakResponse, StreakCheckResponse


class StreakService:
    """Service for managing group streaks."""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = StreakRepository(db)

    async def get_streak(self, group_id: int) -> GroupStreakResponse:
        """Get streak information for a group."""
        streak = await self.repository.get_or_create_streak(group_id)
        return self._to_response(streak)

    async def record_activity(self, group_id: int) -> StreakCheckResponse:
        """Record activity for a group (called when a key result is completed)."""
        streak, increased = await self.repository.record_activity(group_id)

        if increased:
            if streak.current_streak == 1:
                message = "Streak started! Keep it going tomorrow."
            else:
                message = f"Streak increased to {streak.current_streak} days!"
        else:
            message = f"Already recorded activity today. Current streak: {streak.current_streak} days."

        return StreakCheckResponse(
            group_id=group_id,
            current_streak=streak.current_streak,
            streak_increased=increased,
            message=message,
        )

    async def reset_stale_streaks(self) -> int:
        """Reset streaks with no recent activity (for daily cron)."""
        return await self.repository.check_and_reset_stale_streaks()

    def _to_response(self, streak: GroupStreak) -> GroupStreakResponse:
        """Convert streak model to response schema."""
        today = date.today()
        is_active_today = streak.last_activity_date == today

        return GroupStreakResponse(
            id=streak.id,
            group_id=streak.group_id,
            group_name=streak.group.name,
            current_streak=streak.current_streak,
            longest_streak=streak.longest_streak,
            last_activity_date=streak.last_activity_date,
            streak_started_at=streak.streak_started_at,
            is_active_today=is_active_today,
        )
