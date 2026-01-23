from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    name: str
    description: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


# Lightweight reference for nested responses
class RoleRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class GroupRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class OrganizationRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# Main response with relationships
class UserResponse(UserBase):
    id: int
    roles: list[RoleRef] = Field(default_factory=list)
    groups: list[GroupRef] = Field(default_factory=list)
    organizations: list[OrganizationRef] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# Alias for backwards compatibility
UserDetailResponse = UserResponse
