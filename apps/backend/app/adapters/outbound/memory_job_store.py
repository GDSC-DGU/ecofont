"""In-memory JobStore — dict + asyncio.Lock (Q2=B, max_instances=1 전제)."""

from __future__ import annotations

import asyncio
import uuid
from dataclasses import replace
from typing import Any

from app.domain.models import Job


class MemoryJobStoreAdapter:
    def __init__(self) -> None:
        self._jobs: dict[str, Job] = {}
        self._lock = asyncio.Lock()

    async def create(self) -> Job:
        async with self._lock:
            job = Job(id=uuid.uuid4().hex)
            self._jobs[job.id] = job
            return job

    async def get(self, job_id: str) -> Job | None:
        async with self._lock:
            return self._jobs.get(job_id)

    async def update(self, job_id: str, **fields: Any) -> None:
        async with self._lock:
            existing = self._jobs.get(job_id)
            if existing is None:
                return
            self._jobs[job_id] = replace(existing, **fields)

    async def list_processing(self) -> list[Job]:
        async with self._lock:
            return [j for j in self._jobs.values() if j.status == "processing"]
