"""Objective service with eager loading support."""



from app.models.objective import Objective
from app.repositories.objective import ObjectiveRepository
from app.schemas.objective import (
    ObjectiveCreate,
    ObjectiveResponse,
    ObjectiveUpdate,
    ObjectiveWithKeyResults,
)
from app.services.base import BaseService


class ObjectiveService(BaseService[Objective, ObjectiveCreate, ObjectiveUpdate, ObjectiveResponse]):
    """Service for Objective operations with key results support."""

    repository_class = ObjectiveRepository
    response_schema = ObjectiveResponse

    async def get_by_id_with_keyresults(self, id: int) -> ObjectiveWithKeyResults:
        """Get objective with eager-loaded key results.

        Args:
            id: Primary key ID.

        Returns:
            ObjectiveWithKeyResults response.

        Raises:
            NotFoundError: If objective not found.
        """
        repo: ObjectiveRepository = self.repository
        instance = await repo.get_by_id_with_keyresults(id)
        return ObjectiveWithKeyResults.model_validate(instance)
