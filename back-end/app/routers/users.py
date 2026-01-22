from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=None)
async def list_users(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(User)
    count_query = select(func.count()).select_from(User)

    if name:
        query = query.where(User.name.ilike(f"%{name}%"))
        count_query = count_query.where(User.name.ilike(f"%{name}%"))
    if description:
        query = query.where(User.description.ilike(f"%{description}%"))
        count_query = count_query.where(User.description.ilike(f"%{description}%"))

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(User, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(User, ordering))
    else:
        query = query.order_by(User.name)

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    users = result.scalars().all()

    items = [UserResponse.model_validate(user) for user in users]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return UserResponse.model_validate(db_user)


@router.get("/{user_id}/", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


@router.put("/{user_id}/", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return UserResponse.model_validate(user)


@router.delete("/{user_id}/", status_code=204)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(user)
    await db.commit()
    return None
