"""Error handling middleware for the OKR application."""

import uuid
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError as SQLAlchemyIntegrityError
from sqlalchemy.exc import SQLAlchemyError

from app.core.exceptions import AppException
from app.core.logging import get_logger

logger = get_logger(__name__)


async def error_handler_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    """Global error handling middleware with request correlation.

    Catches and handles:
    - AppException: Custom application errors → structured JSON response
    - SQLAlchemyIntegrityError: Constraint violations → 409 response
    - SQLAlchemyError: Database errors → 500 response
    - Unhandled exceptions: → 500 response with logging

    Adds request_id to all responses for correlation.
    """
    request_id = str(uuid.uuid4())[:8]
    request.state.request_id = request_id

    try:
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

    except AppException as exc:
        logger.warning(
            "Application error | request_id=%s | path=%s | error_code=%s | message=%s",
            request_id,
            request.url.path,
            exc.error_code,
            exc.message,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict(),
            headers={"X-Request-ID": request_id},
        )

    except SQLAlchemyIntegrityError as exc:
        logger.warning(
            "Integrity error | request_id=%s | path=%s | error=%s",
            request_id,
            request.url.path,
            str(exc),
        )
        return JSONResponse(
            status_code=409,
            content={
                "error_code": "INTEGRITY_ERROR",
                "message": "Database integrity constraint violated",
                "details": {"request_id": request_id},
            },
            headers={"X-Request-ID": request_id},
        )

    except SQLAlchemyError as exc:
        logger.exception(
            "Database error | request_id=%s | path=%s | error=%s",
            request_id,
            request.url.path,
            str(exc),
        )
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "DATABASE_ERROR",
                "message": "Database operation failed",
                "details": {"request_id": request_id},
            },
            headers={"X-Request-ID": request_id},
        )

    except Exception as exc:
        logger.exception(
            "Unhandled error | request_id=%s | path=%s | error=%s",
            request_id,
            request.url.path,
            str(exc),
        )
        return JSONResponse(
            status_code=500,
            content={
                "error_code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
                "details": {"request_id": request_id},
            },
            headers={"X-Request-ID": request_id},
        )
