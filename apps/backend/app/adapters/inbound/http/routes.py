"""FastAPI 라우터 — GET /health.

우제 Cherokee 생성 라우터(`POST /v1/font-generation/ttf`, `GET /v1/assets/{job_id}/{path}`)는
이식 시 별도 라우터로 추가하고 `app/main.py`에서 include 한다.
GCS 배선은 `app/adapters/outbound/gcs_assets.py`의 put_asset/get_asset 사용. (가이드: apps/backend/INTEGRATION.md)
"""

from __future__ import annotations

from fastapi import APIRouter

from app.adapters.inbound.http.schemas import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    tags=["health"],
    summary="헬스 체크",
    description='항상 `{"status": "ok"}` 반환. Cloud Run startup/liveness probe가 사용.',
)
def health() -> HealthResponse:
    return HealthResponse()
