from __future__ import annotations

import uuid
from pathlib import Path
from typing import Annotated

import structlog
from fastapi import APIRouter, File, HTTPException, Response, UploadFile, status
from fontTools.ttLib import TTLibError

from app.adapters.outbound.gcs_assets import get_asset
from app.ai.font_generation import UnsupportedScriptError, generate_cherokee_candidates
from app.config import settings

logger = structlog.get_logger()
router = APIRouter()


def _validate_asset_path(rel_path: str) -> None:
    parts = Path(rel_path).parts
    if rel_path.startswith("/") or ".." in parts:
        raise HTTPException(status_code=400, detail="invalid asset path")


@router.post(
    "/v1/font-generation/ttf",
    tags=["font-generation"],
    summary="Cherokee 에코폰트 후보 생성",
    description=(
        "TTF/TrueType glyf 기반 OTF 파일 1개를 multipart `font` 필드로 업로드한다. "
        "서버가 cmap으로 Cherokee 여부를 자동 판정하고 후보 TTF 20개와 평균 OCR 점수를 반환한다."
    ),
)
async def generate_font_candidates(font: Annotated[UploadFile, File(...)]) -> dict:
    filename = Path(font.filename or "input.ttf").name
    suffix = Path(filename).suffix.lower()
    if suffix not in {".ttf", ".otf"}:
        raise HTTPException(status_code=422, detail="font upload must be a .ttf or .otf file")

    data = await font.read()
    if not data:
        raise HTTPException(status_code=422, detail="uploaded font is empty")
    if len(data) > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="uploaded font is too large",
        )

    job_id = uuid.uuid4().hex
    logger.info("font_generation_started", job_id=job_id, filename=filename, size_bytes=len(data))
    try:
        result = await generate_cherokee_candidates(
            bucket=settings.gcs_asset_bucket,
            job_id=job_id,
            font_bytes=data,
            filename=filename,
        )
    except UnsupportedScriptError as exc:
        raise HTTPException(status_code=422, detail=exc.detail) from exc
    except (TTLibError, ValueError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    logger.info(
        "font_generation_completed",
        job_id=job_id,
        candidates=len(result.get("candidates", [])),
        covered_glyphs=result.get("coverage", {}).get("covered_glyphs"),
    )
    return result


@router.get(
    "/v1/assets/{job_id}/{rel_path:path}",
    tags=["assets"],
    summary="생성 결과물 다운로드",
    description="GCS에 저장된 후보 TTF·preview·manifest·zip을 상대경로 URL로 프록시 서빙한다.",
)
async def download_asset(job_id: str, rel_path: str) -> Response:
    _validate_asset_path(rel_path)
    result = await get_asset(settings.gcs_asset_bucket, job_id, rel_path)
    if result is None:
        raise HTTPException(status_code=404, detail="asset not found or expired")
    data, content_type = result
    return Response(content=data, media_type=content_type)
