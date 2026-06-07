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


settings = Settings()
