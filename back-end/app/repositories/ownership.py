"""Repository for managing objective ownership."""

from typing import Literal

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError, ValidationError
from app.models import Group, Objective, Role, User
from app.models.associations import ObjectiveOwnership, OwnerType, user_groups, user_roles


class OwnershipRepository:
    """Repository for managing objective ownership relationships."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add_ownership(
        self,
        objective_id: int,
        owner_type: Literal["user", "role", "group"],
        owner_id: int,
    ) -> ObjectiveOwnership:
        """Add ownership to an objective.

        Args:
            objective_id: Objective ID.
            owner_type: Type of owner (user, role, group).
            owner_id: ID of the owner entity.

        Returns:
            Created ObjectiveOwnership.

        Raises:
            NotFoundError: If objective or owner not found.
            ValidationError: If ownership already exists.
        """
        # Validate objective exists
        await self._validate_objective_exists(objective_id)

        # Validate owner exists based on type
        await self._validate_owner_exists(owner_type, owner_id)

        # Check if ownership already exists
        owner_type_enum = OwnerType(owner_type)
        query = select(ObjectiveOwnership).where(
            ObjectiveOwnership.objective_id == objective_id,
            ObjectiveOwnership.owner_type == owner_type_enum,
            ObjectiveOwnership.owner_id == owner_id,
        )
        result = await self.db.execute(query)
        if result.scalar_one_or_none():
            raise ValidationError(
                message=f"Objective already has this {owner_type} as owner",
                field="owner_id",
                value=owner_id,
            )

        # Create ownership
        ownership = ObjectiveOwnership(
            objective_id=objective_id,
            owner_type=owner_type_enum,
            owner_id=owner_id,
        )
        self.db.add(ownership)
        await self.db.commit()
        await self.db.refresh(ownership)
        return ownership

    async def remove_ownership(
        self,
        objective_id: int,
        owner_type: Literal["user", "role", "group"],
        owner_id: int,
    ) -> None:
        """Remove ownership from an objective.

        Args:
            objective_id: Objective ID.
            owner_type: Type of owner (user, role, group).
            owner_id: ID of the owner entity.

        Raises:
            NotFoundError: If ownership not found.
        """
        owner_type_enum = OwnerType(owner_type)
        stmt = delete(ObjectiveOwnership).where(
            ObjectiveOwnership.objective_id == objective_id,
            ObjectiveOwnership.owner_type == owner_type_enum,
            ObjectiveOwnership.owner_id == owner_id,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError(
                "Ownership",
                f"objective:{objective_id}-{owner_type}:{owner_id}",
            )
        await self.db.commit()

    async def get_objective_ownerships(
        self, objective_id: int
    ) -> list[ObjectiveOwnership]:
        """Get all ownerships for an objective.

        Args:
            objective_id: Objective ID.

        Returns:
            List of ObjectiveOwnership records.
        """
        await self._validate_objective_exists(objective_id)
        query = select(ObjectiveOwnership).where(
            ObjectiveOwnership.objective_id == objective_id
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_user_objectives(
        self, user_id: int
    ) -> tuple[list[Objective], dict[int, list[str]], dict[int, list[str]]]:
        """Get all objectives assigned to a user (directly, via roles, via groups).

        Args:
            user_id: User ID.

        Returns:
            Tuple of:
                - List of all assigned objectives
                - Dict mapping objective_id to role names
                - Dict mapping objective_id to group names
        """
        await self._validate_user_exists(user_id)

        # Get user's roles
        role_query = (
            select(Role)
            .join(user_roles, Role.id == user_roles.c.role_id)
            .where(user_roles.c.user_id == user_id)
        )
        role_result = await self.db.execute(role_query)
        user_role_ids = [r.id for r in role_result.scalars().all()]

        # Get user's groups
        group_query = (
            select(Group)
            .join(user_groups, Group.id == user_groups.c.group_id)
            .where(user_groups.c.user_id == user_id)
        )
        group_result = await self.db.execute(group_query)
        user_group_ids = [g.id for g in group_result.scalars().all()]

        # Build conditions for objectives
        conditions = [
            (ObjectiveOwnership.owner_type == OwnerType.USER)
            & (ObjectiveOwnership.owner_id == user_id)
        ]

        if user_role_ids:
            conditions.append(
                (ObjectiveOwnership.owner_type == OwnerType.ROLE)
                & (ObjectiveOwnership.owner_id.in_(user_role_ids))
            )

        if user_group_ids:
            conditions.append(
                (ObjectiveOwnership.owner_type == OwnerType.GROUP)
                & (ObjectiveOwnership.owner_id.in_(user_group_ids))
            )

        # Get all matching ownerships
        from sqlalchemy import or_

        ownership_query = select(ObjectiveOwnership).where(or_(*conditions))
        ownership_result = await self.db.execute(ownership_query)
        ownerships = list(ownership_result.scalars().all())

        # Collect objective IDs and track assignment source
        objective_ids = set()
        role_assignments: dict[int, list[str]] = {}
        group_assignments: dict[int, list[str]] = {}

        for ownership in ownerships:
            objective_ids.add(ownership.objective_id)
            if (
                ownership.owner_type == OwnerType.ROLE
                and ownership.owner_id in user_role_ids
            ):
                # Get role name
                role_name_query = select(Role.name).where(
                    Role.id == ownership.owner_id
                )
                role_name = await self.db.scalar(role_name_query)
                if role_name:
                    role_assignments.setdefault(ownership.objective_id, []).append(
                        role_name
                    )
            elif (
                ownership.owner_type == OwnerType.GROUP
                and ownership.owner_id in user_group_ids
            ):
                # Get group name
                group_name_query = select(Group.name).where(
                    Group.id == ownership.owner_id
                )
                group_name = await self.db.scalar(group_name_query)
                if group_name:
                    group_assignments.setdefault(ownership.objective_id, []).append(
                        group_name
                    )

        # Get objectives
        if not objective_ids:
            return [], {}, {}

        objectives_query = (
            select(Objective)
            .options(selectinload(Objective.keyresults))
            .where(Objective.id.in_(objective_ids))
        )
        objectives_result = await self.db.execute(objectives_query)
        objectives = list(objectives_result.scalars().all())

        return objectives, role_assignments, group_assignments

    async def get_owner_name(
        self, owner_type: Literal["user", "role", "group"], owner_id: int
    ) -> str | None:
        """Get the name of an owner by type and ID.

        Args:
            owner_type: Type of owner.
            owner_id: ID of the owner.

        Returns:
            Owner name or None if not found.
        """
        model_map = {
            "user": User,
            "role": Role,
            "group": Group,
        }
        model = model_map[owner_type]
        query = select(model.name).where(model.id == owner_id)  # type: ignore[arg-type]
        return await self.db.scalar(query)

    async def get_owner_names_bulk(
        self, ownerships: list[ObjectiveOwnership]
    ) -> dict[tuple[str, int], str]:
        """Get owner names for multiple ownerships.

        Args:
            ownerships: List of ObjectiveOwnership records.

        Returns:
            Dict mapping (owner_type, owner_id) to owner name.
        """
        if not ownerships:
            return {}

        # Group by owner type
        user_ids = [o.owner_id for o in ownerships if o.owner_type == OwnerType.USER]
        role_ids = [o.owner_id for o in ownerships if o.owner_type == OwnerType.ROLE]
        group_ids = [o.owner_id for o in ownerships if o.owner_type == OwnerType.GROUP]

        result: dict[tuple[str, int], str] = {}

        if user_ids:
            query = select(User.id, User.name).where(User.id.in_(user_ids))
            users = await self.db.execute(query)
            for user_id, name in users:
                result[("user", user_id)] = name

        if role_ids:
            query = select(Role.id, Role.name).where(Role.id.in_(role_ids))
            roles = await self.db.execute(query)
            for role_id, name in roles:
                result[("role", role_id)] = name

        if group_ids:
            query = select(Group.id, Group.name).where(Group.id.in_(group_ids))
            groups = await self.db.execute(query)
            for group_id, name in groups:
                result[("group", group_id)] = name

        return result

    # -------------------- Validation Helpers --------------------

    async def _validate_objective_exists(self, objective_id: int) -> None:
        """Validate that objective exists."""
        query = select(Objective).where(Objective.id == objective_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("Objective", objective_id)

    async def _validate_user_exists(self, user_id: int) -> None:
        """Validate that user exists."""
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError("User", user_id)

    async def _validate_owner_exists(
        self, owner_type: Literal["user", "role", "group"], owner_id: int
    ) -> None:
        """Validate that owner entity exists."""
        model_map = {
            "user": User,
            "role": Role,
            "group": Group,
        }
        model = model_map[owner_type]
        query = select(model).where(model.id == owner_id)  # type: ignore[arg-type]
        result = await self.db.execute(query)
        if not result.scalar_one_or_none():
            raise NotFoundError(owner_type.capitalize(), owner_id)
