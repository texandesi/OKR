"""Custom exception classes for the OKR application."""

from typing import Any


class AppException(Exception):
    """Base exception for all application errors.

    Attributes:
        message: Human-readable error message.
        error_code: Machine-readable error code for client handling.
        status_code: HTTP status code to return.
        details: Additional context about the error.
    """

    def __init__(
        self,
        message: str,
        error_code: str = "APP_ERROR",
        status_code: int = 500,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

    def to_dict(self) -> dict[str, Any]:
        """Convert exception to dictionary for JSON response."""
        return {
            "error_code": self.error_code,
            "message": self.message,
            "details": self.details,
        }


class NotFoundError(AppException):
    """Resource not found (404)."""

    def __init__(
        self,
        resource: str,
        resource_id: int | str | None = None,
        message: str | None = None,
    ) -> None:
        details = {"resource": resource}
        if resource_id is not None:
            details["id"] = resource_id

        if message is None:
            if resource_id is not None:
                message = f"{resource} with id {resource_id} not found"
            else:
                message = f"{resource} not found"

        super().__init__(
            message=message,
            error_code="NOT_FOUND",
            status_code=404,
            details=details,
        )


class ValidationError(AppException):
    """Validation error (400)."""

    def __init__(
        self,
        message: str,
        field: str | None = None,
        value: Any = None,
    ) -> None:
        details: dict[str, Any] = {}
        if field is not None:
            details["field"] = field
        if value is not None:
            details["value"] = value

        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=400,
            details=details,
        )


class DatabaseError(AppException):
    """Database operation failure (500)."""

    def __init__(
        self,
        message: str = "Database operation failed",
        operation: str | None = None,
    ) -> None:
        details: dict[str, Any] = {}
        if operation is not None:
            details["operation"] = operation

        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=500,
            details=details,
        )


class IntegrityError(AppException):
    """Database constraint violation (409)."""

    def __init__(
        self,
        message: str = "Database integrity constraint violated",
        constraint: str | None = None,
    ) -> None:
        details: dict[str, Any] = {}
        if constraint is not None:
            details["constraint"] = constraint

        super().__init__(
            message=message,
            error_code="INTEGRITY_ERROR",
            status_code=409,
            details=details,
        )


class InvalidFieldError(AppException):
    """Invalid field for ordering or filtering (400)."""

    def __init__(
        self,
        field: str,
        valid_fields: list[str],
        operation: str = "ordering",
    ) -> None:
        message = f"Invalid {operation} field: '{field}'. Valid fields: {', '.join(valid_fields)}"

        super().__init__(
            message=message,
            error_code="INVALID_FIELD",
            status_code=400,
            details={
                "field": field,
                "valid_fields": valid_fields,
                "operation": operation,
            },
        )
