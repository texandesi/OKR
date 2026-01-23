"""Router for reaction endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.reaction import (
    EmojiType,
    KeyResultReactions,
    ReactionCreate,
    ReactionResponse,
)
from app.services.reaction import ReactionService

router = APIRouter(prefix="/key-results", tags=["reactions"])


# For now, we'll use a hardcoded user ID. In production, this would come from auth.
CURRENT_USER_ID = 1


@router.post(
    "/{key_result_id}/reactions",
    response_model=ReactionResponse | None,
    status_code=status.HTTP_200_OK,
)
async def toggle_reaction(
    key_result_id: int,
    data: ReactionCreate,
    db: AsyncSession = Depends(get_db),
) -> ReactionResponse | None:
    """Toggle a reaction on a key result.

    If the reaction exists, it will be removed. Otherwise, it will be added.
    Returns the reaction if added, null if removed.
    """
    service = ReactionService(db)
    return await service.toggle_reaction(
        key_result_id=key_result_id,
        user_id=CURRENT_USER_ID,
        emoji=data.emoji,
    )


@router.delete(
    "/{key_result_id}/reactions/{emoji}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_reaction(
    key_result_id: int,
    emoji: EmojiType,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Remove a specific reaction from a key result."""
    service = ReactionService(db)
    await service.remove_reaction(
        key_result_id=key_result_id,
        user_id=CURRENT_USER_ID,
        emoji=emoji,
    )


@router.get(
    "/{key_result_id}/reactions",
    response_model=KeyResultReactions,
)
async def get_reactions(
    key_result_id: int,
    db: AsyncSession = Depends(get_db),
) -> KeyResultReactions:
    """Get all reactions for a key result with summary by emoji type."""
    service = ReactionService(db)
    return await service.get_reactions(key_result_id)
