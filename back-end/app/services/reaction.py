"""Service layer for reactions."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reaction import Reaction
from app.repositories.reaction import ReactionRepository
from app.schemas.reaction import (
    EmojiType,
    KeyResultReactions,
    ReactionResponse,
    ReactionSummary,
)


class ReactionService:
    """Service for managing reactions on key results."""

    def __init__(self, db: AsyncSession) -> None:
        self.repository = ReactionRepository(db)

    async def add_reaction(
        self, key_result_id: int, user_id: int, emoji: EmojiType
    ) -> ReactionResponse:
        """Add a reaction to a key result."""
        reaction = await self.repository.add_reaction(
            key_result_id=key_result_id,
            user_id=user_id,
            emoji=emoji.value,
        )
        return self._to_response(reaction)

    async def remove_reaction(
        self, key_result_id: int, user_id: int, emoji: EmojiType
    ) -> None:
        """Remove a reaction from a key result."""
        await self.repository.remove_reaction(
            key_result_id=key_result_id,
            user_id=user_id,
            emoji=emoji.value,
        )

    async def toggle_reaction(
        self, key_result_id: int, user_id: int, emoji: EmojiType
    ) -> ReactionResponse | None:
        """Toggle a reaction - add if not exists, remove if exists."""
        existing = await self.repository.get_user_reaction(
            key_result_id=key_result_id,
            user_id=user_id,
            emoji=emoji.value,
        )
        if existing:
            await self.repository.remove_reaction(
                key_result_id=key_result_id,
                user_id=user_id,
                emoji=emoji.value,
            )
            return None
        else:
            reaction = await self.repository.add_reaction(
                key_result_id=key_result_id,
                user_id=user_id,
                emoji=emoji.value,
            )
            return self._to_response(reaction)

    async def get_reactions(self, key_result_id: int) -> KeyResultReactions:
        """Get all reactions for a key result with summary."""
        summary_data = await self.repository.get_reaction_summary(key_result_id)
        summaries = [
            ReactionSummary(
                emoji=EmojiType(item["emoji"]),
                count=item["count"],
                users=item["users"],
                user_ids=item["user_ids"],
            )
            for item in summary_data
        ]
        total = sum(s.count for s in summaries)
        return KeyResultReactions(
            key_result_id=key_result_id,
            reactions=summaries,
            total_count=total,
        )

    def _to_response(self, reaction: Reaction) -> ReactionResponse:
        """Convert reaction model to response schema."""
        return ReactionResponse(
            id=reaction.id,
            key_result_id=reaction.key_result_id,
            user_id=reaction.user_id,
            user_name=reaction.user.name,
            emoji=EmojiType(reaction.emoji),
            created_at=reaction.created_at,
        )
