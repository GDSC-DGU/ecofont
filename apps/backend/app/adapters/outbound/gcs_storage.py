"""GCS Storage adapter — async wrapping + V4 Signed URL (SA self-impersonation)."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone

import google.auth
import google.auth.transport.requests
from google.cloud import storage

from app.ports.storage import SignedUrl


class GcsStorageAdapter:
    def __init__(self) -> None:
        self._client = storage.Client()

    async def upload(self, bucket: str, key: str, data: bytes) -> str:
        await asyncio.to_thread(self._upload_sync, bucket, key, data)
        return f"gs://{bucket}/{key}"

    def _upload_sync(self, bucket: str, key: str, data: bytes) -> None:
        blob = self._client.bucket(bucket).blob(key)
        blob.upload_from_string(data, content_type="font/ttf")

    async def signed_url(
        self, bucket: str, key: str, ttl_seconds: int = 86400
    ) -> SignedUrl:
        return await asyncio.to_thread(self._signed_url_sync, bucket, key, ttl_seconds)

    def _signed_url_sync(self, bucket: str, key: str, ttl_seconds: int) -> SignedUrl:
        credentials, _ = google.auth.default(
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        # Cloud Run SA → 자신을 impersonate (NFR Design §5, INFRA-7).
        # 키 파일 없이 V4 Signed URL 발급.
        request = google.auth.transport.requests.Request()
        credentials.refresh(request)

        blob = self._client.bucket(bucket).blob(key)
        sa_email = getattr(credentials, "service_account_email", None)
        access_token = getattr(credentials, "token", None)

        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(seconds=ttl_seconds),
            method="GET",
            service_account_email=sa_email,
            access_token=access_token,
        )
        return SignedUrl(
            url=url,
            expires_at=datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds),
        )
