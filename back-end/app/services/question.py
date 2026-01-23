"""Question service for polls."""

from app.models.poll import Question
from app.repositories.question import QuestionRepository
from app.schemas.poll import QuestionCreate, QuestionResponse, QuestionUpdate
from app.services.base import BaseService


class QuestionService(BaseService[Question, QuestionCreate, QuestionUpdate, QuestionResponse]):
    """Service for Question operations."""

    repository_class = QuestionRepository
    response_schema = QuestionResponse
