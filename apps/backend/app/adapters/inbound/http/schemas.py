"""HTTP boundary DTOs — 도메인 모델과 분리."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ErrorBody(BaseModel):
    error: str = Field(..., description="에러 코드(상수)", examples=["FILE_TOO_LARGE"])
    message: str = Field(
        ..., description="사용자 표시용 메시지", examples=["파일 크기는 10MB 이하여야 합니다."]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {"error": "FILE_TOO_LARGE", "message": "파일 크기는 10MB 이하여야 합니다."}
        }
    )


class ConvertAcceptedResponse(BaseModel):
    job_id: str = Field(..., description="Job 식별자", examples=["a1b2c3d4"])
    status: Literal["pending"] = "pending"
    status_url: str = Field(..., description="폴링용 상대 경로", examples=["/jobs/a1b2c3d4"])

    model_config = ConfigDict(
        json_schema_extra={
            "example": {"job_id": "a1b2c3d4", "status": "pending", "status_url": "/jobs/a1b2c3d4"}
        }
    )


class ConvertResultBody(BaseModel):
    ink_saving_rate: float = Field(
        ..., ge=0.0, le=1.0, description="잉크 절약률 (0~1)", examples=[0.31]
    )
    carbon_reduction_g: float = Field(..., ge=0.0, description="탄소 절감량 (g)", examples=[16.4])
    download_url: str = Field(..., description="변환 TTF 다운로드용 GCS Signed URL (24h 유효)")
    expires_at: datetime = Field(..., description="download_url 만료 시각 (UTC)")
    original_filename: str = Field(..., description="업로드 원본 파일명", examples=["MyFont.ttf"])
    converted_filename: str = Field(
        ..., description="변환 결과 파일명", examples=["MyFont_eco.ttf"]
    )


class JobPendingResponse(BaseModel):
    job_id: str
    status: Literal["pending"]

    model_config = ConfigDict(
        json_schema_extra={"example": {"job_id": "a1b2c3d4", "status": "pending"}}
    )


class JobProcessingResponse(BaseModel):
    job_id: str
    status: Literal["processing"]
    progress: float = Field(..., ge=0.0, le=1.0, description="진행률 (0~1)", examples=[0.4])
    stage: str | None = Field(
        None,
        description="현재 단계: uploading/parsing/optimizing/finalizing",
        examples=["optimizing"],
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "a1b2c3d4",
                "status": "processing",
                "progress": 0.4,
                "stage": "optimizing",
            }
        }
    )


class JobDoneResponse(BaseModel):
    job_id: str
    status: Literal["done"]
    result: ConvertResultBody

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "a1b2c3d4",
                "status": "done",
                "result": {
                    "ink_saving_rate": 0.31,
                    "carbon_reduction_g": 16.4,
                    "download_url": "https://storage.googleapis.com/ecofont-re-ecofont-output/a1b2c3d4.ttf?X-Goog-Signature=...",
                    "expires_at": "2026-06-25T10:00:00Z",
                    "original_filename": "MyFont.ttf",
                    "converted_filename": "MyFont_eco.ttf",
                },
            }
        }
    )


class JobFailedResponse(BaseModel):
    job_id: str
    status: Literal["failed"]
    error: str = Field(..., description="에러 코드", examples=["CONVERSION_FAILED"])
    message: str = Field(
        ..., description="사용자 표시용 메시지", examples=["변환 중 오류가 발생했습니다."]
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "a1b2c3d4",
                "status": "failed",
                "error": "CONVERSION_FAILED",
                "message": "변환 중 오류가 발생했습니다.",
            }
        }
    )


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
