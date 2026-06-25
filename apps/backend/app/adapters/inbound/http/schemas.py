"""HTTP boundary DTOs.

우제 Cherokee 생성 API의 요청/응답 스키마는 이식 시 여기(또는 별도 모듈)에 추가한다.
계약 전문: `apps/backend/INTEGRATION.md` §7.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
