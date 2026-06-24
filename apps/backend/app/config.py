"""환경변수 기반 설정 — Pydantic Settings."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # 생성 결과물(후보 TTF·zip·manifest·preview) 저장 버킷. /v1/assets 서빙 대상.
    # 1일 자동 삭제는 버킷 Lifecycle(Terraform)에 위임.
    gcs_asset_bucket: str = "ecofont-assets"
    max_file_size_bytes: int = 50 * 1024 * 1024  # 업로드 한도 50MB (413)
    port: int = 8080
    log_level: str = "INFO"

    # CORS — 브라우저(Vercel 프론트)가 교차 출처로 호출 허용.
    # 콤마 구분 문자열(JSON 파싱 이슈 회피). 정규식은 Vercel preview 배포 도메인 대응.
    cors_allow_origins: str = "http://localhost:3000,https://ecofont.vercel.app"
    cors_allow_origin_regex: str = r"https://.*\.vercel\.app"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_allow_origins.split(",") if o.strip()]


settings = Settings()
