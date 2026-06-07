"""StoragePort — GCS 등 외부 파일 저장소 추상화."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass(frozen=True)
class SignedUrl:
    url: str
    expires_at: datetime


class StoragePort(Protocol):
    async def upload(self, bucket: str, key: str, data: bytes) -> str:
        """객체 업로드 — gs:// URI 반환."""
        ...

    async def signed_url(
        self, bucket: str, key: str, ttl_seconds: int = 86400
    ) -> SignedUrl:
        """V4 Signed URL 생성 (다운로드용)."""
        ...
