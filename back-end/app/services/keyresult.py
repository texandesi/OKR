"""KeyResult service with custom response conversion."""



from app.models.keyresult import KeyResult
from app.repositories.keyresult import KeyResultRepository
from app.schemas.keyresult import KeyResultCreate, KeyResultResponse, KeyResultUpdate
from app.services.base import BaseService


class KeyResultService(BaseService[KeyResult, KeyResultCreate, KeyResultUpdate, KeyResultResponse]):
    """Service for KeyResult operations with custom conversion."""

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
