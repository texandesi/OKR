"""Repository for managing group streaks."""

from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import Group
from app.models.group_streak import GroupStreak


class StreakRepository:
    """Repository for group streak operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_streak(self, group_id: int) -> GroupStreak | None:
        """Get streak for a group."""
        query = select(GroupStreak).where(GroupStreak.group_id == group_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_or_create_streak(self, group_id: int) -> GroupStreak:
        """Get or create streak for a group."""
        # Validate group exists
        group_query = select(Group).where(Group.id == group_id)
        group_result = await self.db.execute(group_query)
        if not group_result.scalar_one_or_none():
            raise NotFoundError("Group", group_id)

        streak = await self.get_streak(group_id)
        if not streak:
            streak = GroupStreak(
                group_id=group_id,
                current_streak=0,
                longest_streak=0,
                last_activity_date=None,
                streak_started_at=None,
            )
            self.db.add(streak)
            await self.db.commit()
            await self.db.refresh(streak)
        return streak

    async def record_activity(self, group_id: int) -> tuple[GroupStreak, bool]:
        """
        Record activity for a group and update streak.

        Returns:
            Tuple of (updated streak, whether streak increased)
        """
        streak = await self.get_or_create_streak(group_id)
        today = date.today()
        streak_increased = False

        if streak.last_activity_date is None:
            # First activity ever
            streak.current_streak = 1
            streak.longest_streak = 1
            streak.streak_started_at = today
            streak_increased = True
        elif streak.last_activity_date == today:
            # Already recorded activity today
            pass
        elif streak.last_activity_date == today - timedelta(days=1):
            # Consecutive day - increase streak
            streak.current_streak += 1
            if streak.current_streak > streak.longest_streak:
                streak.longest_streak = streak.current_streak
            streak_increased = True
        else:
            # Streak broken - start new one
            streak.current_streak = 1
            streak.streak_started_at = today
            streak_increased = True

        streak.last_activity_date = today
        await self.db.commit()
        await self.db.refresh(streak)
        return streak, streak_increased

    async def check_and_reset_stale_streaks(self) -> int:
        """
        Reset streaks that haven't had activity yesterday.
        Called by daily cron job.

        Returns:
            Number of streaks reset
        """
        yesterday = date.today() - timedelta(days=1)
        query = select(GroupStreak).where(
            GroupStreak.last_activity_date < yesterday,
            GroupStreak.current_streak > 0,
        )
        result = await self.db.execute(query)
        streaks = list(result.scalars().all())

        for streak in streaks:
            streak.current_streak = 0
            streak.streak_started_at = None

        await self.db.commit()
        return len(streaks)
