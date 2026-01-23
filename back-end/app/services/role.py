"""Role service."""

from app.models.role import Role
from app.repositories.role import RoleRepository
from app.schemas.role import RoleCreate, RoleResponse, RoleUpdate
from app.services.base import BaseService


class RoleService(BaseService[Role, RoleCreate, RoleUpdate, RoleResponse]):
    """Service for Role operations."""

    repository_class = RoleRepository
    response_schema = RoleResponse
