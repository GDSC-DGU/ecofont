"""GCS asset 저장·서빙 배선 (우제 Cherokee 폰트 생성 API용).

우제 API는 생성 결과물(후보 TTF 20개·zip·manifest·preview PNG)을 응답 본문이 아니라
`/v1/assets/{job_id}/...` 상대경로 URL로 내려준다. 이 파일들을 **어디에 저장하느냐**가
배포 후 동작을 가른다.

왜 로컬 디스크가 아니라 GCS인가:
  Cloud Run은 stateless·multi-instance·ephemeral이다.
  - POST(생성)를 처리한 인스턴스 A의 로컬 디스크에 결과를 쓰면,
    이어지는 GET(다운로드)이 인스턴스 B로 라우팅될 때 파일이 없어 404가 난다.
  - 인스턴스가 idle로 죽으면 디스크도 사라진다.
  → 결과물은 모든 인스턴스가 공유하는 GCS 버킷에 두고, /v1/assets 핸들러가 거기서 읽어 서빙한다.

설계 메모:
  - Signed URL을 쓰지 않는다. 클라이언트 스펙이 `/v1/assets/...` **상대경로**로 고정돼 있어
    (프론트가 API_BASE를 붙임), 절대 URL(Signed URL)로 바꾸면 프론트 계약이 깨진다.
    대신 Cloud Run이 GCS object를 읽어 프록시 서빙한다 → 프론트 변경 0.
  - GCS object key = "{job_id}/{rel_path}". rel_path 는 /v1/assets/{job_id}/ 뒤의 경로 전체
    (예: "font_generation/candidates/candidate_00_source_original.ttf").
  - 1일 자동 삭제는 버킷 Lifecycle 정책(Terraform)에 맡긴다. 코드에서 TTL 관리 안 함.
"""

from __future__ import annotations

import asyncio
import mimetypes

from google.cloud import storage

# 확장자 → Content-Type (스펙상 내려가는 4종 + 폰트 보강).
_CONTENT_TYPES = {
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".png": "image/png",
    ".zip": "application/zip",
    ".json": "application/json",
}

# 모듈 로드만으로 GCP 인증을 시도하지 않도록 lazy 초기화 (로컬·테스트 편의).
_client: storage.Client | None = None


def _get_client() -> storage.Client:
    global _client
    if _client is None:
        _client = storage.Client()
    return _client


def _content_type(rel_path: str) -> str:
    for ext, ct in _CONTENT_TYPES.items():
        if rel_path.endswith(ext):
            return ct
    return mimetypes.guess_type(rel_path)[0] or "application/octet-stream"


async def put_asset(bucket: str, job_id: str, rel_path: str, data: bytes) -> None:
    """생성 결과물 1개를 GCS에 업로드. 우제 코드의 '파일 저장' 자리에서 호출."""
    await asyncio.to_thread(_put_sync, bucket, job_id, rel_path, data)


def _put_sync(bucket: str, job_id: str, rel_path: str, data: bytes) -> None:
    key = f"{job_id}/{rel_path.lstrip('/')}"
    blob = _get_client().bucket(bucket).blob(key)
    blob.upload_from_string(data, content_type=_content_type(rel_path))


async def get_asset(bucket: str, job_id: str, rel_path: str) -> tuple[bytes, str] | None:
    """GCS에서 결과물 1개를 읽어 (bytes, content_type) 반환. 없으면 None.

    `/v1/assets/{job_id}/{rel_path}` 다운로드 핸들러에서 호출.
    NOTE: 후보 zip이 커질 경우 download_as_bytes 대신 blob.open("rb") 스트리밍 고려.
    현재 폰트 결과물은 수 MB 수준이라 단순 bytes 로 충분.
    """
    return await asyncio.to_thread(_get_sync, bucket, job_id, rel_path)


def _get_sync(bucket: str, job_id: str, rel_path: str) -> tuple[bytes, str] | None:
    key = f"{job_id}/{rel_path.lstrip('/')}"
    blob = _get_client().bucket(bucket).blob(key)
    if not blob.exists():
        return None
    return blob.download_as_bytes(), _content_type(rel_path)
