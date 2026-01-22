from pydantic import BaseModel, ConfigDict


class ObjectiveBase(BaseModel):
    name: str
    description: str


class ObjectiveCreate(ObjectiveBase):
    pass


class ObjectiveUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class ObjectiveResponse(ObjectiveBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class KeyResultInObjective(BaseModel):
    id: int
    name: str
    description: str
    target_value: float | None = None
    current_value: float | None = None
    unit: str | None = None
    progress_percentage: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class ObjectiveWithKeyResults(ObjectiveResponse):
    keyresults: list[KeyResultInObjective] = []
