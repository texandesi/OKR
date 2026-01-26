"""Reaction model for emoji reactions on key results."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.keyresult import KeyResult
    from app.models.user import User


class Reaction(Base):
    """Emoji reaction on a completed key result."""

    __tablename__ = "reactions"
    __table_args__ = (
        UniqueConstraint("key_result_id", "user_id", "emoji", name="uq_reaction"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key_result_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("key_results.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    emoji: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    key_result: Mapped[KeyResult] = relationship("KeyResult", lazy="selectin")
    user: Mapped[User] = relationship("User", lazy="selectin")

    def __repr__(self) -> str:
        return f"Reaction(id={self.id}, emoji={self.emoji}, user_id={self.user_id})"
