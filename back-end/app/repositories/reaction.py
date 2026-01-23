"""Repository for managing reactions."""

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationError
from app.models import KeyResult, User
from app.models.reaction import Reaction


class ReactionRepository:
    """Repository for reaction CRUD operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add_reaction(
        self, key_result_id: int, user_id: int, emoji: str
    ) -> Reaction:
        """Add a reaction to a key result."""
        # Validate key result exists
        kr_query = select(KeyResult).where(KeyResult.id == key_result_id)
        kr_result = await self.db.execute(kr_query)
        if not kr_result.scalar_one_or_none():
            raise NotFoundError("KeyResult", key_result_id)

        # Validate user exists
        user_query = select(User).where(User.id == user_id)
        user_result = await self.db.execute(user_query)
        if not user_result.scalar_one_or_none():
            raise NotFoundError("User", user_id)

        # Check if reaction already exists
        existing_query = select(Reaction).where(
            Reaction.key_result_id == key_result_id,
            Reaction.user_id == user_id,
            Reaction.emoji == emoji,
        )
        existing_result = await self.db.execute(existing_query)
        if existing_result.scalar_one_or_none():
            raise ValidationError(
                message="You have already added this reaction",
                field="emoji",
                value=emoji,
            )

        reaction = Reaction(
            key_result_id=key_result_id,
            user_id=user_id,
            emoji=emoji,
        )
        self.db.add(reaction)
        await self.db.commit()
        await self.db.refresh(reaction)
        return reaction

    async def remove_reaction(
        self, key_result_id: int, user_id: int, emoji: str
    ) -> None:
        """Remove a reaction from a key result."""
        stmt = delete(Reaction).where(
            Reaction.key_result_id == key_result_id,
            Reaction.user_id == user_id,
            Reaction.emoji == emoji,
        )
        result = await self.db.execute(stmt)
        if result.rowcount == 0:
            raise NotFoundError("Reaction", f"{key_result_id}-{user_id}-{emoji}")
        await self.db.commit()

    async def get_reactions_for_key_result(
        self, key_result_id: int
    ) -> list[Reaction]:
        """Get all reactions for a key result."""
        query = (
            select(Reaction)
            .where(Reaction.key_result_id == key_result_id)
            .order_by(Reaction.created_at)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_reaction_summary(
        self, key_result_id: int
    ) -> list[dict]:
        """Get reaction summary grouped by emoji with user details."""
        # Get all reactions with user info
        query = (
            select(Reaction, User.name)
            .join(User, Reaction.user_id == User.id)
            .where(Reaction.key_result_id == key_result_id)
            .order_by(Reaction.emoji, Reaction.created_at)
        )
        result = await self.db.execute(query)
        rows = result.all()

        # Group by emoji
        summary: dict[str, dict] = {}
        for reaction, user_name in rows:
            if reaction.emoji not in summary:
                summary[reaction.emoji] = {
                    "emoji": reaction.emoji,
                    "count": 0,
                    "users": [],
                    "user_ids": [],
                }
            summary[reaction.emoji]["count"] += 1
            summary[reaction.emoji]["users"].append(user_name)
            summary[reaction.emoji]["user_ids"].append(reaction.user_id)

        return list(summary.values())

    async def get_user_reaction(
        self, key_result_id: int, user_id: int, emoji: str
    ) -> Reaction | None:
        """Get a specific reaction by a user."""
        query = select(Reaction).where(
            Reaction.key_result_id == key_result_id,
            Reaction.user_id == user_id,
            Reaction.emoji == emoji,
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
