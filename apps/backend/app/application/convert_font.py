"""ConvertFontUseCase — POST /convert 및 GET /jobs/{id} 의 비즈니스 로직 오케스트레이션."""

from __future__ import annotations

import asyncio
from pathlib import Path

import structlog

from app.domain import metrics_calculator
from app.domain.models import ConvertResult, ErrorInfo, Job
from app.ports.ai_engine import AIEnginePort
from app.ports.font_processor import FontProcessorPort
from app.ports.job_store import JobStorePort
from app.ports.storage import StoragePort

logger = structlog.get_logger()


class ConvertFontUseCase:
    def __init__(
        self,
        storage: StoragePort,
        ai_engine: AIEnginePort,
        font_processor: FontProcessorPort,
        job_store: JobStorePort,
        input_bucket: str,
        output_bucket: str,
        signed_url_ttl_seconds: int,
    ) -> None:
        self._storage = storage
        self._ai_engine = ai_engine
        self._font_processor = font_processor
        self._job_store = job_store
        self._input_bucket = input_bucket
        self._output_bucket = output_bucket
        self._signed_url_ttl = signed_url_ttl_seconds

    async def start_job(self, file_bytes: bytes, filename: str) -> str:
        job = await self._job_store.create()
        logger.info("job_started", job_id=job.id, filename=filename)
        asyncio.create_task(self._run_conversion(job.id, file_bytes, filename))
        return job.id

    async def get_job(self, job_id: str) -> Job | None:
        return await self._job_store.get(job_id)

    async def _run_conversion(self, job_id: str, file_bytes: bytes, filename: str) -> None:
        structlog.contextvars.bind_contextvars(job_id=job_id)
        try:
            await self._job_store.update(job_id, status="processing", stage="uploading")
            logger.info("stage_started", stage="uploading")
            key = f"{job_id}.ttf"
            await self._storage.upload(self._input_bucket, key, file_bytes)

            await self._job_store.update(job_id, stage="parsing", progress=0.2)
            logger.info("stage_started", stage="parsing")
            try:
                original_glyphs = self._font_processor.extract_glyphs(file_bytes)
            except ValueError as e:
                await self._fail(job_id, "INVALID_TTF", "parsing", "올바른 TTF 파일이 아닙니다.")
                logger.warning("parsing_failed", error=str(e))
                return

            await self._job_store.update(job_id, stage="optimizing", progress=0.4)
            logger.info("stage_started", stage="optimizing")
            try:
                optimized = await self._ai_engine.optimize(original_glyphs)
            except Exception as e:
                await self._fail(
                    job_id, "CONVERSION_FAILED", "optimizing", "변환 중 오류가 발생했습니다."
                )
                logger.exception("optimization_failed", error=str(e))
                return

            await self._job_store.update(job_id, stage="finalizing", progress=0.8)
            logger.info("stage_started", stage="finalizing")
            converted_bytes = self._font_processor.rebuild_ttf(file_bytes, optimized)
            await self._storage.upload(self._output_bucket, key, converted_bytes)

            metrics = metrics_calculator.calculate(original_glyphs, optimized)
            signed = await self._storage.signed_url(
                self._output_bucket, key, self._signed_url_ttl
            )

            stem = Path(filename).stem
            result = ConvertResult(
                ink_saving_rate=metrics.ink_saving_rate,
                carbon_reduction_g=metrics.carbon_reduction_g,
                download_url=signed.url,
                expires_at=signed.expires_at,
                original_filename=filename,
                converted_filename=f"{stem}_eco.ttf",
            )
            await self._job_store.update(
                job_id, status="done", stage=None, progress=1.0, result=result
            )
            logger.info(
                "job_done",
                ink_saving_rate=metrics.ink_saving_rate,
                carbon_reduction_g=metrics.carbon_reduction_g,
            )
        except Exception as e:
            await self._fail(
                job_id, "SERVICE_UNAVAILABLE", None, "일시적인 오류입니다. 다시 시도해주세요."
            )
            logger.exception("job_failed_unexpected", error=str(e))
        finally:
            structlog.contextvars.unbind_contextvars("job_id")

    async def _fail(
        self, job_id: str, code: str, stage: str | None, message: str
    ) -> None:
        await self._job_store.update(
            job_id,
            status="failed",
            stage=None,
            error=ErrorInfo(code=code, stage=stage, message=message),
        )
