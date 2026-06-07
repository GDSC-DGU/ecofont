"""잉크 절약률·탄소 저감량 산출 (도메인 서비스).

⚠️ Open-1, Open-2: 산출 방법 미확정 — 본 모듈은 placeholder 구현.
실제 산출식은 Code Generation 이후 우제와 협의하여 확정 예정.
"""

from __future__ import annotations

from app.domain.models import ConversionMetrics, GlyphData

# TODO Open-2: CO2 환산 계수 — 논문/보고서 근거로 확정 필요
# 현재값은 placeholder (잉크 1ml 당 약 0.005g CO2 가정)
_CARBON_PLACEHOLDER_FACTOR = 0.005  # g CO2 / 가상 잉크 단위
_VOLUME_PLACEHOLDER = 100.0  # 단일 폰트당 사용량 가상 단위


def calculate(original: GlyphData, optimized: GlyphData) -> ConversionMetrics:
    """원본 vs 최적화 글리프 비교 → 잉크 절약률·탄소 저감량 산출."""
    ink_saving_rate = _estimate_ink_saving_rate(original, optimized)
    carbon_reduction_g = _estimate_carbon_reduction(ink_saving_rate)
    return ConversionMetrics(
        ink_saving_rate=ink_saving_rate,
        carbon_reduction_g=carbon_reduction_g,
    )


def _estimate_ink_saving_rate(original: GlyphData, optimized: GlyphData) -> float:
    """TODO Open-1: 산출 방법 미확정 — 임시 좌표 수 기반 비율 사용."""
    original_points = _total_point_count(original)
    optimized_points = _total_point_count(optimized)
    if original_points == 0:
        return 0.0
    saving = max(0, original_points - optimized_points) / original_points
    return min(1.0, saving)


def _estimate_carbon_reduction(ink_saving_rate: float) -> float:
    """TODO Open-2: 잉크량 → CO2 변환 공식 확정 후 교체."""
    saved_ink = ink_saving_rate * _VOLUME_PLACEHOLDER
    return saved_ink * _CARBON_PLACEHOLDER_FACTOR


def _total_point_count(data: GlyphData) -> int:
    return sum(
        len(contour.coordinates)
        for contours in data.glyphs.values()
        for contour in contours
    )
