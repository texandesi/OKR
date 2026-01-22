from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from app.routers.utils import paginate_response
from app.config import settings

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.get("/", response_model=None)
async def list_organizations(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(settings.default_page_size, ge=1, le=settings.max_page_size),
    ordering: str | None = Query(None),
    name: str | None = Query(None),
    description: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Organization)
    count_query = select(func.count()).select_from(Organization)

    if name:
        query = query.where(Organization.name.ilike(f"%{name}%"))
        count_query = count_query.where(Organization.name.ilike(f"%{name}%"))
    if description:
        query = query.where(Organization.description.ilike(f"%{description}%"))
        count_query = count_query.where(Organization.description.ilike(f"%{description}%"))

    if ordering:
        if ordering.startswith("-"):
            query = query.order_by(getattr(Organization, ordering[1:]).desc())
        else:
            query = query.order_by(getattr(Organization, ordering))
    else:
        query = query.order_by(Organization.name)

    total_count = await db.scalar(count_query)

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    organizations = result.scalars().all()

    items = [OrganizationResponse.model_validate(org) for org in organizations]
    return paginate_response(request, items, total_count, page, page_size)


@router.post("/", response_model=OrganizationResponse, status_code=201)
async def create_organization(organization: OrganizationCreate, db: AsyncSession = Depends(get_db)):
    db_organization = Organization(**organization.model_dump())
    db.add(db_organization)
    await db.commit()
    await db.refresh(db_organization)
    return OrganizationResponse.model_validate(db_organization)


@router.get("/{organization_id}/", response_model=OrganizationResponse)
async def get_organization(organization_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Organization).where(Organization.id == organization_id)
    result = await db.execute(query)
    organization = result.scalar_one_or_none()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    return OrganizationResponse.model_validate(organization)


@router.put("/{organization_id}/", response_model=OrganizationResponse)
async def update_organization(organization_id: int, organization_update: OrganizationUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Organization).where(Organization.id == organization_id)
    result = await db.execute(query)
    organization = result.scalar_one_or_none()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    update_data = organization_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(organization, field, value)

    await db.commit()
    await db.refresh(organization)
    return OrganizationResponse.model_validate(organization)


@router.delete("/{organization_id}/", status_code=204)
async def delete_organization(organization_id: int, db: AsyncSession = Depends(get_db)):
    query = select(Organization).where(Organization.id == organization_id)
    result = await db.execute(query)
    organization = result.scalar_one_or_none()
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    await db.delete(organization)
    await db.commit()
    return None
