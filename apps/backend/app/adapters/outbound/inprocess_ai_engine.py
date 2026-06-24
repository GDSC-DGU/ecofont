"""In-process AI Engine adapter (Q1=A 통합).

⚠️ 우제 Unit 3 미완성 — 현재는 identity transformation (입력 = 출력) placeholder.
Unit 3 ai_engine 패키지 준비되면 `from ai_engine.optimization import optimize_glyphs`
로 교체하고 본 클래스의 optimize 메서드를 그쪽으로 위임.

우제 시작 가이드: `apps/ai-engine/README.md` 참조 (인터페이스·통합 절차 명시).
"""

from __future__ import annotations

import asyncio

from app.domain.models import GlyphData

# TODO: Unit 3 ai_engine 모듈 준비 후 활성화
# from ai_engine.optimization import optimize_glyphs


class InProcessAIEngineAdapter:
    async def optimize(self, glyphs: GlyphData) -> GlyphData:
        # CPU-bound 작업 가정 → 워커 스레드로 위임 (FastAPI 이벤트 루프 차단 방지)
        return await asyncio.to_thread(self._optimize_sync, glyphs)

    @staticmethod
    def _optimize_sync(glyphs: GlyphData) -> GlyphData:
        # TODO: optimize_glyphs(glyphs) 호출로 교체 (우제 Unit 3)
        # 현재는 identity — 잉크 절약률 0 으로 계산됨
        return glyphs
