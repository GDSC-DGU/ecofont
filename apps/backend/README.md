# Eco-Font Backend

TTF 폰트를 잉크 절약형 에코폰트로 변환하는 FastAPI 서비스.

> 설계 출처: `aidlc-docs/construction/unit-2/` (Functional Design v2, NFR Requirements, NFR Design, Infrastructure Design)

## 아키텍처

Hexagonal Architecture (Ports & Adapters) + Light DDD:

```
app/
├── domain/        # 외부 의존 없는 순수 도메인 (GlyphData, Job, MetricsCalculator)
├── ports/         # 추상 인터페이스 (Protocol)
├── application/   # 유스케이스 (ConvertFontUseCase)
└── adapters/
    ├── inbound/http/    # FastAPI 라우터·DTO·미들웨어
    └── outbound/        # GCS·AI Engine·FontTools·Job Store 구현체
```

의존성 방향: `adapters → application → domain`. domain은 외부 라이브러리 import 금지.

## 로컬 실행

```bash
# 의존성 설치 (uv 필수)
uv sync

# 환경변수
cp .env.example .env
# GOOGLE_APPLICATION_CREDENTIALS 설정 (서비스 계정 키 파일 경로)

# 실행
uv run uvicorn app.main:app --reload --port 8080
```

API:
- `POST /convert` (multipart `file`) → `202 { job_id, status_url }`
- `GET /jobs/{job_id}` → 상태별 응답 (pending/processing/done/failed)
- `GET /health` → `{ status: "ok" }`

## 컨테이너 빌드

```bash
docker build -t ecofont-backend:0.1.0 .
docker run -p 8080:8080 \
  -e GCS_INPUT_BUCKET=... \
  -e GCS_OUTPUT_BUCKET=... \
  -v $(pwd)/sa-key.json:/sa-key.json:ro \
  -e GOOGLE_APPLICATION_CREDENTIALS=/sa-key.json \
  ecofont-backend:0.1.0
```

## 배포 (Cloud Run)

`infra/` 디렉토리의 Terraform 사용. 자세한 절차는 `infra/README.md` 참조.

## Open Items

- **Open-1**: 잉크 절약률 산출 방법 — `app/domain/metrics_calculator.py` 의 `_estimate_ink_saving_rate` 가 placeholder (글리프 좌표 수 비교)
- **Open-2**: CO2 환산 계수 — 같은 모듈 `_estimate_carbon_reduction` 의 `_CARBON_PLACEHOLDER_FACTOR` 상수 교체 필요
- **Unit 3 (AI Engine)**: `app/adapters/outbound/inprocess_ai_engine.py` 가 현재 identity transformation. 우제 모듈 준비 후 교체 — 시작 가이드: [`apps/ai-engine/README.md`](../ai-engine/README.md)

## 품질 도구

```bash
uv run ruff format .
uv run ruff check .
uv run pyright
```
