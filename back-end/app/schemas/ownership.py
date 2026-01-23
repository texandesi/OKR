"""Schemas for objective ownership management."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.objective import ObjectiveResponse


class OwnershipCreate(BaseModel):
    """Schema for creating ownership."""

    owner_type: Literal["user", "role", "group"] = Field(alias="ownerType")
    owner_id: int = Field(alias="ownerId")

    model_config = ConfigDict(populate_by_name=True)


class OwnershipResponse(BaseModel):
    """Response schema for ownership."""

    id: int
    objective_id: int = Field(serialization_alias="objectiveId")
    owner_type: str = Field(serialization_alias="ownerType")
    owner_id: int = Field(serialization_alias="ownerId")
    owner_name: str | None = Field(default=None, serialization_alias="ownerName")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class OwnershipDeleteParams(BaseModel):
    """Query params for deleting ownership."""

    owner_type: Literal["user", "role", "group"] = Field(alias="ownerType")
    owner_id: int = Field(alias="ownerId")

    model_config = ConfigDict(populate_by_name=True)


class UserAssignedOKRs(BaseModel):
    """Response containing user's assigned OKRs grouped by assignment type."""

    individual: list[ObjectiveResponse] = Field(
        default=[],
        description="Objectives directly assigned to the user",
    )
    by_role: dict[str, list[ObjectiveResponse]] = Field(
        default={},
        serialization_alias="byRole",
        description="Objectives assigned via roles, keyed by role name",
    )
    by_group: dict[str, list[ObjectiveResponse]] = Field(
        default={},
        serialization_alias="byGroup",
        description="Objectives assigned via groups, keyed by group name",
    )

    model_config = ConfigDict(populate_by_name=True)
