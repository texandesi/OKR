from pydantic import BaseModel, ConfigDict, Field


class GroupBase(BaseModel):
    name: str
    description: str


class GroupCreate(GroupBase):
    parent_id: int | None = Field(default=None, alias="parentId")
    owner_id: int | None = Field(default=None, alias="ownerId")

    model_config = ConfigDict(populate_by_name=True)


class GroupUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    parent_id: int | None = Field(default=None, alias="parentId")
    owner_id: int | None = Field(default=None, alias="ownerId")

    model_config = ConfigDict(populate_by_name=True)


class GroupResponse(GroupBase):
    id: int
    parent_id: int | None = Field(default=None, serialization_alias="parentId")
    owner_id: int | None = Field(default=None, serialization_alias="ownerId")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# Lightweight reference for nested responses
class GroupRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class UserRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class RoleRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


# Detailed response with relationships
class GroupDetailResponse(GroupBase):
    id: int
    parent_id: int | None = Field(default=None, serialization_alias="parentId")
    owner_id: int | None = Field(default=None, serialization_alias="ownerId")
    parent: GroupRef | None = None
    owner: UserRef | None = None
    children: list[GroupRef] = []
    delegates: list[UserRef] = []
    users: list[UserRef] = []
    roles: list[RoleRef] = []

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# For cascaded objectives management
class CascadeObjectiveRequest(BaseModel):
    objective_id: int = Field(alias="objectiveId")
    child_group_id: int = Field(alias="childGroupId")

    model_config = ConfigDict(populate_by_name=True)


class CascadedObjectiveResponse(BaseModel):
    id: int
    parent_group_id: int = Field(serialization_alias="parentGroupId")
    child_group_id: int = Field(serialization_alias="childGroupId")
    objective_id: int = Field(serialization_alias="objectiveId")
    is_active: bool = Field(serialization_alias="isActive")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
