"""FontTools 기반 TTF 파싱·재생성 어댑터."""

from __future__ import annotations

import io

from fontTools.ttLib import TTFont, TTLibError

from app.domain.models import Contour, GlyphData


class FontToolsProcessorAdapter:
    def extract_glyphs(self, ttf_bytes: bytes) -> GlyphData:
        try:
            font = TTFont(io.BytesIO(ttf_bytes))
        except TTLibError as e:
            raise ValueError(f"Invalid TTF file: {e}") from e

        units_per_em = int(font["head"].unitsPerEm)
        glyf = font.get("glyf")
        if glyf is None:
            raise ValueError("TTF 파일에 'glyf' 테이블이 없습니다 (CFF 폰트 미지원).")

        glyph_names = font.getGlyphOrder()
        result: dict[str, tuple[Contour, ...]] = {}

        for name in glyph_names:
            glyph = glyf[name]
            if glyph.isComposite() or glyph.numberOfContours <= 0:
                # 합성 글리프와 빈 글리프는 본 단계 미처리 — 원본 그대로
                continue
            coords = glyph.coordinates
            end_pts = glyph.endPtsOfContours
            contours: list[Contour] = []
            start = 0
            for end in end_pts:
                slice_coords = tuple(
                    (float(coords[i][0]), float(coords[i][1])) for i in range(start, end + 1)
                )
                contours.append(
                    Contour(coordinates=slice_coords, end_indices=(end - start,))
                )
                start = end + 1
            result[name] = tuple(contours)

        return GlyphData(glyphs=result, units_per_em=units_per_em)

    def rebuild_ttf(self, original_ttf: bytes, optimized: GlyphData) -> bytes:
        font = TTFont(io.BytesIO(original_ttf))
        glyf = font.get("glyf")
        if glyf is None:
            raise ValueError("rebuild_ttf: 'glyf' 테이블 누락.")

        for name, contours in optimized.glyphs.items():
            try:
                glyph = glyf[name]
            except KeyError:
                continue
            if glyph.isComposite() or glyph.numberOfContours <= 0:
                continue
            new_coords: list[tuple[float, float]] = []
            for contour in contours:
                new_coords.extend(contour.coordinates)
            # NOTE: FontTools는 GlyphCoordinates 객체를 기대하지만 list[tuple]도 setattr 가능.
            # 본 어댑터는 식별성 우선 — 좌표 갱신만 수행.
            from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates

            glyph.coordinates = GlyphCoordinates(new_coords)

        buf = io.BytesIO()
        font.save(buf)
        return buf.getvalue()
