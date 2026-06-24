"""환경변수 기반 설정 — Pydantic Settings."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    gcs_input_bucket: str = "ecofont-input"
    gcs_output_bucket: str = "ecofont-output"
    signed_url_ttl_seconds: int = 86400
    max_file_size_bytes: int = 10 * 1024 * 1024
    port: int = 8080
    log_level: str = "INFO"

    # CORS — 브라우저(Vercel 프론트)가 교차 출처로 /convert·/jobs 호출 허용.
    # 콤마 구분 문자열(JSON 파싱 이슈 회피). 정규식은 Vercel preview 배포 도메인 대응.
    cors_allow_origins: str = "http://localhost:3000,https://ecofont.vercel.app"
    cors_allow_origin_regex: str = r"https://.*\.vercel\.app"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_allow_origins.split(",") if o.strip()]


settings = Settings()
