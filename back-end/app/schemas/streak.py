"""Schemas for group streaks."""

from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class GroupStreakResponse(BaseModel):
    """Response schema for group streak."""

    id: int
    group_id: int = Field(serialization_alias="groupId")
    group_name: str = Field(serialization_alias="groupName")
    current_streak: int = Field(serialization_alias="currentStreak")
    longest_streak: int = Field(serialization_alias="longestStreak")
    last_activity_date: date | None = Field(
        default=None, serialization_alias="lastActivityDate"
    )
    streak_started_at: date | None = Field(
        default=None, serialization_alias="streakStartedAt"
    )
    is_active_today: bool = Field(
        default=False, serialization_alias="isActiveToday"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class StreakCheckResponse(BaseModel):
    """Response after checking/updating a streak."""

    group_id: int = Field(serialization_alias="groupId")
    current_streak: int = Field(serialization_alias="currentStreak")
    streak_increased: bool = Field(serialization_alias="streakIncreased")
    message: str

    model_config = ConfigDict(populate_by_name=True)
