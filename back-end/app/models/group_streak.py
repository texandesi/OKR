"""Group streak model for tracking consecutive activity days."""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.group import Group


class GroupStreak(Base):
    """Tracks consecutive days of activity for a group."""

    __tablename__ = "group_streaks"
    __table_args__ = (UniqueConstraint("group_id", name="uq_group_streak"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    group_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    streak_started_at: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Relationship
    group: Mapped[Group] = relationship("Group", lazy="selectin")

    def __repr__(self) -> str:
        return (
            f"GroupStreak(group_id={self.group_id}, "
            f"current={self.current_streak}, longest={self.longest_streak})"
        )
