# Eco-Font Backend

업로드한 TTF를 **Cherokee 에코폰트 후보**로 변환하는 FastAPI 서비스.

> **현재 상태**: 우제 Cherokee 생성 API가 기존 비동기 오케스트레이터를 통째 대체하는 전환 중.
> 이 디렉토리는 **운영 골격**(CORS·로깅·`/health` + GCS 배선)만 있고, 변환 로직(라우터·AI 모듈)은 우제 코드 이식 대기.
> **이식 가이드: [`INTEGRATION.md`](INTEGRATION.md)** (계약·GCS 배선·운영배선·체크리스트)

## 구조 (현재 골격)

```
app/
├── config.py                 # 설정 (gcs_asset_bucket, 50MB, CORS)
├── logging_config.py         # structlog
├── main.py                   # FastAPI 부트스트랩 (CORS·lifespan·라우터 include) — 우제 라우터 자리 TODO
└── adapters/
    ├── inbound/http/         # routes(/health)·schemas·middleware
    └── outbound/
        └── gcs_assets.py     # /v1/assets 결과물 GCS 저장·프록시 서빙 (put_asset/get_asset)
```

## 동작 (이식 후 목표)

- `POST /v1/font-generation/ttf` (multipart `font`) → **동기 단일 응답**으로 후보 20개 + 평균 OCR 점수 (`status:"completed"`)
- `GET /v1/assets/{job_id}/{path}` → 결과물 다운로드 (GCS 프록시 서빙, 상대경로)
- `GET /health` → `{ "status": "ok" }` (현재 구현됨, Cloud Run probe)

계약 전문: [`INTEGRATION.md`](INTEGRATION.md) §7.

## 로컬 실행

```bash
uv sync
cp .env.example .env
uv run uvicorn app.main:app --reload --port 8080
# 현재는 /health 만 응답 (우제 코드 이식 전)
```

## 컨테이너 빌드 / 배포

- 빌드: `docker build -t ecofont-backend .` (Dockerfile은 uv 멀티스테이지)
- 배포: `develop`에 `apps/backend/**` push 시 GitHub Actions가 Cloud Run 자동 배포. 인프라(GCS·env·사이징)는 Terraform 수동 `apply`. 절차: [`infra/README.md`](../../infra/README.md)

## 이식 시 우제가 맞출 것 (요약)

- `pyproject.toml` 의존성 재정의 (OCR·폰트 라이브러리) + `uv.lock` 갱신
- `Dockerfile`에 OCR 시스템 패키지(예: `tesseract-ocr-chr`) 추가
- 결과물 저장을 `gcs_assets.put_asset`(GCS)로 + `/v1/assets` 라우트 추가
- 운영 배선(CORS·50MB·`/health`·로깅) 유지 + 8080 listen

상세·체크리스트: [`INTEGRATION.md`](INTEGRATION.md) §2~6.

## 품질 도구

```bash
uv run ruff format .
uv run ruff check .
```
