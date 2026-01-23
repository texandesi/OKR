from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    name: str
    description: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


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


# Detailed response with relationships
class UserDetailResponse(UserBase):
    id: int
    roles: list[RoleRef] = []
    groups: list[GroupRef] = []
    organizations: list[OrganizationRef] = []

    model_config = ConfigDict(from_attributes=True)
