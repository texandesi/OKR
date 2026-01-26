"""Schemas for membership management."""

from pydantic import BaseModel, ConfigDict


class MembershipResponse(BaseModel):
    """Generic response for membership operations."""

    success: bool = True
    message: str


class UserInOrganization(BaseModel):
    """User summary in organization context."""

    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)


class GroupInOrganization(BaseModel):
    """Group summary in organization context."""

    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)


class UserInGroup(BaseModel):
    """User summary in group context."""

    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)


class RoleAssignment(BaseModel):
    """Role summary for assignments."""

    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)


class GroupAssignment(BaseModel):
    """Group summary for user assignments."""

    id: int
    name: str
    description: str

    model_config = ConfigDict(from_attributes=True)


class OrganizationMembersResponse(BaseModel):
    """Response containing organization members."""

    users: list[UserInOrganization] = []
    groups: list[GroupInOrganization] = []


class GroupMembersResponse(BaseModel):
    """Response containing group members."""

    users: list[UserInGroup] = []
    roles: list[RoleAssignment] = []


class UserMembershipsResponse(BaseModel):
    """Response containing user's memberships."""

    organizations: list[GroupInOrganization] = []
    groups: list[GroupAssignment] = []
    roles: list[RoleAssignment] = []
