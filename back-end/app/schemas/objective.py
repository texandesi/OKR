from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING, Self

from pydantic import BaseModel, ConfigDict, Field

if TYPE_CHECKING:
    from app.models.objective import Objective


class ObjectiveOwnershipResponse(BaseModel):
    """Response schema for objective ownership."""

    id: int
    owner_type: str = Field(serialization_alias="ownerType")
    owner_id: int = Field(serialization_alias="ownerId")
    owner_name: str | None = Field(default=None, serialization_alias="ownerName")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ObjectiveBase(BaseModel):
    name: str
    description: str


class ObjectiveCreate(ObjectiveBase):
    start_date: date | None = Field(default=None, alias="startDate")
    end_date: date | None = Field(default=None, alias="endDate")

    model_config = ConfigDict(populate_by_name=True)


class ObjectiveUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    start_date: date | None = Field(default=None, alias="startDate")
    end_date: date | None = Field(default=None, alias="endDate")
    is_complete: bool | None = Field(default=None, alias="isComplete")

    model_config = ConfigDict(populate_by_name=True)


class ObjectiveResponse(ObjectiveBase):
    id: int
    start_date: date | None = Field(default=None, serialization_alias="startDate")
    end_date: date | None = Field(default=None, serialization_alias="endDate")
    is_complete: bool = Field(default=False, serialization_alias="isComplete")
    progress_percentage: float = Field(default=0.0, serialization_alias="progressPercentage")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class KeyResultInObjective(BaseModel):
    id: int
    name: str
    description: str
    target_value: float | None = Field(default=None, serialization_alias="targetValue")
    current_value: float | None = Field(default=None, serialization_alias="currentValue")
    unit: str | None = None
    progress_percentage: float = Field(default=0.0, serialization_alias="progressPercentage")
    start_date: date | None = Field(default=None, serialization_alias="startDate")
    end_date: date | None = Field(default=None, serialization_alias="endDate")
    is_complete: bool = Field(default=False, serialization_alias="isComplete")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ObjectiveWithKeyResults(ObjectiveResponse):
    keyresults: list[KeyResultInObjective] = []
    ownerships: list[ObjectiveOwnershipResponse] = []

    @classmethod
    def from_orm_with_ownerships(
        cls,
        objective: Objective,
        owner_names: dict[tuple[str, int], str] | None = None,
    ) -> Self:
        """Create response with resolved owner names.

        Args:
            objective: Objective ORM model.
            owner_names: Dict mapping (owner_type, owner_id) to owner name.

        Returns:
            ObjectiveWithKeyResults with resolved owner names.
        """
        owner_names = owner_names or {}
        ownerships = [
            ObjectiveOwnershipResponse(
                id=o.id,
                owner_type=o.owner_type.value,
                owner_id=o.owner_id,
                owner_name=owner_names.get((o.owner_type.value, o.owner_id)),
            )
            for o in objective.ownerships
        ]
        return cls(
            id=objective.id,
            name=objective.name,
            description=objective.description,
            start_date=objective.start_date,
            end_date=objective.end_date,
            is_complete=objective.is_complete,
            progress_percentage=objective.progress_percentage,
            keyresults=[
                KeyResultInObjective(
                    id=kr.id,
                    name=kr.name,
                    description=kr.description,
                    target_value=kr.target_value,
                    current_value=kr.current_value,
                    unit=kr.unit,
                    progress_percentage=kr.progress_percentage,
                    start_date=kr.start_date,
                    end_date=kr.end_date,
                    is_complete=kr.is_complete,
                )
                for kr in objective.keyresults
            ],
            ownerships=ownerships,
        )
