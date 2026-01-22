from pydantic import BaseModel, ConfigDict


class GroupBase(BaseModel):
    name: str
    description: str


class GroupCreate(GroupBase):
    pass


class GroupUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class GroupResponse(GroupBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
