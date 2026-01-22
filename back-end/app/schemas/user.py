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
