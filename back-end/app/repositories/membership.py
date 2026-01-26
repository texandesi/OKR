"""Repository for managing organizational memberships."""

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationError
from app.models import Group, Objective, Organization, Role, User
from app.models.associations import (
    GroupCascadedObjective,
    group_delegates,
    group_organizations,
    group_roles,
    user_groups,
    user_organizations,
    user_roles,
)


class MembershipRepository:
    """Repository for managing many-to-many membership relationships."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # -------------------- User-Organization --------------------

    async def add_user_to_organization(self, user_id: int, organization_id: int) -> None:
        """Add user to organization."""
        # Validate entities exist
        await self._validate_user_exists(user_id)
        await self._validate_organization_exists(organization_id)

        # Check if already a member
        query = select(user_organizations).where(
            user_organizations.c.user_id == user_id,
            user_organizations.c.organization_id == organization_id,
        )
        result = await self.db.execute(query)
        if result.first():
            raise ValidationError(
                message="User is already a member of this organization",
                field="user_id",
                value=user_id,
            )

        # Add membership
        stmt = user_organizations.insert().values(
            user_id=user_id, organization_id=organization_id
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def remove_user_from_organization(
        self, user_id: int, organization_id: int
    ) -> None:
        """Remove user from organization."""
        stmt = delete(user_organizations).where(
            user_organizations.c.user_id == user_id,
            user_organizations.c.organization_id == organization_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Membership", f"user:{user_id}-org:{organization_id}")
        await self.db.commit()

    async def get_organization_users(self, organization_id: int) -> list[User]:
        """Get all users in an organization."""
        await self._validate_organization_exists(organization_id)
        query = (
            select(User)
            .join(user_organizations, User.id == user_organizations.c.user_id)
            .where(user_organizations.c.organization_id == organization_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- Group-Organization --------------------

    async def add_group_to_organization(
        self, group_id: int, organization_id: int
    ) -> None:
        """Add group to organization."""
        await self._validate_group_exists(group_id)
        await self._validate_organization_exists(organization_id)

        query = select(group_organizations).where(
            group_organizations.c.group_id == group_id,
            group_organizations.c.organization_id == organization_id,
        )
        result = await self.db.execute(query)
        if result.first():
            raise ValidationError(
                message="Group is already a member of this organization",
                field="group_id",
                value=group_id,
            )

        stmt = group_organizations.insert().values(
            group_id=group_id, organization_id=organization_id
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def remove_group_from_organization(
        self, group_id: int, organization_id: int
    ) -> None:
        """Remove group from organization."""
        stmt = delete(group_organizations).where(
            group_organizations.c.group_id == group_id,
            group_organizations.c.organization_id == organization_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Membership", f"group:{group_id}-org:{organization_id}")
        await self.db.commit()

    async def get_organization_groups(self, organization_id: int) -> list[Group]:
        """Get all groups in an organization."""
        await self._validate_organization_exists(organization_id)
        query = (
            select(Group)
            .join(group_organizations, Group.id == group_organizations.c.group_id)
            .where(group_organizations.c.organization_id == organization_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- User-Group --------------------

    async def add_user_to_group(self, user_id: int, group_id: int) -> None:
        """Add user to group."""
        await self._validate_user_exists(user_id)
        await self._validate_group_exists(group_id)

        query = select(user_groups).where(
            user_groups.c.user_id == user_id,
            user_groups.c.group_id == group_id,
        )
        result = await self.db.execute(query)
        if result.first():
            raise ValidationError(
                message="User is already a member of this group",
                field="user_id",
                value=user_id,
            )

        stmt = user_groups.insert().values(user_id=user_id, group_id=group_id)
        await self.db.execute(stmt)
        await self.db.commit()

    async def remove_user_from_group(self, user_id: int, group_id: int) -> None:
        """Remove user from group."""
        stmt = delete(user_groups).where(
            user_groups.c.user_id == user_id,
            user_groups.c.group_id == group_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Membership", f"user:{user_id}-group:{group_id}")
        await self.db.commit()

    async def get_group_users(self, group_id: int) -> list[User]:
        """Get all users in a group."""
        await self._validate_group_exists(group_id)
        query = (
            select(User)
            .join(user_groups, User.id == user_groups.c.user_id)
            .where(user_groups.c.group_id == group_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- User-Role --------------------

    async def add_role_to_user(self, user_id: int, role_id: int) -> None:
        """Assign role to user."""
        await self._validate_user_exists(user_id)
        await self._validate_role_exists(role_id)

        query = select(user_roles).where(
            user_roles.c.user_id == user_id,
            user_roles.c.role_id == role_id,
        )
        result = await self.db.execute(query)
        if result.first():
            raise ValidationError(
                message="User already has this role",
                field="role_id",
                value=role_id,
            )

        stmt = user_roles.insert().values(user_id=user_id, role_id=role_id)
        await self.db.execute(stmt)
        await self.db.commit()

    async def remove_role_from_user(self, user_id: int, role_id: int) -> None:
        """Remove role from user."""
        stmt = delete(user_roles).where(
            user_roles.c.user_id == user_id,
            user_roles.c.role_id == role_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Role assignment", f"user:{user_id}-role:{role_id}")
        await self.db.commit()

    async def get_user_roles(self, user_id: int) -> list[Role]:
        """Get all roles for a user."""
        await self._validate_user_exists(user_id)
        query = (
            select(Role)
            .join(user_roles, Role.id == user_roles.c.role_id)
            .where(user_roles.c.user_id == user_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_user_groups(self, user_id: int) -> list[Group]:
        """Get all groups for a user."""
        await self._validate_user_exists(user_id)
        query = (
            select(Group)
            .join(user_groups, Group.id == user_groups.c.group_id)
            .where(user_groups.c.user_id == user_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- Group-Role --------------------

    async def add_role_to_group(self, group_id: int, role_id: int) -> None:
        """Assign role to group."""
        await self._validate_group_exists(group_id)
        await self._validate_role_exists(role_id)

        query = select(group_roles).where(
            group_roles.c.group_id == group_id,
            group_roles.c.role_id == role_id,
        )
        result = await self.db.execute(query)
        if result.first():
            raise ValidationError(
                message="Group already has this role",
                field="role_id",
                value=role_id,
            )

        stmt = group_roles.insert().values(group_id=group_id, role_id=role_id)
        await self.db.execute(stmt)
        await self.db.commit()

    async def remove_role_from_group(self, group_id: int, role_id: int) -> None:
        """Remove role from group."""
        stmt = delete(group_roles).where(
            group_roles.c.group_id == group_id,
            group_roles.c.role_id == role_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Role assignment", f"group:{group_id}-role:{role_id}")
        await self.db.commit()

    async def get_group_roles(self, group_id: int) -> list[Role]:
        """Get all roles for a group."""
        await self._validate_group_exists(group_id)
        query = (
            select(Role)
            .join(group_roles, Role.id == group_roles.c.role_id)
            .where(group_roles.c.group_id == group_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- Validation Helpers --------------------

    async def _validate_user_exists(self, user_id: int) -> None:
        """Validate that user exists."""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("User", user_id)

    async def _validate_organization_exists(self, organization_id: int) -> None:
        """Validate that organization exists."""
        query = select(Organization).where(Organization.id == organization_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("Organization", organization_id)

    async def _validate_group_exists(self, group_id: int) -> None:
        """Validate that group exists."""
        query = select(Group).where(Group.id == group_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("Group", group_id)

    async def _validate_role_exists(self, role_id: int) -> None:
        """Validate that role exists."""
        query = select(Role).where(Role.id == role_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("Role", role_id)

    async def _validate_objective_exists(self, objective_id: int) -> None:
        """Validate that objective exists."""
        query = select(Objective).where(Objective.id == objective_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("Objective", objective_id)

    # -------------------- Group Delegates --------------------

    async def add_delegate_to_group(self, group_id: int, user_id: int) -> None:
        """Add a delegate (user with edit rights) to a group."""
        await self._validate_group_exists(group_id)
        await self._validate_user_exists(user_id)

        query = select(group_delegates).where(
            group_delegates.c.group_id == group_id,
            group_delegates.c.user_id == user_id,
        )
        result = await self.db.execute(query)
        if result.first():
            raise ValidationError(
                message="User is already a delegate of this group",
                field="user_id",
                value=user_id,
            )

        stmt = group_delegates.insert().values(group_id=group_id, user_id=user_id)
        await self.db.execute(stmt)
        await self.db.commit()

    async def remove_delegate_from_group(self, group_id: int, user_id: int) -> None:
        """Remove a delegate from a group."""
        stmt = delete(group_delegates).where(
            group_delegates.c.group_id == group_id,
            group_delegates.c.user_id == user_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Delegate", f"group:{group_id}-user:{user_id}")
        await self.db.commit()

    async def get_group_delegates(self, group_id: int) -> list[User]:
        """Get all delegates for a group."""
        await self._validate_group_exists(group_id)
        query = (
            select(User)
            .join(group_delegates, User.id == group_delegates.c.user_id)
            .where(group_delegates.c.group_id == group_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- Role Users/Groups --------------------

    async def get_role_users(self, role_id: int) -> list[User]:
        """Get all users with a specific role."""
        await self._validate_role_exists(role_id)
        query = (
            select(User)
            .join(user_roles, User.id == user_roles.c.user_id)
            .where(user_roles.c.role_id == role_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_role_groups(self, role_id: int) -> list[Group]:
        """Get all groups with a specific role."""
        await self._validate_role_exists(role_id)
        query = (
            select(Group)
            .join(group_roles, Group.id == group_roles.c.group_id)
            .where(group_roles.c.role_id == role_id)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # -------------------- Cascaded Objectives --------------------

    async def cascade_objective_to_child(
        self, parent_group_id: int, child_group_id: int, objective_id: int
    ) -> GroupCascadedObjective:
        """Cascade an objective from parent group to child group."""
        # Validate all entities exist
        await self._validate_group_exists(parent_group_id)
        await self._validate_group_exists(child_group_id)
        await self._validate_objective_exists(objective_id)

        # Validate parent-child relationship
        child_query = select(Group).where(Group.id == child_group_id)
        result = await self.db.execute(child_query)
        child_group = result.scalar_one()
        if child_group.parent_id != parent_group_id:
            raise ValidationError(
                message="The specified child group is not a child of the parent group",
                field="child_group_id",
                value=child_group_id,
            )

        # Check if already cascaded
        existing = await self.db.execute(
            select(GroupCascadedObjective).where(
                GroupCascadedObjective.parent_group_id == parent_group_id,
                GroupCascadedObjective.child_group_id == child_group_id,
                GroupCascadedObjective.objective_id == objective_id,
            )
        )
        if existing.scalar_one_or_none():
            raise ValidationError(
                message="This objective is already cascaded to this child group",
                field="objective_id",
                value=objective_id,
            )

        # Create cascaded objective
        cascaded = GroupCascadedObjective(
            parent_group_id=parent_group_id,
            child_group_id=child_group_id,
            objective_id=objective_id,
            is_active=True,
        )
        self.db.add(cascaded)
        await self.db.commit()
        await self.db.refresh(cascaded)
        return cascaded

    async def remove_cascaded_objective(
        self, parent_group_id: int, child_group_id: int, objective_id: int
    ) -> None:
        """Remove a cascaded objective."""
        stmt = delete(GroupCascadedObjective).where(
            GroupCascadedObjective.parent_group_id == parent_group_id,
            GroupCascadedObjective.child_group_id == child_group_id,
            GroupCascadedObjective.objective_id == objective_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError(
                "CascadedObjective",
                f"parent:{parent_group_id}-child:{child_group_id}-obj:{objective_id}",
            )
        await self.db.commit()

    async def toggle_cascaded_objective(
        self, cascaded_id: int, is_active: bool
    ) -> GroupCascadedObjective:
        """Toggle the active status of a cascaded objective."""
        query = select(GroupCascadedObjective).where(GroupCascadedObjective.id == cascaded_id)
        result = await self.db.execute(query)
        cascaded = result.scalar_one_or_none()
        if not cascaded:
            raise NotFoundError("CascadedObjective", cascaded_id)

        stmt = (
            update(GroupCascadedObjective)
            .where(GroupCascadedObjective.id == cascaded_id)
            .values(is_active=is_active)
        )
        await self.db.execute(stmt)
        await self.db.commit()
        await self.db.refresh(cascaded)
        return cascaded

    async def get_cascaded_objectives_for_group(
        self, group_id: int
    ) -> list[GroupCascadedObjective]:
        """Get all objectives cascaded TO a group (where it's the child)."""
        await self._validate_group_exists(group_id)
        query = select(GroupCascadedObjective).where(
            GroupCascadedObjective.child_group_id == group_id
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_cascaded_objectives_from_group(
        self, group_id: int
    ) -> list[GroupCascadedObjective]:
        """Get all objectives cascaded FROM a group (where it's the parent)."""
        await self._validate_group_exists(group_id)
        query = select(GroupCascadedObjective).where(
            GroupCascadedObjective.parent_group_id == group_id
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())
