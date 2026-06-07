"""JobStorePort — Job 상태 저장소 추상화 (Q2=B 비동기 폴링용)."""

from __future__ import annotations

from typing import Any, Protocol

from app.domain.models import Job


class JobStorePort(Protocol):
    async def create(self) -> Job:
        """새 Job 생성 + 저장."""
        ...

    async def get(self, job_id: str) -> Job | None:
        """Job 조회 — 없으면 None."""
        ...

    async def update(self, job_id: str, **fields: Any) -> None:
        """Job 필드 부분 업데이트."""
        ...

    async def list_processing(self) -> list[Job]:
        """현재 processing 상태인 Job 목록 (SIGTERM 처리용)."""
        ...
