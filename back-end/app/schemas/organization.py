from pydantic import BaseModel, ConfigDict, Field


class OrganizationBase(BaseModel):
    name: str
    description: str


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


# Lightweight references for nested responses
class UserRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class GroupRef(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class OrganizationResponse(OrganizationBase):
    id: int
    users: list[UserRef] = Field(default_factory=list)
    groups: list[GroupRef] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
