# Unit 2: Backend — NFR Requirements

> **단계**: CONSTRUCTION / NFR Requirements
> **유닛**: Unit 2 (Backend / Font Processing)
> **선행**: Functional Design v2 (승인 완료)
> **목적**: Unit 2의 비기능 품질 속성을 측정 가능한 형태로 정의 (HOW는 NFR Design에서)

---

## 1. Scope

본 문서는 **Unit 2 (Backend) 한정** NFR을 다룬다. 시스템 전반 NFR(`aidlc-docs/inception/requirements/requirements.md` NFR-1~6)을 Unit 2에 구체화하고, Functional Design v2의 결정(Q1~Q4)에서 파생되는 Unit-level 요구를 추가한다.

ID 규칙: `NFR-U2-{카테고리}-{번호}`

---

## 2. 시스템 전반 NFR 매핑

| 시스템 NFR | Unit 2 적용 방식 |
|------------|------------------|
| NFR-1 성능 — 콜드 스타트 허용, SLA 없음 | §3 Performance에서 cold start budget·요청별 응답 시간 구체화 |
| NFR-2 보안 — Security Baseline 비활성, GCS 1일 자동 삭제 | §5 Security에서 IAM 최소 권한·signed URL only 명시 |
| NFR-3 확장성 — 단일 사용자 MVP | §4 Reliability에서 `max_instances=1` 명시 |
| NFR-4 테스트 — 미작성 | §7 Maintainability에서 "테스트 짜기 좋은 구조" 요구 (실제 작성 면제) |
| NFR-5 배포 — Cloud Run + Terraform | §9 Operational에서 Cloud Run 호환성 요구 |
| NFR-6 API 방식 — Functional Design v2에서 결정 (비동기 폴링) | §3·§4에서 폴링 기반 응답시간·Job 상태 내구성 요구 |

---

## 3. Performance

### NFR-U2-PERF-1: Cloud Run 콜드 스타트 상한
- Cloud Run 첫 요청 ~ 응답 시작까지 **≤ 20초** 목표
- 측정 방식: Cloud Run 로그의 `startup_latency` 메트릭
- 사용자 경험: FR-7 콜드 스타트 안내 UI로 마스킹

### NFR-U2-PERF-2: GET /jobs/{id} 응답 시간
- p95 **< 200ms** (in-memory dict 조회 + DTO 변환만 수행)
- 측정 방식: Cloud Run request_latencies p95
- 정당화: 폴링 간격 2~3초 → 응답 자체는 빨라야 폴링 부하 최소화

### NFR-U2-PERF-3: POST /convert 응답 시간
- p95 **< 1초** (파일 검증 + Job 생성만, 변환 비동기 위임)
- 변환 작업 자체의 응답 시간은 본 NFR 대상 아님 (FR-7 로딩 UI 책임)

### NFR-U2-PERF-4: 컨테이너 메모리 상한
- Cloud Run 인스턴스 메모리 **≤ 2 GiB**
- 정당화: FontTools + NumPy + SciPy + 단일 TTF (≤ 10MB) + 글리프 벡터 메모리 표현 합산 시 충분
- 초과 시: Cloud Run OOM 종료 → Job failed로 기록

### NFR-U2-PERF-5: 변환 시간 SLA
- **명시적 SLA 없음** (시스템 NFR-1 계승)
- 비공식 예상: 5~30분 (Functional Design §Q2 분석 기반)
- 폴링 응답에 `progress`·`stage` 노출하여 사용자 가시성 확보

---

## 4. Reliability & Availability

### NFR-U2-REL-1: Job 상태 내구성
- In-memory 저장소 사용 → 인스턴스 재시작/배포/스케일 다운 시 **in-flight Job 손실 허용**
- 사용자 영향: 폴링 시 404 `JOB_NOT_FOUND` 반환, 재업로드 안내
- 정당화: MVP 단일 사용자 + 짧은 사용 세션, Redis/GCS 도입 비용 > 이득

### NFR-U2-REL-2: 단일 인스턴스 보장
- Cloud Run **`max_instances=1`** 강제 (in-memory store 정합성)
- 스케일 아웃 시 Job ID 다른 인스턴스 라우팅 → 사용자 영향 = 404

### NFR-U2-REL-3: 단일 동시성 보장
- Cloud Run **`concurrency=1`** (한 번에 한 작업만 처리, 메모리 경합 회피)
- 두 번째 요청 시: Cloud Run이 큐잉 또는 429 반환 (Cloud Run 기본 동작에 위임)

### NFR-U2-REL-4: 부분 실패 보고
- 변환 파이프라인 어느 단계에서 실패해도 Job 상태에 **실패 단계(`stage`) + error code 기록**
- Frontend는 어느 시점에 실패했는지 사용자에게 표시 가능

### NFR-U2-REL-5: SIGTERM 처리
- Cloud Run 인스턴스 종료 시 **in-flight Job을 `failed` 상태로 마킹**
- 클라이언트 폴링 시 즉시 실패 인지 가능
- Cloud Run SIGTERM grace period 10초 내 처리

---

## 5. Security

### NFR-U2-SEC-1: GCS 버킷 비공개
- `ecofont-input`, `ecofont-output` 모두 **퍼블릭 액세스 금지**
- 다운로드는 **signed URL 경로만** 허용 (TTL 24h)

### NFR-U2-SEC-2: Cloud Run SA 최소 권한
- Service Account에는 **`roles/storage.objectAdmin`을 두 버킷에만 부여** (조건부 IAM)
- 프로젝트 전역 권한 금지

### NFR-U2-SEC-3: 파일명 sanitization
- GCS 객체 키는 **UUID v4만** 사용 (사용자 입력 파일명 키로 사용 금지)
- 응답의 `original_filename`·`converted_filename`은 디스플레이 전용 (다음 요청에 다시 사용되지 않음)

### NFR-U2-SEC-4: 인증 정책
- MVP는 **인증 미적용** (Cloud Run public ingress)
- Rate limiting은 본 단계 미요구 (학습 프로젝트 + max_instances=1로 부하 자체 제한)

### NFR-U2-SEC-5: HTTPS 강제
- Cloud Run 기본값 (HTTP 자동 redirect → HTTPS) 사용
- 별도 설정 없음

### NFR-U2-SEC-6: 파일 검증 (FR-1 보강)
- 확장자·MIME·크기 검증은 **Inbound HTTP Adapter에서 즉시** 수행
- 검증 통과 후에만 Job 생성 → GCS 업로드 → 파이프라인 진입

---

## 6. Observability

### NFR-U2-OBS-1: 구조화 로깅
- 모든 로그는 **JSON 형식**
- 필수 필드: `timestamp`, `level`, `request_id`, `job_id`, `stage`, `message`
- Cloud Logging에서 필드 기반 필터/검색 가능해야 함

### NFR-U2-OBS-2: Job 상태 전이 로깅
- Job 상태가 `pending → processing → done/failed` 또는 `stage` 변경 시마다 **INFO 로그**
- `processing` 내 stage 변경(`uploading`→`parsing`→`optimizing`→`finalizing`)도 각각 로깅

### NFR-U2-OBS-3: 에러 로깅
- 모든 예외는 **ERROR 레벨 + 스택트레이스** 포함
- error code와 `job_id` 함께 기록

### NFR-U2-OBS-4: Cloud Logging 연동
- `stdout`/`stderr` 출력만으로 Cloud Logging 자동 수집 (별도 agent 미설정)

### NFR-U2-OBS-5: 메트릭
- MVP는 **Cloud Run 기본 메트릭만** 활용 (request count, latency, instance count)
- 별도 Prometheus / Custom Metrics 미요구

---

## 7. Maintainability

### NFR-U2-MAINT-1: 헥사고날 의존성 방향 준수
- `domain` ← `ports` ← `application` ← `adapters` (단방향)
- `domain`은 외부 라이브러리 import 금지 (표준 라이브러리만)
- 본 NFR은 코드 리뷰 단계에서 수동 검증 (린트 강제는 본 단계 미요구)

### NFR-U2-MAINT-2: 타입 힌트 완전성
- 모든 public 함수/메서드 시그니처에 **타입 힌트 필수**
- Python 3.11+ 문법 (`X | Y`, `list[T]` 등)

### NFR-U2-MAINT-3: HTTP 경계 Pydantic
- 요청·응답 DTO는 **Pydantic v2** 모델로 정의
- 검증·직렬화 일관성 확보

### NFR-U2-MAINT-4: Ubiquitous Language
- 코드의 식별자는 도메인 용어와 일치 (`GlyphData`, `ConversionMetrics`, `Job`, `stage`, `ink_saving_rate` 등)
- 한영 혼용 금지, 영문 도메인 용어 일관 사용

### NFR-U2-MAINT-5: 의존성 관리
- `pyproject.toml`에 모든 의존성 **명시적 버전 범위**
- **lockfile 필수** (`uv.lock` 또는 `poetry.lock`)

### NFR-U2-MAINT-6: 테스트 면제 (NFR-4 계승)
- MVP는 테스트 코드 미작성
- 단, **테스트 작성이 용이한 구조**는 유지 (헥사고날 + 포트 추상화로 어댑터 모킹 가능 상태)

---

## 8. Cost

### NFR-U2-COST-1: Cloud Run min_instances=0
- 유휴 시 인스턴스 0 → **콜드 스타트 비용을 사용자 경험으로 흡수** (FR-7 안내)
- 무료 티어 활용

### NFR-U2-COST-2: Cloud Run max_instances=1
- §4 NFR-U2-REL-2와 동일 목적, 비용 측면에서도 확장 비용 방지

### NFR-U2-COST-3: 컨테이너 이미지 크기
- **목표 ≤ 800 MB** (압축 후)
- 정당화: 이미지 빌드/배포 시간 단축, Cloud Run pull latency 영향 최소화
- 수단: Python slim 베이스 + multi-stage build (구체 설계는 NFR Design)

### NFR-U2-COST-4: GCS 비용
- Lifecycle 1일 자동 삭제 (시스템 NFR-2 계승)
- 별도 GCS 비용 제한 없음 (10MB × 단일 사용자 트래픽으로 무시 가능)

---

## 9. Operational

### NFR-U2-OPS-1: Health endpoint
- **`GET /health`**: 단순 200 OK 응답 (의존 서비스 체크 미포함)
- Cloud Run liveness/readiness probe로 사용

### NFR-U2-OPS-2: 환경변수 기반 설정
- 모든 환경 의존 설정은 **환경변수로만** 주입 (Functional Design §6 목록)
- 로컬 개발용 sane defaults 제공 (`.env.example` 포함)

### NFR-U2-OPS-3: 12-factor 로깅
- 파일 출력 금지, **`stdout`/`stderr`로만** 출력
- Cloud Logging이 자동 수집

### NFR-U2-OPS-4: Dockerfile 멀티스테이지
- Build 스테이지(빌드 도구 + 의존성 컴파일) / Runtime 스테이지(런타임 최소 의존) 분리
- 보안·이미지 크기 목적 (NFR-U2-COST-3과 연계)

### NFR-U2-OPS-5: GracefulShutdown
- SIGTERM 수신 시 §NFR-U2-REL-5 처리 + Cloud Run grace period 10초 준수

---

## 10. Acceptance Summary (측정 가능 기준)

| ID | 측정 항목 | 목표 |
|----|-----------|------|
| PERF-1 | Cold start latency | ≤ 20s |
| PERF-2 | GET /jobs/{id} p95 | < 200ms |
| PERF-3 | POST /convert p95 | < 1s |
| PERF-4 | 메모리 사용 peak | ≤ 2 GiB |
| REL-2 | Cloud Run max_instances | = 1 |
| REL-3 | Cloud Run concurrency | = 1 |
| SEC-1 | 버킷 퍼블릭 액세스 | 차단 (gsutil iam 확인) |
| SEC-2 | SA 권한 범위 | 두 버킷 + objectAdmin만 |
| OBS-1 | 로그 포맷 | JSON, 5필드 필수 |
| COST-1 | Cloud Run min_instances | = 0 |
| COST-3 | 컨테이너 이미지 크기 | ≤ 800 MB (압축) |
| OPS-1 | /health 가용성 | 200 OK |

---

## 11. Open Items 갱신

Functional Design에서 carry-over + 본 단계에서 발견:

| ID | 상태 | 비고 |
|----|------|------|
| Open-1: 잉크 절약률 산출 방법 | 미해결 | Code Generation 전 결정 (Week 3 전) |
| Open-2: CO2 환산 계수 | 미해결 | Code Generation 전 결정 (Week 3 전) |
| Open-3: CI/CD 파이프라인 | 미해결 | 팀 합의 |
| Open-4 (신규): 의존성 관리 도구 | 미해결 | `uv` vs `poetry` 선택 (NFR-MAINT-5) — NFR Design 단계에서 결정 |
| Open-5 (신규): Python 베이스 이미지 | 미해결 | `python:3.11-slim` vs `distroless` 등 — NFR Design 단계에서 결정 |

---

## 12. 승인 옵션

- **변경 요청**: NFR 기준·목표값·범위 수정 필요
- **다음 단계 진행**: Unit 2 **NFR Design** 단계로 진행
