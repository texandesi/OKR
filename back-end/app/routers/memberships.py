"""Membership router endpoints for managing organizational relationships."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.membership import (
    GroupMembersResponse,
    MembershipResponse,
    OrganizationMembersResponse,
    UserMembershipsResponse,
)
from app.services.membership import MembershipService

router = APIRouter(prefix="/memberships", tags=["memberships"])


def get_service(db: AsyncSession = Depends(get_db)) -> MembershipService:
    """Dependency to get MembershipService instance."""
    return MembershipService(db)


# -------------------- User-Organization --------------------


@router.post(
    "/organizations/{organization_id}/users/{user_id}",
    response_model=MembershipResponse,
    status_code=201,
)
async def add_user_to_organization(
    organization_id: int,
    user_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Add a user to an organization."""
    return await service.add_user_to_organization(user_id, organization_id)


@router.delete(
    "/organizations/{organization_id}/users/{user_id}",
    response_model=MembershipResponse,
)
async def remove_user_from_organization(
    organization_id: int,
    user_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Remove a user from an organization."""
    return await service.remove_user_from_organization(user_id, organization_id)


@router.get(
    "/organizations/{organization_id}/members",
    response_model=OrganizationMembersResponse,
)
async def get_organization_members(
    organization_id: int,
    service: MembershipService = Depends(get_service),
) -> OrganizationMembersResponse:
    """Get all users and groups in an organization."""
    return await service.get_organization_members(organization_id)


# -------------------- Group-Organization --------------------


@router.post(
    "/organizations/{organization_id}/groups/{group_id}",
    response_model=MembershipResponse,
    status_code=201,
)
async def add_group_to_organization(
    organization_id: int,
    group_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Add a group to an organization."""
    return await service.add_group_to_organization(group_id, organization_id)


@router.delete(
    "/organizations/{organization_id}/groups/{group_id}",
    response_model=MembershipResponse,
)
async def remove_group_from_organization(
    organization_id: int,
    group_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Remove a group from an organization."""
    return await service.remove_group_from_organization(group_id, organization_id)


# -------------------- User-Group --------------------


@router.post(
    "/groups/{group_id}/users/{user_id}",
    response_model=MembershipResponse,
    status_code=201,
)
async def add_user_to_group(
    group_id: int,
    user_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Add a user to a group."""
    return await service.add_user_to_group(user_id, group_id)


@router.delete(
    "/groups/{group_id}/users/{user_id}",
    response_model=MembershipResponse,
)
async def remove_user_from_group(
    group_id: int,
    user_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Remove a user from a group."""
    return await service.remove_user_from_group(user_id, group_id)


@router.get(
    "/groups/{group_id}/members",
    response_model=GroupMembersResponse,
)
async def get_group_members(
    group_id: int,
    service: MembershipService = Depends(get_service),
) -> GroupMembersResponse:
    """Get all users and roles in a group."""
    return await service.get_group_members(group_id)


# -------------------- User-Role --------------------


@router.post(
    "/users/{user_id}/roles/{role_id}",
    response_model=MembershipResponse,
    status_code=201,
)
async def add_role_to_user(
    user_id: int,
    role_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Assign a role to a user."""
    return await service.add_role_to_user(user_id, role_id)


@router.delete(
    "/users/{user_id}/roles/{role_id}",
    response_model=MembershipResponse,
)
async def remove_role_from_user(
    user_id: int,
    role_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Remove a role from a user."""
    return await service.remove_role_from_user(user_id, role_id)


@router.get(
    "/users/{user_id}/memberships",
    response_model=UserMembershipsResponse,
)
async def get_user_memberships(
    user_id: int,
    service: MembershipService = Depends(get_service),
) -> UserMembershipsResponse:
    """Get all memberships (roles and groups) for a user."""
    return await service.get_user_memberships(user_id)


# -------------------- Group-Role --------------------


@router.post(
    "/groups/{group_id}/roles/{role_id}",
    response_model=MembershipResponse,
    status_code=201,
)
async def add_role_to_group(
    group_id: int,
    role_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Assign a role to a group."""
    return await service.add_role_to_group(group_id, role_id)


@router.delete(
    "/groups/{group_id}/roles/{role_id}",
    response_model=MembershipResponse,
)
async def remove_role_from_group(
    group_id: int,
    role_id: int,
    service: MembershipService = Depends(get_service),
) -> MembershipResponse:
    """Remove a role from a group."""
    return await service.remove_role_from_group(group_id, role_id)
