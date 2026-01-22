from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("/", response_model=None)
async def list_roles(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Role)
    count_query = select(func.count()).select_from(Role)

    if name:
        query = query.where(Role.name.ilike(f"%{name}%"))
        count_query = count_query.where(Role.name.ilike(f"%{name}%"))
    if description:
        query = query.where(Role.description.ilike(f"%{description}%"))
        count_query = count_query.where(Role.description.ilike(f"%{description}%"))

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Role, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Role, ordering))
    else:
        query = query.order_by(Role.name)

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    roles = result.scalars().all()

    items = [RoleResponse.model_validate(role) for role in roles]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=RoleResponse, status_code=201)
async def create_role(role: RoleCreate, db: AsyncSession = Depends(get_db)):
    db_role = Role(**role.model_dump())
    db.add(db_role)
    await db.commit()
    await db.refresh(db_role)
    return RoleResponse.model_validate(db_role)


@router.get("/{role_id}/", response_model=RoleResponse)
async def get_role(role_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Role).where(Role.id == role_id)
    result = await db.execute(query)
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return RoleResponse.model_validate(role)


@router.put("/{role_id}/", response_model=RoleResponse)
async def update_role(role_id: int, role_update: RoleUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Role).where(Role.id == role_id)
    result = await db.execute(query)
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    update_data = role_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(role, field, value)

    await db.commit()
    await db.refresh(role)
    return RoleResponse.model_validate(role)


@router.delete("/{role_id}/", status_code=204)
async def delete_role(role_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Role).where(Role.id == role_id)
    result = await db.execute(query)
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    await db.delete(role)
    await db.commit()
    return None
