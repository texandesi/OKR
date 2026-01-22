from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.kpi import Kpi
from app.schemas.kpi import KpiCreate, KpiUpdate, KpiResponse
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/kpis", tags=["kpis"])


@router.get("/", response_model=None)
async def list_kpis(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Kpi)
    count_query = select(func.count()).select_from(Kpi)

    if name:
        query = query.where(Kpi.name.ilike(f"%{name}%"))
        count_query = count_query.where(Kpi.name.ilike(f"%{name}%"))
    if description:
        query = query.where(Kpi.description.ilike(f"%{description}%"))
        count_query = count_query.where(Kpi.description.ilike(f"%{description}%"))

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Kpi, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Kpi, ordering))
    else:
        query = query.order_by(Kpi.name)

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    kpis = result.scalars().all()

    items = [KpiResponse.model_validate(kpi) for kpi in kpis]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=KpiResponse, status_code=201)
async def create_kpi(kpi: KpiCreate, db: AsyncSession = Depends(get_db)):
    db_kpi = Kpi(**kpi.model_dump())
    db.add(db_kpi)
    await db.commit()
    await db.refresh(db_kpi)
    return KpiResponse.model_validate(db_kpi)


@router.get("/{kpi_id}/", response_model=KpiResponse)
async def get_kpi(kpi_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Kpi).where(Kpi.id == kpi_id)
    result = await db.execute(query)
    kpi = result.scalar_one_or_none()
    if not kpi:
        raise HTTPException(status_code=404, detail="Kpi not found")
    return KpiResponse.model_validate(kpi)


@router.put("/{kpi_id}/", response_model=KpiResponse)
async def update_kpi(kpi_id: int, kpi_update: KpiUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Kpi).where(Kpi.id == kpi_id)
    result = await db.execute(query)
    kpi = result.scalar_one_or_none()
    if not kpi:
        raise HTTPException(status_code=404, detail="Kpi not found")

    update_data = kpi_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(kpi, field, value)

    await db.commit()
    await db.refresh(kpi)
    return KpiResponse.model_validate(kpi)


@router.delete("/{kpi_id}/", status_code=204)
async def delete_kpi(kpi_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Kpi).where(Kpi.id == kpi_id)
    result = await db.execute(query)
    kpi = result.scalar_one_or_none()
    if not kpi:
        raise HTTPException(status_code=404, detail="Kpi not found")
    await db.delete(kpi)
    await db.commit()
    return None
