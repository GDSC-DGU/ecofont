from __future__ import annotations

import unicodedata
from pathlib import Path

from fontTools.ttLib import TTFont

CHEROKEE_RANGES = ((0x13A0, 0x13FF), (0xAB70, 0xABBF))
HANGUL_SYLLABLE_RANGE = (0xAC00, 0xD7A3)


def font_cmap(font_path: str | Path) -> dict[int, str]:
    font = TTFont(str(font_path), lazy=True)
    cmap: dict[int, str] = {}
    for table in font["cmap"].tables:
        cmap.update(table.cmap)
    return cmap


def _count_range(cmap: dict[int, str], ranges: tuple[tuple[int, int], ...]) -> int:
    count = 0
    for start, end in ranges:
        count += sum(1 for codepoint in cmap if start <= codepoint <= end)
    return count


def font_script_counts(font_path: str | Path) -> dict[str, int]:
    cmap = font_cmap(font_path)
    hangul_start, hangul_end = HANGUL_SYLLABLE_RANGE
    return {
        "cherokee": _count_range(cmap, CHEROKEE_RANGES),
        "hangul": sum(1 for codepoint in cmap if hangul_start <= codepoint <= hangul_end),
    }


def detect_font_script(font_path: str | Path) -> str | None:
    counts = font_script_counts(font_path)
    if counts["cherokee"] > 0:
        return "cherokee"
    if counts["hangul"] > 0:
        return "hangul"
    return None


def assigned_cherokee_chars() -> list[str]:
    chars: list[str] = []
    for start, end in CHEROKEE_RANGES:
        for codepoint in range(start, end + 1):
            ch = chr(codepoint)
            try:
                name = unicodedata.name(ch)
            except ValueError:
                continue
            if name.startswith("CHEROKEE "):
                chars.append(ch)
    return chars


def present_cherokee_chars(font_path: str | Path) -> tuple[list[str], list[str]]:
    cmap = font_cmap(font_path)
    requested = assigned_cherokee_chars()
    present = [ch for ch in requested if ord(ch) in cmap]
    missing = [ch for ch in requested if ord(ch) not in cmap]
    return present, missing
