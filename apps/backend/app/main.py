"""FastAPI 부트스트랩 — DI 와이어링 + 라이프사이클."""

from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

import structlog
from fastapi import FastAPI

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
app.include_router(router)
