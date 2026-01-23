"""Objective service with eager loading support."""

from typing import cast

from app.models.objective import Objective
from app.repositories.objective import ObjectiveRepository
from app.repositories.ownership import OwnershipRepository
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
        """Get objective with eager-loaded key results and resolved ownerships.

        Args:
            id: Primary key ID.

        Returns:
            ObjectiveWithKeyResults response with owner names resolved.

        Raises:
            NotFoundError: If objective not found.
        """
        repo = cast(ObjectiveRepository, self.repository)
        instance = await repo.get_by_id_with_keyresults(id)

        # Resolve owner names
        ownership_repo = OwnershipRepository(self.db)
        owner_names = await ownership_repo.get_owner_names_bulk(instance.ownerships)

        return ObjectiveWithKeyResults.from_orm_with_ownerships(instance, owner_names)
