"""Recurring schedule model for auto-regenerating key results."""

from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import JSON, Boolean, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.keyresult import KeyResult


class RecurringSchedule(Base):
    """Schedule for recurring key results that auto-regenerate."""

    __tablename__ = "recurring_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key_result_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("key_results.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    frequency: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # "daily", "weekly", "monthly"
    rotation_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    rotation_users: Mapped[list[int] | None] = mapped_column(
        JSON, nullable=True
    )  # Array of user IDs
    current_rotation_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    next_due_date: Mapped[date] = mapped_column(Date, nullable=False)
    last_generated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationship
    key_result: Mapped[KeyResult] = relationship("KeyResult", lazy="selectin")

    def __repr__(self) -> str:
        return (
            f"RecurringSchedule(id={self.id}, key_result_id={self.key_result_id}, "
            f"frequency={self.frequency})"
        )
