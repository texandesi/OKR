from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.keyresult import KeyResult
from app.models.objective import Objective
from app.schemas.keyresult import (
    KeyResultCreate,
    KeyResultUpdate,
    KeyResultResponse,
)
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/keyresults", tags=["keyresults"])


@router.get("/", response_model=None)
async def list_keyresults(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    # Build query with eager loading of objective
    query = select(KeyResult).options(selectinload(KeyResult.objective))
    count_query = select(func.count()).select_from(KeyResult)

    # Apply filters
    if name:
        query = query.where(KeyResult.name.ilike(f"%{name}%"))
        count_query = count_query.where(KeyResult.name.ilike(f"%{name}%"))
    if description:
        query = query.where(KeyResult.description.ilike(f"%{description}%"))
        count_query = count_query.where(KeyResult.description.ilike(f"%{description}%"))

    # Apply ordering
    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(KeyResult, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(KeyResult, ordering))
    else:
        query = query.order_by(KeyResult.name)

    # Get total count
    total_count = await db.scalar(count_query)

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    keyresults = result.scalars().all()

    items = [KeyResultResponse.from_orm_with_objective(kr) for kr in keyresults]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=KeyResultResponse, status_code=201)
async def create_keyresult(
    keyresult: KeyResultCreate,
    db: AsyncSession = Depends(get_db),
):
    # Verify objective exists
    obj_query = select(Objective).where(Objective.id == keyresult.objective)
    obj_result = await db.execute(obj_query)
    objective = obj_result.scalar_one_or_none()

    if not objective:
        raise HTTPException(status_code=400, detail="Objective not found")

    db_keyresult = KeyResult(
        name=keyresult.name,
        description=keyresult.description,
        objective_id=keyresult.objective,
        target_value=keyresult.target_value,
        current_value=keyresult.current_value,
        unit=keyresult.unit,
    )
    db.add(db_keyresult)
    await db.commit()
    await db.refresh(db_keyresult)

    # Reload with objective
    query = select(KeyResult).options(selectinload(KeyResult.objective)).where(KeyResult.id == db_keyresult.id)
    result = await db.execute(query)
    db_keyresult = result.scalar_one()

    return KeyResultResponse.from_orm_with_objective(db_keyresult)


@router.get("/{keyresult_id}/", response_model=KeyResultResponse)
async def get_keyresult(
    keyresult_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(KeyResult)
        .options(selectinload(KeyResult.objective))
        .where(KeyResult.id == keyresult_id)
    )
    result = await db.execute(query)
    keyresult = result.scalar_one_or_none()

    if not keyresult:
        raise HTTPException(status_code=404, detail="KeyResult not found")

    return KeyResultResponse.from_orm_with_objective(keyresult)


@router.put("/{keyresult_id}/", response_model=KeyResultResponse)
async def update_keyresult(
    keyresult_id: int,
    keyresult_update: KeyResultUpdate,
    db: AsyncSession = Depends(get_db),
):
    query = select(KeyResult).options(selectinload(KeyResult.objective)).where(KeyResult.id == keyresult_id)
    result = await db.execute(query)
    keyresult = result.scalar_one_or_none()

    if not keyresult:
        raise HTTPException(status_code=404, detail="KeyResult not found")

    update_data = keyresult_update.model_dump(exclude_unset=True)

    # Handle objective field mapping
    if "objective" in update_data:
        update_data["objective_id"] = update_data.pop("objective")
        # Verify new objective exists
        obj_query = select(Objective).where(Objective.id == update_data["objective_id"])
        obj_result = await db.execute(obj_query)
        if not obj_result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Objective not found")

    for field, value in update_data.items():
        setattr(keyresult, field, value)

    await db.commit()
    await db.refresh(keyresult)

    # Reload with objective
    query = select(KeyResult).options(selectinload(KeyResult.objective)).where(KeyResult.id == keyresult.id)
    result = await db.execute(query)
    keyresult = result.scalar_one()

    return KeyResultResponse.from_orm_with_objective(keyresult)


@router.delete("/{keyresult_id}/", status_code=204)
async def delete_keyresult(
    keyresult_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = select(KeyResult).where(KeyResult.id == keyresult_id)
    result = await db.execute(query)
    keyresult = result.scalar_one_or_none()

    if not keyresult:
        raise HTTPException(status_code=404, detail="KeyResult not found")

    await db.delete(keyresult)
    await db.commit()
    return None
