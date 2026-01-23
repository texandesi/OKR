"""Schemas for reactions."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class EmojiType(str, Enum):
    """Supported emoji types for reactions."""

    CELEBRATION = "celebration"  # 🎉
    CLAP = "clap"  # 👏
    FIRE = "fire"  # 🔥
    HEART = "heart"  # ❤️


class ReactionCreate(BaseModel):
    """Schema for creating a reaction."""

    emoji: EmojiType


class ReactionResponse(BaseModel):
    """Schema for reaction response."""

    id: int
    key_result_id: int = Field(serialization_alias="keyResultId")
    user_id: int = Field(serialization_alias="userId")
    user_name: str = Field(serialization_alias="userName")
    emoji: EmojiType
    created_at: datetime = Field(serialization_alias="createdAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ReactionSummary(BaseModel):
    """Summary of reactions for a key result."""

    emoji: EmojiType
    count: int
    users: list[str]  # List of user names who reacted
    user_ids: list[int] = Field(serialization_alias="userIds")

    model_config = ConfigDict(populate_by_name=True)


class KeyResultReactions(BaseModel):
    """All reactions for a key result."""

    key_result_id: int = Field(serialization_alias="keyResultId")
    reactions: list[ReactionSummary]
    total_count: int = Field(serialization_alias="totalCount")

    model_config = ConfigDict(populate_by_name=True)
