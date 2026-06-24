"""AIEnginePort — SSIM 기반 글리프 최적화 추상화 (Q1=A 통합)."""

from __future__ import annotations

from typing import Protocol

from app.domain.models import GlyphData


class AIEnginePort(Protocol):
    async def optimize(self, glyphs: GlyphData) -> GlyphData:
        """글리프 벡터 → 잉크 절약형으로 최적화."""
        ...
