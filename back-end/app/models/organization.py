from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.associations import group_organizations, user_organizations

if TYPE_CHECKING:
    from app.models.group import Group
    from app.models.user import User


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)

    # Many-to-many relationships
    users: Mapped[list[User]] = relationship(
        "User",
        secondary=user_organizations,
        back_populates="organizations",
        lazy="selectin",
    )

    groups: Mapped[list[Group]] = relationship(
        "Group",
        secondary=group_organizations,
        back_populates="organizations",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"Organization(id={self.id}, name={self.name})"
