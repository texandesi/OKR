"""Service for managing organizational memberships."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.membership import MembershipRepository
from app.schemas.membership import (
    GroupAssignment,
    GroupInOrganization,
    GroupMembersResponse,
    MembershipResponse,
    OrganizationMembersResponse,
    RoleAssignment,
    UserInGroup,
    UserInOrganization,
    UserMembershipsResponse,
)


class MembershipService:
    """Service for managing many-to-many membership relationships."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repository = MembershipRepository(db)

    # -------------------- User-Organization --------------------

    async def add_user_to_organization(
        self, user_id: int, organization_id: int
    ) -> MembershipResponse:
        """Add user to organization."""
        await self.repository.add_user_to_organization(user_id, organization_id)
        return MembershipResponse(message="User added to organization successfully")

    async def remove_user_from_organization(
        self, user_id: int, organization_id: int
    ) -> MembershipResponse:
        """Remove user from organization."""
        await self.repository.remove_user_from_organization(user_id, organization_id)
        return MembershipResponse(message="User removed from organization successfully")

    async def get_organization_members(
        self, organization_id: int
    ) -> OrganizationMembersResponse:
        """Get all members of an organization."""
        users = await self.repository.get_organization_users(organization_id)
        groups = await self.repository.get_organization_groups(organization_id)
        return OrganizationMembersResponse(
            users=[UserInOrganization.model_validate(u) for u in users],
            groups=[GroupInOrganization.model_validate(g) for g in groups],
        )

    # -------------------- Group-Organization --------------------

    async def add_group_to_organization(
        self, group_id: int, organization_id: int
    ) -> MembershipResponse:
        """Add group to organization."""
        await self.repository.add_group_to_organization(group_id, organization_id)
        return MembershipResponse(message="Group added to organization successfully")

    async def remove_group_from_organization(
        self, group_id: int, organization_id: int
    ) -> MembershipResponse:
        """Remove group from organization."""
        await self.repository.remove_group_from_organization(group_id, organization_id)
        return MembershipResponse(
            message="Group removed from organization successfully"
        )

    # -------------------- User-Group --------------------

    async def add_user_to_group(
        self, user_id: int, group_id: int
    ) -> MembershipResponse:
        """Add user to group."""
        await self.repository.add_user_to_group(user_id, group_id)
        return MembershipResponse(message="User added to group successfully")

    async def remove_user_from_group(
        self, user_id: int, group_id: int
    ) -> MembershipResponse:
        """Remove user from group."""
        await self.repository.remove_user_from_group(user_id, group_id)
        return MembershipResponse(message="User removed from group successfully")

    async def get_group_members(self, group_id: int) -> GroupMembersResponse:
        """Get all members of a group."""
        users = await self.repository.get_group_users(group_id)
        roles = await self.repository.get_group_roles(group_id)
        return GroupMembersResponse(
            users=[UserInGroup.model_validate(u) for u in users],
            roles=[RoleAssignment.model_validate(r) for r in roles],
        )

    # -------------------- User-Role --------------------

    async def add_role_to_user(
        self, user_id: int, role_id: int
    ) -> MembershipResponse:
        """Assign role to user."""
        await self.repository.add_role_to_user(user_id, role_id)
        return MembershipResponse(message="Role assigned to user successfully")

    async def remove_role_from_user(
        self, user_id: int, role_id: int
    ) -> MembershipResponse:
        """Remove role from user."""
        await self.repository.remove_role_from_user(user_id, role_id)
        return MembershipResponse(message="Role removed from user successfully")

    async def get_user_memberships(self, user_id: int) -> UserMembershipsResponse:
        """Get all memberships for a user."""
        roles = await self.repository.get_user_roles(user_id)
        groups = await self.repository.get_user_groups(user_id)
        return UserMembershipsResponse(
            roles=[RoleAssignment.model_validate(r) for r in roles],
            groups=[GroupAssignment.model_validate(g) for g in groups],
        )

    # -------------------- Group-Role --------------------

    async def add_role_to_group(
        self, group_id: int, role_id: int
    ) -> MembershipResponse:
        """Assign role to group."""
        await self.repository.add_role_to_group(group_id, role_id)
        return MembershipResponse(message="Role assigned to group successfully")

    async def remove_role_from_group(
        self, group_id: int, role_id: int
    ) -> MembershipResponse:
        """Remove role from group."""
        await self.repository.remove_role_from_group(group_id, role_id)
        return MembershipResponse(message="Role removed from group successfully")
