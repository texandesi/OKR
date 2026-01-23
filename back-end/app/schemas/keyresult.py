from __future__ import annotations

from typing import TYPE_CHECKING, Self

from pydantic import BaseModel, ConfigDict, Field

if TYPE_CHECKING:
    from app.models.keyresult import KeyResult


def to_camel(string: str) -> str:
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class KeyResultBase(BaseModel):
    name: str
    description: str
    objective: int  # Match Django field name for frontend compatibility


class KeyResultCreate(KeyResultBase):
    target_value: float | None = Field(default=100.0, alias="targetValue")
    current_value: float | None = Field(default=0.0, alias="currentValue")
    unit: str | None = "%"

    model_config = ConfigDict(populate_by_name=True)


class KeyResultUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    objective: int | None = None
    target_value: float | None = Field(default=None, alias="targetValue")
    current_value: float | None = Field(default=None, alias="currentValue")
    unit: str | None = None

    model_config = ConfigDict(populate_by_name=True)


class KeyResultResponse(BaseModel):
    id: int
    name: str
    description: str
    objective: int
    target_value: float | None = Field(default=None, serialization_alias="targetValue")
    current_value: float | None = Field(default=None, serialization_alias="currentValue")
    unit: str | None = None
    progress_percentage: float = Field(default=0.0, serialization_alias="progressPercentage")
    objective_name: str | None = Field(default=None, serialization_alias="objectiveName")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    @classmethod
    def from_orm_with_objective(cls, keyresult: KeyResult) -> Self:
        return cls(
            id=keyresult.id,
            name=keyresult.name,
            description=keyresult.description,
            objective=keyresult.objective_id,
            target_value=keyresult.target_value,
            current_value=keyresult.current_value,
            unit=keyresult.unit,
            progress_percentage=keyresult.progress_percentage,
            objective_name=keyresult.objective.name if keyresult.objective else None,
        )
