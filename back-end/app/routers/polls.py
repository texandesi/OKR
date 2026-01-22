from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.poll import Question, Choice
from app.schemas.poll import (
    QuestionCreate, QuestionUpdate, QuestionResponse,
    ChoiceCreate, ChoiceUpdate, ChoiceResponse,
)
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/polls", tags=["polls"])


# Question endpoints
@router.get("/questions/", response_model=None)
async def list_questions(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Question)
    count_query = select(func.count()).select_from(Question)

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Question, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Question, ordering))
    else:
        query = query.order_by(Question.pub_date.desc())

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    questions = result.scalars().all()

    items = [QuestionResponse.model_validate(q) for q in questions]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/questions/", response_model=QuestionResponse, status_code=201)
async def create_question(question: QuestionCreate, db: AsyncSession = Depends(get_db)):
    db_question = Question(
        question_text=question.question_text,
        pub_date=question.pub_date or datetime.utcnow(),
    )
    db.add(db_question)
    await db.commit()
    await db.refresh(db_question)
    return QuestionResponse.model_validate(db_question)


@router.get("/questions/{question_id}/", response_model=QuestionResponse)
async def get_question(question_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Question).where(Question.id == question_id)
    result = await db.execute(query)
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return QuestionResponse.model_validate(question)


@router.put("/questions/{question_id}/", response_model=QuestionResponse)
async def update_question(question_id: int, question_update: QuestionUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Question).where(Question.id == question_id)
    result = await db.execute(query)
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    update_data = question_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)

    await db.commit()
    await db.refresh(question)
    return QuestionResponse.model_validate(question)


@router.delete("/questions/{question_id}/", status_code=204)
async def delete_question(question_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Question).where(Question.id == question_id)
    result = await db.execute(query)
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    await db.delete(question)
    await db.commit()
    return None


# Choice endpoints
@router.get("/choices/", response_model=None)
async def list_choices(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    question_id: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Choice)
    count_query = select(func.count()).select_from(Choice)

    if question_id:
        query = query.where(Choice.question_id == question_id)
        count_query = count_query.where(Choice.question_id == question_id)

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Choice, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Choice, ordering))
    else:
        query = query.order_by(Choice.id)

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    choices = result.scalars().all()

    items = [ChoiceResponse.model_validate(c) for c in choices]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/choices/", response_model=ChoiceResponse, status_code=201)
async def create_choice(choice: ChoiceCreate, db: AsyncSession = Depends(get_db)):
    # Verify question exists
    q_query = select(Question).where(Question.id == choice.question_id)
    q_result = await db.execute(q_query)
    if not q_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Question not found")

    db_choice = Choice(**choice.model_dump())
    db.add(db_choice)
    await db.commit()
    await db.refresh(db_choice)
    return ChoiceResponse.model_validate(db_choice)


@router.get("/choices/{choice_id}/", response_model=ChoiceResponse)
async def get_choice(choice_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Choice).where(Choice.id == choice_id)
    result = await db.execute(query)
    choice = result.scalar_one_or_none()
    if not choice:
        raise HTTPException(status_code=404, detail="Choice not found")
    return ChoiceResponse.model_validate(choice)


@router.put("/choices/{choice_id}/", response_model=ChoiceResponse)
async def update_choice(choice_id: int, choice_update: ChoiceUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Choice).where(Choice.id == choice_id)
    result = await db.execute(query)
    choice = result.scalar_one_or_none()
    if not choice:
        raise HTTPException(status_code=404, detail="Choice not found")

    update_data = choice_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(choice, field, value)

    await db.commit()
    await db.refresh(choice)
    return ChoiceResponse.model_validate(choice)


@router.delete("/choices/{choice_id}/", status_code=204)
async def delete_choice(choice_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Choice).where(Choice.id == choice_id)
    result = await db.execute(query)
    choice = result.scalar_one_or_none()
    if not choice:
        raise HTTPException(status_code=404, detail="Choice not found")
    await db.delete(choice)
    await db.commit()
    return None
