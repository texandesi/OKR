from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.associations import (
    group_delegates,
    group_organizations,
    group_roles,
    user_groups,
)

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.role import Role
    from app.models.user import User


class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(100), nullable=False)

    # Hierarchy: self-referential parent-child relationship
    parent_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("groups.id", ondelete="SET NULL"), nullable=True
    )

    # Group owner (single user who owns this group)
    owner_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # Parent group relationship
    parent: Mapped[Group | None] = relationship(
        "Group",
        remote_side="Group.id",
        foreign_keys=[parent_id],
        back_populates="children",
        lazy="selectin",
    )

    # Child groups relationship
    children: Mapped[list[Group]] = relationship(
        "Group",
        back_populates="parent",
        foreign_keys=[parent_id],
        lazy="selectin",
    )

    # Owner relationship
    owner: Mapped[User | None] = relationship(
        "User",
        foreign_keys=[owner_id],
        lazy="selectin",
    )

    # Delegates: users who can edit this group (besides the owner)
    delegates: Mapped[list[User]] = relationship(
        "User",
        secondary=group_delegates,
        lazy="selectin",
    )

    # Many-to-many relationships
    users: Mapped[list[User]] = relationship(
        "User",
        secondary=user_groups,
        back_populates="groups",
        lazy="selectin",
    )

    organizations: Mapped[list[Organization]] = relationship(
        "Organization",
        secondary=group_organizations,
        back_populates="groups",
        lazy="selectin",
    )

    roles: Mapped[list[Role]] = relationship(
        "Role",
        secondary=group_roles,
        back_populates="groups",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"Group(id={self.id}, name={self.name})"
