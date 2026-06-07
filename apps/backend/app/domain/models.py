"""Domain models — 외부 의존 없는 순수 도메인 객체."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal

JobStatus = Literal["pending", "processing", "done", "failed"]
JobStage = Literal["uploading", "parsing", "optimizing", "finalizing"]


@dataclass(frozen=True)
class Contour:
    """단일 글리프 외곽선 — 좌표 리스트 + 끝 인덱스."""

    coordinates: tuple[tuple[float, float], ...]
    end_indices: tuple[int, ...]


@dataclass(frozen=True)
class GlyphData:
    """TTF에서 추출된 글리프 벡터 컬렉션."""

    glyphs: dict[str, tuple[Contour, ...]]  # glyph name → contours
    units_per_em: int


@dataclass(frozen=True)
class ConversionMetrics:
    """변환 결과 지표."""

    ink_saving_rate: float  # 0.0 ~ 1.0, 산출 방법 TBD (Open-1)
    carbon_reduction_g: float  # g 단위, 산출 방법 TBD (Open-2)


@dataclass(frozen=True)
class ErrorInfo:
    code: str
    stage: str | None
    message: str


@dataclass(frozen=True)
class ConvertResult:
    ink_saving_rate: float
    carbon_reduction_g: float
    download_url: str
    expires_at: datetime
    original_filename: str
    converted_filename: str


@dataclass
class Job:
    id: str
    status: JobStatus = "pending"
    stage: JobStage | None = None
    progress: float = 0.0
    result: ConvertResult | None = None
    error: ErrorInfo | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
