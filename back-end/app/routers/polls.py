"""Poll router endpoints for Questions and Choices."""

from typing import Any

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.schemas.poll import (
    ChoiceCreate,
    ChoiceResponse,
    ChoiceUpdate,
    QuestionCreate,
    QuestionResponse,
    QuestionUpdate,
)
from app.services.choice import ChoiceService
from app.services.question import QuestionService

router = APIRouter(prefix="/polls", tags=["polls"])


def get_question_service(db: AsyncSession = Depends(get_db)) -> QuestionService:
    """Dependency to get QuestionService instance."""
    return QuestionService(db)


def get_choice_service(db: AsyncSession = Depends(get_db)) -> ChoiceService:
    """Dependency to get ChoiceService instance."""
    return ChoiceService(db)


# Question endpoints


@router.get("/questions/", response_model=None)
async def list_questions(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    service: QuestionService = Depends(get_question_service),
) -> dict[str, Any]:
    """List all questions with pagination and ordering."""
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
    )


@router.post("/questions/", response_model=QuestionResponse, status_code=201)
async def create_question(
    question: QuestionCreate,
    service: QuestionService = Depends(get_question_service),
) -> QuestionResponse:
    """Create a new question."""
    return await service.create(question)


@router.get("/questions/{question_id}/", response_model=QuestionResponse)
async def get_question(
    question_id: int,
    service: QuestionService = Depends(get_question_service),
) -> QuestionResponse:
    """Get a question by ID."""
    return await service.get_by_id(question_id)


@router.put("/questions/{question_id}/", response_model=QuestionResponse)
async def update_question(
    question_id: int,
    question_update: QuestionUpdate,
    service: QuestionService = Depends(get_question_service),
) -> QuestionResponse:
    """Update an existing question."""
    return await service.update(question_id, question_update)


@router.delete("/questions/{question_id}/", status_code=204)
async def delete_question(
    question_id: int,
    service: QuestionService = Depends(get_question_service),
) -> None:
    """Delete a question by ID."""
    await service.delete(question_id)


# Choice endpoints


@router.get("/choices/", response_model=None)
async def list_choices(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    question_id: int | None = Query(None),
    service: ChoiceService = Depends(get_choice_service),
) -> dict[str, Any]:
    """List all choices with pagination, ordering, and optional question filter."""
    return await service.get_list(
        request,
        page=page,
        page_size=page_size,
        ordering=ordering,
        question_id=question_id,
    )


@router.post("/choices/", response_model=ChoiceResponse, status_code=201)
async def create_choice(
    choice: ChoiceCreate,
    service: ChoiceService = Depends(get_choice_service),
) -> ChoiceResponse:
    """Create a new choice."""
    return await service.create(choice)


@router.get("/choices/{choice_id}/", response_model=ChoiceResponse)
async def get_choice(
    choice_id: int,
    service: ChoiceService = Depends(get_choice_service),
) -> ChoiceResponse:
    """Get a choice by ID."""
    return await service.get_by_id(choice_id)


@router.put("/choices/{choice_id}/", response_model=ChoiceResponse)
async def update_choice(
    choice_id: int,
    choice_update: ChoiceUpdate,
    service: ChoiceService = Depends(get_choice_service),
) -> ChoiceResponse:
    """Update an existing choice."""
    return await service.update(choice_id, choice_update)


@router.delete("/choices/{choice_id}/", status_code=204)
async def delete_choice(
    choice_id: int,
    service: ChoiceService = Depends(get_choice_service),
) -> None:
    """Delete a choice by ID."""
    await service.delete(choice_id)
