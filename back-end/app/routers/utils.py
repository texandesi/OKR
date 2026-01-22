from typing import Any

from fastapi import Request
from pydantic import BaseModel

from app.config import settings


def build_pagination_urls(
    request: Request,
    page: int,
    page_size: int,
    total_count: int,
) -> tuple[str | None, str | None]:
    """Build next and previous pagination URLs."""
    base_url = str(request.url).split("?")[0]

    # Preserve existing query params except page
    params = dict(request.query_params)

    total_pages = (total_count + page_size - 1) // page_size if page_size > 0 else 1

    # Build next URL
    next_url = None
    if page < total_pages:
        params["page"] = str(page + 1)
        params["page_size"] = str(page_size)
        next_url = f"{base_url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"

    # Build previous URL
    previous_url = None
    if page > 1:
        params["page"] = str(page - 1)
        params["page_size"] = str(page_size)
        previous_url = f"{base_url}?{'&'.join(f'{k}={v}' for k, v in params.items())}"

    return next_url, previous_url


def serialize_item(item: Any) -> Any:
    """Serialize item, using aliases if it's a Pydantic model."""
    if isinstance(item, BaseModel):
        return item.model_dump(by_alias=True)
    return item


def paginate_response(
    request: Request,
    items: list[Any],
    total_count: int,
    page: int,
    page_size: int,
) -> dict[str, Any]:
    """Build a paginated response matching Django REST Framework format."""
    next_url, previous_url = build_pagination_urls(request, page, page_size, total_count)

    # Serialize items with aliases
    serialized_items = [serialize_item(item) for item in items]

    return {
        "count": total_count,
        "next": next_url,
        "previous": previous_url,
        "results": serialized_items,
    }
