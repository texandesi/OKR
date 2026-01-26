"""Service for managing objective ownership."""

from typing import Literal

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.ownership import OwnershipRepository
from app.schemas.objective import ObjectiveResponse
from app.schemas.ownership import OwnershipResponse, UserAssignedOKRs


class OwnershipService:
    """Service for managing objective ownership relationships."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repository = OwnershipRepository(db)

    async def add_ownership(
        self,
        objective_id: int,
        owner_type: Literal["user", "role", "group"],
        owner_id: int,
    ) -> OwnershipResponse:
        """Add ownership to an objective.

        Args:
            objective_id: Objective ID.
            owner_type: Type of owner (user, role, group).
            owner_id: ID of the owner entity.

        Returns:
            OwnershipResponse with owner name resolved.
        """
        ownership = await self.repository.add_ownership(
            objective_id, owner_type, owner_id
        )
        owner_name = await self.repository.get_owner_name(owner_type, owner_id)
        return OwnershipResponse(
            id=ownership.id,
            objective_id=ownership.objective_id,
            owner_type=ownership.owner_type.value,
            owner_id=ownership.owner_id,
            owner_name=owner_name,
        )

    async def remove_ownership(
        self,
        objective_id: int,
        owner_type: Literal["user", "role", "group"],
        owner_id: int,
    ) -> None:
        """Remove ownership from an objective."""
        await self.repository.remove_ownership(objective_id, owner_type, owner_id)

    async def get_objective_ownerships(
        self, objective_id: int
    ) -> list[OwnershipResponse]:
        """Get all ownerships for an objective with resolved owner names."""
        ownerships = await self.repository.get_objective_ownerships(objective_id)
        owner_names = await self.repository.get_owner_names_bulk(ownerships)

        return [
            OwnershipResponse(
                id=o.id,
                objective_id=o.objective_id,
                owner_type=o.owner_type.value,
                owner_id=o.owner_id,
                owner_name=owner_names.get((o.owner_type.value, o.owner_id)),
            )
            for o in ownerships
        ]

    async def get_user_assigned_okrs(self, user_id: int) -> UserAssignedOKRs:
        """Get all objectives assigned to a user, grouped by assignment type.

        Args:
            user_id: User ID.

        Returns:
            UserAssignedOKRs with objectives grouped by individual, role, and group.
        """
        objectives, role_assignments, group_assignments = (
            await self.repository.get_user_objectives(user_id)
        )

        # Build response
        individual: list[ObjectiveResponse] = []
        by_role: dict[str, list[ObjectiveResponse]] = {}
        by_group: dict[str, list[ObjectiveResponse]] = {}

        for obj in objectives:
            obj_response = ObjectiveResponse.model_validate(obj)

            # Check if directly assigned to user
            from app.models.associations import OwnerType

            direct_assignment = any(
                o.owner_type == OwnerType.USER and o.owner_id == user_id
                for o in obj.ownerships
            )

            if direct_assignment:
                individual.append(obj_response)

            # Check role assignments
            if obj.id in role_assignments:
                for role_name in role_assignments[obj.id]:
                    by_role.setdefault(role_name, []).append(obj_response)

            # Check group assignments
            if obj.id in group_assignments:
                for group_name in group_assignments[obj.id]:
                    by_group.setdefault(group_name, []).append(obj_response)

        return UserAssignedOKRs(
            individual=individual,
            by_role=by_role,
            by_group=by_group,
        )
