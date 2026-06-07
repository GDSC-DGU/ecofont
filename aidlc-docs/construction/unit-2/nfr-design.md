# Unit 2: Backend — NFR Design

> **단계**: CONSTRUCTION / NFR Design
> **유닛**: Unit 2 (Backend / Font Processing)
> **선행**: Functional Design v2, NFR Requirements (모두 승인 완료)
> **목적**: 각 NFR을 **어떤 기술·구성·코드 패턴**으로 만족시킬지 설계
> **브랜치**: `docs/unit-2-nfr-design` (develop에서 분기)

---

## 1. Scope

본 문서는 [NFR Requirements](nfr-requirements.md)의 22개 NFR-U2-* 항목을 **실제 구현 수단에 매핑**한다. Open-4(의존성 도구)·Open-5(베이스 이미지)와 본 단계에서 발견된 신규 결정도 함께 확정한다.

코드 자체는 Code Generation 단계에서 작성 (본 문서는 설계까지).

---

## 2. 확정 결정 — Open Items + 신규

### 2.1 Open-4 (확정): 의존성 관리 도구 → **uv**

| 옵션 | 장점 | 단점 |
|------|------|------|
| **uv** ← 결정 | Rust 기반 초고속, lockfile native, pyproject.toml 표준, Astral 도구체인 일관성 | 신기술 (안정성 검증 짧음) |
| poetry | 성숙, 광범위 채택 | 느림, 별도 plugin 패러다임 |

- **근거**: 학생 학습 가치 + Astral 도구체인(uv + ruff) 일관 사용 가능. Python 생태계가 uv로 표준화되는 추세에 합류
- **lockfile**: `uv.lock` 커밋 필수 (NFR-U2-MAINT-5)

### 2.2 Open-5 (확정): Python 베이스 이미지 → **python:3.11-slim-bookworm**

| 옵션 | 장점 | 단점 |
|------|------|------|
| **python:3.11-slim-bookworm** ← 결정 | Debian 12 LTS 베이스, ~150MB 시작, 디버깅 가능 (셸), NumPy/SciPy 사전 빌드 휠 호환 | distroless보다 크고 보안 표면 큼 |
| python:3.11-alpine | 최소 크기 (~50MB) | musl libc 이슈 (NumPy/SciPy 휠 비호환, 소스 빌드 필요 — 빌드 시간 폭증) |
| gcr.io/distroless/python3.11 | 최소 보안 표면, 작음 | 셸 없음 → 디버깅 어려움, MVP에 부적합 |

- **근거**: NumPy/SciPy 사전 빌드 휠 호환성이 결정적. alpine은 musl로 휠 미지원이라 비현실적. distroless는 디버깅 어려워 MVP 단계 부적합
- **이미지 크기 예상**: 빌드 후 ~700~800MB (NFR-U2-COST-3 ≤800MB 만족 예상)

### 2.3 (신규) 로깅 라이브러리 → **structlog**

| 옵션 | 장점 | 단점 |
|------|------|------|
| **structlog** ← 결정 | ContextVar 기반 contextual logging 자연스러움, JSON renderer 내장, 학습 가치 | 별도 학습 필요 |
| python-json-logger | 단순 | contextual logging 부재 |
| stdlib `logging` + JSON formatter | 의존성 0 | 보일러플레이트 많음, contextual logging 미지원 |

- **근거**: NFR-U2-OBS-1 (구조화 JSON 로깅) + request_id/job_id 컨텍스트 자동 전파 요구를 structlog이 가장 자연스럽게 충족

### 2.4 (신규) HTTP 서버 → **uvicorn[standard]**

- ASGI 표준, FastAPI 권장
- `[standard]` extra로 `httptools` + `uvloop` 포함 → 성능 향상
- Cloud Run 호환 (PORT 환경변수, 단일 워커 구동)

### 2.5 (신규) 비동기 작업 패턴 → **`asyncio.create_task` (in-process)**

| 옵션 | 장점 | 단점 |
|------|------|------|
| **`asyncio.create_task`** ← 결정 | 단순, 외부 의존 0, 단일 인스턴스에 적합 | 인스턴스 재시작 시 작업 손실 (NFR-U2-REL-1 허용) |
| Celery + Redis 브로커 | 복원력 ↑, 분산 가능 | Redis 인스턴스 필요 (비용↑), 복잡 |
| Cloud Tasks | GCP native | Cloud Tasks API 학습, 외부 의존 |

- **근거**: `max_instances=1` + 단일 사용자 MVP 전제 하에 `create_task`로 충분. NFR-U2-REL-1·5와 일관

### 2.6 (신규) 린터·포매터 → **ruff**

- Astral 도구체인(uv와 동일 벤더) → 설치·설정 일관성
- linter + formatter 통합 (black + isort + flake8 + pylint 대체)
- 초고속

### 2.7 (신규) 타입 체커 → **pyright** (선택사항)

- FastAPI/Pydantic 친화적, VS Code 통합 우수 (Pylance)
- MVP는 강제 미요구, pre-commit hook 없이 IDE 표시만 활용

---

## 3. Performance 설계

### 3.1 NFR-U2-PERF-1: Cold start ≤ 20s

**구현 수단**:
- **이미지 최적화** (§5 참조) — slim 베이스 + multi-stage build + 불필요 파일 제외
- **Lazy import** — 무거운 의존성(NumPy/SciPy/FontTools)은 `domain`/`ports` import 시 로드되지 않도록 함. 어댑터 모듈에서만 import → ConvertFontUseCase가 어댑터를 만들 때 임포트
- **Pydantic v2** (Rust 기반 검증) → import 시간 자체가 빠름
- **uvicorn 단일 워커** 시작 (다중 워커는 max_instances=1 환경에서 무의미)

**측정**: Cloud Run 로그 `httpRequest.latency` + `startupLatency` 메트릭

### 3.2 NFR-U2-PERF-2: GET /jobs/{id} p95 < 200ms

**구현 수단**:
- in-memory `dict[str, Job]` 조회 = O(1)
- `asyncio.Lock`으로 race condition 회피하되 read 작업은 lock 없이 dict snapshot 활용 가능
- Pydantic JSON 직렬화 (Rust core) — 빠름

### 3.3 NFR-U2-PERF-3: POST /convert p95 < 1s

**구현 수단**:
- 파일 검증 (size/extension/mime) → Pydantic `UploadFile` 메타데이터 검사
- Job 생성 (`dict[uuid] = Job(...)`) → O(1)
- `asyncio.create_task(_run_conversion(...))` 즉시 반환
- 파일 bytes는 백그라운드 태스크가 비동기 처리

### 3.4 NFR-U2-PERF-4: 메모리 ≤ 2 GiB

**구현 수단**:
- Cloud Run 인스턴스 메모리 **2Gi** (Terraform 설정)
- 단일 TTF (≤10MB) + 글리프 dict 표현 (~100MB) + SciPy/NumPy 작업 메모리 (~수백 MB) 합계 충분
- OOM 시 Cloud Run 자동 종료 → SIGTERM 처리 (§4.4)에서 Job failed 마킹

---

## 4. Reliability & Availability 설계

### 4.1 NFR-U2-REL-1: Job 손실 허용 (in-memory)

**구현 수단**:
- `MemoryJobStoreAdapter`:
  ```python
  class MemoryJobStoreAdapter(JobStorePort):
      def __init__(self) -> None:
          self._jobs: dict[str, Job] = {}
          self._lock = asyncio.Lock()
  ```
- 재시작 시 손실 = 새 인스턴스에서 dict 비어 있음 → GET 시 404 JOB_NOT_FOUND
- 사용자에게는 message로 재업로드 안내 (FR-6 정책 일관)

### 4.2 NFR-U2-REL-2 / REL-3: max_instances=1, concurrency=1

**구현 수단**: Terraform `google_cloud_run_v2_service`에 명시 (Unit 4 책임이지만 본 NFR에서 지시)
```hcl
template {
  scaling {
    max_instance_count = 1
  }
  containers {
    # ...
  }
  max_instance_request_concurrency = 1
}
```

### 4.3 NFR-U2-REL-4: 부분 실패 보고

**구현 수단**: `ConvertFontUseCase._run_conversion`에서 단계별 try/except, 실패 시 `JobStorePort.update(status="failed", error=ErrorInfo(code, stage, message))`

```python
try:
    glyphs = font_processor.extract_glyphs(bytes)
except Exception as e:
    await job_store.update(job_id, status="failed", error=ErrorInfo(
        code="INVALID_TTF", stage="parsing", message=str(e)
    ))
    return
```

### 4.4 NFR-U2-REL-5: SIGTERM 처리

**구현 수단**: FastAPI lifespan 또는 별도 signal handler에서 종료 시 모든 `processing` Job을 `failed`로 마킹
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # shutdown
    for job in job_store.list_processing():
        await job_store.update(job.id, status="failed",
            error=ErrorInfo(code="SERVICE_UNAVAILABLE", stage=job.stage,
                            message="서비스가 재시작되어 작업이 중단되었습니다."))
```

---

## 5. Security 설계

### 5.1 NFR-U2-SEC-1: GCS 버킷 비공개

**Terraform 설정** (Unit 4):
- `google_storage_bucket`: `public_access_prevention = "enforced"`
- IAM 바인딩에 `allUsers` / `allAuthenticatedUsers` 금지

### 5.2 NFR-U2-SEC-2: SA 최소 권한

**Terraform 설정** (Unit 4):
- `google_service_account` 생성
- `google_storage_bucket_iam_member` (버킷 레벨, 두 버킷만):
  - `roles/storage.objectAdmin`
- 프로젝트 레벨 권한 부여 금지

### 5.3 NFR-U2-SEC-3: 파일명 sanitization

**구현 수단**:
- 업로드 시: `key = f"{uuid4().hex}.ttf"` — 사용자 파일명 키로 사용 금지
- 응답 시: `converted_filename = f"{Path(original).stem}_eco.ttf"` — `Path.stem`이 디렉토리 traversal 자동 차단

### 5.4 NFR-U2-SEC-4 / SEC-5: 인증 미적용, HTTPS

**Cloud Run 설정**:
- `--allow-unauthenticated` (Terraform `iam_member`: `roles/run.invoker` to `allUsers`)
- HTTPS는 Cloud Run 기본 (별도 설정 없음)

### 5.5 NFR-U2-SEC-6: 파일 검증

**구현 수단**: Inbound HTTP Adapter (`routes.py`)
```python
@router.post("/convert")
async def convert(file: UploadFile = File(...)) -> ConvertAcceptedResponse:
    # 1. content-length 사전 검사 (헤더 기반)
    if request.headers.get("content-length", 0) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(413, ErrorBody(error="FILE_TOO_LARGE", ...))
    # 2. 확장자
    if not file.filename.lower().endswith(".ttf"):
        raise HTTPException(415, ErrorBody(error="UNSUPPORTED_FILE_TYPE", ...))
    # 3. MIME (relaxed — application/octet-stream도 허용)
    # 4. 실제 bytes 읽기 + size 재검증
    bytes_ = await file.read()
    if len(bytes_) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(413, ...)
    # 5. Use case 위임
    job_id = await use_case.start_job(bytes_, file.filename)
```

---

## 6. Observability 설계

### 6.1 NFR-U2-OBS-1 ~ OBS-4: structlog 기반 JSON 로깅

**설정** (`app/config.py` 부근):
```python
import structlog

structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)
logger = structlog.get_logger()
```

**Context 주입** — FastAPI middleware:
```python
@app.middleware("http")
async def request_id_middleware(request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    structlog.contextvars.bind_contextvars(request_id=request_id)
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response
```

**Stage 로깅** — Use case 내부:
```python
async def _run_conversion(self, job_id: str, ...):
    structlog.contextvars.bind_contextvars(job_id=job_id)
    logger.info("job_started")
    await self._update_stage(job_id, "uploading")
    logger.info("stage_started", stage="uploading")
    # ...
```

### 6.2 NFR-U2-OBS-5: 메트릭

- 별도 코드 작성 없음. Cloud Run 콘솔의 기본 메트릭(요청 수, 응답 시간, 인스턴스 수, 메모리/CPU)으로 충분

---

## 7. Maintainability 설계

### 7.1 NFR-U2-MAINT-1: 의존성 방향 준수

**수단**: 코드 리뷰 + 디렉토리 컨벤션
- `domain/*.py`는 외부 라이브러리 import 금지 (표준 라이브러리만)
- `ports/*.py`는 `domain` import 가능, 그 외 금지
- `application/*.py`는 `domain`, `ports` import 가능, `adapters` import 금지
- `adapters/*.py`는 모든 계층 import 가능

**자동 강제(선택)**: `import-linter` 같은 도구 도입은 MVP 단계 미요구

### 7.2 NFR-U2-MAINT-2: 타입 힌트

- pyright VS Code 통합으로 IDE에서 즉시 표시
- pyright 실행 명령: `uv run pyright` (선택)

### 7.3 NFR-U2-MAINT-3: Pydantic v2

- `app/adapters/inbound/http/schemas.py`에 요청·응답 DTO 정의
- 도메인 모델과 별도 (DTO ≠ 도메인 모델)

### 7.4 NFR-U2-MAINT-5: pyproject.toml + uv.lock

```toml
# pyproject.toml (요약 — 실제는 Code Gen에서)
[project]
name = "ecofont-backend"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi>=0.115",
  "uvicorn[standard]>=0.32",
  "pydantic>=2.9",
  "python-multipart>=0.0.12",   # FastAPI UploadFile
  "google-cloud-storage>=2.18",
  "fonttools>=4.55",
  "numpy>=2.1",
  "scipy>=1.14",
  "structlog>=24.4",
  # ai-engine 패키지는 우제와 합의 후 path/workspace 의존으로 추가
]

[tool.uv]
package = true

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM", "RUF"]

[tool.pyright]
pythonVersion = "3.11"
reportMissingTypeStubs = false
```

---

## 8. Cost 설계

### 8.1 NFR-U2-COST-1 / COST-2: min=0 / max=1

**Terraform** (Unit 4):
```hcl
scaling {
  min_instance_count = 0
  max_instance_count = 1
}
```

### 8.2 NFR-U2-COST-3: 이미지 ≤ 800MB

**수단**: §10 Dockerfile multi-stage build로 빌드 도구 제외, `.dockerignore`로 불필요 파일 제외

**`.dockerignore` 핵심 항목**:
```
.git
.venv
__pycache__
*.pyc
.pytest_cache
.ruff_cache
.idea
.vscode
node_modules
docs
aidlc-docs
.aidlc-rule-details
*.md
```

### 8.3 NFR-U2-COST-4: GCS 비용

- Lifecycle Rule (Unit 4 Terraform):
  ```hcl
  lifecycle_rule {
    condition { age = 1 }   # 1일
    action    { type = "Delete" }
  }
  ```

---

## 9. Operational 설계

### 9.1 NFR-U2-OPS-1: /health endpoint

```python
@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

### 9.2 NFR-U2-OPS-2: 환경변수 + sane defaults

```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gcs_input_bucket: str = "ecofont-input"
    gcs_output_bucket: str = "ecofont-output"
    signed_url_ttl_seconds: int = 86400
    max_file_size_bytes: int = 10 * 1024 * 1024
    port: int = 8080

    model_config = {"env_file": ".env", "env_prefix": ""}

settings = Settings()
```

`.env.example`을 레포에 포함하여 로컬 개발 진입장벽 ↓

### 9.3 NFR-U2-OPS-3: 12-factor 로깅

- structlog JSON renderer가 `stdout`로 출력
- 파일 로깅 미사용

### 9.4 NFR-U2-OPS-4 / OPS-5: Dockerfile + SIGTERM

§10 참조

---

## 10. 컨테이너 설계 (Dockerfile)

```dockerfile
# syntax=docker/dockerfile:1.7

# ====== Stage 1: Builder (uv로 의존성 설치) ======
FROM python:3.11-slim-bookworm AS builder

# uv 설치 (공식 multi-stage 권장 패턴)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/opt/venv

WORKDIR /app

# lockfile 변경 시에만 의존성 재설치 (캐시 최적화)
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# 앱 코드 복사 후 패키지 install (workspace 모드)
COPY app ./app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# ====== Stage 2: Runtime ======
FROM python:3.11-slim-bookworm AS runtime

# non-root 사용자
RUN groupadd -r app && useradd -r -u 1000 -g app appuser

# 가상환경 복사
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY --chown=appuser:app app ./app

USER appuser

# Cloud Run은 PORT 환경변수 주입
ENV PORT=8080
EXPOSE 8080

# uvicorn 단일 워커, max_instances=1·concurrency=1과 일관
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --no-access-log
```

**선택 사항**:
- `--no-access-log`: structlog로 요청 로깅을 별도 middleware에서 수행 → uvicorn 기본 access log와 이중 출력 회피
- SIGTERM grace period 10초는 uvicorn 기본값으로 충분

---

## 11. Open Items 갱신

| ID | 상태 | 비고 |
|----|------|------|
| Open-1: 잉크 절약률 산출 방법 | **미해결** | Code Generation 전 결정 (Week 3 전) |
| Open-2: CO2 환산 계수 | **미해결** | Code Generation 전 결정 (Week 3 전) |
| Open-3: CI/CD 파이프라인 | **미해결** | 팀 합의 |
| Open-4: 의존성 도구 | ✅ **해결** | uv |
| Open-5: 베이스 이미지 | ✅ **해결** | python:3.11-slim-bookworm |

**신규 Open Item 없음** (모든 설계 결정 본 단계에서 확정).

---

## 12. 본 단계에서 확정한 결정 요약

| ID | 결정 |
|----|------|
| Open-4 | 의존성 도구 = **uv** + uv.lock 커밋 |
| Open-5 | 베이스 이미지 = **python:3.11-slim-bookworm** |
| 로깅 | **structlog** + JSON renderer + ContextVar |
| HTTP 서버 | **uvicorn[standard]** 단일 워커 |
| 비동기 | **asyncio.create_task** in-process |
| 린터/포매터 | **ruff** (Astral 도구체인) |
| 타입 체크 | **pyright** (IDE only, MVP 강제 미적용) |
| Job 저장소 | `dict + asyncio.Lock` (`MemoryJobStoreAdapter`) |
| Dockerfile | uv multi-stage + python slim + non-root |

---

## 13. 승인 옵션

- **변경 요청**: 위 결정·구현 패턴 수정 필요
- **다음 단계 진행**: Unit 2 **Infrastructure Design** 단계로 진행 (Cloud Run·GCS·IAM 최종 Terraform 스펙)
