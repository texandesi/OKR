from pydantic import BaseModel, ConfigDict, Field


class RoleBase(BaseModel):
    name: str
    description: str


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


# Lightweight reference for nested responses
class UserRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class GroupRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# Main response with relationships
class RoleResponse(RoleBase):
    id: int
    users: list[UserRef] = Field(default_factory=list)
    groups: list[GroupRef] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# Alias for backwards compatibility
RoleDetailResponse = RoleResponse
