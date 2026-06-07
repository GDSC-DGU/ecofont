"""HTTP boundary DTOs — 도메인 모델과 분리."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ErrorBody(BaseModel):
    error: str
    message: str


class ConvertAcceptedResponse(BaseModel):
    job_id: str = Field(..., description="Job 식별자")
    status: Literal["pending"] = "pending"
    status_url: str = Field(..., description="폴링용 상대 경로")


class ConvertResultBody(BaseModel):
    ink_saving_rate: float = Field(..., ge=0.0, le=1.0)
    carbon_reduction_g: float = Field(..., ge=0.0)
    download_url: str
    expires_at: datetime
    original_filename: str
    converted_filename: str


class JobProcessingResponse(BaseModel):
    job_id: str
    status: Literal["processing"]
    progress: float = Field(..., ge=0.0, le=1.0)
    stage: str | None = None


class JobDoneResponse(BaseModel):
    job_id: str
    status: Literal["done"]
    result: ConvertResultBody


class JobFailedResponse(BaseModel):
    job_id: str
    status: Literal["failed"]
    error: str
    message: str


class JobPendingResponse(BaseModel):
    job_id: str
    status: Literal["pending"]


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
