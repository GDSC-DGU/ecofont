"""FastAPI 부트스트랩 — 운영 배선(CORS·로깅·헬스).

우제 Cherokee 폰트 생성 API가 기존 비동기 오케스트레이터를 통째 대체한다.
이 파일은 우제 라우터가 붙기 전의 골격(운영 배선 + /health)이다.
이식 가이드: `apps/backend/INTEGRATION.md`.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.adapters.inbound.http.middleware import request_id_middleware
from app.adapters.inbound.http.routes import router
from app.config import settings
from app.logging_config import configure_logging

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_logging(level=settings.log_level)
    logger.info("startup", asset_bucket=settings.gcs_asset_bucket)
    yield
    logger.info("shutdown_complete")


API_DESCRIPTION = """
업로드한 TTF를 Cherokee 에코폰트 후보로 변환하는 API.

### 변환 흐름 (동기 단일 요청)
1. **`POST /v1/font-generation/ttf`** — `.ttf`를 multipart(`font` 필드)로 업로드.
   서버가 cmap으로 Cherokee 여부를 자동 판정하고, Cherokee면 eco 후보 TTF 20개 + 평균 OCR 점수를
   한 번의 응답(`status:"completed"`)으로 반환한다. (비동기 폴링 없음)
2. 결과 파일(후보 TTF·zip·preview)은 응답의 상대경로 URL `/v1/assets/{job_id}/...`로 다운로드한다.

### 프론트 연동 메모
- 제약: 단일 폰트 ≤ 50MB. 위반/미지원 시 `413`/`422` + `{detail}` 본문.
- CORS: Vercel(프로덕션·preview)·localhost 출처 허용.
- `*_url`은 상대경로 → 프론트가 API_BASE를 붙여 다운로드.
"""

tags_metadata = [
    {"name": "font-generation", "description": "Cherokee 에코폰트 후보 생성"},
    {"name": "assets", "description": "생성 결과물 다운로드 (GCS 프록시 서빙)"},
    {"name": "health", "description": "Cloud Run 헬스 체크 (probe용)"},
]

app = FastAPI(
    title="Eco-Font Backend",
    description=API_DESCRIPTION,
    version="0.3.0",
    lifespan=lifespan,
    openapi_tags=tags_metadata,
    servers=[
        {
            "url": "https://ecofont-backend-pdixgz2hlq-du.a.run.app",
            "description": "Production (Cloud Run)",
        },
        {"url": "http://localhost:8080", "description": "Local 개발"},
    ],
)
app.middleware("http")(request_id_middleware)

# CORS는 가장 바깥에서 동작해야 preflight(OPTIONS)와 에러 응답에도 헤더가 붙는다.
# add_middleware는 마지막에 추가된 것이 최외곽 → request_id_middleware 등록 뒤에 추가.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=settings.cors_allow_origin_regex or None,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=False,  # 쿠키 미사용(다운로드는 상대경로 asset URL) → 자격증명 불필요
    expose_headers=["X-Request-ID"],
    max_age=3600,
)

app.include_router(router)

# TODO(우제): Cherokee 생성 라우터를 여기 include.
#   from app.adapters.inbound.http.font_generation import router as font_router
#   app.include_router(font_router)
# - POST /v1/font-generation/ttf : 50MB 검증(413) + cmap Cherokee 판정(422) + 후보 20 생성 + 응답 조립
# - GET  /v1/assets/{job_id}/{rel_path:path} : gcs_assets.get_asset 로 GCS 프록시 서빙
