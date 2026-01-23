from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.associations import ObjectiveOwnership
    from app.models.keyresult import KeyResult


class Objective(Base):
    __tablename__ = "objectives"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)

    # Time tracking fields
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Completion status
    is_complete: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    keyresults: Mapped[list[KeyResult]] = relationship(
        "KeyResult", back_populates="objective", cascade="all, delete-orphan"
    )

    ownerships: Mapped[list[ObjectiveOwnership]] = relationship(
        "ObjectiveOwnership",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @property
    def progress_percentage(self) -> float:
        """Calculate overall progress based on key results.

        Returns the average progress of all key results, or 0 if no key results exist.
        """
        if not self.keyresults:
            return 0.0
        total_progress = sum(kr.progress_percentage for kr in self.keyresults)
        return total_progress / len(self.keyresults)

    def __repr__(self) -> str:
        return f"Objective(id={self.id}, name={self.name})"
