from pydantic import BaseModel, ConfigDict


class OrganizationBase(BaseModel):
    name: str
    description: str


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class OrganizationResponse(OrganizationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
