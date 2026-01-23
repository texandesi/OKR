"""Organization service."""

from app.models.organization import Organization
from app.repositories.organization import OrganizationRepository
from app.schemas.organization import OrganizationCreate, OrganizationResponse, OrganizationUpdate
from app.services.base import BaseService


class OrganizationService(BaseService[Organization, OrganizationCreate, OrganizationUpdate, OrganizationResponse]):
    """Service for Organization operations."""

    repository_class = OrganizationRepository
    response_schema = OrganizationResponse
