"""Error response schemas for the OKR application."""

from typing import Any

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standard error response format."""

    error_code: str = Field(description="Machine-readable error code")
    message: str = Field(description="Human-readable error message")
    details: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional context about the error",
    )


class ValidationErrorDetail(BaseModel):
    """Detail for a single validation error."""

    field: str = Field(description="Field that failed validation")
    message: str = Field(description="Validation error message")
    value: Any = Field(default=None, description="Value that failed validation")


class ValidationErrorResponse(BaseModel):
    """Response for multiple validation errors."""

    error_code: str = Field(default="VALIDATION_ERROR")
    message: str = Field(default="Validation failed")
    details: dict[str, Any] = Field(default_factory=dict)
    errors: list[ValidationErrorDetail] = Field(
        default_factory=list,
        description="List of validation errors",
    )
