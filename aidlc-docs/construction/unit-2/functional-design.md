# Unit 2: Backend — Functional Design

> **단계**: CONSTRUCTION / Functional Design
> **유닛**: Unit 2 (Backend / Font Processing)
> **담당**: 이소은
> **선행**: 없음 (Phase 1 병렬)
> **후행 영향**: Unit 1b (정선 Frontend API 연동), Unit 3 (우제 AI Engine), Unit 4 (본인 Infrastructure)
> **브랜치**: `docs/unit-2-functional-design` (develop에서 분기)

---

## 1. 목적

`POST /convert` (비동기 작업 시작) + `GET /jobs/{job_id}` (폴링) 두 엔드포인트로 TTF 파일을 받아 에코폰트로 변환하는 FastAPI 백엔드 구축. **Hexagonal Architecture (Ports & Adapters) + Light DDD** 구조로 학습 가치와 어댑터 교체 유연성을 동시 확보.

본 단계 핵심 산출물:
1. **API 계약** (`POST /convert` + `GET /jobs/{job_id}`) → 정선 Unit 1a mock 정확화
2. **Q1~Q4 결정** → 우제 Unit 3, 본인 Unit 4 잠금 해제

---

## 2. 미결정 사항 (Q1~Q4) 결정

### Q1: Backend ↔ AI Engine 통합 방식 ⚠ 우제·본인 Unit 4 잠금 해제

**결정: A — 통합 (단일 Cloud Run + 함수 호출)**

| 옵션 | 장점 | 단점 |
|------|------|------|
| **A. 통합 (함수 호출)** ← 결정 | 콜드 스타트 1회, 호출 오버헤드 0, 인프라 단순 | AI 의존성 backend 포함, 분리 스케일링 불가 |
| B. 분리 (Cloud Run 2개 + HTTP) | 독립 스케일링 | 콜드 스타트 2회, HTTP 직렬화, Infra 복잡 |

- **근거**: NFR-3 동시 처리 요구 없음, 단일 사용자 MVP, 콜드 스타트가 사용자 경험의 주된 비용
- **헥사고날 표현**: `AIEnginePort` (추상) + `InProcessAIEngineAdapter` (구현). 추후 분리 필요 시 `HttpAIEngineAdapter` 추가 → 어댑터 교체만으로 변경 가능
- **Unit 4 영향**: Cloud Run 서비스 **1개**만 프로비저닝

### Q2: Frontend ↔ Backend API 호출 방식 ⚠ 정선 Unit 1b 잠금 해제

**결정: B — 비동기 폴링**

| 옵션 | 장점 | 단점 |
|------|------|------|
| A. 동기 REST | Frontend 단순 | 프록시 타임아웃(브라우저/Vercel edge/Cloudflare ~100s), 1~30분 스피너 UX 최악 |
| **B. 비동기 폴링** ← 결정 | 변환 시간 무관, 진행 상태 표시 가능 | 추가 엔드포인트 + Job 저장소 필요 |

- **근거**: 현실적 변환 시간 5~30분 (콜드 스타트 ~15s + 글리프 ~2,700개 × SSIM 최적화 0.5~2s). 동기 REST는 프록시 타임아웃에서 끊김
- **Job 저장소**: in-memory dict + Cloud Run `max_instances=1` (MVP 단일 사용자 충분, Redis/GCS 오버킬)
- **폴링 간격**: 클라이언트 2~3초 권장 (Frontend mock 시 동일 패턴 사용)

### Q3: 다운로드 방식

**결정: A — GCS Signed URL (TTL 24h)**

| 옵션 | 장점 | 단점 |
|------|------|------|
| **A. GCS Signed URL** ← 결정 | Cloud Run 부하 분리, 비용 절감, GCS native | URL TTL 관리 |
| B. Backend 스트리밍 | 단순 | Cloud Run 메모리/대역폭 사용 |

- **근거**: GCS Lifecycle 1일 자동 삭제와 TTL 일치
- **Unit 1b 영향**: `<a href={download_url} download>` 패턴

### Q4: Backend 레이어 구조

**결정: C — Hexagonal Architecture + Light DDD**

| 옵션 | 장점 | 단점 |
|------|------|------|
| A. Flat | 빠른 개발 | 도메인/인프라 혼재, 학습 가치 낮음 |
| B. Layered (3-tier) | 익숙함 | DI 추상화 미흡, 어댑터 교체 어색 |
| **C. Hexagonal + Light DDD** ← 결정 | 학생 학습 가치, 어댑터 교체 깔끔(Q1과 시너지), 도메인 분리 | 코드 ~30% 증가 |

- **근거**: 컴포넌트 5개 + 외부 의존 3개(GCS/AI/FontTools)는 헥사고날 학습에 적정 규모. 학생 학습 ROI > MVP 일정 비용
- **DDD 적용 범위**: 단일 Bounded Context + Ubiquitous Language 일관 (Glyph, ConversionMetrics 등) 정도. Aggregate Root·Event Sourcing 등 고급 패턴은 오버킬

#### 디렉토리 구조

```
apps/backend/
├── app/
│   ├── domain/                          # 외부 의존 0 — 순수 도메인
│   │   ├── models.py                    # GlyphData, ConversionMetrics, Job
│   │   └── metrics_calculator.py        # 잉크 절약률·탄소 저감량 산출 (도메인 서비스)
│   ├── ports/                           # 추상 인터페이스 (Protocol)
│   │   ├── storage.py                   # StoragePort
│   │   ├── ai_engine.py                 # AIEnginePort
│   │   ├── font_processor.py            # FontProcessorPort
│   │   └── job_store.py                 # JobStorePort
│   ├── adapters/
│   │   ├── inbound/
│   │   │   └── http/                    # FastAPI (inbound adapter)
│   │   │       ├── routes.py            # POST /convert, GET /jobs/{id}
│   │   │       └── schemas.py           # Pydantic DTO
│   │   └── outbound/                    # 외부 시스템 구현체
│   │       ├── gcs_storage.py           # StoragePort 구현
│   │       ├── inprocess_ai_engine.py   # AIEnginePort 구현 (Q1=A 반영)
│   │       ├── fonttools_processor.py   # FontProcessorPort 구현
│   │       └── memory_job_store.py      # JobStorePort 구현 (Q2=B 반영)
│   ├── application/                     # 유스케이스
│   │   └── convert_font.py              # ConvertFontUseCase (오케스트레이션)
│   ├── config.py                        # 환경변수 로드
│   └── main.py                          # DI 와이어링 + FastAPI app 부트스트랩
└── pyproject.toml
```

**의존성 방향 원칙**: `adapters → application → domain` (단방향). `domain`은 외부 import 금지. `ports`는 `domain`이 정의하고 `adapters`가 구현 (DIP).

---

## 3. API 계약

### 3.1 `POST /convert` (작업 시작)

```
POST /convert
Content-Type: multipart/form-data

file: <TTF binary>
```

**검증 규칙** (FR-1):
- 파일 1개만 (다중 업로드 거부)
- 확장자 `.ttf` (대소문자 무관)
- MIME `font/ttf` 또는 `application/octet-stream` 허용
- 파일 크기 ≤ 10 MB

**응답 (202 Accepted)**:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "status_url": "/jobs/550e8400-e29b-41d4-a716-446655440000"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `job_id` | string (uuid4) | Job 식별자 |
| `status` | enum | 초기값 `pending` |
| `status_url` | string | 폴링용 상대 경로 |

**에러 응답** (FR-6, 파일 검증 단계에서 즉시):

| HTTP | error code | 발생 조건 | message 예시 |
|------|------------|-----------|--------------|
| 400 | `INVALID_REQUEST` | 파일 누락, 다중 파일 | "파일을 첨부해주세요." |
| 413 | `FILE_TOO_LARGE` | 10MB 초과 | "파일 크기는 10MB 이하여야 합니다." |
| 415 | `UNSUPPORTED_FILE_TYPE` | TTF 아님 | "TTF 파일만 업로드 가능합니다." |

### 3.2 `GET /jobs/{job_id}` (폴링)

상태별 200 OK 응답 본문 (단일 엔드포인트, status 필드 분기):

**진행 중**:
```json
{
  "job_id": "550e8400-...",
  "status": "processing",
  "progress": 0.45,
  "stage": "optimizing"
}
```

**완료**:
```json
{
  "job_id": "550e8400-...",
  "status": "done",
  "result": {
    "ink_saving_rate": 0.234,
    "carbon_reduction_g": 12.5,
    "download_url": "https://storage.googleapis.com/ecofont-output/...",
    "expires_at": "2026-06-08T12:00:00Z",
    "original_filename": "MyFont.ttf",
    "converted_filename": "MyFont_eco.ttf"
  }
}
```

**실패** (Job 자체는 정상 종료, 변환만 실패):
```json
{
  "job_id": "550e8400-...",
  "status": "failed",
  "error": "CONVERSION_FAILED",
  "message": "변환 중 오류가 발생했습니다."
}
```

**Job 없음 (404)**:
```json
{
  "error": "JOB_NOT_FOUND",
  "message": "존재하지 않거나 만료된 작업입니다."
}
```

### 3.3 응답 필드 정의

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | enum | `pending` / `processing` / `done` / `failed` |
| `progress` | float (0~1) | 진행률 (processing 시 선택) |
| `stage` | enum | `uploading` / `parsing` / `optimizing` / `finalizing` |
| `ink_saving_rate` | float (0~1) | 잉크 절약률 — **산출 방법 TBD (Open-1)** |
| `carbon_reduction_g` | float | 탄소 저감량 — **산출 방법 TBD (Open-2)** |
| `download_url` | string | GCS Signed URL (TTL 24h) |
| `expires_at` | ISO 8601 | Signed URL 만료 |

> ⚠️ `ink_saving_rate`, `carbon_reduction_g` 필드는 응답에 **유지** (FR-5 Frontend 표시 의존). 산출식은 본 단계에서 미확정 → Open Items 참조.

### 3.4 변환 실패 시 에러 코드 (Job result)

| error code | 발생 단계 | message |
|------------|-----------|---------|
| `INVALID_TTF` | parsing 단계 (FontTools 파싱 실패) | "올바른 TTF 파일이 아닙니다." |
| `CONVERSION_FAILED` | optimizing 단계 (AI 최적화 실패) | "변환 중 오류가 발생했습니다." |
| `SERVICE_UNAVAILABLE` | GCS 등 외부 의존 실패 | "일시적인 오류입니다. 다시 시도해주세요." |

### 3.5 보조 엔드포인트

| 엔드포인트 | 용도 |
|------------|------|
| `GET /health` | Cloud Run liveness/readiness probe |

---

## 4. 처리 플로우 (ConvertFontUseCase)

### 4.1 Job 라이프사이클

```
[Client] POST /convert (TTF)
   └→ Inbound HTTP Adapter
       └→ ConvertFontUseCase.start_job(file_bytes, filename)
           ├→ 파일 검증 (size/extension/mime) — 실패 시 4xx 즉시 반환
           ├→ JobStorePort.create() → Job(status=pending)
           ├→ asyncio.create_task(_run_conversion(job_id, file_bytes, filename))
           └→ return 202 { job_id, status_url }

[Background asyncio task] _run_conversion
   ├→ JobStorePort.update(status=processing, stage=uploading)
   ├→ StoragePort.upload(input_bucket, f"{uuid}.ttf", bytes)
   ├→ JobStorePort.update(stage=parsing)
   ├→ FontProcessorPort.extract_glyphs(bytes) → GlyphData
   │   └ 실패 → JobStorePort.update(status=failed, error=INVALID_TTF) + return
   ├→ JobStorePort.update(stage=optimizing)
   ├→ AIEnginePort.optimize(GlyphData) → GlyphData (optimized)
   │   └ 실패 → JobStorePort.update(status=failed, error=CONVERSION_FAILED) + return
   ├→ JobStorePort.update(stage=finalizing)
   ├→ FontProcessorPort.rebuild_ttf(original_bytes, optimized) → bytes
   ├→ StoragePort.upload(output_bucket, f"{uuid}.ttf", bytes)
   ├→ MetricsCalculator.calculate(original, optimized) → ConversionMetrics
   ├→ StoragePort.signed_url(output_bucket, key, ttl=86400)
   └→ JobStorePort.update(status=done, result=ConvertResult{...})

[Client] GET /jobs/{job_id}
   └→ Inbound HTTP Adapter
       └→ JobStorePort.get(job_id) → Job | None
           ├ None → 404 JOB_NOT_FOUND
           └ Job → 200 + status-based DTO
```

### 4.2 에러 처리 (FR-6)

- 파일 검증 실패 → POST /convert에서 즉시 4xx (Job 생성 안 함)
- 변환 중 예외 → Job 상태 `failed` + error code 기록, GET /jobs로 조회
- 재시도 버튼 없음 (FR-6) → 사용자에게 재업로드 유도하는 message만 표시

### 4.3 파일명 정책 (NFR-2 보류 사항 해소)

- GCS 객체 키: `{uuid4}.ttf` (충돌 방지)
- 응답 `converted_filename`: 원본 파일명 기반 `{stem}_eco.ttf`

### 4.4 버킷 구성

- `ecofont-input` — 원본 업로드, Lifecycle 1일 자동 삭제
- `ecofont-output` — 변환 결과, Lifecycle 1일 자동 삭제

---

## 5. 컴포넌트 인터페이스 (Hexagonal)

### 5.1 Ports — 도메인이 정의하는 추상 인터페이스 (Python Protocol)

```python
# ports/storage.py
class StoragePort(Protocol):
    async def upload(self, bucket: str, key: str, data: bytes) -> str: ...   # returns gs:// URI
    async def signed_url(self, bucket: str, key: str, ttl_seconds: int = 86400) -> SignedUrl: ...

# ports/ai_engine.py
class AIEnginePort(Protocol):
    async def optimize(self, glyphs: GlyphData) -> GlyphData: ...

# ports/font_processor.py
class FontProcessorPort(Protocol):
    def extract_glyphs(self, ttf_bytes: bytes) -> GlyphData: ...
    def rebuild_ttf(self, original_ttf: bytes, optimized: GlyphData) -> bytes: ...

# ports/job_store.py
class JobStorePort(Protocol):
    def create(self) -> Job: ...
    def get(self, job_id: str) -> Job | None: ...
    def update(self, job_id: str, **fields) -> None: ...
```

### 5.2 Domain Models

```python
# domain/models.py
@dataclass(frozen=True)
class GlyphData:
    glyphs: dict[str, list[Contour]]   # codepoint → outline
    units_per_em: int

@dataclass(frozen=True)
class ConversionMetrics:
    ink_saving_rate: float       # 0~1, 산출 방법 TBD (Open-1)
    carbon_reduction_g: float    # g, 산출 방법 TBD (Open-2)

@dataclass
class Job:
    id: str
    status: Literal["pending", "processing", "done", "failed"]
    stage: str | None
    progress: float
    result: ConvertResult | None
    error: ErrorInfo | None
    created_at: datetime
```

### 5.3 Outbound Adapters

| 어댑터 | 구현 포트 | 백엔드 |
|--------|-----------|--------|
| `GcsStorageAdapter` | `StoragePort` | google-cloud-storage |
| `InProcessAIEngineAdapter` | `AIEnginePort` | 우제 모듈 import (`from ai_engine.optimization import optimize_glyphs`) — Q1=A |
| `FontToolsProcessorAdapter` | `FontProcessorPort` | fontTools |
| `MemoryJobStoreAdapter` | `JobStorePort` | dict + `threading.Lock` — Q2=B |

### 5.4 Application Use Case

```python
# application/convert_font.py
class ConvertFontUseCase:
    def __init__(
        self,
        storage: StoragePort,
        ai_engine: AIEnginePort,
        font_processor: FontProcessorPort,
        job_store: JobStorePort,
        metrics_calculator: MetricsCalculator,
    ): ...

    async def start_job(self, file_bytes: bytes, filename: str) -> str: ...      # POST /convert
    async def get_job(self, job_id: str) -> Job | None: ...                       # GET /jobs/{id}
    async def _run_conversion(self, job_id: str, file_bytes: bytes, filename: str) -> None: ...
```

### 5.5 우제(Unit 3)와 합의 필요 인터페이스

```python
# ai_engine 패키지가 export해야 할 함수 시그니처
def optimize_glyphs(glyphs: GlyphData) -> GlyphData: ...
```

- `GlyphData`는 `app/domain/models.py`에 정의 → ai-engine 모듈은 동일 dataclass import (혹은 별도 공유 패키지)
- 협의 시점: 본 Functional Design 승인 직후 우제와 시그니처 확정

---

## 6. 환경변수

| 변수 | 용도 | 기본값 |
|------|------|--------|
| `GCS_INPUT_BUCKET` | 원본 버킷 | `ecofont-input` |
| `GCS_OUTPUT_BUCKET` | 변환 버킷 | `ecofont-output` |
| `SIGNED_URL_TTL_SECONDS` | Signed URL TTL | `86400` (24h) |
| `MAX_FILE_SIZE_BYTES` | 업로드 한도 | `10485760` (10MB) |
| `GOOGLE_APPLICATION_CREDENTIALS` | 로컬 ADC (Cloud Run은 IAM SA 자동) | — |

---

## 7. 본 단계에서 확정한 결정 요약

| ID | 결정 | 영향 받는 팀원 / 유닛 |
|----|------|----------------------|
| Q1 | Backend ↔ AI 통합 (`InProcessAIEngineAdapter`, 단일 Cloud Run) | 우제 Unit 3, 본인 Unit 4 |
| Q2 | 비동기 폴링 (`POST /convert` 202 + `GET /jobs/{id}`) | 정선 Unit 1a/1b |
| Q3 | GCS Signed URL TTL 24h | 동현 Unit 1b 다운로드 |
| Q4 | Hexagonal + Light DDD | 본인 Unit 2 내부 |

---

## 8. Open Items (별도 트랙 처리)

### Open-1: 잉크 절약률 산출 방법 ⚠ Code Generation 전 결정 필수
- **현황**: 응답 필드(`ink_saving_rate`)는 유지, 산출식 미정
- **후보**: 300 DPI 벡터 면적 비교 / 외곽선 길이 비교 / 픽셀 커버리지 측정 등
- **소유**: 이소은 (이우제 협의)
- **데드라인**: Week 3 진입 전 (B-3 task 시작 전)

### Open-2: 탄소 저감량 환산 계수
- **현황**: 응답 필드(`carbon_reduction_g`)는 유지, 환산 공식·계수 미정
- **필요 근거**: 잉크량 → 잉크 g → CO2 g 환산 (논문/보고서)
- **소유**: 이소은
- **데드라인**: Week 3 진입 전 (B-4 task 시작 전)

### Open-3: CI/CD 파이프라인
- **현황**: 미결정. MVP 자체는 미블록 (수동 배포 가능)
- **소유**: 팀 합의

---

## 9. 승인 옵션

- **변경 요청**: 위 결정·구조·API 계약 수정 필요
- **다음 단계 진행**: Unit 2 NFR Requirements 단계로 진행
