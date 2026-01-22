from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.objective import Objective
from app.schemas.objective import (
    ObjectiveCreate,
    ObjectiveUpdate,
    ObjectiveResponse,
    ObjectiveWithKeyResults,
)
from app.schemas.common import PaginatedResponse
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/objectives", tags=["objectives"])


@router.get("/", response_model=None)
async def list_objectives(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    # Build query
    query = select(Objective)
    count_query = select(func.count()).select_from(Objective)

    # Apply filters
    if name:
        query = query.where(Objective.name.ilike(f"%{name}%"))
        count_query = count_query.where(Objective.name.ilike(f"%{name}%"))
    if description:
        query = query.where(Objective.description.ilike(f"%{description}%"))
        count_query = count_query.where(Objective.description.ilike(f"%{description}%"))

    # Apply ordering
    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Objective, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Objective, ordering))
    else:
        query = query.order_by(Objective.name)

    # Get total count
    total_count = await db.scalar(count_query)

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    objectives = result.scalars().all()

    items = [ObjectiveResponse.model_validate(obj) for obj in objectives]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=ObjectiveResponse, status_code=201)
async def create_objective(
    objective: ObjectiveCreate,
    db: AsyncSession = Depends(get_db),
):
    db_objective = Objective(**objective.model_dump())
    db.add(db_objective)
    await db.commit()
    await db.refresh(db_objective)
    return ObjectiveResponse.model_validate(db_objective)


@router.get("/{objective_id}/", response_model=ObjectiveWithKeyResults)
async def get_objective(
    objective_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Objective)
        .options(selectinload(Objective.keyresults))
        .where(Objective.id == objective_id)
    )
    result = await db.execute(query)
    objective = result.scalar_one_or_none()

    if not objective:
        raise HTTPException(status_code=404, detail="Objective not found")

    return ObjectiveWithKeyResults.model_validate(objective)


@router.put("/{objective_id}/", response_model=ObjectiveResponse)
async def update_objective(
    objective_id: int,
    objective_update: ObjectiveUpdate,
    db: AsyncSession = Depends(get_db),
):
    query = select(Objective).where(Objective.id == objective_id)
    result = await db.execute(query)
    objective = result.scalar_one_or_none()

    if not objective:
        raise HTTPException(status_code=404, detail="Objective not found")

    update_data = objective_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(objective, field, value)

    await db.commit()
    await db.refresh(objective)
    return ObjectiveResponse.model_validate(objective)


@router.delete("/{objective_id}/", status_code=204)
async def delete_objective(
    objective_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = select(Objective).where(Objective.id == objective_id)
    result = await db.execute(query)
    objective = result.scalar_one_or_none()

    if not objective:
        raise HTTPException(status_code=404, detail="Objective not found")

    await db.delete(objective)
    await db.commit()
    return None
