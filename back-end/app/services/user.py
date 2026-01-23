"""User service."""

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.base import BaseService


class UserService(BaseService[User, UserCreate, UserUpdate, UserResponse]):
    """Service for User operations."""

    repository_class = UserRepository
    response_schema = UserResponse
