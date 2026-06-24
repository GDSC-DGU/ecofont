"""FastAPI 부트스트랩 — DI 와이어링 + 라이프사이클."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.adapters.inbound.http.middleware import request_id_middleware
from app.adapters.inbound.http.routes import router
from app.adapters.outbound.fonttools_processor import FontToolsProcessorAdapter
from app.adapters.outbound.gcs_storage import GcsStorageAdapter
from app.adapters.outbound.inprocess_ai_engine import InProcessAIEngineAdapter
from app.adapters.outbound.memory_job_store import MemoryJobStoreAdapter
from app.application.convert_font import ConvertFontUseCase
from app.config import settings
from app.domain.models import ErrorInfo
from app.logging_config import configure_logging

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_logging(level=settings.log_level)
    logger.info(
        "startup",
        input_bucket=settings.gcs_input_bucket,
        output_bucket=settings.gcs_output_bucket,
    )

    job_store = MemoryJobStoreAdapter()
    use_case = ConvertFontUseCase(
        storage=GcsStorageAdapter(),
        ai_engine=InProcessAIEngineAdapter(),
        font_processor=FontToolsProcessorAdapter(),
        job_store=job_store,
        input_bucket=settings.gcs_input_bucket,
        output_bucket=settings.gcs_output_bucket,
        signed_url_ttl_seconds=settings.signed_url_ttl_seconds,
    )
    app.state.convert_use_case = use_case
    app.state.job_store = job_store

    yield

    # Graceful shutdown — in-flight Job들을 failed 마킹 (NFR-U2-REL-5)
    processing = await job_store.list_processing()
    for job in processing:
        await job_store.update(
            job.id,
            status="failed",
            stage=None,
            error=ErrorInfo(
                code="SERVICE_UNAVAILABLE",
                stage=job.stage,
                message="서비스가 재시작되어 작업이 중단되었습니다.",
            ),
        )
    if processing:
        logger.warning("shutdown_aborted_jobs", count=len(processing))
    logger.info("shutdown_complete")


app = FastAPI(
    title="Eco-Font Backend",
    description="TTF 폰트를 잉크 절약형 에코폰트로 변환하는 API",
    version="0.1.0",
    lifespan=lifespan,
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
    allow_credentials=False,  # 쿠키 미사용(다운로드는 GCS Signed URL) → 자격증명 불필요
    expose_headers=["X-Request-ID"],
    max_age=3600,
)

app.include_router(router)
