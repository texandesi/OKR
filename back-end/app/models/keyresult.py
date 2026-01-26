from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.objective import Objective


class KeyResult(Base):
    __tablename__ = "key_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    objective_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("objectives.id"), nullable=False
    )

    target_value: Mapped[float | None] = mapped_column(
        Float, nullable=True, default=100.0
    )
    current_value: Mapped[float | None] = mapped_column(
        Float, nullable=True, default=0.0
    )
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True, default="%")

    # Time tracking fields (optional overrides for objective dates)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Completion status (checkbox)
    is_complete: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    objective: Mapped[Objective] = relationship("Objective", back_populates="keyresults")

    @property
    def progress_percentage(self) -> float:
        """Calculate progress percentage based on current/target values."""
        if self.target_value and self.target_value > 0:
            return min(100.0, (self.current_value or 0) / self.target_value * 100)
        return 0.0

    @property
    def effective_start_date(self) -> date | None:
        """Get effective start date (key result's date or inherit from objective)."""
        if self.start_date is not None:
            return self.start_date
        return self.objective.start_date if self.objective else None

    @property
    def effective_end_date(self) -> date | None:
        """Get effective end date (key result's date or inherit from objective)."""
        if self.end_date is not None:
            return self.end_date
        return self.objective.end_date if self.objective else None

    def __repr__(self) -> str:
        return f"KeyResult(id={self.id}, name={self.name})"
