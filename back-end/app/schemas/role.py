from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    name: str
    description: str


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class RoleResponse(RoleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# Lightweight reference for nested responses
class UserRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class GroupRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# Detailed response with relationships
class RoleDetailResponse(RoleBase):
    id: int
    users: list[UserRef] = []
    groups: list[GroupRef] = []

    model_config = ConfigDict(from_attributes=True)
