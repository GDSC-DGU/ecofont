"""FastAPI 라우터 — POST /convert, GET /jobs/{id}, GET /health."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated

import structlog
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status

from app.adapters.inbound.http.schemas import (
    ConvertAcceptedResponse,
    ConvertResultBody,
    ErrorBody,
    HealthResponse,
    JobDoneResponse,
    JobFailedResponse,
    JobPendingResponse,
    JobProcessingResponse,
)
from app.application.convert_font import ConvertFontUseCase
from app.config import settings

logger = structlog.get_logger()


def get_use_case(request: Request) -> ConvertFontUseCase:
    return request.app.state.convert_use_case


router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse()


@router.post(
    "/convert",
    response_model=ConvertAcceptedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    responses={
        400: {"model": ErrorBody},
        413: {"model": ErrorBody},
        415: {"model": ErrorBody},
    },
)
async def convert(
    file: Annotated[UploadFile, File(...)],
    use_case: Annotated[ConvertFontUseCase, Depends(get_use_case)],
) -> ConvertAcceptedResponse:
    # 1. 확장자 검증
    filename = file.filename or ""
    if not filename.lower().endswith(".ttf"):
        raise HTTPException(
            status_code=415,
            detail=ErrorBody(
                error="UNSUPPORTED_FILE_TYPE",
                message="TTF 파일만 업로드 가능합니다.",
            ).model_dump(),
        )

    # 2. 본문 읽기 + 크기 검증
    data = await file.read()
    if len(data) == 0:
        raise HTTPException(
            status_code=400,
            detail=ErrorBody(
                error="INVALID_REQUEST", message="파일을 첨부해주세요."
            ).model_dump(),
        )
    if len(data) > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=ErrorBody(
                error="FILE_TOO_LARGE",
                message="파일 크기는 10MB 이하여야 합니다.",
            ).model_dump(),
        )

    job_id = await use_case.start_job(data, Path(filename).name)
    logger.info("convert_accepted", filename=filename, size_bytes=len(data), job_id=job_id)
    return ConvertAcceptedResponse(
        job_id=job_id, status="pending", status_url=f"/jobs/{job_id}"
    )


@router.get(
    "/jobs/{job_id}",
    response_model=(
        JobPendingResponse | JobProcessingResponse | JobDoneResponse | JobFailedResponse
    ),
    responses={404: {"model": ErrorBody}},
)
async def get_job(
    job_id: str,
    use_case: Annotated[ConvertFontUseCase, Depends(get_use_case)],
):
    job = await use_case.get_job(job_id)
    if job is None:
        raise HTTPException(
            status_code=404,
            detail=ErrorBody(
                error="JOB_NOT_FOUND",
                message="존재하지 않거나 만료된 작업입니다.",
            ).model_dump(),
        )

    if job.status == "pending":
        return JobPendingResponse(job_id=job.id, status="pending")
    if job.status == "processing":
        return JobProcessingResponse(
            job_id=job.id,
            status="processing",
            progress=job.progress,
            stage=job.stage,
        )
    if job.status == "done":
        assert job.result is not None
        return JobDoneResponse(
            job_id=job.id,
            status="done",
            result=ConvertResultBody(
                ink_saving_rate=job.result.ink_saving_rate,
                carbon_reduction_g=job.result.carbon_reduction_g,
                download_url=job.result.download_url,
                expires_at=job.result.expires_at,
                original_filename=job.result.original_filename,
                converted_filename=job.result.converted_filename,
            ),
        )
    # status == "failed"
    assert job.error is not None
    return JobFailedResponse(
        job_id=job.id,
        status="failed",
        error=job.error.code,
        message=job.error.message,
    )
