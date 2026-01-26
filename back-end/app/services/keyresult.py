"""KeyResult service with custom response conversion and auto-complete logic."""

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.keyresult import KeyResult
from app.models.objective import Objective
from app.core.websockets import manager
from app.repositories.keyresult import KeyResultRepository
from app.schemas.keyresult import KeyResultCreate, KeyResultResponse, KeyResultUpdate
from app.services.base import BaseService


class KeyResultService(BaseService[KeyResult, KeyResultCreate, KeyResultUpdate, KeyResultResponse]):
    """Service for KeyResult operations with custom conversion and auto-complete."""

    repository_class = KeyResultRepository
    response_schema = KeyResultResponse

    def _to_response(self, instance: KeyResult) -> KeyResultResponse:
        """Convert KeyResult to response with objective info.

        Uses the custom from_orm_with_objective classmethod to include
        the objective name in the response.

        Args:
            instance: KeyResult model instance with loaded objective.

        Returns:
            KeyResultResponse with objective_name populated.
        """
        return KeyResultResponse.from_orm_with_objective(instance)

    async def update(self, id: int, data: KeyResultUpdate) -> KeyResultResponse:
        """Update key result and check for auto-complete of objective.

        If the updated key result results in all key results being complete
        (either via is_complete checkbox or 100% progress), auto-complete
        the parent objective.

        Args:
            id: Primary key ID.
            data: KeyResultUpdate schema.

        Returns:
            Updated KeyResultResponse.
        """
        await self._validate_update(id, data)
        instance = await self.repository.update(id, data)

        # Check if we need to auto-complete the objective
        await self._check_and_auto_complete_objective(instance.objective_id)

        # Broadcast update
        await manager.broadcast({
            "type": "keyresult_update",
            "data": {
                "id": instance.id,
                "objectiveId": instance.objective_id,
                "progress": instance.progress_percentage
            }
        })

        return self._to_response(instance)

    async def _check_and_auto_complete_objective(self, objective_id: int) -> None:
        """Check if all key results are complete and auto-complete objective.

        A key result is considered complete if:
        - is_complete is True, OR
        - progress_percentage >= 100

        Args:
            objective_id: Objective ID to check.
        """
        # Get objective with all key results
        query = (
            select(Objective)
            .options(selectinload(Objective.keyresults))
            .where(Objective.id == objective_id)
        )
        result = await self.db.execute(query)
        objective = result.scalar_one_or_none()

        if not objective or not objective.keyresults:
            return

        # Check if all key results are complete
        all_complete = all(
            kr.is_complete or kr.progress_percentage >= 100
            for kr in objective.keyresults
        )

        # Update objective if all complete and not already marked complete
        if all_complete and not objective.is_complete:
            objective.is_complete = True
            await self.db.commit()
        elif not all_complete and objective.is_complete:
            # If some key results are no longer complete, unmark objective
            objective.is_complete = False
            await self.db.commit()
