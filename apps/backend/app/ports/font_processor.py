"""FontProcessorPort — TTF 파싱·재생성 추상화."""

from __future__ import annotations

from typing import Protocol

from app.domain.models import GlyphData


class FontProcessorPort(Protocol):
    def extract_glyphs(self, ttf_bytes: bytes) -> GlyphData:
        """TTF 바이너리 → 글리프 벡터."""
        ...

    def rebuild_ttf(self, original_ttf: bytes, optimized: GlyphData) -> bytes:
        """원본 TTF + 최적화된 글리프 → 새 TTF 바이너리."""
        ...
