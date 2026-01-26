"""Association tables for many-to-many relationships."""

from __future__ import annotations

import enum

from sqlalchemy import Boolean, Column, Enum, ForeignKey, Integer, Table

from app.database import Base

# Association table: Users belong to Organizations (M:N)
user_organizations = Table(
    "user_organizations",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "organization_id",
        Integer,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# Association table: Groups belong to Organizations (M:N)
group_organizations = Table(
    "group_organizations",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "organization_id",
        Integer,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# Association table: Users belong to Groups (M:N)
user_groups = Table(
    "user_groups",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", Integer, ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True),
)

# Association table: Users have Roles (M:N)
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

# Association table: Groups have Roles (M:N)
group_roles = Table(
    "group_roles",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

# Association table: Group delegates (users who can edit the group)
group_delegates = Table(
    "group_delegates",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)


class OwnerType(str, enum.Enum):
    """Type of entity that can own an objective."""

    USER = "user"
    ROLE = "role"
    GROUP = "group"


class ObjectiveOwnership(Base):
    """Polymorphic ownership model for objectives.

    An objective can be owned by multiple users, roles, or groups.
    """

    __tablename__ = "objective_ownerships"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    objective_id: int = Column(
        Integer, ForeignKey("objectives.id", ondelete="CASCADE"), nullable=False
    )
    owner_type: OwnerType = Column(
        Enum(OwnerType, name="owner_type_enum"), nullable=False
    )
    owner_id: int = Column(Integer, nullable=False)

    # Note: We don't create a foreign key to the owner because it's polymorphic
    # The owner_id refers to users.id, roles.id, or groups.id based on owner_type

    def __repr__(self) -> str:
        return (
            f"ObjectiveOwnership(id={self.id}, objective_id={self.objective_id}, "
            f"owner_type={self.owner_type}, owner_id={self.owner_id})"
        )


class GroupCascadedObjective(Base):
    """Tracks objectives cascaded from parent groups to child groups."""

    __tablename__ = "group_cascaded_objectives"

    id: int = Column(Integer, primary_key=True, autoincrement=True)
    parent_group_id: int = Column(
        Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    child_group_id: int = Column(
        Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    objective_id: int = Column(
        Integer, ForeignKey("objectives.id", ondelete="CASCADE"), nullable=False
    )
    is_active: bool = Column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:
        return (
            f"GroupCascadedObjective(parent={self.parent_group_id}, "
            f"child={self.child_group_id}, objective={self.objective_id})"
        )
