"""Group service."""

from app.models.group import Group
from app.repositories.group import GroupRepository
from app.schemas.group import GroupCreate, GroupResponse, GroupUpdate
from app.services.base import BaseService


class GroupService(BaseService[Group, GroupCreate, GroupUpdate, GroupResponse]):
    """Service for Group operations."""

    repository_class = GroupRepository
    response_schema = GroupResponse
