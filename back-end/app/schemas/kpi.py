from pydantic import BaseModel, ConfigDict


class KpiBase(BaseModel):
    name: str
    description: str


class KpiCreate(KpiBase):
    pass


class KpiUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class KpiResponse(KpiBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
