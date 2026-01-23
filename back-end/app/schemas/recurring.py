"""Schemas for recurring schedules."""

from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class Frequency(str, Enum):
    """Frequency options for recurring tasks."""

    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class RecurringScheduleCreate(BaseModel):
    """Schema for creating a recurring schedule."""

    frequency: Frequency
    rotation_enabled: bool = Field(default=False, alias="rotationEnabled")
    rotation_users: list[int] | None = Field(default=None, alias="rotationUsers")
    next_due_date: date = Field(alias="nextDueDate")

    model_config = ConfigDict(populate_by_name=True)


class RecurringScheduleUpdate(BaseModel):
    """Schema for updating a recurring schedule."""

    frequency: Frequency | None = None
    rotation_enabled: bool | None = Field(default=None, alias="rotationEnabled")
    rotation_users: list[int] | None = Field(default=None, alias="rotationUsers")
    next_due_date: date | None = Field(default=None, alias="nextDueDate")

    model_config = ConfigDict(populate_by_name=True)


class RecurringScheduleResponse(BaseModel):
    """Response schema for recurring schedule."""

    id: int
    key_result_id: int = Field(serialization_alias="keyResultId")
    key_result_name: str = Field(serialization_alias="keyResultName")
    frequency: Frequency
    rotation_enabled: bool = Field(serialization_alias="rotationEnabled")
    rotation_users: list[int] | None = Field(default=None, serialization_alias="rotationUsers")
    current_rotation_index: int = Field(serialization_alias="currentRotationIndex")
    next_due_date: date = Field(serialization_alias="nextDueDate")
    last_generated_at: datetime | None = Field(
        default=None, serialization_alias="lastGeneratedAt"
    )
    current_assignee_id: int | None = Field(
        default=None, serialization_alias="currentAssigneeId"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DueTodayItem(BaseModel):
    """Item due today from recurring schedule."""

    key_result_id: int = Field(serialization_alias="keyResultId")
    key_result_name: str = Field(serialization_alias="keyResultName")
    objective_name: str = Field(serialization_alias="objectiveName")
    frequency: Frequency
    assignee_id: int | None = Field(default=None, serialization_alias="assigneeId")
    assignee_name: str | None = Field(default=None, serialization_alias="assigneeName")

    model_config = ConfigDict(populate_by_name=True)


class RegenerateResponse(BaseModel):
    """Response from regeneration job."""

    regenerated_count: int = Field(serialization_alias="regeneratedCount")
    rotated_count: int = Field(serialization_alias="rotatedCount")
    message: str

    model_config = ConfigDict(populate_by_name=True)
