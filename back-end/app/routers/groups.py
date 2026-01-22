from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.group import Group
from app.schemas.group import GroupCreate, GroupUpdate, GroupResponse
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/groups", tags=["groups"])


@router.get("/", response_model=None)
async def list_groups(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Group)
    count_query = select(func.count()).select_from(Group)

    if name:
        query = query.where(Group.name.ilike(f"%{name}%"))
        count_query = count_query.where(Group.name.ilike(f"%{name}%"))
    if description:
        query = query.where(Group.description.ilike(f"%{description}%"))
        count_query = count_query.where(Group.description.ilike(f"%{description}%"))

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Group, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Group, ordering))
    else:
        query = query.order_by(Group.name)

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    groups = result.scalars().all()

    items = [GroupResponse.model_validate(group) for group in groups]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=GroupResponse, status_code=201)
async def create_group(group: GroupCreate, db: AsyncSession = Depends(get_db)):
    db_group = Group(**group.model_dump())
    db.add(db_group)
    await db.commit()
    await db.refresh(db_group)
    return GroupResponse.model_validate(db_group)


@router.get("/{group_id}/", response_model=GroupResponse)
async def get_group(group_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Group).where(Group.id == group_id)
    result = await db.execute(query)
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return GroupResponse.model_validate(group)


@router.put("/{group_id}/", response_model=GroupResponse)
async def update_group(group_id: int, group_update: GroupUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Group).where(Group.id == group_id)
    result = await db.execute(query)
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    update_data = group_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(group, field, value)

    await db.commit()
    await db.refresh(group)
    return GroupResponse.model_validate(group)


@router.delete("/{group_id}/", status_code=204)
async def delete_group(group_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Group).where(Group.id == group_id)
    result = await db.execute(query)
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    await db.delete(group)
    await db.commit()
    return None
